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

    switch (type) {
      case 'pour': {
        const duration = 0.5;
        const mainOsc = ctx.createOscillator();
        const noiseFilter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();
        
        // Pink noise-ish for liquid pouring
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(params.chemicalState === 'solid' ? 800 : 400, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(params.chemicalState === 'solid' ? 400 : 200, now + duration);
        
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGainRef.current);
        
        noise.start(now);
        noise.stop(now + duration);
        break;
      }
      
      case 'bubble': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        const startFreq = 400 + Math.random() * 600;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + 0.1);
        
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        osc.connect(gain);
        gain.connect(masterGainRef.current);
        
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        
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
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < ctx.sampleRate * duration; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + duration);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);
        
        noise.start(now);
        noise.stop(now + duration);
        break;
      }

      case 'success': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'triangle';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc1.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        
        osc1.connect(gain);
        gain.connect(masterGainRef.current);
        
        osc1.start(now);
        osc1.stop(now + 0.6);
        break;
      }
      
      default:
        break;
    }
  }, [enabled, initAudio]);

  // Clean up
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { playSound };
};
