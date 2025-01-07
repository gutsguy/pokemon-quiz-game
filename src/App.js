import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Lobby from "./Lobby";
import QuizGame from "./QuizGame";
import Login from "./Login";
import CreateRoomPopup from "./CreateRoomPopup"; // 방 만들기 팝업 추가
import { authStore } from "./store/AuthStore";
import { getMe } from "./apis/auth";

const App = () => {
  const { user, setUser, loggedIn } = authStore();
  const [initialized, setInitialized] = useState(false);
  const [gameConfig, setGameConfig] = useState(null); // 게임 설정 저장

  useEffect(() => {
    if (!initialized) {
      getMe()
        .then((data) => {
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
                  onCreateRoom={() => setGameConfig(null)} // 초기화
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* 퀴즈 게임 화면 */}
          <Route
            path="/game"
            element={<QuizGame />} // state를 QuizGame 내부에서 직접 가져오도록 변경
          />
          {/* 방 생성 팝업 */}
          <Route
            path="/create-room"
            element={
              <CreateRoomPopup
                onSubmit={(config) => setGameConfig(config)} // 설정 저장
                onClose={() => console.log("팝업 닫기")}
              />
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
