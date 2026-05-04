import React, { useState } from 'react';
import { Play } from 'lucide-react';

const t = {
  en: {
    runs_label: 'Number of runs:',
    run_100: '100 runs',
    run_1000: '1,000 runs',
    run_10000: '10,000 runs',
    run_100000: '100,000 runs',
    run_btn: 'Run Simulation',
    simulating: 'Simulating...',
    switch: 'Always Switch',
    stay: 'Always Stay',
    wins: 'wins',
    runs: 'runs',
    why: 'Why does this happen?',
    exp: "Initially, you have a 1/3 chance of picking the car and a 2/3 chance of picking a goat. When Monty opens a goat door, the probabilities don't change. If you stay, you still have your initial 1/3 chance of winning. However, because Monty is forced to reveal a goat from the remaining unchosen doors, switching gives you the remaining 2/3 chance of winning.",
    thought_title: '🤔 Further Thought',
    thought_text: 'Try comparing the probability fluctuations when running the simulation 100 times versus 100,000 times. What do you observe about the variance as the number of simulations increases? (Hint: Law of Large Numbers)'
  },
  zh: {
    runs_label: '模拟次数：',
    run_100: '100 次',
    run_1000: '1,000 次',
    run_10000: '10,000 次',
    run_100000: '100,000 次',
    run_btn: '开始模拟',
    simulating: '模拟中...',
    switch: '始终换门',
    stay: '始终不换',
    wins: '次获胜',
    runs: '次运行',
    why: '原理解析',
    exp: '最初，你选中跑车的概率是 1/3，选中羊的概率是 2/3。当主持人打开一扇有羊的门后，所有的概率并没有改变。如果你选择不换门，你赢得跑车的概率仍然是你最初的 1/3。然而，因为主持人被迫从剩余未选中的门中揭晓了一只羊，所以换门将赋予你剩余的 2/3 获胜机会。',
    thought_title: '🤔 进一步思考',
    thought_text: '试着比较运行 100 次和运行 100,000 次模拟时的胜率波动大小。随着重复模拟次数的增加，你观察到了什么现象？（提示：大数定律）'
  }
};

export default function Simulator({ lang = 'zh' }) {
  const getText = (key) => t[lang][key];
  const [simCount, setSimCount] = useState(1000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState({ switchWins: 0, stayWins: 0, total: 0 });

  const runSimulation = () => {
    setIsSimulating(true);
    setResults({ switchWins: 0, stayWins: 0, total: 0 });
    
    let currentTotal = 0;
    let currentSwitchWins = 0;
    let currentStayWins = 0;
    
    // Chunking to prevent UI freezing
    const chunkSize = Math.max(1, Math.floor(simCount / 50));
    
    const runChunk = () => {
      let limit = Math.min(simCount - currentTotal, chunkSize);
      for (let i = 0; i < limit; i++) {
        const carDoor = Math.floor(Math.random() * 3);
        const initialPick = Math.floor(Math.random() * 3);
        
        // Monty opens a goat door
        let montyOptions = [0, 1, 2].filter(d => d !== carDoor && d !== initialPick);
        const montyOpen = montyOptions[Math.floor(Math.random() * montyOptions.length)];
        
        // Switch pick
        const switchPick = [0, 1, 2].find(d => d !== initialPick && d !== montyOpen);
        
        if (initialPick === carDoor) currentStayWins++;
        if (switchPick === carDoor) currentSwitchWins++;
        currentTotal++;
      }
      
      setResults({ switchWins: currentSwitchWins, stayWins: currentStayWins, total: currentTotal });
      
      if (currentTotal < simCount) {
        requestAnimationFrame(runChunk);
      } else {
        setIsSimulating(false);
      }
    };
    
    requestAnimationFrame(runChunk);
  };

  const switchWinRate = results.total > 0 ? ((results.switchWins / results.total) * 100).toFixed(1) : 0;
  const stayWinRate = results.total > 0 ? ((results.stayWins / results.total) * 100).toFixed(1) : 0;

  return (
    <div className="glass-panel">
      <div className="sim-controls">
        <div className="input-group">
          <label htmlFor="sim-count">{getText('runs_label')}</label>
          <select 
            id="sim-count" 
            value={simCount} 
            onChange={(e) => setSimCount(Number(e.target.value))}
            disabled={isSimulating}
          >
            <option value={100}>{getText('run_100')}</option>
            <option value={1000}>{getText('run_1000')}</option>
            <option value={10000}>{getText('run_10000')}</option>
            <option value={100000}>{getText('run_100000')}</option>
          </select>
        </div>
        <button 
          className="btn-primary" 
          onClick={runSimulation}
          disabled={isSimulating}
        >
          <Play size={18} fill="currentColor" />
          {isSimulating ? getText('simulating') : getText('run_btn')}
        </button>
      </div>

      <div className="stats-grid">
        {/* Switch Strategy Stats */}
        <div className="stat-card">
          <div className="stat-header">
            <span style={{ color: 'var(--accent-primary)' }}>{getText('switch')}</span>
          </div>
          <div className="stat-value success">{switchWinRate}%</div>
          <div className="stat-sub">{results.switchWins} {getText('wins')} / {results.total} {getText('runs')}</div>
          <div className="progress-container">
            <div 
              className="progress-bar success" 
              style={{ width: `${switchWinRate}%` }}
            ></div>
          </div>
        </div>

        {/* Stay Strategy Stats */}
        <div className="stat-card">
          <div className="stat-header">
            <span style={{ color: 'var(--warning)' }}>{getText('stay')}</span>
          </div>
          <div className="stat-value danger">{stayWinRate}%</div>
          <div className="stat-sub">{results.stayWins} {getText('wins')} / {results.total} {getText('runs')}</div>
          <div className="progress-container">
            <div 
              className="progress-bar danger" 
              style={{ width: `${stayWinRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="explanation">
        <h3>{getText('why')}</h3>
        <p>
          {getText('exp')}
        </p>
        
        <h4 style={{ marginTop: '1.5rem', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
          {getText('thought_title')}
        </h4>
        <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
          {getText('thought_text')}
        </p>
      </div>
    </div>
  );
}
