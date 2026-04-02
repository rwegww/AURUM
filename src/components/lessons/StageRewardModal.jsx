import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const StageRewardModal = ({ rewardSrc, onProceed, lessonTitle }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-[#fffbf0]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto"
    >
      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Unlocked Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="mb-8 px-8 py-3 bg-viet-green text-white rounded-full font-black text-[14px] uppercase tracking-[4px] shadow-2xl shadow-viet-green/30"
        >
          ✨ Đã mở khóa bí thuật ✨
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-black text-viet-text mb-2 text-center italic"
        >
          Trang Sách Tri Thức
        </motion.h2>
        <p className="text-viet-text-light font-bold text-lg mb-12 opacity-60">Ghi chép từ cuộc hành trình - {lessonTitle}</p>

        {/* Book Page Image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-viet-border overflow-hidden group mb-12"
        >
           <img 
             src={rewardSrc} 
             alt="Book Page Reward" 
             className="w-full h-auto object-contain"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
           
           {/* Decorative Elements */}
           <div className="absolute top-8 left-8 w-12 h-12 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-xl border border-white/30">
             📖
           </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onProceed}
          className="group relative px-12 py-5 bg-viet-text text-white rounded-[24px] font-black text-[14px] uppercase tracking-[3px] hover:scale-105 active:scale-95 transition-all shadow-2xl hover:bg-viet-green"
        >
          <span className="relative z-10 flex items-center gap-3">
            Bắt đầu bài học chính 🚀
          </span>
          <div className="absolute inset-0 bg-viet-green rounded-[24px] blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
        </motion.button>
        
        <p className="mt-8 text-viet-text-light/40 text-[11px] font-black uppercase tracking-widest">
          Phần thưởng này đã được lưu vào thư viện của bạn
        </p>
      </div>
    </motion.div>
  );
};

export default StageRewardModal;
