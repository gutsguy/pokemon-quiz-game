// server/models/Room.js
const mongoose = require('mongoose');
//방 정보
const roomSchema = new mongoose.Schema({
    room_id: String,
    room_member: [String],
    member_score: [Number],
    chat_log: [String],
    answer: String,
});

module.exports = mongoose.model('Room', roomSchema);
