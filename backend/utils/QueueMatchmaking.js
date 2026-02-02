const ChatModel = require('../models/chat.models');
const crypto = require('crypto');

const QueueMatchmaking = {
    queue: [],

    addUser: function(socket) {
        const exist = this.queue.find(u => u.id === socket.id);
        if (!exist) this.queue.push(socket);
        this.matchUser();
    },

    deleteUser: function(socketId) {
        this.queue = this.queue.filter(u => u.id !== socketId);
    },

    matchUser: async function() {
        if (this.queue.length < 2) return;

        for (let i = 0; i < this.queue.length; i++) {
            const u1 = this.queue[i];
            
            const partnerIdx = this.queue.findIndex((u, idx) => {
                if (idx === i || u.deviceId === u1.deviceId) return false;
                const common = u1.interests.filter(interest => 
                    u.interests.map(s => s.toLowerCase()).includes(interest.toLowerCase())
                );
                return common.length > 0;
            });

            if (partnerIdx !== -1) {
                const user1 = this.queue.splice(i, 1)[0];
                const actualPartnerIdx = partnerIdx > i ? partnerIdx - 1 : partnerIdx;
                const user2 = this.queue.splice(actualPartnerIdx, 1)[0];

                const commonInterest = user1.interests.filter(interest => 
                    user2.interests.map(s => s.toLowerCase()).includes(interest.toLowerCase())
                )[0];

                const seed = `${user1.id}-${user2.id}-${Date.now()}`;
                const roomId = crypto.createHash('sha256').update(seed).digest('hex').substring(0, 24);

                try {
                    await ChatModel.create({
                        roomId,
                        participants: [
                            { socketId: user1.id, nickname: user1.username },
                            { socketId: user2.id, nickname: user2.username }
                        ],
                        status: 'active'
                    });

                    user1.join(roomId);
                    user2.join(roomId);

                    const payload = (p, reason) => ({
                        roomId,
                        partner: { username: p.username, bio: p.bio },
                        notice: `CONNECTED_VIA_${reason.toUpperCase()}`
                    });

                    user1.emit("match_found", payload(user2, commonInterest));
                    user2.emit("match_found", payload(user1, commonInterest));
                    
                    return; 
                } catch (err) {
                    this.queue.push(user1, user2);
                }
            }
        }
    }
};

module.exports = { QueueMatchmaking };