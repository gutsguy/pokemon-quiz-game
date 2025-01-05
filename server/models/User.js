const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  social_id: String,
  nickname: String,
  /*picture: String,
  is_logged_in: Boolean,
  total_try: Number, // 누적 전체 시도
  highscore: Number, // 혼자 놀기 최고 점수
  rank : Number, // 누적 맞춘 문제 수*/
  email: String,
});

module.exports = mongoose.model("User", userSchema);