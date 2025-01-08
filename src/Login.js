import React, { useState, useEffect } from "react";
import "./Login.css";
import quizgame from '/root/pokemon-quiz-game/src/pokemonquizgame.png';
import professor from '/root/pokemon-quiz-game/src/professor.png';
import ash from '/root/pokemon-quiz-game/src/ash.png';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const navigate = useNavigate();


  const handleKakaoLogin = async () => {
    try {
      // 로그인 상태 확인
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, { withCredentials: true });
      if (response.data) {
        navigate("/lobby"); // 이미 로그인 상태라면 로비로 이동
        return;
      }
    } catch {
      // 로그인되지 않은 상태라면 로그인 진행
    }

    // 서버 로그인 URL로 리다이렉트
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/kakao?redirect=${window.location.origin + (query.get("redirect") || "/")}`;
  };

  const [ashStyle, setAshStyle] = useState({});
  const [professorStyle, setProfessorStyle] = useState({});
  const [silhouette, setSilhouette] = useState(null); // Silhouette 이미지 상태

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    // 마우스 위치에 따라 기울어지는 정도 계산
    const tiltX = ((clientX / innerWidth) - 0.5) * -50; // -10 ~ 10도
    const tiltY = ((clientY / innerHeight) - 0.5) * -50; // -10 ~ 10도

    setAshStyle({
      transform: `rotateX(${-tiltY}deg) rotateY(${tiltX}deg)`,
      transition: 'transform 0.2s ease-out',
      filter: `drop-shadow(${tiltX}px ${tiltY}px 20px rgba(0, 0, 0, 0.3)) brightness(${1 + tiltX / 200})`,
    });

    setProfessorStyle({
      transform: `rotateX(${-tiltY}deg) rotateY(${tiltX}deg)`,
      transition: 'transform 0.2s ease-out',
      filter: `drop-shadow(${tiltX}px ${tiltY}px 20px rgba(0, 0, 0, 0.3)) brightness(${1 + tiltX / 200})`,
    });
  };

  const fetchRandomPokemon = async () => {
    // 사용자가 선택한 세대 가져오기
    const randomId = Math.floor(Math.random() * 493) + 1;
    try {
      const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const pokemonData = await pokemonResponse.data;

      const imageUrl = pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;
      
      const silhouetteImage = await createSilhouette(imageUrl);
      setSilhouette(silhouetteImage);

    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  };

  const createSilhouette = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";  // 크로스오리진 문제 방지
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
          const alpha = imageData.data[i + 3];  // 알파 채널 (투명도)
          if (alpha > 50) {
            imageData.data[i] = 0;   // R
            imageData.data[i + 1] = 0; // G
            imageData.data[i + 2] = 0; // B (검정색으로 설정)
          } else {
            imageData.data[i + 3] = 0;  // 투명하게 설정
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());  // base64로 반환
      };
    });
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  return (
    <div className="login-page" onMouseMove={handleMouseMove}>
      <img
        src={quizgame}
        alt="Pokemon Quiz Game Title"
        className="title-img"
      />
      <div className="login-container">
        <div className="characters">
          <img
            src={ash}
            alt="ash"
            className="character ash"
            style={ashStyle} // 동적 스타일 추가
          />
          <div className="login-box">
            <button className="kakao-login-button" onClick={handleKakaoLogin}> 카카오 로그인 </button>
            <p>이 포켓몬은 뭘까~~~용</p> 
            {silhouette && (
              <img
                src={silhouette}
                alt="Silhouette"
                className="silhouette-image"
              />
            )}
            
          </div>
          <img
            src={professor}
            alt="professor"
            className="character professor"
            style={professorStyle} // 동적 스타일 추가
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
