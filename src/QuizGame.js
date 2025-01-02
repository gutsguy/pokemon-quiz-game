// src/App.js
import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="game-container">
      {/* 상단: 방 정보 */}
      <header className="room-info">
        <span>[788] 어진님의 방</span>
        <span>참여자 8/8</span>
        <span>라운드 3</span>
        <span>10초</span>
      </header>

      {/* 미션 및 체인 영역 */}
      <div className="mission-chain-container">
        <div className="mission">
          <div className="mission-title">MISSION</div>
          <div className="mission-content">하</div>
        </div>
        <div className="current-word">(동물)</div>
        <div className="chain">
          <div className="chain-title">CHAIN</div>
          <div className="chain-count">0</div>
        </div>
      </div>

      {/* 참여자 리스트 */}
      <div className="participants-container">
        {Array(8).fill(null).map((_, index) => (
          <div key={index} className="participant-card">
            <div className="participant-avatar">
              <img
                src="https://via.placeholder.com/50"
                alt="avatar"
                className="avatar-img"
              />
            </div>
            <div className="participant-name">사기 고투 봇</div>
            <div className="participant-id">{Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
        ))}
      </div>

      {/* 채팅창 */}
      <div className="chat-container">
        <div className="chat-title">채팅</div>
        <div className="chat-messages">
          {/* 메시지가 여기에 표시됩니다 */}
        </div>
        <input type="text" placeholder="메시지를 입력하세요..." className="chat-input" />
      </div>
    </div>
  );
};

export default App;
