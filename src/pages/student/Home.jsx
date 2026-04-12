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

// --- Background Decorations (Falling Chemistry Symbols) ---
const FallingChemistry = () => {
  const symbols = [
    { text: 'H₂O', size: 'text-[14px]' },
    { text: 'CO₂', size: 'text-[12px]' },
    { text: 'NaCl', size: 'text-[13px]' },
    { text: 'CH₄', size: 'text-[12px]' },
    { text: '⚛️', size: 'text-[18px]' },
    { text: '⬢', size: 'text-[20px]' }, // Benzene ring
    { text: 'O₂', size: 'text-[11px]' },
    { text: '+', size: 'text-[16px]' },
    { text: '-', size: 'text-[16px]' },
    { text: 'H₂', size: 'text-[12px]' },
    { text: 'NH₃', size: 'text-[13px]' },
    { text: '🧪', size: 'text-[15px]' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full z-0">
      {[...Array(50)].map((_, i) => {
        const symbol = symbols[i % symbols.length];
        const randomX = Math.random() * 100;
        const duration = 20 + Math.random() * 25;
        const delay = Math.random() * -40; // Randomized start positions
        const opacity = 0.02 + Math.random() * 0.1;
        const blur = Math.random() > 0.7 ? 'blur-[1.5px]' : 'blur-[0.5px]';

        return (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0, rotate: 0, x: 0 }}
            animate={{ 
              y: '120vh', 
              opacity: [0, opacity, opacity, 0],
              rotate: 360,
              x: (Math.random() * 40 - 20) // Horizontal drift in pixels
            }}
            transition={{ 
              duration: duration, 
              delay: delay, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={`absolute font-black text-viet-green select-none ${symbol.size} ${blur}`}
            style={{ 
              left: `${randomX}%`,
              textShadow: '0 0 10px rgba(118, 192, 52, 0.1)'
            }}
          >
            {symbol.text}
          </motion.div>
        );
      })}

      {/* Soft Glows for ambiance */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-viet-green/[0.03] to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-viet-green/[0.05] blur-[120px] rounded-full" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/[0.03] blur-[100px] rounded-full" />
    </div>
  );
};

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
        <FallingChemistry />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-6 mb-10 cursor-default animate-fade-in relative">
            {/* Dynamic Halo behind logo */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -left-10 w-40 h-40 opacity-10 pointer-events-none z-0"
            >
               <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#76c034" strokeWidth="0.5" strokeDasharray="10 5" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#76c034" strokeWidth="0.5" strokeDasharray="5 10" />
                  <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" stroke="#76c034" strokeWidth="1" />
               </svg>
            </motion.div>

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
              <span className="text-[12px] font-bold text-viet-green uppercase tracking-[8px] mt-2 block ml-1">{t('nav.arena_link')} CURRENCY</span>
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
        title={t('home.features.journey.title')}
        highlight={t('home.features.journey.highlight')}
        description={t('home.features.journey.desc')}
        linkText={t('home.features.journey.link')}
        linkUrl="/classroom"
        graphic={<GraphicClassroom />}
        bgClass="bg-white"
        reverse={false}
      />

      <FeatureSection
        title={t('home.features.lab.title')}
        highlight={t('home.features.lab.highlight')}
        description={t('home.features.lab.desc')}
        linkText={t('home.features.lab.link')}
        linkUrl="/lab"
        graphic={<GraphicLab />}
        bgClass="bg-[#fffbf0]"
        reverse={true}
      />

      <FeatureSection
        title={t('home.features.arena.title')}
        highlight={t('home.features.arena.highlight')}
        description={t('home.features.arena.desc')}
        linkText={t('home.features.arena.link')}
        linkUrl="/arena"
        graphic={<GraphicArena />}
        bgClass="bg-white"
        reverse={false}
      />
      
      <LeaderboardSection />

      <FeatureSection
        title={t('home.features.library.title')}
        highlight={t('home.features.library.highlight')}
        description={t('home.features.library.desc')}
        linkText={t('home.features.library.link')}
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
              {t('home.footer.desc')}
            </p>
          </div>
          <div className="flex items-center gap-8 text-[15px] font-bold text-viet-text-light hover:[&>a]:text-viet-green transition-colors">
             <Link to="/about">{t('home.footer.about')}</Link>
             <Link to="/contact">{t('home.footer.contact')}</Link>
             <Link to="/terms">{t('home.footer.terms')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
