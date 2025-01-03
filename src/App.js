import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Lobby from './Lobby';
import QuizGame from './QuizGame';

const App = () => {
  const [isLoggedIn] = useState(true);  // 로그인 스킵 (true)
  const [rooms, setRooms] = useState([]); // 방 목록
  const [selectedRoom, setSelectedRoom] = useState(null); // 선택한 방 정보

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
          {/* "/" 경로에서 바로 /lobby로 리디렉트 */}
          <Route path="/" element={<Navigate to="/lobby" replace />} />
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
