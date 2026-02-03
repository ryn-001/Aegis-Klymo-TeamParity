require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { DatabaseConnection } = require("./utils/database");
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const { QueueMatchmaking } = require("./utils/QueueMatchmaking");
const { router } = require("./routes/index.routes");
const { UserServices, DeviceServices } = require("./services/index.services");
const ChatModel = require('./models/chat.models');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.CLIENT_SIDE_URL ? process.env.CLIENT_SIDE_URL.split(',') : [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['polling', 'websocket']
});

const calculateBan = (count) => {
    if (count >= 20) return { isPermanentBan: true, banUntil: null };
    if (count >= 10) return { isPermanentBan: false, banUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) };
    if (count >= 5) return { isPermanentBan: false, banUntil: new Date(Date.now() + 12 * 60 * 60 * 1000) };
    if (count >= 3) return { isPermanentBan: false, banUntil: new Date(Date.now() + 6 * 60 * 60 * 1000) };
    return { isPermanentBan: false, banUntil: null };
};

const terminateActiveChat = async (socket) => {
    try {
        const activeChat = await ChatModel.findOne({
            status: 'active',
            $or: [
                { "participants.socketId": socket.id },
                { "participants.deviceId": socket.deviceId }
            ]
        });

        if (activeChat) {
            io.to(activeChat.roomId).emit("partner_disconnected");

            await ChatModel.deleteOne({ roomId: activeChat.roomId });
            return activeChat;
        }
    } catch (err) {
        console.error("Termination Error:", err);
    }
    return null;
};

io.on("connection", (socket) => {
    socket.on("join_queue", async (userData) => {
        try {
            const deviceStatus = await DeviceServices.findDevice(userData.deviceId);
            if (deviceStatus) {
                if (deviceStatus.isPermanentBan || (deviceStatus.banUntil && new Date() < deviceStatus.banUntil)) {
                    return socket.emit("banned", {
                        permanent: deviceStatus.isPermanentBan,
                        until: deviceStatus.banUntil
                    });
                }
            }

            let cleanUserId = userData.userId;
            if (cleanUserId && typeof cleanUserId === 'object') {
                cleanUserId = cleanUserId.userId || cleanUserId.id || cleanUserId._id;
            }

            socket.userId = cleanUserId;
            socket.deviceId = userData.deviceId;
            socket.username = userData.username;
            socket.avatar = userData.avatar;

            QueueMatchmaking.addUser(socket);
        } catch (err) {
            console.error("Join Queue Error:", err);
        }
    });

    socket.on("requeue", async () => {
        try {
            await QueueMatchmaking.deleteUser(socket.id);
            await terminateActiveChat(socket);
            QueueMatchmaking.addUser(socket);
        } catch (err) {
            console.error("Requeue Error:", err);
        }
    });

    socket.on("send_message", (data) => {
        if (data.roomId) {
            socket.to(data.roomId).emit("receive_message", data);
        }
    });

    socket.on("report_user", async ({ targetDeviceId }) => {
        if (!targetDeviceId) return;
        try {
            await terminateActiveChat(socket);
            const device = await DeviceServices.updateReports(targetDeviceId);
            const banInfo = calculateBan(device.reportCount);

            if (banInfo.isPermanentBan || banInfo.banUntil) {
                const allSockets = await io.fetchSockets();
                const targetSocket = allSockets.find(s => s.deviceId === targetDeviceId);
                if (targetSocket) {
                    targetSocket.emit("banned", {
                        permanent: banInfo.isPermanentBan,
                        until: banInfo.banUntil
                    });
                    targetSocket.disconnect();
                }
            }
        } catch (err) {
            console.error("Report Error:", err);
        }
    });

    socket.on("disconnect", async () => {
        try {
            await QueueMatchmaking.deleteUser(socket.id);
            await terminateActiveChat(socket);
            
            if (socket.userId && typeof socket.userId === 'string') {
                await UserServices.deleteUser(socket.userId);
            }
        } catch (err) {
            console.error("Disconnect Cleanup Error:", err);
        }
    });
});

app.use("/api", router);
app.set("io", io);

DatabaseConnection(server);