import React, { useEffect, useState, useRef } from 'react';
import './QuizGame.css';
import axios from 'axios';

const QuizGame = ({ room }) => {
  const [pokemonImage, setPokemonImage] = useState(null);
  const [pokemonName, setPokemonName] = useState('');
  const [hints, setHints] = useState([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [round, setRound] = useState(room.round);
  const [chatMessages, setChatMessages] = useState([]);
  const inputRef = useRef();
  const hintInterval = useRef(null);
  const roundTimeout = useRef(null);

  const timelimit = room.time * 1000; // 한 라운드 전체 시간 (밀리초)

  // 방의 라운드와 채팅DB 불러오기
  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/rooms/${room.room_id}`);
      setRound(response.data.round); // 최신 round 불러오기
      setChatMessages(response.data.chat_room || []); // 최신 채팅 불러오기
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const fetchRandomPokemon = async () => {
    setIsLoading(true);
    const randomId = Math.floor(Math.random() * 1010) + 1;
    
    try {
      const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const pokemonData = await pokemonResponse.data;
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
      const speciesData = await speciesResponse.data;

      const imageUrl = pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;
      const koreanName = speciesData.names.find((name) => name.language.name === 'ko')?.name || pokemonData.name;
      const type = pokemonData.types.map((t) => t.type.name).join('/');
      const generation = Math.ceil(randomId / 151);
      const nameLength = koreanName.length;

      const extractedColors = await extractDominantColors(imageUrl);

      setHints([
        { label: "색1/색2", value: extractedColors.slice(0, 2) },
        { label: "색3", value: extractedColors[2] },
        { label: "세대", value: `${generation}세대` },
        { label: "타입", value: type },
        { label: "글자수", value: `${nameLength} 글자` },
        { label: "실루엣", value: createSilhouette(imageUrl) },
        { label: "픽셀화", value: createPixelatedImage(imageUrl) }

      ]);

      setPokemonImage(imageUrl);
      setPokemonName(koreanName);
      setIsLoading(false);
      startHintSequence();
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setIsLoading(false);
    }
  };

  const extractDominantColors = async (imageUrl) => {
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
        const pixels = ctx.getImageData(0, 0, 50, 50).data;
        const colorCount = {};
        for (let i = 0; i < pixels.length; i += 4) {
          const [r, g, b] = pixels.slice(i, i + 3);
          const rgb = `rgb(${r},${g},${b})`;
          colorCount[rgb] = (colorCount[rgb] || 0) + 1;
        }
        const sortedColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
        resolve(sortedColors.map(([color]) => color).slice(0, 3));
      };
    });
  };

  // 라운드 증가 및 저장
  const updateRoundInDB = async () => {
    try {
      const newRound = round + 1;
      await axios.patch(`http://localhost:5000/rooms/${room.room_id}`, { round: newRound });
      setRound(newRound); // 화면 업데이트
    } catch (error) {
      console.error('Error updating round in DB:', error);
    }
  };

  const createSilhouette = (imageUrl) => {
    return imageUrl; // 이미지 URL 사용, CSS로 검정 실루엣 스타일링 가능
  };

  const createPixelatedImage = (imageUrl) => {
    return imageUrl; // 이미지 URL 사용, CSS로 픽셀화 필터 적용 가능
  };

  const startHintSequence = () => {
    let index = 0;
    const intervalTime = timelimit / 7; // 힌트 노출 간격
    setCurrentHintIndex(0); // 초기화

    clearInterval(hintInterval.current); // 중복 실행 방지
    hintInterval.current = setInterval(() => {
      setCurrentHintIndex((prevIndex) => prevIndex + 1);
      index++;
      if (index >= 7) {
        clearInterval(hintInterval.current); // 모든 힌트 출력 후 정리
      }
    }, intervalTime);
  };

  const startNextRound = () => {
    updateRoundInDB(); // 라운드 끝날 때 DB에 저장 및 업데이트
    fetchRandomPokemon(); // 다음 포켓몬 가져오기
  };

  useEffect(() => {
    fetchRoomData(); // 컴포넌트가 마운트될 때 방 데이터 불러오기
    fetchRandomPokemon(); // 첫 번째 포켓몬 로드
    roundTimeout.current = setInterval(startNextRound, timelimit); // 라운드마다 포켓몬 변경
    return () => {
      clearInterval(hintInterval.current);
      clearInterval(roundTimeout.current); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, [room.room_id]); // room 변경 시 새 라운드 시작

  // 채팅 전송 및 업데이트
  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && inputRef.current.value.trim()) {
      const newMessage = inputRef.current.value.trim();

      try {
        await axios.patch(`http://localhost:5000/rooms/${room.room_id}/chat`, {
          chat_room: newMessage,
        });
        fetchRoomData(); // 채팅 업데이트 후 최신 채팅 불러오기
        inputRef.current.value = ''; // 입력창 초기화
      } catch (error) {
        console.error('Error sending chat message:', error);
      }
    }
  };
  
  return (
    <div className="game-container">
      <header className="room-info">
        <span>{room.room_name}</span>
        <span>참가인원: {room.member_id.length}/{room.max_participants}</span>
        <span>라운드 {room.round}/{room.max_round}</span>
        <span>제한 시간: {room.time}초</span>
      </header>

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

        {/* 문제 화면 */}
        <div className="game-content">
          {/* 게이지바 부분 */}
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentHintIndex + 1) / hints.length) * 100}%`,
                  transition: 'width 0.5s ease',
                  animationDuration: `${room.time}s`
                }}
              ></div>
            </div>
              <div className="progress-labels">
              <span>색1/2</span>
              <span>색3</span>
              <span>세대</span>
              <span>타입</span>
              <span>글자수</span>
              <span>실루엣</span>
              <span>픽셀화</span>
              <span></span>
            </div>
          </div>

          <div className="game-display">
            {/* 힌트 표시 */}
            {isLoading ? (
              <p className="loading-text">로딩 중...</p>
            ) : (
              <div className="hint-row">
                {hints.map((hint, index) => (
                  <div
                    key={index}
                    className={`hint-box ${currentHintIndex >= index ? "visible" : "hidden"}`}
                  >
                    <strong>{hint.label}</strong>
                    <div className="hint-content">
                      {Array.isArray(hint.value) ? (
                        <div className="color-bubbles">
                          {hint.value.map((color, i) => (
                            <div key={i} className="color-circle" style={{ backgroundColor: color }}></div>
                          ))}
                        </div>
                      ) : typeof hint.value === 'string' && hint.value.startsWith('http') ? (
                        <img src={hint.value} alt={hint.label} className="hint-image" />
                      ) : (
                        <span>{hint.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* 채팅창 */}
      <div className="chat-container">
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <input
          type="text"
          placeholder="채팅을 입력해주세요."
          className="chat-input"
          ref={inputRef}
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  )};


export default QuizGame;