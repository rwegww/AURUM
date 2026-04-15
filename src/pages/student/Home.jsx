import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LeaderboardSection from '@/components/home/LeaderboardSection';

// --- Reused SVG Graphics (Simplified for Bento) ---

const GraphicClassroom = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-viet-green group-hover:scale-110 transition-transform duration-500 ease-out">
    <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none">
      <path d="M20 70 h50 a10 10 0 0 0 10 -10 v-20 a10 10 0 0 0 -10 -10 h-50 z" fill="currentColor" fillOpacity="0.2" />
      <path d="M20 70 v-40 m50 40 v-40" />
      <path d="M25 45 h30 M25 55 h20" strokeWidth="4" />
    </g>
  </svg>
);

const GraphicLab = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500 group-hover:scale-110 transition-transform duration-500 ease-out">
    <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none">
      <path d="M30 40 v20 a10 10 0 0 0 20 0 v-20" fill="currentColor" fillOpacity="0.3" />
      <path d="M25 40 h30" strokeWidth="4" />
      <path d="M60 30 v30 a10 10 0 0 0 20 0 v-30" fill="#76c034" fillOpacity="0.3" stroke="#76c034" />
      <path d="M55 30 h30" stroke="#76c034" strokeWidth="4" />
    </g>
  </svg>
);

const GraphicArena = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-purple-600 group-hover:scale-110 transition-transform duration-500 ease-out">
    <g stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none">
      <path d="M10 60 l10 -15 h60 l10 15 v10 h-80 z" fill="currentColor" fillOpacity="0.2" />
      <path d="M30 60 Q50 78 70 60" fill="currentColor" fillOpacity="0.5" />
      <rect x="35" y="15" width="30" height="15" fill="#fff" rx="2" />
    </g>
  </svg>
);

const GraphicLibrary = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 group-hover:scale-110 transition-transform duration-500 ease-out">
    <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none">
      <rect x="20" y="20" width="60" height="60" rx="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="28" y="28" width="15" height="15" fill="currentColor" fillOpacity="0.8" />
      <rect x="48" y="48" width="15" height="15" fill="currentColor" fillOpacity="0.8" />
    </g>
  </svg>
);

