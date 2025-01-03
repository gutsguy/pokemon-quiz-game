import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoomPopup from './CreateRoomPopup';

const Lobby = ({ rooms, onCreateRoom, onJoinRoom }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    const handleRoomClick = (roomId) => {
        onJoinRoom(roomId); // 방 클릭 시 방 참가
        navigate('/game'); // 게임 화면으로 전환
    };

    const handleCreateRoomClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleRoomSubmit = (roomData) => {
        onCreateRoom(roomData); // 방 생성 처리
        setIsPopupOpen(false);
    };

    return (
        <div className="lobby-container">
            <h2>로비</h2>
            <button onClick={handleCreateRoomClick}>방 만들기</button>
            {isPopupOpen && <CreateRoomPopup onClose={handleClosePopup} onSubmit={handleRoomSubmit} />}
            <div className="room-list">
                <h3>방 목록</h3>
                {rooms.length === 0 ? (
                    <p>생성된 방이 없습니다.</p>
                ) : (
                    rooms.map((room) => (
                        <div key={room.id} className="room-item" onClick={() => handleRoomClick(room.id)}>
                            <p>{room.name} (최대 인원: {room.maxParticipants}명)</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Lobby;
