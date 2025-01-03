import React, { useEffect, useState, useRef } from 'react';
import './App.css';

const QuizGame = () => {
  const [pokemonImage, setPokemonImage] = useState(null);
  const [pokemonName, setPokemonName] = useState('');
  const [dominantColors, setDominantColors] = useState(['#ffffff', '#cccccc']);
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerRef = useRef(null);

  const getRandomPokemonId = () => Math.floor(Math.random() * 1010) + 1;

  const fetchRandomPokemon = async () => {
    setIsLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const randomId = getRandomPokemonId();
    try {
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`, {
        signal: abortControllerRef.current.signal,
      });
      const pokemonData = await pokemonResponse.json();
      const imageUrl = pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;

      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`, {
        signal: abortControllerRef.current.signal,
      });
      const speciesData = await speciesResponse.json();
      const koreanName = speciesData.names.find((name) => name.language.name === 'ko');
      const name = koreanName ? koreanName.name : pokemonData.name;

      const extractedColors = await extractDominantColors(imageUrl);

      setPokemonImage(imageUrl);
      setPokemonName(name);
      setDominantColors(extractedColors);
      setIsLoading(false);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Failed to fetch Pokemon:', error);
      }
      setIsLoading(false);
    }
  };

  const extractDominantColors = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const imageData = ctx.getImageData(0, 0, 50, 50);
        const pixels = imageData.data;
        const colorCount = {};
        let dominantColors = [];
        const maxColorsToExtract = 5; // 최대 색상 추출 개수

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          if (a < 200 || (r > 240 && g > 240 && b > 240) || (r < 20 && g < 20 && b < 20)) continue;

          const rgb = `rgb(${r},${g},${b})`;

          if (colorCount[rgb]) {
            colorCount[rgb]++;
          } else {
            colorCount[rgb] = 1;
          }
        }

        // 색상 빈도 수대로 정렬
        const sortedColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);

        dominantColors.push(sortedColors[0][0]); // 첫 번째 색상 추가

        let addedColors = 1;
        for (let i = 1; i < sortedColors.length && addedColors < 2; i++) {
          const candidateColor = sortedColors[i][0];
          if (colorDifference(dominantColors[0], candidateColor) > 70) { // 두 색상 차이를 판단하는 기준 강화
            dominantColors.push(candidateColor);
            addedColors++;
          }
        }

        // 만약 두 번째 색상이 비슷하면 기본 색상 반환
        if (dominantColors.length < 2) {
          dominantColors.push('#dddddd');
        }

        resolve(dominantColors);
      };
    });
  };

  // 두 색상 간 차이를 계산하는 함수
  const colorDifference = (rgb1, rgb2) => {
    const [r1, g1, b1] = rgb1.match(/\d+/g).map(Number);
    const [r2, g2, b2] = rgb2.match(/\d+/g).map(Number);
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
  };

  useEffect(() => {
    fetchRandomPokemon();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="game-container">
      {/* 방 정보 */}
      <header className="room-info">
        <span>[1] 어진님의 방</span>
        <span>참가인원 8/8</span>
        <span>라운드 4/5</span>
        <span>30초</span>
      </header>



      {/* 게임 화면 */}
      <div className="game-display-container">
        {/* 왼쪽 프로필 리스트 */}
        <div className="profile-column">
          {Array(4).fill(null).map((_, index) => (
            <div key={index} className="participant-card">
              <div className="profile-circle">프로필</div>
              <div className="nickname">닉네임</div>
              <div className="score">점수: 2322</div>
            </div>
          ))}
        </div>

        {/* 게이지 바 및 문제 이미지*/}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-labels">
            <span>색1</span>
            <span>색2</span>
            <span>타입</span>
            <span>세대</span>
            <span>글자수</span>
            <span>실루엣</span>
            <span>픽셀화</span>
          </div>

          {/* 문제 이미지 중앙 */}
          <div className="game-content">
            {isLoading ? (
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#555' }}>로딩 중...</p>
            ) : (
              <div
                className="game-display"
                style={{
                  backgroundColor: dominantColors[0],
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px solid #000',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {pokemonImage && (
                    <img
                      src={pokemonImage}
                      alt={pokemonName}
                      style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                    />
                  )}
                  <p style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
                    {pokemonName ? `이 포켓몬은 ${pokemonName}입니다!` : '포켓몬 이름을 불러오는 중...'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: dominantColors[0],
                      borderRadius: '50%',
                    }}
                  ></div>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: dominantColors[1],
                      borderRadius: '50%',
                    }}
                  ></div>
                </div>
                <p>Dominant Colors: {dominantColors[0]}, {dominantColors[1]}</p>
              </div>
            )}
            

            {/* 채팅창 */}
            <div className="chat-container">
              <div className="chat-messages">
                <p>참가자1: 정답은 피카츄!</p>
                <p>참가자2: 틀렸어!</p>
                <p>참가자3: 답을 모르겠네...</p>
              </div>
              <input type="text" placeholder="채팅을 입력해주세요." className="chat-input" />
            </div>
          </div>
        </div>



        {/* 오른쪽 프로필 리스트 */}
        <div className="profile-column">
          {Array(4).fill(null).map((_, index) => (
            <div key={index} className="participant-card">
              <div className="profile-circle">프로필</div>
              <div className="nickname">닉네임</div>
              <div className="score">점수: 2322</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
