import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Hourglass, Rocket } from 'lucide-react';
import {
  getVideoEmbedUrl,
  getVideoProvider,
  getYouTubeVideoId,
} from '@/utils/videoLinks';

let youtubeApiPromise;

const loadYouTubeIframeApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try {
        previousReadyHandler?.();
      } finally {
        resolve(window.YT);
      }
    };

    let script = document.getElementById('youtube-iframe-api');
    if (!script) {
      script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('error', () => reject(new Error('Không tải được trình phát YouTube.')), { once: true });
  });

  return youtubeApiPromise;
};

const WATCH_END_TOLERANCE_SECONDS = 5;

const StageVideoModal = ({ videoSrc, onComplete, onBack, lessonTitle }) => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const youtubeMountRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const vimeoFrameRef = useRef(null);
  const lastPlaybackPositionRef = useRef(null);
  const watchedSecondsRef = useRef(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [playbackError, setPlaybackError] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const provider = getVideoProvider(videoSrc);
  const isEmbedVideo = provider === 'youtube' || provider === 'vimeo';
  const embedVideoUrl = getVideoEmbedUrl(videoSrc);
  const vimeoPlayerId = `journey-video-${useId().replace(/:/g, '')}`;
  const requiredWatchSeconds = Math.max(1, duration - WATCH_END_TOLERANCE_SECONDS);
  const canContinue = isVideoEnded
    && (provider === 'file' || duration === 0 || watchedSeconds >= requiredWatchSeconds);

  const vimeoEmbedUrl = useMemo(() => {
    if (provider !== 'vimeo') return embedVideoUrl;
    const separator = embedVideoUrl.includes('?') ? '&' : '?';
    return `${embedVideoUrl}${separator}api=1&player_id=${encodeURIComponent(vimeoPlayerId)}`;
  }, [embedVideoUrl, provider, vimeoPlayerId]);

  const recordPlaybackProgress = useCallback((seconds, totalDuration) => {
    const safeSeconds = Number(seconds) || 0;
    const safeDuration = Number(totalDuration) || 0;
    const previousPosition = lastPlaybackPositionRef.current;

    if (previousPosition !== null) {
      const delta = safeSeconds - previousPosition;
      if (delta > 0 && delta <= 1.5) {
        watchedSecondsRef.current += delta;
        setWatchedSeconds(watchedSecondsRef.current);
      }
    }

    lastPlaybackPositionRef.current = safeSeconds;
    setCurrentTime(safeSeconds);
    if (safeDuration > 0) setDuration(safeDuration);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  useEffect(() => {
    if (provider !== 'youtube' || !youtubeMountRef.current) return undefined;

    let cancelled = false;
    let progressTimer;
    const videoId = getYouTubeVideoId(videoSrc);

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled || !youtubeMountRef.current || !videoId) return;

        youtubePlayerRef.current = new YT.Player(youtubeMountRef.current, {
          width: '100%',
          height: '100%',
          videoId,
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              setDuration(event.target.getDuration() || 0);
              progressTimer = window.setInterval(() => {
                const player = youtubePlayerRef.current;
                if (!player?.getCurrentTime) return;
                recordPlaybackProgress(player.getCurrentTime(), player.getDuration());
              }, 500);
            },
            onStateChange: (event) => {
              setIsPlaying(event.data === YT.PlayerState.PLAYING);
              if (event.data === YT.PlayerState.ENDED) {
                recordPlaybackProgress(event.target.getDuration(), event.target.getDuration());
                setIsVideoEnded(true);
              }
            },
            onError: () => setPlaybackError('Video hiện không phát được. Hãy quay lại và thử lại sau.'),
          },
        });
      })
      .catch((error) => setPlaybackError(error.message || 'Không tải được trình phát video.'));

    return () => {
      cancelled = true;
      if (progressTimer) window.clearInterval(progressTimer);
      youtubePlayerRef.current?.destroy?.();
      youtubePlayerRef.current = null;
    };
  }, [provider, recordPlaybackProgress, videoSrc]);

  useEffect(() => {
    if (provider !== 'vimeo') return undefined;

    const postVimeoCommand = (method, value) => {
      vimeoFrameRef.current?.contentWindow?.postMessage({ method, value }, 'https://player.vimeo.com');
    };
    const registerVimeoEvents = () => {
      ['timeupdate', 'ended', 'finish'].forEach((eventName) => postVimeoCommand('addEventListener', eventName));
    };
    const handleVimeoMessage = (event) => {
      if (event.origin !== 'https://player.vimeo.com') return;
      let payload = event.data;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }
      if (!payload || (payload.player_id && payload.player_id !== vimeoPlayerId)) return;
      if (payload.event === 'ready') registerVimeoEvents();
      if (payload.event === 'timeupdate' || payload.event === 'playProgress') {
        recordPlaybackProgress(payload.data?.seconds, payload.data?.duration);
      }
      if (payload.event === 'ended' || payload.event === 'finish') setIsVideoEnded(true);
    };

    window.addEventListener('message', handleVimeoMessage);
    return () => window.removeEventListener('message', handleVimeoMessage);
  }, [provider, recordPlaybackProgress, vimeoPlayerId]);

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

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const metadataLabel = isEmbedVideo
    ? `${provider === 'youtube' ? 'YouTube' : 'Vimeo'} · ${Math.round(Math.min(100, (watchedSeconds / Math.max(1, requiredWatchSeconds)) * 100))}%`
    : `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`;

  // Update time as video plays
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      recordPlaybackProgress(videoRef.current.currentTime, videoRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
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
              {(lessonTitle || '').split(': ').pop()}
           </h2>
        </div>

        <div className="hidden md:flex items-center gap-2 py-1 px-3 bg-viet-green/5 rounded-full border border-viet-green/10 shrink-0">
           <span className="text-[8px] font-black text-viet-green/60 uppercase tracking-widest">{t('stage_video.status.label')}</span>
           <span className="text-[9px] font-bold text-viet-text uppercase">{canContinue ? t('stage_video.status.ready') : t('stage_video.status.analyzing')}</span>
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
            {provider === 'youtube' ? (
              <div ref={youtubeMountRef} className="h-full w-full" />
            ) : provider === 'vimeo' ? (
              <iframe
                ref={vimeoFrameRef}
                id={vimeoPlayerId}
                src={vimeoEmbedUrl}
                title={lessonTitle}
                className="w-full h-full"
                onLoad={() => {
                  ['timeupdate', 'ended', 'finish'].forEach((eventName) => {
                    vimeoFrameRef.current?.contentWindow?.postMessage(
                      { method: 'addEventListener', value: eventName },
                      'https://player.vimeo.com',
                    );
                  });
                }}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                className="w-full h-full object-cover"
                onEnded={() => setIsVideoEnded(true)}
                onClick={handlePlayPause}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setPlaybackError('Video hiện không phát được. Hãy quay lại và thử lại sau.')}
              />
            )}

            {playbackError && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-slate-950/90 p-8 text-center text-white">
                <AlertTriangle className="h-10 w-10 text-amber-300" />
                <p className="max-w-md text-sm font-bold leading-6">{playbackError}</p>
              </div>
            )}

            {/* Play/Pause Indicator Overlay */}
            <AnimatePresence>
              {!isEmbedVideo && !isPlaying && (
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

            {/* Custom Seek Bar / Progress Bar */}
            {!isEmbedVideo && (
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100/30 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <div 
                  className="h-full bg-viet-green relative transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                >
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-viet-green rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                </div>
            </div>
            )}

            {/* Video Controls Decor */}
            {!isEmbedVideo && (
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-30">
               <button 
                 onClick={toggleMute}
                 className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
               >
                 <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
               </button>
            </div>
            )}
         </motion.div>

         {/* Technical Label Below Video */}
         <div className="absolute -bottom-8 left-10 flex items-center gap-6 opacity-30 select-none">
            <span className="text-[8px] font-black text-viet-text uppercase tracking-[4px]">{t('stage_video.metadata.source')}</span>
            <div className="w-20 h-[1px] bg-viet-text" />
            <span className="text-[10px] font-bold text-viet-green min-w-[80px]">
               {metadataLabel}
            </span>
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
          onClick={canContinue ? onComplete : undefined}
          disabled={!canContinue}
          className={`group relative px-12 py-4 rounded-[24px] font-black text-[13px] uppercase tracking-[4px] transition-all duration-500 overflow-hidden flex items-center gap-3
            ${canContinue 
              ? 'bg-viet-green text-white shadow-[0_15px_40px_-8px_rgba(118,192,52,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(118,192,52,0.5)] hover:-translate-y-1 active:scale-95 cursor-pointer' 
              : 'bg-white text-gray-300 border-2 border-gray-100 cursor-not-allowed opacity-80'}
          `}
        >
          {/* Animated Background for Enabled State */}
          {canContinue && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          )}

          <span className="relative z-10 font-sora">
            {canContinue ? t('stage_video.action_btn.ready') : t('stage_video.action_btn.processing')}
          </span>
          <span className={`relative z-10 transition-all duration-300 ${canContinue ? 'group-hover:rotate-12 group-hover:scale-125' : 'grayscale'}`} aria-hidden="true">
            {canContinue ? <Rocket className="h-5 w-5" /> : <Hourglass className="h-5 w-5" />}
          </span>
        </button>

        <div className={`flex items-center gap-3 py-3 px-10 rounded-full border transition-all duration-700
          ${canContinue ? 'bg-viet-green/10 border-viet-green/20' : 'bg-gray-50 border-gray-100'}
        `}>
           <p className={`text-[10px] font-black uppercase tracking-widest transition-colors
             ${canContinue ? 'text-viet-green' : 'text-gray-400'}
           `}>
             {canContinue
               ? 'Đã xem xong video · câu hỏi vòng 1 đã sẵn sàng'
               : isVideoEnded && isEmbedVideo
                 ? 'Bạn cần xem đầy đủ video trước khi tiếp tục'
                 : 'Hãy xem hết video để mở câu hỏi vòng 1'}
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StageVideoModal;
