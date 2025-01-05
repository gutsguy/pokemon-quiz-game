// server/models/Room.js
const mongoose = require('mongoose');
//방 정보
const userSchema = new mongoose.Schema({
    user_id: String,
    nickname: String,
    picture: Image,
    is_logged_in: Boolean,
    total_try: Number, // 누적 전체 시도
    highscore: Number, // 혼자 놀기 최고 점수
    rank : Number // 누적 맞춘 문제 수
});

module.exports = mongoose.model('User', userSchema);
