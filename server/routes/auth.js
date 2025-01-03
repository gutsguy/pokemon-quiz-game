const express = require('express');
const axios = require('axios');
const router = express.Router();

// Google OAuth 라우트
router.get('/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent('email profile')}`;
  res.redirect(googleAuthUrl);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Google Authentication Failed: Missing authorization code.');
  }

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    req.session.user = userResponse.data;
    res.redirect('http://localhost:3000');
  } catch (error) {
    console.error('Google Authentication Error:', error.response?.data || error.message);
    res.status(500).send('Google Authentication Failed.');
  }
});

// Kakao OAuth 라우트
router.get('/kakao', (req, res) => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.KAKAO_REDIRECT_URI)}&response_type=code`;
  res.redirect(kakaoAuthUrl);
});

router.get('/kakao/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Kakao Authentication Failed: Missing authorization code.');
  }

  try {
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code,
      },
    });

    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    req.session.user = userResponse.data;
    res.redirect('http://localhost:3000');
  } catch (error) {
    console.error('Kakao Authentication Error:', error.response?.data || error.message);
    res.status(500).send('Kakao Authentication Failed.');
  }
});

module.exports = router;
