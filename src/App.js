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


  // 방 목록 로드
  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rooms');
      console.log('방 목록 응답:', response.data); // 응답 로그 출력
      setRooms(response.data); // 방 목록 상태 업데이트
    } catch (error) {
      console.error('방 목록 불러오기 실패:', error);
    }
  };

  const handleCreateRoom = async (roomData) => {
    try {
      const response = await axios.post('http://localhost:5000/rooms', roomData);
      const newRoom = response.data; // 생성된 방 정보
      setRooms((prevRooms) => [...prevRooms, newRoom]); // 방 목록에 추가
    } catch (error) {
      console.error('handleCreateRoom 오류:', error);
    }
  };

  const handleJoinRoom = (roomId) => {
    const room = rooms.find((room) => room.room_id === roomId);
    if (room) setSelectedRoom(room); // 선택한 방 상태 설정
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRooms(); // 로그인 상태일 때만 방 목록 불러오기
    }
  }, [isLoggedIn]);

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
