const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// 방 생성 라우트
router.post('/', async (req, res) => {
  try {
    console.log('요청 데이터:', req.body); // 요청 데이터 로그 출력
    const { name, maxParticipants } = req.body; // 클라이언트로부터 방 정보 받기
    if (!name || !maxParticipants) {
      throw new Error('필수 필드가 누락되었습니다');
    }
    const newRoom = new Room({
      room_id: Date.now().toString(), // 고유 ID 생성
      room_name: name,
      member_id: [],
      member_score: [],
      time: 60,
      round: 1,
      generation: [],
      max_participants: maxParticipants,
      max_round: 5,
      game_order: [],
      chat_room: []
    });

    await newRoom.save(); // DB에 방 저장
    res.status(201).json(newRoom); // 생성된 방 정보를 프론트로 응답
  } catch (err) {
    console.error('방 생성 라우트 오류:', err);
    res.status(500).json({ error: '방 생성 라우트 오류' });
  }
});

// 모든 방 데이터 가져오기
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).send('모든 방 데이터 가져오기 오류');
  }
});

// 특정 방 데이터 가져오기
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findOne({ room_id: req.params.id });
    if (room) {
      res.json(room);
    } else {
      res.status(404).send('Room not found');
    }
  } catch (err) {
    res.status(500).send('특정 방 데이터 가져오기 오류');
  }
});

module.exports = router;