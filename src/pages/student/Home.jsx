import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// --- Reused SVG Icons (Scaled up for Feature Sections) ---

const GraphicClassroom = () => (
  <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
    <div className="absolute inset-0 bg-viet-green/10 rounded-full blur-3xl"></div>
    <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-viet-green drop-shadow-2xl">
      <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none">
        {/* Book */}
        <path d="M20 70 h50 a10 10 0 0 0 10 -10 v-20 a10 10 0 0 0 -10 -10 h-50 z" fill="#76c034" fillOpacity="0.2" />
        <path d="M20 70 v-40 m50 40 v-40" />
        <path d="M25 45 h30 M25 55 h20" strokeWidth="4" />
        {/* Board */}
        <rect x="40" y="20" width="50" height="30" fill="#fff" strokeWidth="4" rx="2" />
        <path d="M45 35 h20 M45 40 h15" strokeWidth="2" />
        <path d="M70 25 l5 10 l5 -10" strokeWidth="2" />
      </g>
    </svg>
  </div>
);

const GraphicLab = () => (
  <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
    <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-blue-500 flex-shrink-0 drop-shadow-2xl">
      <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none">
        <path d="M30 40 v20 a10 10 0 0 0 20 0 v-20" fill="#3b82f6" fillOpacity="0.3" />
        <path d="M25 40 h30" strokeWidth="4" />
        <path d="M60 30 v30 a10 10 0 0 0 20 0 v-30" fill="#76c034" fillOpacity="0.3" stroke="#76c034" />
        <path d="M55 30 h30" stroke="#76c034" strokeWidth="4" />
        <circle cx="40" cy="55" r="2" fill="currentColor" />
        <circle cx="70" cy="45" r="3" fill="#76c034" stroke="none" />
        <circle cx="67" cy="52" r="1.5" fill="#76c034" stroke="none" />
      </g>
    </svg>
  </div>
);

const GraphicArena = () => (
  <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
    <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl"></div>
    <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-purple-600 drop-shadow-2xl">
      <g stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none">
        <path d="M10 60 l10 -15 h60 l10 15 v10 h-80 z" fill="#a855f7" fillOpacity="0.2" />
        <path d="M20 45 Q50 65 80 45" />
        <path d="M15 52 Q50 72 85 52" />
        <path d="M30 60 Q50 78 70 60" fill="#a855f7" fillOpacity="0.5" />
        <rect x="35" y="15" width="30" height="15" fill="#fff" rx="2" />
        <path d="M42 22 v4 M50 22 v4 M58 22 v4" strokeWidth="3" />
        <path d="M40 30 v15 M60 30 v15" strokeWidth="3" />
      </g>
    </svg>
  </div>
);

const GraphicLibrary = () => (
  <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
    <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl"></div>
    <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-amber-500 drop-shadow-2xl">
      <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none">
        <rect x="20" y="20" width="60" height="60" rx="4" fill="#f59e0b" fillOpacity="0.1" />
        <rect x="28" y="28" width="15" height="15" fill="#f59e0b" fillOpacity="0.5" />
        <rect x="48" y="28" width="15" height="15" fill="#f59e0b" fillOpacity="0.2" />
        <rect x="28" y="48" width="15" height="15" fill="#f59e0b" fillOpacity="0.2" />
        <rect x="48" y="48" width="15" height="15" fill="#f59e0b" fillOpacity="0.8" />
        <path d="M75 25 v50 M85 30 v40" />
      </g>
    </svg>
  </div>
);

// --- Background Decorations ---
const BackgroundOrbs = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Refined Dot Grid Design */}
    <div className="absolute top-0 left-0 w-full h-[600px] opacity-20">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
             <circle cx="2" cy="2" r="1.5" fill="#76c034" />
             <circle cx="22" cy="22" r="0.8" fill="#76c034" opacity="0.5" />
          </pattern>
          <radialGradient id="fadeGradient" cx="20%" cy="30%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="mask">
            <rect width="100%" height="100%" fill="url(#fadeGradient)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" mask="url(#mask)" />
      </svg>
    </div>

    {/* Elegant Hexagon Symbol */}
    <motion.div 
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, 0]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-40 right-20 w-48 h-48 text-viet-green opacity-20"
    >
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
         <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
         <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5" strokeOpacity="0.5" />
         <circle cx="50" cy="50" r="10" />
         <path d="M50 5 v10 M95 27.5 l-10 5 M95 72.5 l-10 -5 M50 95 v-10 M5 72.5 l 10 -5 M5 27.5 l 10 5" />
      </svg>
    </motion.div>

    {/* Soft Glows */}
    <div className="absolute -top-40 -left-40 w-96 h-96 bg-viet-green/5 blur-[120px] rounded-full" />
  </div>
);

import LeaderboardSection from '@/components/home/LeaderboardSection';

