import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRoomPopup.css';

const CreateRoomPopup = ({ onClose }) => {
    const [maxRounds, setMaxRounds] = useState(5);
    const [timeLimit, setTimeLimit] = useState(15);
    const [selectedGenerations, setSelectedGenerations] = useState([]);
    const navigate = useNavigate();

    const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 1세대 ~ 9세대

    // 세대 클릭 핸들러
    const handleGenerationClick = (gen) => {
        if (selectedGenerations.includes(gen)) {
            setSelectedGenerations(selectedGenerations.filter((g) => g !== gen));
        } else {
            setSelectedGenerations([...selectedGenerations, gen]);
        }
    };

    const handleModeChange = (e) => {
        const mode = Number(e.target.value);
        setTimeLimit(mode);

        if (mode === -1) { // 무한 모드 선택 시
            setMaxRounds(9999); // 큰 값으로 설정
            setTimeLimit(15)
            setSelectedGenerations(generations); // 모든 세대 자동 선택
        } else {
            setMaxRounds(5); // 기본값으로 재설정
            setSelectedGenerations([]);
        }
    };

    // 제출 핸들러
    const handleSubmit = () => {
        const gameConfig = {
            max_rounds: maxRounds,
            time_limit: timeLimit,
            selected_generations: selectedGenerations,
        };
        localStorage.setItem('gameConfig', JSON.stringify(gameConfig)); // 설정을 저장
        navigate('/game');
        console.log("제출되었습니다");
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>게임 모드 설정</h2>
                    <button className="close-btn" onClick={onClose}>❌</button>
                </div>
                <div className="form-group">
                    <label>게임 모드</label>
                    <select value={timeLimit} onChange={handleModeChange}>
                        <option value={30}>이지 모드</option>
                        <option value={15}>하드 모드</option>
                        <option value={-1}>무한 모드</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>최대 라운드</label>
                    <input
                        type="number"
                        min="1"
                        value={maxRounds}
                        onChange={(e) => setMaxRounds(Number(e.target.value))}
                        disabled={timeLimit === -1} // 무한 모드일 때 비활성화
                    />
                </div>
                <div className="form-group">
                    <label>세대 선택</label>
                    <div className="generation-buttons">
                        {generations.map((gen) => (
                            <button
                                key={gen}
                                className={`generation-btn ${selectedGenerations.includes(gen) ? 'selected' : ''}`}
                                onClick={() => handleGenerationClick(gen)}
                                disabled={timeLimit === 15 && maxRounds === 9999}
                            >
                                {gen}세대
                            </button>
                        ))}
                    </div>
                </div>
                <button className="submit-btn" onClick={handleSubmit}>게임 준비</button>
            </div>
        </div>
    );
};

export default CreateRoomPopup;
