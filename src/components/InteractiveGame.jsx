import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sounds';

const fireConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults, particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults, particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

const createDoors = () => {
  const doors = [
    { id: 0, content: 'goat', isOpen: false },
    { id: 1, content: 'goat', isOpen: false },
    { id: 2, content: 'goat', isOpen: false },
  ];
  doors[Math.floor(Math.random() * 3)].content = 'car';
  return doors;
};

const t = {
  en: {
    start: 'Select a door to start!',
    opening: 'Monty is opening a goat door...',
    stay_switch: 'Do you want to STAY with your door or SWITCH?',
    win: '🎉 You won a CAR! 🎉',
    lose: '🐐 You got a GOAT! 🐐',
    selected: 'Selected',
    reset: 'Reset Game'
  },
  zh: {
    start: '请选择一扇门开始！',
    opening: '主持人正在打开一扇有羊的门...',
    stay_switch: '你想【坚持】初衷还是【换门】？',
    win: '🎉 恭喜你赢得了一辆跑车！ 🎉',
    lose: '🐐 你得到了一只山羊！ 🐐',
    selected: '已选择',
    reset: '重新开始'
  }
};

export default function InteractiveGame({ lang = 'zh' }) {
  const [doors, setDoors] = useState(createDoors());
  const [gameState, setGameState] = useState('idle');
  const [selectedId, setSelectedId] = useState(null);
  const [messageKey, setMessageKey] = useState('start');

  const getText = (key) => t[lang][key];

  const handleDoorClick = (id) => {
    if (gameState === 'idle') {
      sounds.select();
      setSelectedId(id);
      setGameState('picked');
      setMessageKey('opening');
      
      const availableToOpen = doors.filter(d => d.id !== id && d.content === 'goat');
      const doorToOpen = availableToOpen[Math.floor(Math.random() * availableToOpen.length)];
      
      setTimeout(() => {
        sounds.reveal();
        setDoors(prev => prev.map(d => d.id === doorToOpen.id ? { ...d, isOpen: true } : d));
        setGameState('revealed');
        setMessageKey('stay_switch');
      }, 1000);
      
    } else if (gameState === 'revealed') {
      if (doors[id].isOpen) return;
      
      setSelectedId(id);
      setDoors(prev => prev.map(d => ({ ...d, isOpen: true })));
      setGameState('finished');
      
      if (doors[id].content === 'car') {
        setMessageKey('win');
        sounds.win();
        fireConfetti();
      } else {
        setMessageKey('lose');
        sounds.lose();
      }
    }
  };

  const resetGame = () => {
    sounds.click();
    setDoors(createDoors());
    setGameState('idle');
    setSelectedId(null);
    setMessageKey('start');
  };

  return (
    <div className="glass-panel">
      <div className="status-message">
        {getText(messageKey)}
      </div>
      
      <div className="doors-container">
        {doors.map((door) => {
          const isSelected = selectedId === door.id;
          return (
            <div 
              key={door.id}
              className={`door-wrapper ${door.isOpen ? 'open' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDoorClick(door.id)}
            >
              <div className="door-face door-front">
                <img src={`${import.meta.env.BASE_URL}door.png`} alt={`Door ${door.id + 1}`} className="door-img" />
                <div className="door-overlay">
                  <span className="door-number">{door.id + 1}</span>
                  {isSelected && gameState !== 'finished' && (
                    <span className="door-indicator">{getText('selected')}</span>
                  )}
                </div>
              </div>
              <div className={`door-face door-back ${door.content === 'car' ? 'win' : 'lose'}`}>
                <img 
                  src={door.content === 'car' ? `${import.meta.env.BASE_URL}car.png` : `${import.meta.env.BASE_URL}goat.png`} 
                  alt={door.content} 
                  className="door-img" 
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="controls">
        <button 
          className="btn-outline" 
          onClick={resetGame}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RotateCcw size={18} />
          {getText('reset')}
        </button>
      </div>
    </div>
  );
}
