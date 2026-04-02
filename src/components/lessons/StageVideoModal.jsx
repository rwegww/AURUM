import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StageVideoModal = ({ videoSrc, onComplete, onSkip, onBack, lessonTitle }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-[#fffbf0] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden font-inter"
    >
      {/* Soft Light Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#ffffff_0%,_#fffbf0_100%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#76c034 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      {/* Top Floating Header (Light) */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 20 }}
        className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 flex items-center justify-between z-20"
      >
        {/* New Enhanced Back Button */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-6 py-3 bg-white/70 hover:bg-white text-viet-text-light hover:text-viet-green rounded-[24px] text-[11px] font-black uppercase tracking-widest backdrop-blur-xl transition-all border border-viet-border hover:border-viet-green/30 shadow-sm hover:shadow-lg active:scale-95"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-sora">Quay lại</span>
        </button>

        <div className="hidden md:flex items-center gap-4 bg-white/70 backdrop-blur-xl border border-viet-green/20 px-6 py-3 rounded-[24px] shadow-xl shadow-viet-green/5">
           <div className="w-2.5 h-2.5 rounded-full bg-viet-green animate-pulse" />
           <div className="flex flex-col">
              <span className="text-viet-green text-[9px] font-black uppercase tracking-[3px]">Mission Briefing</span>
              <h2 className="text-viet-text text-sm md:text-base font-bold font-sora truncate max-w-[200px] md:max-w-md">
                {lessonTitle}
              </h2>
           </div>
        </div>

        <button 
          onClick={onSkip}
          className="group relative px-6 py-3 bg-white/70 hover:bg-white text-viet-text-light hover:text-viet-text rounded-[24px] text-[10px] font-black uppercase tracking-widest backdrop-blur-xl transition-all border border-viet-border overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">Bỏ qua clip <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span></span>
        </button>
      </motion.div>

      {/* Premium Video Container (Light Frame) */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative w-full max-w-5xl aspect-video rounded-[32px] md:rounded-[48px] overflow-hidden ring-8 ring-white shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] group flex items-center justify-center bg-white"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          className="w-full h-full object-cover"
          onEnded={onComplete}
          onClick={handlePlayPause}
        />
        
        {/* Subtle Overlay Hint (Visual Decor) */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-10" />

        {/* Play/Pause Overlay (Light) */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[4px] pointer-events-none z-20"
            >
              <div className="w-24 h-24 rounded-full bg-white/80 backdrop-blur-lg flex items-center justify-center border border-white shadow-2xl">
                <span className="text-viet-green text-4xl ml-2">▶</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Bars Overlay (Light) */}
        <div className="absolute inset-x-0 bottom-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
           {/* Sound Control */}
           <div className="flex items-center gap-4 pointer-events-auto">
              <button 
                onClick={toggleMute}
                className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center border border-viet-border shadow-sm hover:border-viet-green/30 transition-all hover:scale-110 active:scale-95"
              >
                <span className="text-viet-text text-xl">{isMuted ? '🔇' : '🔊'}</span>
              </button>
           </div>
        </div>
      </motion.div>

      {/* Engagement Footer (Light) */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', damping: 20 }}
        className="mt-12 flex flex-col items-center gap-6 z-20"
      >
        <button 
          onClick={onComplete}
          className="group relative px-12 py-5 bg-viet-green text-white rounded-[24px] font-black text-[14px] uppercase tracking-[4px] shadow-[0_20px_40px_rgba(118,192,52,0.2)] hover:shadow-[0_25px_50px_rgba(118,192,52,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 overflow-hidden"
        >
          <span className="relative z-10 font-sora">VÀO NHIỆM VỤ</span>
          <span className="relative z-10 text-xl group-hover:translate-x-2 transition-transform duration-300">🚀</span>
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <div className="flex items-center gap-3 py-3 px-8 bg-white/60 backdrop-blur-md rounded-full border border-viet-green/20 shadow-sm">
           <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-viet-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-viet-green"></span>
           </span>
           <p className="text-viet-text-light text-[11px] font-bold tracking-wide uppercase">
             Gợi ý: Theo dõi clip kỹ để chuẩn bị cho thử thách nhé!
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StageVideoModal;
