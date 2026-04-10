import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const StageVideoModal = ({ videoSrc, onComplete, onSkip, onBack, lessonTitle }) => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

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
      className="fixed inset-0 z-[150] bg-[#fffcf5] flex flex-col items-center justify-between py-6 px-4 md:px-8 overflow-hidden font-inter"
    >
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
      
      {/* Decorative Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-viet-green/0 via-viet-green/30 to-viet-green/0" />
      <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-viet-green/20 rounded-tl-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-viet-green/20 rounded-br-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl px-4 md:px-8 flex items-center justify-between z-20 shrink-0"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-viet-text-light hover:text-viet-green transition-colors py-1.5 px-3 rounded-lg hover:bg-white/50"
        >
          <span className="text-lg">←</span>
          <span className="text-[9px] font-black uppercase tracking-widest font-sora">{t('stage_video.back_btn')}</span>
        </button>

        <div className="flex flex-col items-center max-w-[60%]">
           <div className="flex items-center gap-2 mb-0.5">
              <span className="w-1 h-1 rounded-full bg-viet-green animate-pulse" />
              <span className="text-viet-green text-[8px] font-black uppercase tracking-[4px]">Mission Insight</span>
           </div>
           <h2 className="text-viet-text text-base md:text-lg font-black font-sora uppercase italic tracking-tight text-center line-clamp-1">
              {lessonTitle.split(': ').pop()}
           </h2>
        </div>

        <div className="hidden md:flex items-center gap-2 py-1 px-3 bg-viet-green/5 rounded-full border border-viet-green/10 shrink-0">
           <span className="text-[8px] font-black text-viet-green/60 uppercase tracking-widest">{t('stage_video.status.label')}</span>
           <span className="text-[9px] font-bold text-viet-text uppercase">{isVideoEnded ? t('stage_video.status.ready') : t('stage_video.status.analyzing')}</span>
        </div>

      </motion.div>

      {/* Main Video Section */}
      <div className="relative w-full max-w-4xl flex flex-col items-center justify-center flex-1 my-4">
         {/* Video Canvas */}
         <motion.div 
           initial={{ scale: 0.98, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] border-[8px] border-white group"
         >
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              className="w-full h-full object-cover"
              onEnded={() => setIsVideoEnded(true)}
              onClick={handlePlayPause}
            />

            {/* Play/Pause Indicator Overlay */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] cursor-pointer"
                  onClick={handlePlayPause}
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 shadow-2xl flex items-center justify-center">
                    <span className="text-viet-green text-3xl ml-1">▶</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Controls Decor */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={toggleMute}
                 className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
               >
                 <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
               </button>
            </div>
         </motion.div>

         {/* Technical Label Below Video */}
         <div className="absolute -bottom-8 left-10 flex items-center gap-6 opacity-30 select-none">
            <span className="text-[8px] font-black text-viet-text uppercase tracking-[4px]">{t('stage_video.metadata.source')}</span>
            <div className="w-20 h-[1px] bg-viet-text" />
            <span className="text-[8px] font-black text-viet-text uppercase tracking-[4px]">{t('stage_video.metadata.format')}</span>
         </div>
      </div>

      {/* Tactical Entry Button */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center gap-3 z-20 shrink-0 mb-4"
      >
        <button 
          onClick={isVideoEnded ? onComplete : null}
          disabled={!isVideoEnded}
          className={`group relative px-12 py-4 rounded-[24px] font-black text-[13px] uppercase tracking-[4px] transition-all duration-500 overflow-hidden flex items-center gap-3
            ${isVideoEnded 
              ? 'bg-viet-green text-white shadow-[0_15px_40px_-8px_rgba(118,192,52,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(118,192,52,0.5)] hover:-translate-y-1 active:scale-95 cursor-pointer' 
              : 'bg-white text-gray-300 border-2 border-gray-100 cursor-not-allowed opacity-80'}
          `}
        >
          {/* Animated Background for Enabled State */}
          {isVideoEnded && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          )}

          <span className="relative z-10 font-sora">
            {isVideoEnded ? t('stage_video.action_btn.ready') : t('stage_video.action_btn.processing')}
          </span>
          <span className={`relative z-10 text-xl transition-all duration-300 ${isVideoEnded ? 'group-hover:rotate-12 group-hover:scale-125' : 'grayscale'}`}>
            {isVideoEnded ? '🚀' : '⏳'}
          </span>
        </button>

        <div className={`flex items-center gap-3 py-3 px-10 rounded-full border transition-all duration-700
          ${isVideoEnded ? 'bg-viet-green/10 border-viet-green/20' : 'bg-gray-50 border-gray-100'}
        `}>
           <p className={`text-[10px] font-black uppercase tracking-widest transition-colors
             ${isVideoEnded ? 'text-viet-green' : 'text-gray-400'}
           `}>
             {isVideoEnded 
               ? t('stage_video.hints.ready') 
               : t('stage_video.hints.processing')}
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StageVideoModal;
