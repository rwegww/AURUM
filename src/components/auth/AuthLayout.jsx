import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MoleculeBackground from './MoleculeBackground';

const AuthLayout = ({ children }) => {

  return (
    <div className="min-h-screen w-full flex flex-col md:items-center md:justify-center bg-[#fdf6e3] md:bg-[#fffbf0] overflow-hidden relative md:p-8 font-inter">
      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between px-6 py-5 w-full bg-transparent z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200 group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[13px] font-bold text-slate-600 font-sora">Về trang chủ</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="text-xl">🎓</div>
          <span className="text-[15px] font-black text-viet-green tracking-tight font-sora">VietEdu Odyssey</span>
        </div>
      </div>

      {/* Background for Desktop only */}
      <div className="hidden md:block">
        <MoleculeBackground />
      </div>
      
      {/* Grid texture for Desktop only */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none hidden md:block" 
           style={{ backgroundImage: 'radial-gradient(#76c034 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />

      {/* Floating Home Button (Desktop) */}
      <Link to="/" className="fixed top-8 left-8 z-50 hidden md:flex items-center gap-3 px-6 py-3 bg-white/80 hover:bg-white text-viet-text-light hover:text-viet-green rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-xl transition-all border border-viet-border shadow-sm hover:shadow-lg active:scale-95 group">
         <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
         <span className="font-sora">Trường học</span>
      </Link>

      {/* Main Premium Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-6xl md:bg-white rounded-t-[32px] md:rounded-[56px] md:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] md:border md:border-[#e8e8e8] overflow-hidden flex flex-col md:flex-row flex-1 md:flex-none md:h-[750px] md:max-h-[90vh]"
      >
        {/* Left Side: Branding & Visuals (Desktop) */}
        <div className="hidden md:flex w-full md:w-[45%] bg-gradient-to-br from-[#76c034] to-[#4caf50] p-16 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
           
           <div className="relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-6 md:mb-10 shadow-xl border border-white/30 group hover:rotate-12 transition-transform">
                🎓
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 md:mb-6 font-sora">
                Mở khóa <br className="hidden md:block" />
                <span className="text-white/80"> Bí mật </span> <br className="hidden md:block" />
                Nguyên tử
              </h1>
              <div className="w-12 md:w-16 h-1 md:h-1.5 bg-white/40 rounded-full mb-4 md:mb-6" />
              <p className="text-base md:text-lg font-medium text-white/90 max-w-xs leading-relaxed">
                Tham gia cộng đồng học thuật Aurum ngay hôm nay.
              </p>
           </div>

           <div className="relative z-10 space-y-6 hidden md:block">

              <BenefitItem icon="⚡" title="Thử thách 1:1" desc="Đấu trường tri thức liên trường" />
              <BenefitItem icon="🧪" title="Phòng LAB ảo" desc="Thí nghiệm không giới hạn an toàn" />
              <BenefitItem icon="🏆" title="Hệ thống Rank" desc="Bảng xếp hạng vinh danh Aurum" />
           </div>

           {/* Floating Accent Circle */}
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-[55%] flex flex-col items-center p-6 md:p-8 lg:p-6 overflow-y-auto bg-white custom-scrollbar min-h-0 md:h-full">
           <div className="w-full max-w-sm my-auto md:my-auto">
              {children}
           </div>
           
           {/* Footer branding subtle (Desktop only) */}
           <div className="mt-8 opacity-20 hidden md:flex items-center gap-2 pointer-events-none">
              <span className="w-4 h-[1px] bg-black" />
              <p className="text-black/60 text-xs font-bold uppercase tracking-widest leading-loose">Hệ thống giáo dục Aurum v3.0</p>
              <span className="w-4 h-[1px] bg-black" />
           </div>
        </div>

      </motion.div>

      {/* Decorative background elements outside the container */}
      <div className="fixed -bottom-32 -right-32 w-[500px] h-[500px] bg-viet-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -top-32 -left-32 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

const BenefitItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-all border border-white/10 group-hover:scale-110 shadow-lg">
      <span className="text-xl">{icon}</span>
    </div>
    <div>
      <h3 className="font-bold text-sm font-sora">{title}</h3>
      <p className="text-[11px] text-white/60 font-medium mt-0.5">{desc}</p>
    </div>
  </div>
);

export default AuthLayout;