// --- Background Decorations ---
const FallingChemistry = () => {
  const symbols = ['H₂O', 'CO₂', 'NaCl', 'CH₄', '⚛️', 'O₂', 'H₂', 'NH₃', '🧪'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full z-0 opacity-40">
      {[...Array(20)].map((_, i) => {
        const symbol = symbols[i % symbols.length];
        const randomX = Math.random() * 100;
        const duration = 20 + Math.random() * 25;
        const delay = Math.random() * -40;
        return (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0, rotate: 0 }}
            animate={{ 
              y: '120vh', 
              opacity: [0, 0.2, 0.2, 0],
              rotate: 360,
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
            className="absolute font-black text-viet-green select-none blur-[1px] text-[18px]"
            style={{ left: `${randomX}%` }}
          >
            {symbol}
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", bounce: 0, duration: 0.8 } 
  }
};

const BentoCard = ({ title, highlight, description, linkText, linkUrl, graphic, className = '' }) => (
  <motion.div variants={itemVariants} className={`group relative bg-white border-4 border-[#1a1a1a] rounded-[1.5rem] p-8 flex flex-col gap-6 shadow-tactile hover:shadow-tactile-hover hover:translate-y-1 transition-all duration-200 overflow-hidden ${className}`}>
    <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20 pointer-events-none">
      {graphic}
    </div>
    <div className="relative z-10 flex-1">
      <h3 className="font-rubik text-3xl font-black text-[#1a1a1a] leading-tight mb-3">
        {title} <span className="block text-viet-green">{highlight}</span>
      </h3>
      <p className="text-[17px] font-medium text-[#1a1a1a]/70 max-w-[280px]">
        {description}
      </p>
    </div>
    <div className="relative z-10 mt-auto">
      <Link to={linkUrl} className="inline-flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] text-white font-bold rounded-full hover:bg-viet-green transition-colors w-max">
        {linkText}
        <span className="text-xl leading-none">→</span>
      </Link>
    </div>
  </motion.div>
);

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen font-sans bg-[oklch(0.98_0.02_135)] selection:bg-viet-green selection:text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-[160px] pb-24 overflow-hidden">
        <FallingChemistry />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            {/* Logo & Title */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0">
                <img src="/logo.png" alt="Aurum Chemistry" className="w-full h-full object-contain" />
              </div>
              <div className="text-left flex flex-col justify-center">
                <span className="font-rubik text-6xl md:text-8xl font-black text-[#1a1a1a] uppercase leading-[0.85] tracking-tighter">AURUM</span>
                <span className="font-rubik text-sm md:text-base font-bold text-viet-green uppercase tracking-[0.4em] ml-1 mt-1">
                  {t('nav.arena_link')} CURRENCY
                </span>
              </div>
            </motion.div>

            {/* Main Headline (Fluid) */}
            <motion.h1 variants={itemVariants} className="font-rubik text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-black text-[#1a1a1a] leading-[1.1] tracking-tight mb-10">
              {t('home.hero_statement')}
            </motion.h1>

            {/* Tactile Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              <Link to="/classroom" className="bg-viet-green text-white text-xl font-black px-10 py-5 rounded-[1rem] border-4 border-[#1a1a1a] shadow-tactile hover:shadow-tactile-hover hover:translate-y-1 hover:bg-[#68a82d] transition-all whitespace-nowrap flex items-center gap-3">
                {t('home.enter_classroom')}
                <span className="text-2xl">⚡</span>
              </Link>
              <Link to="/lab" className="bg-white text-[#1a1a1a] text-xl font-black px-10 py-5 rounded-[1rem] border-4 border-[#1a1a1a] shadow-tactile hover:shadow-tactile-hover hover:translate-y-1 hover:bg-gray-50 transition-all whitespace-nowrap flex items-center gap-3">
                {t('home.enter_lab')}
                <span className="text-2xl">🧪</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- BENTO GRID SECTIONS --- */}
      <section className="py-20 bg-[oklch(0.96_0.03_135)] border-t-4 border-b-4 border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-bento gap-8"
          >
            {/* Classroom (Spans 2 columns on large screens if desired, but let's keep it fluid) */}
            <BentoCard
              title={t('home.features.journey.title')}
              highlight={t('home.features.journey.highlight')}
              description={t('home.features.journey.desc')}
              linkText={t('home.features.journey.link')}
              linkUrl="/classroom"
              graphic={<GraphicClassroom />}
              className="md:col-span-2 lg:col-span-1"
            />
            
            <BentoCard
              title={t('home.features.lab.title')}
              highlight={t('home.features.lab.highlight')}
              description={t('home.features.lab.desc')}
              linkText={t('home.features.lab.link')}
              linkUrl="/lab"
              graphic={<GraphicLab />}
            />
            
            <BentoCard
              title={t('home.features.arena.title')}
              highlight={t('home.features.arena.highlight')}
              description={t('home.features.arena.desc')}
              linkText={t('home.features.arena.link')}
              linkUrl="/arena"
              graphic={<GraphicArena />}
            />

            <BentoCard
              title={t('home.features.library.title')}
              highlight={t('home.features.library.highlight')}
              description={t('home.features.library.desc')}
              linkText={t('home.features.library.link')}
              linkUrl="/library"
              graphic={<GraphicLibrary />}
            />
          </motion.div>
        </div>
      </section>

      {/* --- LEADERBOARD --- */}
      <div className="bg-[oklch(0.98_0.02_135)] py-12">
        <LeaderboardSection />
      </div>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t-4 border-[#1a1a1a] bg-white py-16 relative z-20">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="font-rubik text-2xl font-black text-[#1a1a1a] tracking-tighter uppercase">
              AURUM <span className="text-viet-green">CURRENCY</span>
            </span>
            <p className="text-[15px] font-medium text-[#1a1a1a]/60">
              {t('home.footer.desc')}
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[16px] font-bold text-[#1a1a1a] hover:[&>a]:text-viet-green transition-colors">
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
