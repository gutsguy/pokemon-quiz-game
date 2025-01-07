const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  social_id: String,
  nickname: String,
  total_15: Number, // 누적 전체 시도
  total_30: Number,
  correct_15 : Number,
  correct_30 : Number,
  highscore: Number, // 혼자 놀기 최고 점수
  email: String,
  picture: String,
});

module.exports = mongoose.model("User", userSchema);
