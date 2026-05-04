import React, { useState } from 'react';
import InteractiveGame from './components/InteractiveGame';
import Simulator from './components/Simulator';
import { Gamepad2, Settings2, Globe } from 'lucide-react';
import './index.css';
import './App.css';

const t = {
  en: {
    title: 'Monty Hall Simulation',
    subtitle: 'Experience the counter-intuitive probability of the Monty Hall problem. Will you switch or will you stay?',
    play: 'Interactive Play',
    sim: 'High-Speed Simulator'
  },
  zh: {
    title: '三门问题模拟器',
    subtitle: '体验三门问题中反直觉的概率现象。你会换门，还是坚持初衷？',
    play: '互动体验',
    sim: '高速模拟'
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('play');
  const [lang, setLang] = useState('zh');

  const getText = (key) => t[lang][key];

  return (
    <>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button 
          className="btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
        >
          <Globe size={16} />
          {lang === 'en' ? '中文' : 'English'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {getText('title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          {getText('subtitle')}
        </p>
      </div>

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'play' ? 'active' : ''}`}
          onClick={() => setActiveTab('play')}
        >
          <Gamepad2 size={20} />
          {getText('play')}
        </button>
        <button 
          className={`nav-tab ${activeTab === 'simulate' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulate')}
        >
          <Settings2 size={20} />
          {getText('sim')}
        </button>
      </div>

      {activeTab === 'play' ? <InteractiveGame lang={lang} /> : <Simulator lang={lang} />}
    </>
  );
}

export default App;
