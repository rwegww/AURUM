import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#fffbf0] flex flex-col items-center justify-center">
      {/* Animated Beaker Icon */}
      <div className="relative w-24 h-24 mb-6">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full text-viet-green"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Beaker Outline */}
          <motion.path
            d="M30 20 L30 80 Q30 90 40 90 L60 90 Q70 90 70 80 L70 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M25 20 L75 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          
          {/* Liquid Level Animation */}
          <motion.path
            d="M32 80 L32 50 Q50 55 68 50 L68 80 Q68 85 58 85 L42 85 Q32 85 32 80"
            fill="currentColor"
            fillOpacity="0.2"
            animate={{
              d: [
                "M32 80 L32 50 Q50 55 68 50 L68 80 Q68 85 58 85 L42 85 Q32 85 32 80",
                "M32 80 L32 55 Q50 50 68 55 L68 80 Q68 85 58 85 L42 85 Q32 85 32 80",
                "M32 80 L32 50 Q50 55 68 50 L68 80 Q68 85 58 85 L42 85 Q32 85 32 80"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Bubbles */}
          <motion.circle
            cx="40" cy="70" r="3"
            fill="currentColor"
            animate={{ y: [-10, -40], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.circle
            cx="60" cy="75" r="2.5"
            fill="currentColor"
            animate={{ y: [-10, -50], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
          />
          <motion.circle
            cx="50" cy="80" r="2"
            fill="currentColor"
            animate={{ y: [-10, -35], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
          />
        </motion.svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-xl font-black text-viet-text tracking-tight mb-2">
          Chemistry <span className="text-viet-green">Odyssey</span>
        </h2>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-viet-green"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Decorative text */}
      <div className="absolute bottom-10 text-[11px] font-bold text-viet-text-light/30 uppercase tracking-[0.2em]">
        Đang chuẩn bị phòng thí nghiệm...
      </div>
    </div>
  );
};

export default LoadingScreen;
