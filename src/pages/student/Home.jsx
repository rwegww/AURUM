import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LeaderboardSection from '@/components/home/LeaderboardSection';
import Footer from '@/components/common/Footer';
import { Play, FlaskConical, Trophy, BookOpen, Users, Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

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
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full z-0 opacity-30">
      {[...Array(15)].map((_, i) => {
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
              opacity: [0, 0.3, 0.3, 0],
              rotate: 360,
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
            className="absolute font-black text-viet-green select-none blur-[1px] text-[24px]"
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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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
  <motion.div variants={itemVariants} className={`group relative bg-white border-2 border-duo-border border-b-[6px] rounded-3xl p-8 flex flex-col gap-6 hover:-translate-y-2 hover:border-b-[8px] hover:shadow-xl transition-all duration-300 overflow-hidden h-full ${className}`}>
    <div className="absolute -right-8 -bottom-8 w-64 h-64 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12">
      {graphic}
    </div>
    <div className="relative z-10 flex-1">
      <h3 className="font-rubik text-3xl font-black text-[#1a1a1a] leading-tight mb-3">
        {title} <span className="block text-viet-green">{highlight}</span>
      </h3>
      <p className="text-[17px] font-medium text-[#1a1a1a]/70 max-w-[280px] line-clamp-3">
        {description}
      </p>
    </div>
    <div className="relative z-10 mt-auto">
      <Link to={linkUrl} className="inline-flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-viet-green hover:text-white rounded-full w-max text-sm uppercase tracking-widest font-black transition-colors">
        {linkText}
        <ArrowRight size={18} />
      </Link>
    </div>
  </motion.div>
);

const Home = () => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [testimonials, setTestimonials] = React.useState([]);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('Home: Attempting to fetch praises from API...');
        const res = await fetch('/api/user/public-praises');
        
        if (!res.ok) throw new Error('Failed to fetch public praises');
        const data = await res.json();
        
        if (data && data.length > 0) {
          console.log('Home: Praises successfully fetched from database:', data);
          setTestimonials(data); // data is already mapped from backend
        } else {
          console.warn('Home: No praises found in database, falling back to local translations.');
          const fallback = t('home.testimonials.reviews', { returnObjects: true }) || [];
          setTestimonials(fallback);
        }
      } catch (err) {
        console.error('Home: Error fetching praises:', err);
        const fallback = t('home.testimonials.reviews', { returnObjects: true }) || [];
        setTestimonials(fallback);
      }
    };
    fetchTestimonials();
  }, [t, i18n.language]);

  return (
    <div className="min-h-screen font-sans bg-[#fbfbfb] selection:bg-viet-green selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-[140px] lg:pt-[180px] pb-24 overflow-hidden bg-gradient-to-b from-[#f4faef] to-[#fbfbfb]">
        <FallingChemistry />
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8"
          >
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-duo-border shadow-sm mb-8">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-viet-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-viet-green"></span>
                </span>
                <span className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">{t('home.hero_statement', 'Nền tảng Hóa học #1')}</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="font-rubik text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-black text-[#1a1a1a] leading-[1.1] tracking-tight mb-6">
                AURUM <br/>
                <span className="text-viet-green">CHEMISTRY</span> CURRENCY
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                {t('home.hero_statement')}
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/classroom" className="btn-tactile-green text-xl font-black px-10 py-5 rounded-[1.5rem] whitespace-nowrap flex items-center justify-center gap-3">
                  {t('home.enter_classroom')}
                  <Play size={24} className="fill-current" />
                </Link>
                <Link to="/lab" className="bg-white text-[#1a1a1a] border-2 border-duo-border border-b-4 hover:bg-gray-50 active:border-b-0 active:translate-y-[4px] transition-all text-xl font-black px-10 py-5 rounded-[1.5rem] whitespace-nowrap flex items-center justify-center gap-3">
                  {t('home.enter_lab')}
                  <FlaskConical size={24} />
                </Link>
              </motion.div>
            </div>

            {/* Right Visual (Hero Image / Abstract Shape) */}
            <motion.div variants={itemVariants} className="flex-1 relative w-full max-w-lg aspect-square lg:aspect-auto">
              <div className="absolute inset-0 bg-viet-green/10 rounded-full blur-3xl animate-pulse"></div>
              <img src="/logo.png" alt="Aurum Chemistry" className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
              
              {/* Floating Element 1 */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 bg-white p-4 rounded-2xl border-2 border-duo-border shadow-lg flex items-center gap-3 z-20 hidden md:flex"
              >
                <div className="bg-purple-100 p-2 rounded-xl"><Trophy className="text-purple-600" size={24} /></div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-500 uppercase">Top 1</p>
                  <p className="font-black text-[#1a1a1a]">Gamification</p>
                </div>
              </motion.div>

              {/* Floating Element 2 */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-0 bg-white p-4 rounded-2xl border-2 border-duo-border shadow-lg flex items-center gap-3 z-20 hidden md:flex"
              >
                <div className="bg-blue-100 p-2 rounded-xl"><ShieldCheck className="text-blue-600" size={24} /></div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-500 uppercase">100%</p>
                  <p className="font-black text-[#1a1a1a]">Safe Labs</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SOCIAL PROOF BANNER --- */}
      <section className="border-y-2 border-duo-border bg-white py-6 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden flex items-center justify-center font-bold text-gray-500 text-xs">
                  {i===1?'👩‍🔬':i===2?'👨‍🎓':i===3?'👩‍🏫':'👨‍🔬'}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-current" />)}
              </div>
              <span className="font-bold text-sm text-[#1a1a1a]">{t('home.social_proof.text')}</span>
            </div>
          </div>
          <div className="font-bold text-gray-500 flex items-center gap-2">
            <Users size={20} />
            {t('home.social_proof.schools')}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={containerVariants}>
            <motion.span variants={itemVariants} className="font-bold text-viet-green uppercase tracking-widest text-sm mb-3 block">
              {t('home.how_it_works.badge')}
            </motion.span>
            <motion.h2 variants={itemVariants} className="font-rubik text-4xl md:text-5xl font-black text-[#1a1a1a] mb-16">
              {t('home.how_it_works.title')}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-200 -z-10 border-t-2 border-dashed border-gray-300"></div>

              {[
                { id: 'step1', icon: <BookOpen size={32}/>, color: 'bg-blue-100 text-blue-600' },
                { id: 'step2', icon: <FlaskConical size={32}/>, color: 'bg-viet-green/20 text-viet-green' },
                { id: 'step3', icon: <Trophy size={32}/>, color: 'bg-purple-100 text-purple-600' }
              ].map((step) => (
                <motion.div key={step.id} variants={itemVariants} className="flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-full ${step.color} border-4 border-white shadow-xl flex items-center justify-center mb-6 relative z-10`}>
                    {step.icon}
                  </div>
                  <h3 className="font-rubik text-2xl font-black text-[#1a1a1a] mb-3">
                    {t(`home.how_it_works.steps.${step.id}.title`)}
                  </h3>
                  <p className="text-gray-600 font-medium max-w-xs">
                    {t(`home.how_it_works.steps.${step.id}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES / BENTO GRID --- */}
      <section className="py-24 bg-[#f8f9fa] border-t-2 border-b-2 border-duo-border">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-bold text-viet-green uppercase tracking-widest text-sm mb-3 block">Hệ Sinh Thái</span>
            <h2 className="font-rubik text-4xl md:text-5xl font-black text-[#1a1a1a]">Mọi thứ bạn cần để giỏi Hóa</h2>
          </div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[340px]"
          >
            <BentoCard
              title={t('home.features.journey.title')}
              highlight={t('home.features.journey.highlight')}
              description={t('home.features.journey.desc')}
              linkText={t('home.features.journey.link')}
              linkUrl="/classroom"
              graphic={<GraphicClassroom />}
              className="md:col-span-2 lg:col-span-2"
            />
            <BentoCard
              title={t('home.features.lab.title')}
              highlight={t('home.features.lab.highlight')}
              description={t('home.features.lab.desc')}
              linkText={t('home.features.lab.link')}
              linkUrl="/lab"
              graphic={<GraphicLab />}
              className="lg:row-span-2"
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

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-bold text-viet-green uppercase tracking-widest text-sm mb-3 block">
              {t('home.testimonials.badge')}
            </span>
            <h2 className="font-rubik text-4xl md:text-5xl font-black text-[#1a1a1a]">
              {t('home.testimonials.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(testimonials) && testimonials.map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#fbfbfb] p-8 rounded-3xl border-2 border-duo-border border-b-4 hover:-translate-y-2 transition-transform"
              >
                <div className="flex text-amber-400 mb-4">
                  {[...Array(review.rating || 5)].map((_, starIndex) => (
                    <Star key={starIndex} size={20} className="fill-current" />
                  ))}
                </div>
                <p className="text-lg font-medium text-[#1a1a1a] mb-6 italic">"{review.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-duo-border flex items-center justify-center font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a]">{review.name}</h4>
                    <span className="text-sm text-gray-500 font-medium">{review.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LEADERBOARD --- */}
      <div className="bg-[#f4faef] py-20 border-t-2 border-duo-border">
        <LeaderboardSection />
      </div>

      {/* --- FINAL CTA --- */}
      {!isLoggedIn && (
        <section className="py-24 bg-viet-green relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/icons.svg')] bg-repeat bg-[length:100px_100px]"></div>
          <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
            <h2 className="font-rubik text-4xl md:text-6xl font-black text-white mb-6">
              {t('home.final_cta.title')}
            </h2>
            <p className="text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto">
              {t('home.final_cta.subtitle')}
            </p>
            <Link to="/login" className="bg-white text-viet-green border-2 border-[#1a1a1a] border-b-4 hover:bg-gray-50 active:border-b-0 active:translate-y-[4px] transition-all text-xl font-black px-12 py-6 rounded-[1.5rem] inline-flex items-center justify-center gap-3">
              {t('home.final_cta.button')}
              <Zap className="fill-current" size={24} />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;
