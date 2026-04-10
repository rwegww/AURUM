import React from 'react';
import { motion } from 'framer-motion';

const InfographicPage = ({ lesson, pageNumber, isCompleted = true }) => {
  if (!lesson) return null;

  const imagePath = `/assets/curriculum/class${lesson.classId}/${lesson.classId}-${lesson.order}.png`;
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="w-full h-full bg-white p-4 md:p-8 flex flex-col relative rounded-[40px] overflow-hidden select-none border-x border-viet-border/20 shadow-inner">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-viet-green/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      
      {/* Grid texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }} />

      {/* Main Content Container with conditional filters */}
      <div className={`flex flex-col h-full transition-all duration-700 ${!isCompleted ? 'grayscale blur-lg opacity-40 pointer-events-none select-none' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <span className="text-[10px] font-black text-viet-green border border-viet-green/30 px-3 py-1 rounded-full uppercase tracking-widest mb-1 block w-fit">
              Lesson {pageNumber}
            </span>
            <h2 className="text-lg md:text-xl font-black text-viet-text font-sora leading-tight uppercase italic origin-left">
              {lesson.title.split(': ').pop()}
            </h2>
          </div>
        </div>

        <div className="flex-1 relative z-10 flex flex-col min-h-0">
          {!imageError ? (
            <div className="flex-1 w-full bg-[#fcf8f0] rounded-2xl border-2 border-viet-border/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={imagePath} 
                alt={lesson.title}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-[12px] text-viet-text-light italic">Đang tổng hợp dữ liệu...</p>
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <div className="mt-4 pt-4 border-t border-viet-border/40 flex justify-between items-end shrink-0">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-viet-text-light/30 uppercase tracking-[3px]">Survival Guide</span>
            <span className="text-[9px] font-bold text-viet-text font-sora">Aurum</span>
          </div>
          <div className="text-[11px] font-black text-viet-green font-mono">
            PG.{String(pageNumber).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Locked Overlay */}
      {!isCompleted && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-white/10 backdrop-blur-sm">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-20 h-20 bg-white rounded-3xl border-4 border-viet-green shadow-2xl flex items-center justify-center text-4xl mb-6"
           >
              🔒
           </motion.div>
           <h3 className="text-2xl font-black text-viet-text font-sora uppercase italic">Nhiệm vụ chưa hoàn thành</h3>
           <p className="max-w-[280px] text-viet-text-light font-bold text-sm mt-2 leading-relaxed">
             Hãy khai mở bí mật của chương này bằng cách vượt qua thử thách hành trình!
           </p>
           <div className="mt-8 px-6 py-2 bg-viet-green text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
             Đang khóa ➔
           </div>
        </div>
      )}
    </div>
  );
};

export default InfographicPage;
