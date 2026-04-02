import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const characters = {
  professor: {
    name: "Giáo sư Mole",
    image: "/assets/images/characters/professor_mole.png",
    color: "bg-amber-100 border-amber-200 text-amber-900"
  },
  robot: {
    name: "Robot Chem-E",
    image: "/assets/images/characters/robot_cheme.png",
    color: "bg-blue-100 border-blue-200 text-blue-900"
  }
};

const StoryIntro = ({ slides, onComplete, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const activeSlide = slides[currentSlide];
  const char = characters[activeSlide.character] || characters.professor;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#fffbf0]/95 backdrop-blur-md">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-[40px] p-8 md:p-12 border border-viet-border shadow-2xl relative overflow-visible"
          >
            {/* Character Image */}
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 relative">
               <div className="absolute inset-0 bg-viet-green/5 rounded-full scale-110 animate-pulse" />
               <img 
                 src={char.image} 
                 alt={char.name} 
                 className="w-full h-full object-contain relative z-10 drop-shadow-xl"
               />
               <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border shadow-sm text-[12px] font-black uppercase tracking-widest z-20 whitespace-nowrap ${char.color}`}>
                  {char.name}
               </div>
            </div>

            {/* Speech Bubble / Content */}
            <div className="flex-1 flex flex-col justify-center text-center md:text-left pt-6 md:pt-0">
               <div className="mb-8">
                  {/* Progress Dots */}
                  <div className="flex justify-center md:justify-start gap-2 mb-6">
                    {slides.map((_, i) => (
                      <div 
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentSlide ? 'w-8 bg-viet-green' : 'w-2 bg-viet-green/20'
                        }`}
                      />
                    ))}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-viet-text leading-tight mb-4">
                    {activeSlide.text}
                  </h2>
               </div>

               <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={nextSlide}
                    className="w-full sm:w-auto px-10 py-4 bg-viet-green text-white rounded-[20px] font-black text-[14px] uppercase tracking-widest shadow-xl shadow-viet-green/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    {currentSlide < slides.length - 1 ? 'Tiếp theo ➔' : 'Bắt đầu ngay 🚀'}
                  </button>
                  <button
                    onClick={onSkip}
                    className="text-[12px] font-bold text-viet-text-light hover:text-red-500 transition-colors uppercase tracking-widest px-4 py-2"
                  >
                    Bỏ qua
                  </button>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StoryIntro;
