import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomPopup from "./CreateRoomPopup";

const Lobby = ({ rooms, onCreateRoom, onJoinRoom }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

    const handleRoomClick = (roomId) => {
        console.log(`방 클릭됨: ${roomId}`);
        const room = rooms.find((r) => r.room_id === roomId);
        if (room) {
            console.log('선택된 방:', room); // 선택된 방 로그 출력
            onJoinRoom(roomId); // 부모 컴포넌트에서 상태 설정
            navigate('/game'); // 게임 화면으로 이동
        } else {
            console.error('방을 찾을 수 없습니다.');
        }
    };

    return (
        <div className="lobby-container">
            <h2>로비</h2>
            <button onClick={() => setIsPopupOpen(true)}>방 만들기</button>
            {isPopupOpen && (
                <CreateRoomPopup
                    onClose={() => setIsPopupOpen(false)}
                    onSubmit={(roomData) => {
                        onCreateRoom(roomData);
                        setIsPopupOpen(false);
                    }}
                />
            )}
            <div className="room-list">
                <h3>방 목록</h3>
                {rooms.length === 0 ? (
                    <p>생성된 방이 없습니다.</p>
                ) : (
                    rooms.map((room) => (
                        <div key={room.room_id} className="room-item">
                            <p>{room.room_name} (최대 인원: {room.max_participants}명)</p>
                            <button onClick={() => handleRoomClick(room.room_id)}>입장</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Lobby;
