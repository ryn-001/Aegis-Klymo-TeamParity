const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },

    participants: [{
        socketId: String,
        deviceId: String,
        nickname: String
    }],

    status: {
        type: String,
        enum: ['active','ended'],
        default: 'active'
    }
}, {timestamps: true});

const Chat = mongoose.model('Chat',chatSchema);
module.exports = Chat;