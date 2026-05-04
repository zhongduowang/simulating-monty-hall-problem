let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (freq, type, duration, vol = 0.1) => {
  try {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Smooth attack and release to avoid clicks
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error('Audio play failed', e);
  }
};

export const sounds = {
  click: () => playTone(600, 'sine', 0.1, 0.05),
  select: () => {
    playTone(500, 'sine', 0.1, 0.08);
    setTimeout(() => playTone(700, 'sine', 0.15, 0.08), 100);
  },
  reveal: () => {
    playTone(300, 'triangle', 0.2, 0.08);
    setTimeout(() => playTone(250, 'triangle', 0.4, 0.08), 150);
  },
  win: () => {
    // A celebratory firework explosion sound using white noise
    try {
      initAudio();
      const createExplosion = (startTime, isLarge) => {
        const bufferSize = audioCtx.sampleRate * (isLarge ? 1.5 : 0.8);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isLarge ? 1200 : 2000, startTime);
        filter.frequency.exponentialRampToValueAtTime(100, startTime + (isLarge ? 1.2 : 0.6));
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(isLarge ? 0.8 : 0.3, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + (isLarge ? 1.4 : 0.7));
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        noise.start(startTime);
      };

      const now = audioCtx.currentTime;
      createExplosion(now, true); // Big boom
      createExplosion(now + 0.2, false); // Crackle 1
      createExplosion(now + 0.4, false); // Crackle 2
      createExplosion(now + 0.7, true); // Big boom 2
      createExplosion(now + 0.9, false); // Crackle 3
      
      // Also play a nice success chime in the background
      setTimeout(() => playTone(523.25, 'sine', 0.2, 0.15), 0); // C5
      setTimeout(() => playTone(659.25, 'sine', 0.2, 0.15), 150); // E5
      setTimeout(() => playTone(783.99, 'sine', 0.4, 0.15), 300); // G5
    } catch (e) {
      console.error('Audio play failed', e);
    }
  },
  lose: () => {
    playTone(300, 'sawtooth', 0.4, 0.05); 
    setTimeout(() => playTone(280, 'sawtooth', 0.4, 0.05), 250); 
    setTimeout(() => playTone(260, 'sawtooth', 0.4, 0.05), 500); 
    setTimeout(() => playTone(220, 'sawtooth', 0.8, 0.05), 750); 
  }
};
