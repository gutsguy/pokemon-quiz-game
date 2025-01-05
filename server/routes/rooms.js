const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// 방 생성 라우트
router.post('/', async (req, res) => {
  try {
    console.log('요청 데이터:', req.body); // 요청 데이터 로그 출력
    const { room_name, max_participants, max_rounds, time_limit, selected_generations } = req.body; // 클라이언트로부터 방 정보 받기
    if (!room_name, !max_participants, !max_rounds, !time_limit) {
      throw new Error('필수 필드가 누락되었습.');
    }
    const newRoom = new Room({
      room_id: Date.now().toString(), // 고유 ID 생성
      room_name: room_name,
      member_id: [],
      member_score: [],
      time: time_limit,
      round: 1,
      generation: selected_generations,
      max_participants: max_participants,
      max_round: max_rounds,
      game_order: [],
      chat_room: [],
      is_gaming: false
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
    const rooms = await Room.find(); // 모든 방 가져오기
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: '방 목록 가져오기 실패' });
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

// 라운드 변경 라우트
router.patch('/:id', async (req, res) => {
  const { round } = req.body; // 클라이언트에서 round 값 전달
  try {
    const room = await Room.findOneAndUpdate(
      { room_id: req.params.id },
      { round },
      { new: true } // 업데이트된 결과 반환
    );
    if (room) {
      res.status(200).json(room); // 업데이트 성공 시 room 정보 반환
    } else {
      res.status(404).send('Room not found');
    }
  } catch (err) {
    res.status(500).send('Error updating round');
  }
});

// 채팅 메시지 추가 라우트
router.patch('/:id/chat', async (req, res) => {
  const { chat_room } = req.body; // 클라이언트에서 chat_room 배열 전달
  try {
    const room = await Room.findOne({ room_id: req.params.id }); // 방 찾기
    if (room) {
      room.chat_room.push(chat_room); // 기존 메시지 배열에 추가
      await room.save(); // 저장
      res.status(200).json(room);
    } else {
      res.status(404).send('Room not found');
    }
  } catch (err) {
    res.status(500).send('Error updating chat messages');
  }
});




module.exports = router;