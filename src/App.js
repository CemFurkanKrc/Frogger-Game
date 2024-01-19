import React, { useState, useEffect } from 'react';

const Game = () => {
  // Oyunun başlangıç durumu için state'leri tanımla
  const [frogPosition, setFrogPosition] = useState({ x: 4.5, y: 4 });
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [score, setScore] = useState(0);
  const [bestscore,setbest]=useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [intervalDuration, setIntervalDuration] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);

  // Oyunu başlatan fonksiyon
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setFrogPosition({ x: 4.5, y: 4 });
    setObstacles([]);
    setIntervalDuration(10);
  };

  // Klavye olaylarını dinleyen useEffect
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isKeyPressed  && gameStarted) {
        setIsKeyPressed(true);
        // Klavye ok tuşlarına göre kurbağa pozisyonunu güncelle
        if (e.key === 'ArrowUp' && frogPosition.y > 0) {
          setFrogPosition((prev) => ({ ...prev, y: prev.y - 1 }));
        } else if (e.key === 'ArrowDown' && frogPosition.y < 9) {
          setFrogPosition((prev) => ({ ...prev, y: prev.y + 1 }));
        } else if (e.key === 'ArrowLeft' && frogPosition.x > 0) {
          setFrogPosition((prev) => ({ ...prev, x: prev.x - 0.5 }));
        } else if (e.key === 'ArrowRight' && frogPosition.x < 9.5) {
          setFrogPosition((prev) => ({ ...prev, x: prev.x + 0.5 }));
        }
      }
    };

    const handleKeyRelease = () => {
      setIsKeyPressed(false);
    };

    // Klavye olaylarına dinleme ekleyip, temizle
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [frogPosition, isKeyPressed, gameStarted]);

  // Puan artışını sağlayan useEffect
  useEffect(() => {
    const increaseScoreInterval = setInterval(() => {
      if (gameStarted) {
        // Her saniyede puanı 1 arttır
        setScore((prevScore) => prevScore + 1);
      }
    }, 1000);
    // Engelleri oluşturan ve hareket ettiren useEffect
    const obstacleInterval = setInterval(() => {
      if (gameStarted) {
        // Engellerin pozisyonlarını güncelle
        setObstacles((prevObstacles) =>
          prevObstacles.map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - 0.025,
          }))
        );

        // Belirli bir olasılıkla yeni bir engel ekle
        if (Math.random() < 0.02) {
          setObstacles((prevObstacles) => [
            ...prevObstacles,
            {
              x: 10,
              y: Math.floor(Math.random() * 10),
            },
          ]);
        }

        // Oyun alanı dışında kalan engelleri temizle
        setObstacles((prevObstacles) => prevObstacles.filter((obstacle) => obstacle.x + 1> 0));
      }
    }, intervalDuration);

    // Engellerin hızını arttıran useEffect
    const intervalDurationDecrease = setInterval(() => {
      if (gameStarted) {
        setIntervalDuration((prevInterval) => Math.max(1, prevInterval - 1));
      }
    }, 10000);

    // Temizleme işlemleri
    return () => {
      clearInterval(increaseScoreInterval);
      clearInterval(obstacleInterval);
      clearInterval(intervalDurationDecrease);
    };
  }, [intervalDuration, gameStarted]);

  // Çarpışma kontrolünü yapan useEffect
  useEffect(() => {
    const collisionInterval = setInterval(() => {
      if (gameStarted) {
        // Engellerle çarpışmayı kontrol et
        const collided = obstacles.some(
          (obstacle) =>
            frogPosition.y === obstacle.y &&
            frogPosition.x + 0.5 >= obstacle.x &&
            frogPosition.x <= obstacle.x + 1
        );

        // Çarpışma durumunda oyunu durdur ve başlangıç durumuna döndür
        if (collided) {
          setGameStarted(false);
          setFrogPosition({ x: 4.5, y: 4 });
          setScore(score);
          setObstacles([]);
          setIntervalDuration(10);
          // En iyi skoru güncelle
          if(score>bestscore){
            setbest(score)
          }
        }
      }
    }, 1);

    // Temizleme işlemi
    return () => {
      clearInterval(collisionInterval);
    };
  }, [frogPosition, obstacles, setGameStarted, gameStarted]);

  // Oyunun arayüzü
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {!gameStarted && (
        <button onClick={startGame}>Start Game</button>
      )}

      <h1>Frogger</h1>
      <div
        style={{
          position: 'relative',
          width: '800px',
          height: '400px',
          border: '1px solid black',
          margin: 'auto',
        }}
      >
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${index * 40}px`,
              left: 0,
              width: '100%',
              height: '40px',
              borderBottom: '1px solid gray',
            }}
          />
        ))}
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${obstacle.y * 40}px`,
              left: `${obstacle.x * 80}px`,
              width: `80px`,
              height: '40px',
              backgroundColor: 'red',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            top: `${frogPosition.y * 40}px`,
            left: `${frogPosition.x * 80}px`,
            width: '40px',
            height: '40px',
            backgroundColor: 'green',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '35px',
          }}
        >
          🐸
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '600px',
          padding: '10px',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        Score: {score}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '400px',
          padding: '10px',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        BestScore: {bestscore}
      </div>
    </div>
  );
};

export default Game;