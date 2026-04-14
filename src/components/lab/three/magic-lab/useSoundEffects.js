import { create } from 'zustand';
import { useCallback, useEffect, useRef } from 'react';

// Procedural Sound Store
export const useSoundStore = create((set) => ({
  enabled: true,
  volume: 0.5,
  toggleSound: () => set((state) => ({ enabled: !state.enabled })),
  setVolume: (v) => set({ volume: v }),
}));

/**
 * Custom hook for procedural audio effects in the 3D Chemistry Lab.
 * Uses Web Audio API to generate real-time feedback without audio files.
 */
export const useSoundEffects = () => {
  const { enabled, volume } = useSoundStore();
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const activeNodesRef = useRef({}); // Tracks continuous sounds

  // Initialize Audio Context on first interaction
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = volume;
    } catch (e) {
      console.warn("Web Audio API not supported in this browser");
    }
  }, [volume]);

  // Stop a specific type of continuous sound
  const stopSound = useCallback((type) => {
    if (activeNodesRef.current[type]) {
      const nodes = activeNodesRef.current[type];
      nodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch (e) {
          // Already stopped or disconnected
        }
      });
      delete activeNodesRef.current[type];
    }
  }, []);

  // Helper to create noise buffer
  const createNoiseBuffer = (ctx, duration = 1) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  // Main sound playing function
  const playSound = useCallback((type, params = {}) => {
    if (!enabled) return;
    initAudio();
    if (!audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const { current: ctx } = audioContextRef;
    const now = ctx.currentTime;

    // Don't restart continuous sounds if they are already playing
    if (params.continuous && activeNodesRef.current[type]) return;

    switch (type) {
      case 'pour': {
        const isSolid = params.chemicalState === 'solid';
        const duration = isSolid ? 0.3 : 0.6;
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, duration);
        
        const filter = ctx.createBiquadFilter();
        filter.type = isSolid ? 'highpass' : 'lowpass';
        filter.frequency.setValueAtTime(isSolid ? 1200 : 600, now);
        filter.frequency.exponentialRampToValueAtTime(isSolid ? 600 : 300, now + duration);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(isSolid ? 0.05 : 0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);
        
        noise.start(now);
        noise.stop(now + duration);
        break;
      }
      
      case 'bubble':
      case 'fizz': {
        // High-pitched popping noise for gas production
        const duration = params.duration || 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        const baseFreq = type === 'fizz' ? 800 : 400;
        const startFreq = baseFreq + Math.random() * 1000;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.8, now + 0.08);
        
        gain.gain.setValueAtTime(type === 'fizz' ? 0.03 : 0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.connect(gain);
        gain.connect(masterGainRef.current);
        
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'fire': {
        // Deep roar + crackle for burner
        const duration = params.duration || 1;
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, duration);
        noise.loop = !!params.continuous;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
        
        if (!params.continuous) {
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        }

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);
        
        noise.start(now);
        if (!params.continuous) noise.stop(now + duration);

        if (params.continuous) {
          activeNodesRef.current['fire'] = [noise, gain];
        }

        // Add crackle transients
        if (enabled) {
          const crackleCount = 5;
          for(let i=0; i<crackleCount; i++) {
             const t = now + Math.random() * duration;
             const cOsc = ctx.createOscillator();
             const cGain = ctx.createGain();
             cOsc.type = 'square';
             cOsc.frequency.setValueAtTime(2000 + Math.random() * 3000, t);
             cGain.gain.setValueAtTime(0.02, t);
             cGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);
             cOsc.connect(cGain);
             cGain.connect(masterGainRef.current);
             cOsc.start(t);
             cOsc.stop(t + 0.01);
          }
        }
        break;
      }

      case 'explosion': {
        const intensity = params.intensity === 'high' ? 1 : 0.5;
        // Sub-bass thump
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
        oscGain.gain.setValueAtTime(0.5 * intensity, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(oscGain);
        oscGain.connect(masterGainRef.current);
        osc.start(now);
        osc.stop(now + 0.5);

        // White noise burst
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, 0.4);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3 * intensity, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        noise.connect(noiseGain);
        noiseGain.connect(masterGainRef.current);
        noise.start(now);
        noise.stop(now + 0.4);
        break;
      }

      case 'steam':
      case 'smoke': {
        const duration = params.duration || 1;
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, duration);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(type === 'steam' ? 3000 : 800, now);
        filter.Q.value = 2;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);
        
        noise.start(now);
        noise.stop(now + duration);
        break;
      }

      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(masterGainRef.current);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'wash': {
        const duration = 0.8;
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, duration);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);
        noise.start(now);
        noise.stop(now + duration);
        break;
      }

      case 'success': {
        const freqMap = [523.25, 659.25, 783.99, 1046.50];
        freqMap.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.1);
          gain.gain.setValueAtTime(0, now + i * 0.1);
          gain.gain.linearRampToValueAtTime(0.08, now + i * 0.1 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(masterGainRef.current);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.4);
        });
        break;
      }
      
      default:
        break;
    }
  }, [enabled, initAudio, stopSound]);

  // Clean up
  useEffect(() => {
    return () => {
      Object.keys(activeNodesRef.current).forEach(stopSound);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopSound]);

  return { playSound, stopSound };
};
