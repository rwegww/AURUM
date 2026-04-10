import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MoleculeBackground from './MoleculeBackground';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fffbf0] overflow-hidden relative p-4 md:p-8 font-inter">
      {/* Background with floating particles */}
      <MoleculeBackground />
      
      {/* Subtle Grid texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#76c034 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />

      {/* Floating Home Button */}
      <Link to="/" className="fixed top-8 left-8 z-50 flex items-center gap-3 px-6 py-3 bg-white/80 hover:bg-white text-viet-text-light hover:text-viet-green rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-xl transition-all border border-viet-border shadow-sm hover:shadow-lg active:scale-95 group">
         <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
         <span className="font-sora">Trường học</span>
      </Link>

      {/* Main Premium Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl bg-white rounded-[40px] md:rounded-[56px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-[#e8e8e8] overflow-hidden flex flex-col md:flex-row min-h-[600px] md:h-[750px] max-h-[90vh]"
      >
        {/* Left Side: Branding & Visuals (Inside the container) */}
        <div className="w-full md:w-[45%] bg-gradient-to-br from-[#76c034] to-[#4caf50] p-10 md:p-16 flex flex-col justify-between text-white relative overflow-hidden">
           {/* Decorative patterns for the left panel */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
           
           <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-10 shadow-xl border border-white/30 group hover:rotate-12 transition-transform">
                🎓
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6 font-sora">
                Mở khóa <br/>
                <span className="text-white/80">Bí mật</span> <br/>
                Nguyên tử
              </h1>
              <div className="w-16 h-1.5 bg-white/40 rounded-full mb-6" />
              <p className="text-lg font-medium text-white/90 max-w-xs leading-relaxed">
                Tham gia cộng đồng học thuật Aurum ngay hôm nay.
              </p>
           </div>

           <div className="relative z-10 space-y-6">
              <BenefitItem icon="⚡" title="Thử thách 1:1" desc="Đấu trường tri thức liên trường" />
              <BenefitItem icon="🧪" title="Phòng LAB ảo" desc="Thí nghiệm không giới hạn an toàn" />
              <BenefitItem icon="🏆" title="Hệ thống Rank" desc="Bảng xếp hạng vinh danh Aurum" />
           </div>

           {/* Floating Accent Circle */}
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-[55%] flex flex-col items-center p-4 md:p-8 lg:p-6 overflow-y-auto bg-white custom-scrollbar min-h-0">
           <div className="w-full max-w-sm my-auto">
              {children}
           </div>
           
           {/* Footer branding subtle */}
           <div className="mt-8 opacity-20 flex items-center gap-2 pointer-events-none">
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
