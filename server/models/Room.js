// server/models/Room.js
const mongoose = require('mongoose');
//방 정보
const roomSchema = new mongoose.Schema({
    room_id: String,
    room_name: String,
    member_id: [String],
    member_score: [Number],
    time: Number,
    round: Number,
    generation: [Number],
    max_participants: Number,
    max_round: Number,
    game_order: [String],
    chat_room: [String],
});

module.exports = mongoose.model('Room', roomSchema);
