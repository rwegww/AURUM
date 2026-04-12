import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#fffbf0] flex flex-col items-center justify-center">
      {/* Animated Logo */}
      <div className="w-40 h-40 relative flex items-center justify-center">
        {/* Main $ Logo for Loading */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full relative flex items-center justify-center"
        >
          <img src="/src/assets/logo.png" alt="Loading..." className="w-24 h-24 object-contain animate-pulse" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <h2 className="text-4xl font-black text-viet-text tracking-tighter italic uppercase">
          AURUM
        </h2>
        <p className="text-[10px] font-black text-viet-green uppercase tracking-[10px] mt-2 ml-2">
          Chemistry Currency
        </p>
        <div className="flex items-center justify-center gap-1 mt-4">
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
