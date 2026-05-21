import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InfographicPage from './InfographicPage';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, X, ArrowLeft, ArrowRight } from 'lucide-react';

const GRADE_COVERS = {
  '8': {
    gradient: 'from-[#143e18] via-[#0b270e] to-[#041205]',
    spine: 'bg-emerald-950 border-r border-emerald-800/30',
    accent: '#76c034',
    title: 'SỔ TAY SINH TỒN HÓA HỌC 8',
    subtitle: 'Nền Tảng Chất Và Nguyên Tử',
    badge: 'LỚP 8'
  },
  '9': {
    gradient: 'from-[#1e1b4b] via-[#111035] to-[#07061b]',
    spine: 'bg-indigo-950 border-r border-indigo-800/30',
    accent: '#6366f1',
    title: 'SỔ TAY SINH TỒN HÓA HỌC 9',
    subtitle: 'Hợp Chất Vô Cơ & Hữu Cơ',
    badge: 'LỚP 9'
  },
  '10': {
    gradient: 'from-[#042f2e] via-[#021b1b] to-[#010c0c]',
    spine: 'bg-teal-950 border-r border-teal-800/30',
    accent: '#14b8a6',
    title: 'CẨM NANG HÓA HỌC 10',
    subtitle: 'Cấu Tạo Nguyên Tử & Liên Kết',
    badge: 'LỚP 10'
  },
  '11': {
    gradient: 'from-[#4c0519] via-[#2c020d] to-[#120004]',
    spine: 'bg-rose-950 border-r border-rose-800/30',
    accent: '#f43f5e',
    title: 'CẨM NANG HÓA HỌC 11',
    subtitle: 'Cân Bằng Hóa Học & Hóa Hữu Cơ',
    badge: 'LỚP 11'
  },
  '12': {
    gradient: 'from-[#451a03] via-[#280f02] to-[#100500]',
    spine: 'bg-amber-950 border-r border-amber-800/30',
    accent: '#f59e0b',
    title: 'CẨM NANG HÓA HỌC 12',
    subtitle: 'Este, Lipit & Luyện Thi THPT',
    badge: 'LỚP 12'
  }
};

