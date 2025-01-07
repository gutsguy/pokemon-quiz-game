const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/roomDB"); // 옵션 제거
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};

module.exports = connectDB;

/*const cors = require('cors'); // Mongoose 라이브러리 불러오기
const mongoose = require('mongoose'); // mongoose 불러오기
const Room = require('./models/Room');

// MongoDB 연결 설정
const uri = 'mongodb://localhost:27017/';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB')) // 연결 성공 시
.catch(err => console.error('❌ MongoDB connection error:', err)); // 연결 실패 시

// 모든 방 데이터 가져오기 API
app.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find(); // 모든 방 데이터를 가져옴
        res.json(rooms); // 클라이언트에 JSON 응답
    } catch (err) {
        res.status(500).send('❌ Error fetching rooms');
    }
  });
  
  // 특정 방 데이터 가져오기 API
  app.get('/rooms/:id', async (req, res) => {
    try {
        const room = await Room.findOne({ room_id: req.params.id }); // room_id로 검색
        if (room) {
            res.json(room);
        } else {
            res.status(404).send('Room not found');
        }
    } catch (err) {
        res.status(500).send('❌ Error fetching room');
    }
  });
  
  
  // 서버 실행
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  */
