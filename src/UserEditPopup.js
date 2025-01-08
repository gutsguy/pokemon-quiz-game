import React, { useState } from "react";

const UserEditPopup = ({ onClose, onSubmit, currentNickname }) => {
    const [nickname, setNickname] = useState(currentNickname || "");

    const handleSave = () => {
        if (!nickname.trim()) {
            alert('변경 닉네임을 입력해주세요!');
            return;
        }
        const userData = {
            nickname: nickname,
        };
        // 닉네임 저장 로직 추가
        onSubmit(userData);
        console.log("Updated Nickname:", nickname);
        onClose(); // 팝업 닫기
    };

    return (
        <div className="popup-container">
            <div className="popup-content">
                <h3>닉네임 수정</h3>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="새 닉네임 입력"
                />
                <button onClick={handleSave}>저장</button>
                <button onClick={onClose}>취소</button>
            </div>
        </div>
    );
};

export default UserEditPopup;
