import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Lobby from "./Lobby";
import QuizGame from "./QuizGame";
import Login from "./Login";
import { authStore } from "./store/AuthStore";
import { getMe } from "./apis/auth";

const App = () => {
  const { user, setUser, loggedIn } = authStore();
  const [initialized, setInitialized] = useState(false);
  const [rooms, setRooms] = useState([]); // 방 목록
  const [selectedRoom, setSelectedRoom] = useState(null); // 선택한 방 정보

  const handleCreateRoom = roomData => {
    const newRoom = { id: rooms.length + 1, ...roomData }; // 방 ID 생성 및 정보 저장
    setRooms(prevRooms => [...prevRooms, newRoom]);
  };

  const handleJoinRoom = roomId => {
    const room = rooms.find(room => room.id === roomId);
    if (room) setSelectedRoom(room); // 방 정보 설정
  };

  useEffect(() => {
    if (!initialized) {
      getMe()
        .then(data => {
          setUser(data);
          setInitialized(true);
          console.log("User Info:", data);
        })
        .catch(() => {
          setInitialized(true);
        });
    }
  }, []);

  if (!initialized) return null;

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* 로그인 화면 */}
          <Route
            path="/login"
            element={loggedIn ? <Navigate to="/lobby" replace /> : <Login />}
          />
          {/* 로비 화면 */}
          <Route
            path="/lobby"
            element={
              loggedIn ? (
                <Lobby
                  rooms={rooms}
                  onCreateRoom={handleCreateRoom}
                  onJoinRoom={handleJoinRoom}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* 퀴즈 게임 화면 */}
          <Route
            path="/game"
            element={
              selectedRoom ? (
                <QuizGame room={selectedRoom} />
              ) : (
                <Navigate to="/lobby" replace />
              )
            }
          />
          {/* 기본 경로는 로그인 화면으로 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
