import { useRef, useCallback, useEffect } from 'react';
import { create } from 'zustand';

// Store để quản lý settings âm thanh toàn cục
export const useSoundStore = create((set) => ({
  enabled: true,
  volume: 0.5,
  toggleSound: () => set((state) => ({ enabled: !state.enabled })),
  setVolume: (vol) => set({ volume: Math.max(0, Math.min(1, vol)) }),
}));

// Audio Context singleton
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume nếu bị suspended (do browser policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Tạo noise buffer (dùng cho nhiều loại âm thanh)
const createNoiseBuffer = (ctx, duration = 1) => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

// Tạo âm thanh đổ chất lỏng (liquid pouring)
const playPourSound = (ctx, masterGain, volume = 0.5) => {
  const duration = 1.2;
  const now = ctx.currentTime;

  // White noise filtered
  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  // Bandpass filter để tạo âm nước
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.linearRampToValueAtTime(1200, now + duration * 0.3);
  filter.frequency.linearRampToValueAtTime(600, now + duration);
  filter.Q.value = 2;

  // Envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume * 0.6, now + 0.06);
  gainNode.gain.setValueAtTime(volume * 0.6, now + duration * 0.7);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);

  noiseSource.start(now);
  noiseSource.stop(now + duration);
};

// Âm thanh lửa cháy (crackling fire)
const playFireSound = (ctx, masterGain, volume = 0.5, duration = 3) => {
  const now = ctx.currentTime;

  // Cracking sound với noise
  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  // Lowpass filter cho âm trầm của lửa
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 400;

  // Highpass để cắt bass quá sâu
  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 100;

  // Modulation để tạo crackling
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 8 + Math.random() * 4;
  lfoGain.gain.value = volume * 0.15;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * 0.2, now);
  gainNode.gain.linearRampToValueAtTime(volume * 0.25, now + 0.5);
  gainNode.gain.setValueAtTime(volume * 0.25, now + duration - 0.5);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  lfo.connect(lfoGain);
  lfoGain.connect(gainNode.gain);

  noiseSource.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gainNode);
  gainNode.connect(masterGain);

  lfo.start(now);
  noiseSource.start(now);
  lfo.stop(now + duration);
  noiseSource.stop(now + duration);

  return { stop: () => { try { noiseSource.stop(); lfo.stop(); } catch (e) {} } };
};

// Âm thanh bọt khí sủi (bubbling)
const playBubbleSound = (ctx, masterGain, volume = 0.5, duration = 2) => {
  const now = ctx.currentTime;
  const sources = [];

  // Tạo nhiều bọt khí ngắn
  for (let i = 0; i < 12; i++) {
    const startTime = now + Math.random() * duration * 0.8;
    const freq = 200 + Math.random() * 400;
    const bubbleDuration = 0.08 + Math.random() * 0.12;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + bubbleDuration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + bubbleDuration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + bubbleDuration + 0.01);
    sources.push(osc);
  }

  return { stop: () => sources.forEach(s => { try { s.stop(); } catch (e) {} }) };
};

// Âm thanh nổ (explosion)
const playExplosionSound = (ctx, masterGain, volume = 0.5, intensity = 'medium') => {
  const now = ctx.currentTime;
  const baseDuration = intensity === 'extreme' ? 1.5 : (intensity === 'high' ? 1.0 : 0.6);
  const baseVolume = intensity === 'extreme' ? volume * 1.2 : (intensity === 'high' ? volume : volume * 0.7);

  // Impact rumble noise
  const noiseBuffer = createNoiseBuffer(ctx, baseDuration);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(2000, now);
  lowpass.frequency.exponentialRampToValueAtTime(100, now + baseDuration);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(baseVolume, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + baseDuration);

  // Sub bass impact
  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(60, now);
  subOsc.frequency.exponentialRampToValueAtTime(30, now + baseDuration * 0.5);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(baseVolume * 0.5, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + baseDuration * 0.5);

  noiseSource.connect(lowpass);
  lowpass.connect(gainNode);
  gainNode.connect(masterGain);

  subOsc.connect(subGain);
  subGain.connect(masterGain);

  noiseSource.start(now);
  subOsc.start(now);
  noiseSource.stop(now + baseDuration);
  subOsc.stop(now + baseDuration * 0.5);
};

