// server/models/Lobby.js
const mongoose = require('mongoose');
//방 정보
const lobbySchema = new mongoose.Schema({
    participant_id: [String],
    chat_lobby: [String]
});

module.exports = mongoose.model('Lobby', lobbySchema);
