require("dotenv").config();
const express = require("express");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const corsMiddleware = require("./middleware/cors.middleware");
const User = require("./models/User");

const app = express();

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["secretKey"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// 라우트 설정
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


// 기본 라우트에서 Room 데이터 출력
app.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Atlas에서 모든 Room 데이터 가져옴
    console.log("user DB:", users); // 터미널에 로그 출력
    res.json(users); // JSON 형식으로 브라우저에 응답
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).send("❌ Error fetching users");
  }
});

// 서버 실행  
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

