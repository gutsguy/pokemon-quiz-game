import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomPopup from "./CreateRoomPopup";
import { authStore } from "./store/AuthStore";
import "./Lobby.css";
import quizgame from '/root/pokemon-quiz-game/src/pokemonquizgame.png';
import consoleimage from '/root/pokemon-quiz-game/src/consoleimage.png';
import axios from "axios";

const Lobby = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userStats, setUserStats] = useState(null); // 유저 정보 상태
    const [rankingStats, setRankingStats] = useState([]); // 랭킹 정보 상태
    const navigate = useNavigate();

    const { user } = authStore();
    const userId = user?._id;

    // 개별 유저 정보 가져오기
    const getUserStats = async () => {
        const requestUrl = `http://172.10.7.78:5000/users/${userId}`;
        try {
            const response = await axios.get(requestUrl, { withCredentials: true });
            console.log("내 정보", response.data);
            setUserStats(response.data); // 유저 정보 상태에 저장
        } catch (error) {
            console.error("Error fetching user stats:", error);
        }
    };

    // 모든 유저 정보 가져오기
    const getAllUsersStats = async () => {
        const requestUrl = `http://172.10.7.78:5000/users`;
        try {
            const response = await axios.get(requestUrl, { withCredentials: true });
            console.log("모든 유저 정보:", response.data);

            // highscore 기준으로 정렬
            const sortedUsers = response.data.sort((a, b) => b.highscore - a.highscore);

            // 상위 4명만 저장
            setRankingStats(sortedUsers.slice(0, 4));
        } catch (error) {
            console.error("Error fetching all user stats:", error);
        }
    };

    useEffect(() => {
        getUserStats();
        getAllUsersStats();
    }, []);

    // correct 비율 계산
    const calculatePercentage = (correct, total) => {
        if (total === 0) return "0%";
        return `${((correct / total) * 100).toFixed(2)}%`;
    };

    return (
        <div className="main-container">
            {/* 상단 로고 */}
            <div className="header">
                <img
                    src={quizgame}
                    alt="Pokemon Quiz Game"
                    className="title-image"
                />
            </div>

            {/* 중앙 초록 박스 */}
            <div className="profile-box">
                {/* 시작하기 버튼 */}
                <button className="start-button" onClick={() => setIsPopupOpen(true)}>시작하기</button>
                {isPopupOpen && (
                    <CreateRoomPopup
                        onClose={() => setIsPopupOpen(false)}
                        onSubmit={() => {
                            CreateRoomPopup();
                            setIsPopupOpen(false);
                        }}
                    />
                )}
                {/* 왼쪽 프로필 박스 */}
                <div className="console-container">
                    <img
                        src={consoleimage} // 콘솔 이미지 경로
                        alt="Console"
                        className="console-overlay"
                    />
                    <div className="user-profile-box">
                        <div className="user-name">
                            <p>{user?.nickname || "Unknown"}</p>
                        </div>
                        <div className="user-stats">
                            {userStats ? (
                                <>
                                    <p>하이스코어: {userStats.highscore}</p>
                                    <p>
                                        이지모드 정답률:{" "}
                                        {calculatePercentage(userStats.correct_15, userStats.total_15)}
                                    </p>
                                    <p>
                                        하드모드 정답률:{" "}
                                        {calculatePercentage(userStats.correct_30, userStats.total_30)}
                                    </p>
                                    <p>
                                        전체 게임 수:{" "}
                                        {userStats.total_15 + userStats.total_30}회
                                    </p>
                                </>
                            ) : (
                                <p>Loading stats...</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* 오른쪽 랭킹 박스 */}
                <div className="ranking-box">
                    <h2>RANKING</h2>
                    {rankingStats.length > 0 ? (
                        <>
                            <div className="ranking-item purple">
                                <span>1등 {rankingStats[0]?.nickname || "N/A"}</span>
                                <span>점수: {rankingStats[0]?.highscore || 0}</span>
                            </div>
                            <div className="ranking-item yellow">
                                <span>2등 {rankingStats[1]?.nickname || "N/A"}</span>
                                <span>점수: {rankingStats[1]?.highscore || 0}</span>
                            </div>
                            <div className="ranking-item blue">
                                <span>3등 {rankingStats[2]?.nickname || "N/A"}</span>
                                <span>점수: {rankingStats[2]?.highscore || 0}</span>
                            </div>
                            <div className="ranking-item red">
                                <span>4등 {rankingStats[3]?.nickname || "N/A"}</span>
                                <span>점수: {rankingStats[3]?.highscore || 0}</span>
                            </div>
                        </>
                    ) : (
                        <p>Loading rankings...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lobby;