// Âm thanh hơi nước/khói (steam/smoke hiss)
const playSteamSound = (ctx, masterGain, volume = 0.5, duration = 2) => {
  const now = ctx.currentTime;

  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  // Highpass filter cho âm xì hơi
  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 3000;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 6000;
  bandpass.Q.value = 1;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume * 0.15, now + 0.2);
  gainNode.gain.setValueAtTime(volume * 0.15, now + duration - 0.5);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(masterGain);

  noiseSource.start(now);
  noiseSource.stop(now + duration);

  return { stop: () => { try { noiseSource.stop(); } catch (e) {} } };
};

// Âm thanh rửa cốc (water splash)
const playWashSound = (ctx, masterGain, volume = 0.5) => {
  const duration = 0.5;
  const now = ctx.currentTime;

  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1500, now);
  filter.frequency.linearRampToValueAtTime(500, now + duration);
  filter.Q.value = 1;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * 0.4, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);

  noiseSource.start(now);
  noiseSource.stop(now + duration);
};

// Âm thanh click UI
const playClickSound = (ctx, masterGain, volume = 0.5) => {
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * 0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gainNode);
  gainNode.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.05);
};

// Âm thanh thêm hóa chất rắn (solid drop)
const playDropSolidSound = (ctx, masterGain, volume = 0.5) => {
  const now = ctx.currentTime;

  // Impact sound
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * 0.4, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gainNode);
  gainNode.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.15);

  // Small splash
  setTimeout(() => {
    const noiseBuffer = createNoiseBuffer(ctx, 0.1);
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start();
    noise.stop(ctx.currentTime + 0.1);
  }, 80);
};

// Âm thanh phản ứng sủi bọt nhẹ (fizz)
const playFizzSound = (ctx, masterGain, volume = 0.5, duration = 1.5) => {
  const now = ctx.currentTime;

  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 4000;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume * 0.12, now + 0.1);
  gainNode.gain.setValueAtTime(volume * 0.12, now + duration - 0.3);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(highpass);
  highpass.connect(gainNode);
  gainNode.connect(masterGain);

  noiseSource.start(now);
  noiseSource.stop(now + duration);

  return { stop: () => { try { noiseSource.stop(); } catch (e) {} } };
};

// Custom hook để sử dụng trong components
export const useSoundEffects = () => {
  const masterGainRef = useRef(null);
  const activeSourcesRef = useRef({});
  const { enabled, volume } = useSoundStore();

  // Initialize masterGain
  useEffect(() => {
    if (enabled && !masterGainRef.current) {
      const ctx = getAudioContext();
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.connect(ctx.destination);
    }

    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [enabled, volume]);

  const playSound = useCallback((type, options = {}) => {
    if (!enabled) return;

    const ctx = getAudioContext();
    if (!masterGainRef.current) {
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.gain.value = volume;
      masterGainRef.current.connect(ctx.destination);
    }

    const { intensity = 'medium', duration, chemicalState = 'liquid' } = options;

    switch (type) {
      case 'pour':
        if (chemicalState === 'solid' || chemicalState === 'metal') {
          playDropSolidSound(ctx, masterGainRef.current, volume);
        } else {
          playPourSound(ctx, masterGainRef.current, volume);
        }
        break;
      case 'fire':
      case 'heat':
        const fireSource = playFireSound(ctx, masterGainRef.current, volume, duration || 3);
        activeSourcesRef.current.fire = fireSource;
        break;
      case 'bubble':
        const bubbleSource = playBubbleSound(ctx, masterGainRef.current, volume, duration || 2);
        activeSourcesRef.current.bubble = bubbleSource;
        break;
      case 'explosion':
        playExplosionSound(ctx, masterGainRef.current, volume, intensity);
        break;
      case 'steam':
      case 'smoke':
        const steamSource = playSteamSound(ctx, masterGainRef.current, volume, duration || 2);
        activeSourcesRef.current.steam = steamSource;
        break;
      case 'wash':
      case 'clear':
        playWashSound(ctx, masterGainRef.current, volume);
        break;
      case 'click':
        playClickSound(ctx, masterGainRef.current, volume);
        break;
      case 'fizz':
        const fizzSource = playFizzSound(ctx, masterGainRef.current, volume, duration || 1.5);
        activeSourcesRef.current.fizz = fizzSource;
        break;
      default:
        break;
    }
  }, [enabled, volume]);

  const stopSound = useCallback((type) => {
    if (activeSourcesRef.current[type]) {
      activeSourcesRef.current[type].stop();
      delete activeSourcesRef.current[type];
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    Object.values(activeSourcesRef.current).forEach(source => {
      if (source && source.stop) source.stop();
    });
    activeSourcesRef.current = {};
  }, []);

  return { playSound, stopSound, stopAllSounds };
};

export default useSoundEffects;