const FeatureSection = ({ title, highlight, description, reverse, graphic, linkText, linkUrl, bgClass = 'bg-white' }) => (
  <section className={`py-24 ${bgClass} overflow-hidden`}>
    <div className={`max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center gap-16 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1 flex flex-col items-start gap-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-viet-text leading-[1.1] tracking-tight">
          {title} <br/>
          <span className="text-viet-green">{highlight}</span>
        </h2>
        <p className="text-lg text-viet-text-light/80 font-medium leading-relaxed max-w-lg mb-4">
          {description}
        </p>
        <Link to={linkUrl} className="group flex items-center gap-4 px-8 py-4 bg-viet-text text-white rounded-full font-bold text-[15px] hover:bg-viet-green transition-all shadow-lg hover:-translate-y-1">
          {linkText}
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-viet-green transition-all">
            →
          </span>
        </Link>
      </div>
      <div className="flex-1 w-full flex items-center justify-center relative">
        {graphic}
      </div>
    </div>
  </section>
);

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen font-sans bg-[#fffbf0]">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-[180px] pb-32 overflow-hidden bg-[#fffbf0]">
        <BackgroundOrbs />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-6 mb-10 cursor-default animate-fade-in relative">
            {/* Localized Dot Grid behind logo */}
            <div className="absolute -top-10 -left-10 w-40 h-40 opacity-20 pointer-events-none z-0">
               <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <pattern id="localDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                     <circle cx="3" cy="3" r="2.5" fill="#76c034" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#localDots)" />
               </svg>
            </div>

            <div className="w-28 h-28 relative flex items-center justify-center animate-bounce-slow shrink-0 z-10">
              {/* Styled $ Logo */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-viet-green">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" />
                <text x="50" y="65" textAnchor="middle" className="fill-current font-black text-6xl" style={{ fontFamily: 'serif' }}>$</text>
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
              </svg>
            </div>
            <div className="flex flex-col items-start justify-center text-left leading-[0.85] tracking-tighter z-10">
              <span className="text-[100px] font-black text-[#1a1a1a] italic uppercase">AURUM</span>
              <span className="text-[12px] font-bold text-viet-green uppercase tracking-[8px] mt-2 block ml-1">Chemistry Currency</span>
            </div>
          </div>

          <h1 className="text-[28px] md:text-[36px] font-black text-[#666] mb-12 max-w-3xl leading-[1.4] tracking-tight">
             {t('home.hero_statement')}
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/classroom" className="bg-viet-green text-white text-[18px] font-black px-12 py-5 rounded-full shadow-[0_12px_24px_rgba(118,192,52,0.3)] hover:scale-105 active:scale-95 transition-all outline outline-offset-2 outline-transparent hover:outline-viet-green whitespace-nowrap">
              {t('home.enter_classroom')} →
            </Link>
            <Link to="/lab" className="bg-white text-viet-text border border-viet-border text-[18px] font-black px-12 py-5 rounded-full shadow-sm hover:border-viet-green hover:text-viet-green transition-all whitespace-nowrap">
              {t('home.enter_lab')}
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURE SECTIONS (STORY SCROLL) --- */}
      
      <FeatureSection
        title="Lộ trình học tập"
        highlight="Trực tuyến bài bản"
        description="Từ những khái niệm cơ bản nhất của Hóa học 8 đến các chuyên đề nâng cao của Hóa học 12. Nội dung được số hóa thành các bài học tương tác tịnh tiến, rèn giũa cả lý thuyết và bài tập."
        linkText="Khám phá Lớp học"
        linkUrl="/classroom"
        graphic={<GraphicClassroom />}
        bgClass="bg-white"
        reverse={false}
      />

      <FeatureSection
        title="Phòng thí nghiệm"
        highlight="Tuyệt đối an toàn"
        description="Không cần hóa chất thực, không lo rủi ro cháy nổ. Thoải mái pha trộn, quan sát sự đổi màu, kết tủa và khí thoát ra ngay trên màn hình. Hỗ trợ hàng trăm phản ứng từ phổ thông đến nâng cao."
        linkText="Thực hành Lab"
        linkUrl="/lab"
        graphic={<GraphicLab />}
        bgClass="bg-[#fffbf0]"
        reverse={true}
      />

      <FeatureSection
        title="Đấu trường thi đấu"
        highlight="Kịch tính căng thẳng"
        description="Hệ thống xếp hạng thời gian thực. Tạo phòng thi đấu cùng bạn bè hoặc tìm trận ngẫu nhiên. Trả lời chớp nhoáng các câu hỏi Hóa học để tích lũy điểm và mở khóa các bộ Avatar độc quyền."
        linkText="Tham gia Đấu trường"
        linkUrl="/arena"
        graphic={<GraphicArena />}
        bgClass="bg-white"
        reverse={false}
      />
      
      <LeaderboardSection />

      <FeatureSection
        title="Tra cứu toàn diện"
        highlight="Nhanh chóng, chính xác"
        description="Thư viện tài liệu số khổng lồ đi kèm Bảng tuần hoàn tương tác. Bấm vào bất kỳ nguyên tố nào để xem cấu hình electron, mức năng lượng và tính chất hóa học chi tiết."
        linkText="Vào Thư viện"
        linkUrl="/library"
        graphic={<GraphicLibrary />}
        bgClass="bg-[#fffbf0]"
        reverse={true}
      />

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-[#e8e8e8] bg-white py-12 relative z-20">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-black text-viet-text tracking-tighter uppercase italic">
              AURUM <span className="text-viet-green">CURRENCY</span>
            </span>
            <p className="text-[13px] font-medium text-viet-text-light/60">
              © 2026 Chuyên đề Hóa Học KTH. Developed with 💚.
            </p>
          </div>
          <div className="flex items-center gap-8 text-[15px] font-bold text-viet-text-light hover:[&>a]:text-viet-green transition-colors">
             <Link to="/about">Về chúng tôi</Link>
             <Link to="/contact">Liên hệ</Link>
             <Link to="/terms">Điều khoản</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
