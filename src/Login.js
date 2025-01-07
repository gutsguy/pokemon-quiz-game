import React from "react";
import "./Login.css";
import quizgame from '/root/pokemon-quiz-game/src/pokemonquizgame.png';
import professor from '/root/pokemon-quiz-game/src/professor.png';
import ash from '/root/pokemon-quiz-game/src/ash.png';

const Login = () => {
  const query = new URLSearchParams(window.location.search);

  const handleKakaoLogin = () => {
    // 서버 로그인 URL로 리다이렉트
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/kakao?redirect=${window.location.origin + (query.get("redirect") || "/")
      }`;
  };

  return (
    <div className="login-page">

      <img
        src={quizgame}
        alt="Pokemon Quiz Game Title"
        className="title-img"
      />

      <header className="login-header">
      </header>

      <div className="login-container">
        <div className="characters">
          <img
            src={ash}
            alt="character ash"
            className="character ash"
          />
          <div className="login-box">
            <button className="kakao-login-button" onClick={handleKakaoLogin}>
              카카오 로그인 하기
            </button>
          </div>
          <img
            src={professor}
            alt="Professor Oak"
            className="character professor"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;