require("dotenv").config();
const express = require("express");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const corsMiddleware = require("./middleware/cors.middleware");
const User = require("./models/User");
const mongoose = require('mongoose');

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

mongoose.connection.on('error', err => console.error('MongoDB Connection Error:', err));
mongoose.connection.on('connected', () => console.log('✅✅✅✅ Connected to MongoDB'));


// 라우트 설정
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});


app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

// 서버 실행  
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

