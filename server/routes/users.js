const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

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
        console.error(`Error updating ${field}:`, error);
        res.status(500).send("Failed to update user stats");
    }
});

module.exports = router;
