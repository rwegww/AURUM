import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden bg-viet-bg">
      {/* Background Orbs - Adjusted for Light BG */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-viet-green/10 blur-[100px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-viet-accent/10 blur-[100px] rounded-full animate-pulse-slow delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-viet-green/10 border border-viet-green/20 text-viet-green font-semibold text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-viet-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-viet-green"></span>
            </span>
            Kỷ nguyên học tập mới
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-viet-text">
            Chinh Phục <br />
            <span className="text-gradient">Vũ Trụ Nguyên Tử</span>
          </h1>
          
          <p className="max-w-xl mx-auto md:mx-0 text-lg text-viet-text-light leading-relaxed">
            Học Hóa học chưa bao giờ thú vị đến thế. Tham gia vào những cuộc phiêu lưu, 
            thực hiện các thí nghiệm ảo và thi đấu trong đấu trường phân tử để trở thành 
            nhà hóa học lỗi lạc.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link 
              to={isLoggedIn ? "/classroom" : "/login"} 
              className="px-8 py-4 bg-viet-green text-white rounded-2xl font-black uppercase tracking-widest text-[13px] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-viet-green/20"
            >
              <span>{isLoggedIn ? `Chào, ${user?.username}!` : "Bắt đầu hành trình →"}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
            <button className="btn-secondary flex items-center gap-3">
              <span>Khám phá thư viện</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <path d="M10 8l6 4-6 4V8z" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-8 pt-4">
            <div>
              <div className="text-2xl font-bold text-viet-text">15k+</div>
              <div className="text-xs text-viet-text-light uppercase tracking-widest">Học sinh</div>
            </div>
            <div className="w-px h-8 bg-viet-border"></div>
            <div>
              <div className="text-2xl font-bold text-viet-text">500+</div>
              <div className="text-xs text-viet-text-light uppercase tracking-widest">Thí nghiệm</div>
            </div>
            <div className="w-px h-8 bg-viet-border"></div>
            <div>
              <div className="text-2xl font-bold text-viet-text">98%</div>
              <div className="text-xs text-viet-text-light uppercase tracking-widest">Hài lòng</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <div className="viet-card p-4 aspect-square w-full max-w-lg mx-auto relative group shadow-2xl shadow-viet-green/10">
            <div className="absolute inset-0 bg-gradient-to-br from-viet-green/5 to-viet-accent/5 rounded-[24px] group-hover:opacity-100 transition-opacity opacity-0"></div>
            
            <div className="w-full h-full rounded-2xl overflow-hidden border border-viet-border relative">
               <div className="w-full h-full flex items-center justify-center bg-[#fdfaf1]">
                   <svg viewBox="0 0 200 200" className="w-64 h-64">
                       <defs>
                           <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                               <stop offset="0%" style={{stopColor:'#76c034', stopOpacity:1}} />
                               <stop offset="100%" style={{stopColor:'#f9b800', stopOpacity:1}} />
                           </linearGradient>
                       </defs>
                       <circle cx="100" cy="100" r="40" fill="url(#grad1)" fillOpacity="0.1">
                           <animate attributeName="r" values="35;45;35" dur="4s" repeatCount="indefinite" />
                       </circle>
                       <circle cx="100" cy="100" r="60" stroke="url(#grad1)" strokeWidth="1" fill="none" strokeDasharray="5,5" opacity="0.3">
                            <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                       </circle>
                       <circle cx="100" cy="100" r="80" stroke="url(#grad1)" strokeWidth="0.5" fill="none" opacity="0.2">
                            <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="30s" repeatCount="indefinite" />
                       </circle>
                       {/* Floating Atoms - Updated Colors */}
                       <circle cx="140" cy="60" r="8" fill="#76c034" />
                       <circle cx="60" cy="140" r="6" fill="#f9b800" />
                       <circle cx="50" cy="50" r="4" fill="#3f3e3e" />
                   </svg>
               </div>
            </div>
            
            {/* Stats Card Overlay - Adjusted for Light */}
            <div className="absolute -bottom-8 -right-8 bg-white border border-viet-border rounded-2xl p-4 flex items-center gap-4 shadow-xl animate-bounce hover:pause">
               <div className="w-10 h-10 rounded-lg bg-viet-green/10 flex items-center justify-center">
                   <svg className="w-5 h-5 text-viet-green" fill="currentColor" viewBox="0 0 20 20">
                       <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                   </svg>
               </div>
               <div>
                    <div className="text-[10px] text-viet-text-light font-bold uppercase">Đang luyện tập</div>
                    <div className="text-[14px] font-bold text-viet-text">4,281 Chiến binh</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
