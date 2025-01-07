const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://172.10.7.78:27017/userDB"); // 옵션 제거
  } catch (err) {
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};

module.exports = connectDB;
