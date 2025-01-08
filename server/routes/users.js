const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    console.log(`Request received for user ID: ${userId}`); // 요청 로그 추가

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send("Failed to fetch user");
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // 모든 유저 데이터 가져오기
        res.status(200).json(users); // JSON 형식으로 응답
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
});

router.patch('/:id', async (req, res) => {
    const { field, value } = req.body; // 클라이언트에서 전달된 필드와 값
    const userId = req.params.id; // URL에서 사용자 ID 가져오기

    console.log("PATCH Request Body:", req.body); // 전체 요청 본문 출력
    console.log("Field:", field, "Value:", value); // Field와 Value 확인

    if (!field) {
        return res.status(400).send("Field is required");
    }

    try {
        let update;
        if (value !== undefined) {
            console.log("업뎃해썽용");
            // 특정 값으로 설정 (highscore 업데이트)
            update = { $set: { [field]: value }};
        } else {
            // 값을 1 증가
            update = { $inc: { [field]: 1 } };
        }

        const user = await User.findOneAndUpdate(
            { _id: userId },
            update,
            { new: true } // 업데이트된 결과 반환
        );
        if (user) {
            res.status(200).json(user); // 업데이트된 사용자 반환
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(`Error updating ${field}:`, error);
        res.status(500).send("Failed to update user stats");
    }
});




module.exports = router;
