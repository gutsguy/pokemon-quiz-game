import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomPopup from "./CreateRoomPopup";

const Lobby = ({ rooms, onCreateRoom, onJoinRoom }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();



    return (
        <div className="lobby-container">
            <h2>로비</h2>
            <button onClick={() => setIsPopupOpen(true)}>게임 시작</button>
            {isPopupOpen && (
                <CreateRoomPopup
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default Lobby;
