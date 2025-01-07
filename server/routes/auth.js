const express = require("express");
const axios = require("axios");
const userService = require("../services/auth/user.service");
const utils = require("../utils/utils");
const jwtService = require("../services/auth/jwt.service");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

const redirectMap = new Map();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.json(user);
});

// Kakao OAuth 라우트
router.get("/kakao", (req, res) => {
  const randomState = utils.randomString(16);
  redirectMap.set(randomState, req.query.redirect);

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${
    process.env.KAKAO_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.KAKAO_REDIRECT_URI
  )}&response_type=code&state=${randomState}`;
  res.redirect(kakaoAuthUrl);
});

router.get("/kakao/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) return res.redirect("/kakao");

  try {
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code,
        },
      }
    );

    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const existingUser = await userService.getUserBySocialId(
      userResponse.data.id
    );

    if (!existingUser) {
      await userService.createUser({
        social_id: userResponse.data.id,
        nickname: userResponse?.data?.properties?.nickname || null,
        email: userResponse?.data?.kakao_account?.email || null,
        picture : "", 
        highscore: 0, 
        total_15: 0, // 누적 전체 시도
        total_30: 0,
        correct_15 : 0,
        correct_30 : 0,
      });
      console.error("Error creating user:", error);
      console.log("Received data for createUser:", { social_id, nickname, email });
    } else {
      console.log("Existing user:", existingUser);
    }

    const user = await userService.getUserBySocialId(userResponse.data.id);

    const token = jwtService.createToken(user);

    res
      .cookie("Authorization", token, {
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      })
      .redirect(redirectMap.get(state) || "http://172.10.7.78:3000");
  } catch (error) {
    console.error(
      "Kakao Authentication Error:",
      error.response?.data || error.message
    );
    res.status(500).send("Kakao Authentication Failed.");
  }
});

module.exports = router;