const InfographicBook = ({ isOpen, onClose, lessons, grade, unlockedLessons }) => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0); // 0 = Cover, 1 = Pages 1-2, 2 = Pages 3-4, etc.
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null); // 'next' or 'prev'
  
  const coverTheme = GRADE_COVERS[grade] || GRADE_COVERS['8'];

  // Check mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lock body scroll when book is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  // Handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpread, isFlipping, isMobile]);

  if (!isOpen) return null;

  // Build Pages Array: [Cover, Lesson 1, Lesson 2, ..., Lesson 12, BackCover]
  const bookPages = [
    { type: 'cover' },
    ...lessons.map(lesson => ({ type: 'lesson', data: lesson })),
    { type: 'back-cover' }
  ];

  // For desktop: Spreads array grouping pages in pairs
  // Spread 0: [null, Cover] (Book closed)
  // Spread 1: [Lesson 1, Lesson 2]
  // Spread 2: [Lesson 3, Lesson 4]
  // ...
  // Spread 6: [Lesson 11, Lesson 12]
  // Spread 7: [BackCover, null] (Book closed back)
  const totalSpreads = Math.ceil((bookPages.length) / 2);

  const handleNext = () => {
    if (isFlipping) return;
    if (isMobile) {
      if (currentSpread < bookPages.length - 1) {
        setFlipDirection('next');
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentSpread(prev => prev + 1);
          setIsFlipping(false);
        }, 600);
      }
    } else {
      if (currentSpread < totalSpreads - 1) {
        setFlipDirection('next');
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentSpread(prev => prev + 1);
          setIsFlipping(false);
        }, 600);
      }
    }
  };

  const handlePrev = () => {
    if (isFlipping) return;
    if (isMobile) {
      if (currentSpread > 0) {
        setFlipDirection('prev');
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentSpread(prev => prev - 1);
          setIsFlipping(false);
        }, 600);
      }
    } else {
      if (currentSpread > 0) {
        setFlipDirection('prev');
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentSpread(prev => prev - 1);
          setIsFlipping(false);
        }, 600);
      }
    }
  };

  // Render a specific page item
  const renderPageContent = (pageIdx, side = 'left') => {
    const page = bookPages[pageIdx];
    if (!page) {
      const roundedClass = side === 'left' 
        ? 'rounded-l-[32px] md:rounded-l-[40px]' 
        : side === 'right' 
          ? 'rounded-r-[32px] md:rounded-r-[40px]' 
          : 'rounded-[32px] md:rounded-[40px]';
      return (
        <div className={`w-full h-full bg-[#1e1510]/10 ${roundedClass} flex items-center justify-center opacity-20 pointer-events-none select-none`}>
          {/* Inside leather cover texture */}
        </div>
      );
    }

    if (page.type === 'cover') {
      const roundedClass = side === 'left' 
        ? 'rounded-l-[32px] md:rounded-l-[40px] border-y border-l' 
        : side === 'right' 
          ? 'rounded-r-[32px] md:rounded-r-[40px] border-y border-r' 
          : 'rounded-[32px] md:rounded-[40px] border';
      return (
        <div className={`w-full h-full bg-gradient-to-br ${coverTheme.gradient} p-8 flex flex-col justify-between relative select-none shadow-2xl ${roundedClass} border-white/10 overflow-hidden`}>
          {/* Leather spine overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-black/30 border-r border-white/5 blur-[1px]" />
          
          {/* Gold cover ornaments */}
          <div className="absolute inset-4 border border-amber-500/20 rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 border-2 border-amber-500/30 rounded-xl pointer-events-none" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg" />

          {/* Holographic atom design */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[2] pointer-events-none">
            <span className="text-[120px]">⚛️</span>
          </div>

          <div className="mt-8 text-center relative z-10">
            <span className="px-3.5 py-1.5 bg-amber-500/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/30 text-amber-400 shadow-sm">
              {coverTheme.badge}
            </span>
          </div>

          <div className="my-auto text-center px-4 relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-amber-400 font-sora tracking-tight leading-tight uppercase italic drop-shadow-md">
              {coverTheme.title}
            </h2>
            <div className="w-16 h-1 bg-amber-500/50 mx-auto my-4 rounded-full" />
            <p className="text-slate-300 font-bold text-sm tracking-wide">
              {coverTheme.subtitle}
            </p>
          </div>

          <div className="mb-6 text-center relative z-10 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white animate-pulse">
              📖
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              Nhấn góc phải để lật sách
            </span>
          </div>
        </div>
      );
    }

    if (page.type === 'back-cover') {
      const roundedClass = side === 'left' 
        ? 'rounded-l-[32px] md:rounded-l-[40px] border-y border-l' 
        : side === 'right' 
          ? 'rounded-r-[32px] md:rounded-r-[40px] border-y border-r' 
          : 'rounded-[32px] md:rounded-[40px] border';
      return (
        <div className={`w-full h-full bg-gradient-to-br ${coverTheme.gradient} p-8 flex flex-col justify-between relative select-none shadow-2xl ${roundedClass} border-white/10 overflow-hidden`}>
          {/* Leather spine overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-black/30 border-l border-white/5 blur-[1px]" />
          
          <div className="absolute inset-4 border border-amber-500/20 rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 border-2 border-amber-500/30 rounded-xl pointer-events-none" />
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-amber-500/40 rounded-bl-lg" />

          <div className="my-auto text-center px-4 relative z-10">
            <h3 className="text-xl font-black text-amber-500/70 font-sora tracking-wide uppercase italic">
              AURUM CHEMISTRY
            </h3>
            <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-[3px]">
              Survival Journey Complete
            </p>
          </div>

          <div className="mb-4 text-center text-[10px] font-black text-slate-500 tracking-wider">
            © 2026 AURUM EDU. All rights reserved.
          </div>
        </div>
      );
    }

    // Render inside lesson infographic page
    const pageNum = pageIdx; // Matches page numbering
    const isCompleted = user?.role === 'admin' || user?.role === 'teacher' || (unlockedLessons && unlockedLessons.includes(page.data.lessonId));

    const wrapperRoundedClass = side === 'left' 
      ? 'rounded-l-[32px] md:rounded-l-[40px]' 
      : side === 'right' 
        ? 'rounded-r-[32px] md:rounded-r-[40px]' 
        : 'rounded-[32px] md:rounded-[40px]';

    return (
      <div className={`w-full h-full ${wrapperRoundedClass}`}>
        <InfographicPage 
          lesson={page.data} 
          pageNumber={pageNum} 
          isCompleted={isCompleted} 
          side={side}
        />
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/75 backdrop-blur-2xl overflow-hidden"
    >
      {/* Background click to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex flex-col items-center justify-center z-10 scale-[0.8]">
        
        {/* Header Branding */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 md:px-0 -translate-y-16 pointer-events-none z-50">
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[4px]" style={{ color: coverTheme.accent }}>
                SỔ TAY HÀNH TRÌNH
              </span>
              <h2 className="text-white text-xl md:text-2xl font-black font-sora italic uppercase">
                survival handbook • grade {grade}
              </h2>
           </div>
           <button 
             onClick={onClose}
             className="w-12 h-12 rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-red-500 transition-all pointer-events-auto shadow-xl"
           >
             <X size={18} />
           </button>
        </div>

        {/* 3D BOOK BOX */}
        <div className="relative w-full h-[520px] md:h-[600px] flex items-center justify-center select-none perspective-2000">
            {/* Realistic Page Shadow Backdrop */}
            <div className="absolute inset-0 bg-black/40 blur-3xl opacity-60 scale-[0.85] translate-y-12 rounded-full pointer-events-none" />

            {isMobile ? (
              // Mobile View: Single Page sliding-peel view
              <div className="w-full max-w-[340px] h-full relative overflow-hidden rounded-[32px] shadow-2xl">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentSpread}
                    initial={{ opacity: 0, x: flipDirection === 'next' ? 200 : -200, rotateY: flipDirection === 'next' ? 45 : -45 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: flipDirection === 'next' ? -200 : 200, rotateY: flipDirection === 'next' ? -45 : 45 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full preserve-3d"
                  >
                    {renderPageContent(currentSpread, 'single')}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              // Desktop View: Double Page 3D Flip Book layout
              <div className="w-full h-full flex relative rounded-[40px] preserve-3d bg-[#1a0e07] shadow-[0_30px_70px_rgba(0,0,0,0.6)] p-3">
                
                {/* Book cover spine wrap */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-12 bg-gradient-to-r from-black/40 via-black/10 to-black/40 z-20 pointer-events-none border-x border-white/5" />

                {/* Left Page (Underneath static) */}
                <div className="w-1/2 h-full bg-[#fefcf7] rounded-l-[32px] md:rounded-l-[40px] relative overflow-hidden border-r border-slate-200 shadow-inner">
                  {/* Static Left page represents Spread S-1 Right (if going prev) or Spread S Left (if normal) */}
                  {renderPageContent(
                    isFlipping && flipDirection === 'prev' 
                      ? (currentSpread - 1) * 2 - 1 
                      : currentSpread * 2 - 1, 
                    'left'
                  )}
                  {/* Center binding shadow */}
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
                </div>

                {/* Right Page (Underneath static) */}
                <div className="w-1/2 h-full bg-[#fefcf7] rounded-r-[32px] md:rounded-r-[40px] relative overflow-hidden shadow-inner">
                  {/* Static Right page represents Spread S+1 Left (if going next) or Spread S Right (if normal) */}
                  {renderPageContent(
                    isFlipping && flipDirection === 'next'
                      ? (currentSpread + 1) * 2
                      : currentSpread * 2,
                    'right'
                  )}
                  {/* Center binding shadow */}
                  <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-l from-transparent to-black/10 pointer-events-none" />
                </div>

                {/* DYNAMIC FLIPPING LEAF */}
                {isFlipping && (
                  <div 
                    className={`absolute top-3 bottom-3 w-[calc(50%-12px)] h-[calc(100%-24px)] z-40 pointer-events-none preserve-3d transition-transform duration-600 ease-[cubic-bezier(0.645,0.045,0.355,1.0)]`}
                    style={{
                      left: flipDirection === 'next' ? '50%' : '12px',
                      transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                      transform: flipDirection === 'next' 
                        ? `rotateY(0deg) translateZ(1px)`
                        : `rotateY(-180deg) translateZ(1px)`,
                      animation: flipDirection === 'next'
                        ? 'flipNext 0.6s forwards cubic-bezier(0.645,0.045,0.355,1.0)'
                        : 'flipPrev 0.6s forwards cubic-bezier(0.645,0.045,0.355,1.0)'
                    }}
                  >
                    {/* Front Face of Flipping Page */}
                    <div 
                      className="absolute inset-0 w-full h-full backface-hidden z-20 overflow-hidden shadow-md"
                      style={{
                        transform: 'rotateY(0deg)'
                      }}
                    >
                      {renderPageContent(
                        flipDirection === 'next' 
                          ? currentSpread * 2 
                          : currentSpread * 2 - 1,
                        flipDirection === 'next' ? 'right' : 'left'
                      )}
                      {/* Interactive page curl shadow */}
                      <div className="absolute inset-0 bg-black/5 mix-blend-multiply pointer-events-none animate-[pageShadowForward_0.6s_ease-in-out_forwards]" />
                    </div>

                    {/* Back Face of Flipping Page (rotated 180 degrees) */}
                    <div 
                      className="absolute inset-0 w-full h-full backface-hidden z-10 overflow-hidden shadow-md"
                      style={{
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      {renderPageContent(
                        flipDirection === 'next'
                          ? (currentSpread + 1) * 2 - 1
                          : (currentSpread - 1) * 2,
                        flipDirection === 'next' ? 'left' : 'right'
                      )}
                      {/* Interactive page curl shadow */}
                      <div className="absolute inset-0 bg-black/5 mix-blend-multiply pointer-events-none animate-[pageShadowBackward_0.6s_ease-in-out_forwards]" />
                    </div>
                  </div>
                )}

                {/* Realistic Binder rings overlay in center spine */}
                <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 flex flex-col justify-between items-center w-2 h-[calc(100%-80px)] z-50 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="relative w-8 h-4 flex items-center justify-center">
                      {/* 3D Ring arc */}
                      <div className="w-8 h-3 rounded-full border-[3px] border-slate-300 bg-transparent shadow-[0_3px_5px_rgba(0,0,0,0.4)] opacity-80" />
                      {/* Underneath binding holes */}
                      <div className="absolute left-[-2px] w-1.5 h-3 bg-slate-900 rounded-full border border-white/10" />
                      <div className="absolute right-[-2px] w-1.5 h-3 bg-slate-900 rounded-full border border-white/10" />
                    </div>
                  ))}
                </div>

                {/* Hotspots at corners for click-flipping */}
                {currentSpread < totalSpreads - 1 && (
                  <div 
                    onClick={handleNext}
                    className="absolute right-0 bottom-0 w-20 h-20 z-50 cursor-pointer group pointer-events-auto"
                  >
                    {/* Dog ear indicator on hover */}
                    <div className="absolute right-2 bottom-2 w-0 h-0 border-t-[12px] border-r-[12px] border-t-transparent border-r-amber-500/40 group-hover:border-t-[20px] group-hover:border-r-[20px] transition-all duration-300 rounded-bl" />
                  </div>
                )}
                {currentSpread > 0 && (
                  <div 
                    onClick={handlePrev}
                    className="absolute left-0 bottom-0 w-20 h-20 z-50 cursor-pointer group pointer-events-auto"
                  >
                    {/* Dog ear indicator on hover */}
                    <div className="absolute left-2 bottom-2 w-0 h-0 border-t-[12px] border-l-[12px] border-t-transparent border-l-amber-500/40 group-hover:border-t-[20px] group-hover:border-l-[20px] transition-all duration-300 rounded-br" />
                  </div>
                )}
              </div>
            )}

            {/* Navigation Controls */}
            {currentSpread > 0 && (
              <button 
                onClick={handlePrev}
                disabled={isFlipping}
                className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-2xl z-[60]"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            {((isMobile && currentSpread < bookPages.length - 1) || (!isMobile && currentSpread < totalSpreads - 1)) && (
              <button 
                onClick={handleNext}
                disabled={isFlipping}
                className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-2xl z-[60]"
              >
                <ArrowRight size={20} />
              </button>
            )}
        </div>

        {/* Page Indicator / Navigation Dots */}
        <div className="absolute bottom-0 translate-y-16 w-full flex flex-col items-center gap-3 z-50">
           <div className="flex gap-2 p-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              {(isMobile ? bookPages : [...Array(totalSpreads)]).map((_, i) => (
                <button
                  key={i}
                  disabled={isFlipping}
                  onClick={() => {
                    if (isFlipping) return;
                    setFlipDirection(i > currentSpread ? 'next' : 'prev');
                    setCurrentSpread(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSpread ? 'w-8 bg-amber-500' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
           </div>
           <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">
             Sử dụng phím mũi tên hoặc nhấn vào góc trang để lật cuốn sách
           </p>
        </div>
      </div>

      {/* Dynamic keyframe styles for page-turning & curl shading */}
      <style>{`
        .perspective-2000 {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        @keyframes flipNext {
          0% {
            transform: rotateY(0deg) translateZ(1px);
          }
          100% {
            transform: rotateY(-180deg) translateZ(1px);
          }
        }

        @keyframes flipPrev {
          0% {
            transform: rotateY(-180deg) translateZ(1px);
          }
          100% {
            transform: rotateY(0deg) translateZ(1px);
          }
        }

        @keyframes pageShadowForward {
          0% { opacity: 0; }
          50% { opacity: 0.35; }
          100% { opacity: 0; }
        }

        @keyframes pageShadowBackward {
          0% { opacity: 0; }
          50% { opacity: 0.35; }
          100% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default InfographicBook;
