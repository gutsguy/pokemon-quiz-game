import React, { useEffect, useState, useRef } from 'react';
import './QuizGame.css';
import axios from 'axios';

const QuizGame = ({ room }) => {
  const [pokemonImage, setPokemonImage] = useState(null);
  const [pokemonName, setPokemonName] = useState('');
  const [hints, setHints] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // 정답 화면 여부
  const [countdown, setCountdown] = useState(null); // 5초 카운트다운 상태
  const [isGameStarted, setIsGameStarted] = useState(false); // 게임 시작 여부
  const [currentPokemon, setCurrentPokemon] = useState(null); // 현재 포켓몬 데이터
  const [progress, setProgress] = useState(0); // 프로그레스 바 상태
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);  // 맞춘 문제 수
  const [showResult, setShowResult] = useState(false);  // 결과 팝업 여부
  const inputRef = useRef();
  const hintInterval = useRef(null);
  const roundTimeout = useRef(null);

  const timelimit = room.time * 1000; // 한 라운드 전체 시간 (밀리초)

  const typeTranslations = {
    normal: "노말",
    fire: "불꽃",
    water: "물",
    grass: "풀",
    electric: "전기",
    ice: "얼음",
    fighting: "격투",
    poison: "독",
    ground: "땅",
    flying: "비행",
    psychic: "에스퍼",
    bug: "벌레",
    rock: "바위",
    ghost: "고스트",
    dark: "악",
    dragon: "드래곤",
    steel: "강철",
    fairy: "페어리",
  };

  const generationRanges = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1010],
  };

  const fetchRandomPokemon = async () => {
    // 사용자가 선택한 세대 가져오기
    const generations = room.generation;
    const genIndex = Math.floor(Math.random() * generations.length);
    const selectedGen = generations[genIndex];

    const [startId, endId] = generationRanges[selectedGen];
    const randomId = Math.floor(Math.random() * (endId - startId + 1)) + startId;
    try {
      console.log(`랜덤 포켓몬 ID: ${randomId}`);
      const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const pokemonData = await pokemonResponse.data;
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
      const speciesData = await speciesResponse.data;

      console.log("포켓몬 데이터:", pokemonData);
      console.log("포켓몬 종 데이터:", speciesData);

      const imageUrl = pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;
      const koreanName = speciesData.names.find((name) => name.language.name === 'ko')?.name || pokemonData.name;
      const type = pokemonData.types.map((t) => {
        const typeName = typeTranslations[t.type.name] || t.type.name; // 영어 → 한글 변환
        return { typeName };
      });
      const generation = speciesData.generation.url.split("/").slice(-2, -1)[0].replace("generation-", "");
      const nameLength = koreanName.length;

      const extractedColors = await extractDominantColors(imageUrl);
      const silhouetteImage = await createSilhouette(imageUrl);
      const pixelatedImage = await createPixelatedImage(imageUrl);

      setHints([
        { label: "색1/2/3", value: extractedColors},
        { label: "세대", value: `${generation}세대` },
        {
          label: "타입",
          value: type.map((t) => (
            <div key={t.typeName} className="type-hint">
              {t.typeIcon && <img src={t.typeIcon} alt={t.typeName} className="type-icon" />}
              <span>{t.typeName}</span>
            </div>
          )),
        },
        { label: "글자수", value: `${nameLength} 글자` },
        { label: "픽셀화", value: pixelatedImage },
        { label: "실루엣", value: silhouetteImage }

      ]);

      setPokemonImage(imageUrl);
      setPokemonName(koreanName);


      return { imageUrl, koreanName, hints: [...hints] };
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);

    }
  };

  const extractDominantColors = async (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // 크로스오리진 설정
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        // 1. **가장자리 색상 평균 계산** (배경 색상 추출)
        const edgeColors = [];
        for (let y = 0; y < canvas.height; y++) {
          edgeColors.push(getPixel(pixels, canvas.width, 0, y)); // 왼쪽
          edgeColors.push(getPixel(pixels, canvas.width, canvas.width - 1, y)); // 오른쪽
        }
        for (let x = 0; x < canvas.width; x++) {
          edgeColors.push(getPixel(pixels, canvas.width, x, 0)); // 상단
          edgeColors.push(getPixel(pixels, canvas.width, x, canvas.height - 1)); // 하단
        }
        const backgroundColor = averageColor(edgeColors); // 가장자리 색상 평균 계산

        const colorCount = {};
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3]; // 알파 값

          if (a < 200) continue; // 투명 픽셀 무시
          const rgb = [r, g, b];

          // 2. 배경색과 유사한 픽셀은 무시
          if (isSimilarColor(rgb, backgroundColor)) continue;

          const quantizedColor = quantizeColor(rgb, 16); // 색상 군집화
          const rgbString = `rgb(${quantizedColor.join(",")})`;
          colorCount[rgbString] = (colorCount[rgbString] || 0) + 1;
        }

        const sortedColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
        resolve(sortedColors.slice(0, 3).map(([color]) => color)); // 상위 3개 색상 반환
      };
    });
  };

  // Helper 함수들
  const getPixel = (pixels, width, x, y) => {
    const idx = (y * width + x) * 4;
    return [pixels[idx], pixels[idx + 1], pixels[idx + 2]]; // RGB 값 반환
  };

  const averageColor = (colors) => {
    const avg = colors.reduce((acc, color) => {
      acc[0] += color[0];
      acc[1] += color[1];
      acc[2] += color[2];
      return acc;
    }, [0, 0, 0]).map((sum) => Math.round(sum / colors.length));
    return avg; // 평균 RGB 값 반환
  };

  const isSimilarColor = (color1, color2, threshold = 100) => {
    // RGB 값 간 차이가 threshold 이내면 유사 색상으로 간주
    return (
      Math.abs(color1[0] - color2[0]) < threshold &&
      Math.abs(color1[1] - color2[1]) < threshold &&
      Math.abs(color1[2] - color2[2]) < threshold
    );
  };

  const quantizeColor = (color, step) => {
    // RGB 값을 일정 단계로 양자화
    return color.map((c) => Math.round(c / step) * step);
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

  const createPixelatedImage = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const pixelSize = 32;  // 픽셀 크기 조정 (값을 키울수록 모자이크 심함)
        canvas.width = img.width / pixelSize;
        canvas.height = img.height / pixelSize;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // 작은 해상도로 그림

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = img.width;
        finalCanvas.height = img.height;
        const finalCtx = finalCanvas.getContext("2d");
        finalCtx.imageSmoothingEnabled = false;
        finalCtx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);  // 확대하여 모자이크 효과

        resolve(finalCanvas.toDataURL());  // base64 반환
      };
    });
  };


  const startHintSequence = () => {
    let index = 0;
    const intervalTime = timelimit / 7; // 힌트 노출 간격
    const progressIntervalTime = timelimit / 1000; // 프로그레스 바 업데이트 주기
    let progressValue = 0; // 프로그레스 바 초기화

    setProgress(0); // 프로그레스 바 0%로 초기화
    clearInterval(hintInterval.current); // 중복 실행 방지

    // 힌트 시퀀스 시작
    hintInterval.current = setInterval(() => {
      setCurrentHintIndex((prevIndex) => prevIndex + 1);
      index++;

      if (index >= 7) {
        clearInterval(hintInterval.current); // 모든 힌트 출력 후 정리
        showAnswerScreen(); // 정답 화면 표시
      }
    }, intervalTime);

    // 프로그레스 바 업데이트
    const progressInterval = setInterval(() => {
      progressValue += 0.1; // 1%씩 증가
      setProgress(progressValue); // 프로그레스 바 업데이트

      if (progressValue >= 100) {
        clearInterval(progressInterval); // 100%에 도달하면 멈춤
      }
    }, progressIntervalTime);
  };

  const showAnswerScreen = () => {
    setShowAnswer(true); // 정답 화면 표시
    setTimeout(() => {
      setShowAnswer(false); // 5초 후 정답 화면 숨김
      setCurrentHintIndex(0); // 힌트 인덱스 초기화
      startNextRound(); // 다음 라운드 시작
    }, 3000); // 5초 동안 정답 화면을 표시
  };

  const startNextRound = async() => {
    setRound((prevRound) => {
      if (prevRound + 1 > room.max_round) {
        console.log("끝났어용");
        setShowResult(true);  // 결과 팝업 표시
        setCountdown(null);  // 카운트다운 중단
        setShowAnswer(false);  // 정답 화면 숨김
        return prevRound;  // 라운드 증가 중지
      }
      return prevRound + 1;  // 라운드 증가
    });
    
    setShowAnswer(false); // 정답 화면 숨김
    setCountdown(3); // 카운트다운 시작
    
    console.log("카운트다운 시작");
    const nextPokemon = await fetchRandomPokemon();

    if (nextPokemon) {
      console.log("포켓몬 로드 완료:", nextPokemon.koreanName);
    } else {
      console.error("포켓몬 데이터를 로드하지 못했습니다.");
    }

    // 3초 동안 카운트다운
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval); // 카운트다운 종료
          setCountdown(null); // 카운트다운 숨김

          if (nextPokemon) {
            setCurrentPokemon(nextPokemon); // 포켓몬 데이터 설정
            setCurrentHintIndex(0); // 힌트 초기화
            startHintSequence(); // 힌트 시퀀스 시작
          } else {
            console.error("Failed to load Pokemon data");
          }
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setCorrectAnswers((prevCorrect) => prevCorrect + 1);  // 정답 맞춘 수 증가
    }
  };

  const handleRestart = () => {
    setRound(0);
    setCorrectAnswers(0);
    setShowResult(false);  // 게임 재시작
  };

  useEffect(() => {
    if (isGameStarted) {
      startNextRound(); // 게임이 시작되면 첫 라운드 실행
    }

    return () => {
      clearInterval(hintInterval.current); // 컴포넌트 언마운트 시 힌트 타이머 클리어
      clearTimeout(roundTimeout.current); // 라운드 종료 타이머 클리어
    };
  }, [isGameStarted]);

  // 채팅 전송 및 업데이트
  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && inputRef.current.value.trim()) {
      const newMessage = inputRef.current.value.trim();  // 입력된 메시지
      const isCorrectAnswer = newMessage === pokemonName;  // 정답 여부 확인

      const newChatMessage = {
        text: newMessage,
        isCorrect: isCorrectAnswer,  // 정답 여부 저장
      };

      setChatMessages((prevMessages) => [...prevMessages, newChatMessage]);  // 메시지 추가
      inputRef.current.value = '';  // 입력창 초기화

      if (isCorrectAnswer) {
        setShowAnswer(true);  // 정답 화면 표시
        console.log('정답입니다!');
      }
    }
  };
  
  return (
    <div className="game-container">
      <header className="room-info">
        <span>{room.room_name}</span>
        <span>라운드 {round}/{room.max_round}</span>
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

        <div className="game-content">
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                  transition: 'width linear'
                }}
              ></div>
            </div>
              <div className="progress-labels">
              <span>색1/2/3</span>
              <span>세대</span>
              <span>타입</span>
              <span>글자수</span>
              <span>픽셀화</span>
              <span>실루엣</span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="game-display">
            {!isGameStarted ? (
              <div className="start-button-container">
              <button className="start-button" onClick={() => setIsGameStarted(true)}>
                게임 시작
              </button>
            </div>
            ) : countdown !== null ? (
              <div className="countdown">
                <h1>{countdown}</h1>
              </div>
              ) : showAnswer ? (
                <div className="answer-display">
                  <h1 className="pokemon-name">{pokemonName}</h1>
                  <img className="pokemon-image-large" src={pokemonImage} alt={pokemonName} />
                </div>
              ) : (
              <div className="hint-row">
                {hints.map((hint, index) => (
                  <div
                    key={index}
                    className={`hint-box ${currentHintIndex >= index ? "visible" : "hidden"}`}
                  >
                    <strong>{hint.label}</strong>
                    <div className="hint-content">
                      {/* 색1/2/3 힌트 */}
                      {hint.label === "색1/2/3" ? (
                        <div className="color-bubbles">
                          {hint.value.map((color, i) => (
                            <div
                              key={i}
                              className="color-circle"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>
                      ) : hint.label === "픽셀화" ? (
                        <img
                          src={hint.value}
                          alt="픽셀화"
                          className="hint-image pixelated-effect"
                        />
                      ) : hint.label === "실루엣" ? (
                        <img
                          src={hint.value}
                          alt="실루엣"
                          className="hint-image silhouette-effect"
                        />
                      ) : typeof hint.value === "string" && hint.value.startsWith("http") ? (
                        <img src={hint.value} alt={hint.label} className="hint-image" />
                      ) : (
                        <span>{hint.value}</span> // 일반 텍스트 힌트는 텍스트로 표시
                      )}
                    </div>
                  </div>
                ))}
                      {/* 게임 종료 팝업 */}
                      {showResult && (
                        <div className="result-popup">
                          <h2>게임 종료!</h2>
                          <p>맞춘 문제 수: {correctAnswers} / {room.max_round}</p>
                          <button onClick={handleRestart}>게임 다시 시작</button>
                        </div>
                      )}
              </div>
            )}
          </div>


          {/* 채팅창 */}
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <p
                  key={index}
                  className={`chat-message ${message.isCorrect ? 'correct-answer' : ''}`}  // 정답 메시지에 스타일 적용
                >
                  {message.text}  {/* text 속성만 렌더링 */}
                </p>
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
  )};


export default QuizGame;