import React, { useState } from 'react';
import './CreateRoomPopup.css';

const CreateRoomPopup = ({ onClose, onSubmit }) => {
    const [roomName, setRoomName] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(8);
    const [maxRounds, setMaxRounds] = useState(5);
    const [timeLimit, setTimeLimit] = useState(10);
    const [selectedGenerations, setSelectedGenerations] = useState([]);

    const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 1세대 ~ 9세대

    // 세대 클릭 핸들러
    const handleGenerationClick = (gen) => {
        if (selectedGenerations.includes(gen)) {
            setSelectedGenerations(selectedGenerations.filter((g) => g !== gen));
        } else {
            setSelectedGenerations([...selectedGenerations, gen]);
        }
    };

    // 제출 핸들러
    const handleSubmit = () => {
        if (!roomName.trim()) {
            alert('방 이름을 입력해주세요!');
            return;
        }
        const roomData = {
            room_name: roomName,
            max_participants: maxParticipants,
            max_rounds: maxRounds,
            time_limit: timeLimit,
            selected_generations: selectedGenerations,
        };
        onSubmit(roomData);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>방 만들기</h2>
                    <button className="close-btn" onClick={onClose}>❌</button>
                </div>
                <div className="form-group">
                    <label>방 이름</label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="방 이름을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>최대 인원</label>
                    <input
                        type="number"
                        min="2"
                        max="8"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label>최대 라운드</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={maxRounds}
                        onChange={(e) => setMaxRounds(Number(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label>시간 (초)</label>
                    <select value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}>
                        <option value={10}>10초</option>
                        <option value={20}>20초</option>
                        <option value={30}>30초</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>세대 선택</label>
                    <div className="generation-buttons">
                        {generations.map((gen) => (
                            <button
                                key={gen}
                                className={`generation-btn ${selectedGenerations.includes(gen) ? 'selected' : ''}`}
                                onClick={() => handleGenerationClick(gen)}
                            >
                                {gen}세대
                            </button>
                        ))}
                    </div>
                </div>
                <button className="submit-btn" onClick={handleSubmit}>방 만들기</button>
            </div>
        </div>
    );
};

export default CreateRoomPopup;
