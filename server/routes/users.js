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

router.patch('/:id', async (req, res) => {
    const { field } = req.body;
    const userId = req.params.id; // URL에서 사용자 ID 가져오기
    if (!field) {
        return res.status(400).send("Field is required");
    }

    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { [field]: 1 } },
            { new: true } // 업데이트된 결과 반환
        );
        if (user) {
            res.status(200).json(user); // 업데이트된 사용자 반환
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send("Failed to update user stats");
    }
});


module.exports = router;
