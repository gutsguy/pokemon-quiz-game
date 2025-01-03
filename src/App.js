import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Lobby from './Lobby';
import QuizGame from './QuizGame';
import Login from './Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 기본값 false
  const [rooms, setRooms] = useState([]); // 방 목록
  const [selectedRoom, setSelectedRoom] = useState(null); // 선택한 방 정보

  const handleLoginSuccess = (userInfo) => {
    console.log('User logged in:', userInfo);
    setIsLoggedIn(true); // 로그인 성공 시 상태 변경
  };

  const handleCreateRoom = (roomData) => {
    const newRoom = { id: rooms.length + 1, ...roomData }; // 방 ID 생성 및 정보 저장
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  const handleJoinRoom = (roomId) => {
    const room = rooms.find((room) => room.id === roomId);
    if (room) setSelectedRoom(room); // 방 정보 설정
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* 로그인 화면 */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/lobby" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          {/* 로비 화면 */}
          <Route
            path="/lobby"
            element={
              isLoggedIn ? (
                <Lobby rooms={rooms} onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
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
