import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InfographicPage from './InfographicPage';

const InfographicBook = ({ isOpen, onClose, lessons, grade }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Lock body scroll when book is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  if (!isOpen) return null;

  const totalPages = lessons.length;
  const currentLesson = lessons[currentPage];

  const paginate = (newDirection) => {
    const next = currentPage + newDirection;
    if (next >= 0 && next < totalPages) {
      setDirection(newDirection);
      setCurrentPage(next);
    }
  };

  const variants = {
    enter: (direction) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        rotateY: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.9,
      transition: {
        rotateY: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-3xl overflow-hidden"
    >
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex flex-col items-center justify-center perspective-1000">
        
        {/* Header Branding */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 md:px-0 -translate-y-16 pointer-events-none">
           <div className="flex flex-col">
              <span className="text-viet-green text-[10px] font-black uppercase tracking-[4px]">Sổ tay sinh tồn</span>
              <h2 className="text-white text-2xl font-black font-sora italic">CHƯƠNG TRÌNH LỚP {grade}</h2>
           </div>
           <button 
             onClick={onClose}
             className="w-12 h-12 rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-red-500 transition-all pointer-events-auto shadow-xl"
           >
             ✕
           </button>
        </div>

        {/* Book Body */}
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Realistic Page Shadow Backdrop */}
            <div className="absolute inset-0 bg-black/40 blur-3xl opacity-50 scale-90 translate-y-10" />

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-3xl h-full shadow-[20px_40px_100px_rgba(0,0,0,0.5)] rounded-[40px] preserve-3d"
              >
                 <InfographicPage lesson={currentLesson} pageNumber={currentPage + 1} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {currentPage > 0 && (
              <button 
                onClick={() => paginate(-1)}
                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-3xl flex items-center justify-center backdrop-blur-md transition-all shadow-2xl z-30"
              >
                ‹
              </button>
            )}

            {currentPage < totalPages - 1 && (
              <button 
                onClick={() => paginate(1)}
                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-3xl flex items-center justify-center backdrop-blur-md transition-all shadow-2xl z-30"
              >
                ›
              </button>
            )}
        </div>

        {/* Page Indicator / Navigation Dots */}
        <div className="absolute bottom-0 translate-y-16 w-full flex flex-col items-center gap-4">
           <div className="flex gap-2 p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              {lessons.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentPage ? 1 : -1);
                    setCurrentPage(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentPage ? 'w-10 bg-viet-green' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
           </div>
           <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
             Sử dụng phím mũi tên hoặc nhấn vào các chấm để lật trang
           </p>
        </div>
      </div>

      <style jsx="true">{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </motion.div>
  );
};

export default InfographicBook;
