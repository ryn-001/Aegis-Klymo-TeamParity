const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    bio:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        enum: ['Male','Female'],
        required: true
    },
    interests: {
        type: [String],
        required: true
    }
}, {timestamps: true});

const User = mongoose.model('User',userSchema);
module.exports = User;