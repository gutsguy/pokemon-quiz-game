const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// 모든 방 데이터 가져오기
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).send('❌ Error fetching rooms');
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
    res.status(500).send('❌ Error fetching room');
  }
});

module.exports = router;