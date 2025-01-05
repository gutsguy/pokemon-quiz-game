import React, { useState } from 'react';

const CreateRoomPopup = ({ onClose, onSubmit }) => {
    const [roomName, setRoomName] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(8);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name: roomName, maxParticipants: parseInt(maxParticipants, 10) }); // 방 생성 요청
        onClose(); // 팝업 닫기
    };


    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>방 만들기</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        방 이름:
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        최대 참가자 수:
                        <input
                            type="number"
                            value={maxParticipants}
                            onChange={(e) => setMaxParticipants(e.target.value)}
                            min="2"
                            max="16"
                        />
                    </label>
                    <button type="submit">방 만들기</button>
                    <button type="button" onClick={onClose}>취소</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomPopup;
