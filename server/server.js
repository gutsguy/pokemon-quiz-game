require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const corsMiddleware = require('./middleware/cors');
const Room = require('./models/Room');

connectDB(); // MongoDB 연결
Room.find()
  .then(rooms => console.log('Fetched rooms during startup:', rooms))
  .catch(err => console.error('Error during Room.find():', err));
const app = express();


// 미들웨어 설정
app.use(corsMiddleware);
app.use(express.json());
app.use(
  cookieSession({
    name: 'session',
    keys: ['secretKey'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// 라우트 설정
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);

// 기본 라우트 추가
//app.get('/', (req, res) => {
//  res.send('Hello, World! This is the home page.');
//});
// 기본 라우트에서 Room 데이터 출력
app.get('/', async (req, res) => {
  try {
    const rooms = await Room.find(); // Atlas에서 모든 Room 데이터 가져옴
    console.log('Fetched rooms:', rooms); // 터미널에 로그 출력
    res.json(rooms); // JSON 형식으로 브라우저에 응답
  } catch (err) {
    console.error('❌ Error fetching rooms:', err);
    res.status(500).send('❌ Error fetching rooms');
  }
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*require('dotenv').config();
const express = require('express');
const axios = require('axios'); // axios 라이브러리 호출
const cookieSession = require('cookie-session');

const app = express();
console.log('Environment Variables:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
});

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// 세션 설정
app.use(
  cookieSession({
    name: 'session',
    keys: ['secretKey'], // 세션 암호화 키
    maxAge: 24 * 60 * 60 * 1000, // 세션 유효 기간 (1일)
  })
);
app.use(express.json());

// Google OAuth 라우트
app.get('/auth/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent('email profile')}`;
  res.redirect(googleAuthUrl);
});

app.get('/auth/google/callback', async (req, res) => {
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
app.get('/auth/kakao', (req, res) => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.KAKAO_REDIRECT_URI)}&response_type=code`;
  res.redirect(kakaoAuthUrl);
});

app.get('/auth/kakao/callback', async (req, res) => {
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

// 로그아웃
app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/