import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LeaderboardSection from '@/components/home/LeaderboardSection';
import Footer from '@/components/common/Footer';
import { Play, FlaskConical, Trophy, BookOpen, Star, Zap, Map, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { stableRange } from '@/utils/stableRandom';

// --- Floating Chemistry Background ---
const FallingChemistry = () => {
  const symbols = ['H₂O', 'CO₂', 'NaCl', 'CH₄', '⚛️', 'O₂', 'H₂', 'NH₃', 'Fe'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full z-0 opacity-20">
      {[...Array(12)].map((_, i) => {
        const symbol = symbols[i % symbols.length];
        const randomX = stableRange('home-falling-x', i, 0, 100);
        const duration = stableRange('home-falling-duration', i, 22, 50);
        const delay = stableRange('home-falling-delay', i, -40, 0);
        return (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0, rotate: 0 }}
            animate={{ y: '120vh', opacity: [0, 0.25, 0.25, 0], rotate: 360 }}
            transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
            className="absolute font-black text-viet-green select-none text-[22px]"
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
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0, duration: 0.8 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

// --- Feature Row Component ---
// image on right when imageRight=true, left otherwise
const FeatureRow = ({
  badge,
  badgeColor = 'text-viet-green',
  title,
  titleHighlight,
  highlightColor = 'text-viet-green',
  description,
  buttonText,
  buttonUrl,
  buttonIcon,
  imageSrc,
  imageAlt,
  imageRight = true,
  bgClass = 'bg-white',
}) => (
  <section className={`py-20 ${bgClass} border-b border-gray-100`}>
    <div className="max-w-[1100px] mx-auto px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className={`flex flex-col ${imageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-16`}
      >
        {/* Text Side */}
        <div className="w-full lg:w-[55%] lg:flex-none min-w-0">
          <motion.span
            variants={fadeUp}
            className={`inline-block text-sm font-black uppercase tracking-widest mb-3 ${badgeColor}`}
          >
            {badge}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-rubik text-[clamp(1.8rem,3vw+0.4rem,2.6rem)] font-black text-[#1a1a1a] leading-[1.15] mb-4 text-balance"
          >
            {title}
            {titleHighlight && (
              <span className={`block ${highlightColor}`}>{titleHighlight}</span>
            )}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[17px] text-gray-500 font-medium leading-relaxed max-w-[480px] mb-8"
          >
            {description}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              to={buttonUrl}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#1a1a1a] hover:bg-viet-green text-white text-sm font-black uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_0_rgba(118,192,52,0.35)] group"
            >
              {buttonText}
              {buttonIcon}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Image Side */}
        <motion.div
          variants={fadeUp}
          className="w-full lg:w-[45%] lg:flex-none min-w-0 max-w-[520px] lg:max-w-none"
        >
          <div className="relative rounded-[28px] overflow-hidden shadow-2xl group">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-[300px] lg:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle overlay gradient at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// --- Stats Bar ---
const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center py-2">
    <h3 className="text-4xl font-black text-[#1a1a1a] mb-1">{value}</h3>
    <p className="text-gray-500 font-medium text-sm">{label}</p>
  </div>
);

const Home = () => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [testimonials, setTestimonials] = React.useState([]);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/user/public-praises');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          const fallback = t('home.testimonials.reviews', { returnObjects: true }) || [];
          setTestimonials(fallback);
        }
      } catch {
        const fallback = t('home.testimonials.reviews', { returnObjects: true }) || [];
        setTestimonials(fallback);
      }
    };
    fetchTestimonials();
  }, [t, i18n.language]);

  return (
    <div className="min-h-screen font-sans bg-[#fbfbfb] selection:bg-viet-green selection:text-white">

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="relative pt-[120px] lg:pt-[160px] pb-20 overflow-hidden bg-gradient-to-b from-[#f4faef] to-[#fbfbfb]">
        <FallingChemistry />
        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          >
            {/* Left */}
            <div className="w-full lg:w-[55%] lg:flex-none text-center lg:text-left min-w-0">
              <motion.h1
                variants={fadeUp}
                className="font-rubik text-[clamp(2.2rem,4.5vw+0.8rem,4rem)] font-black text-[#1a1a1a] leading-[1.08] tracking-tight mb-4 text-balance"
              >
                <span className="whitespace-normal md:whitespace-nowrap">{t('home.hero_title')}</span> <br />
                <span className="text-viet-green">{t('home.hero_title_highlight')}</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-xl text-gray-500 mb-8 max-w-xl mx-auto lg:mx-0 font-medium text-balance">
                {t('home.hero_statement')}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/classroom"
                  className="bg-viet-green hover:bg-[#65a32e] hover:scale-105 transition-all text-white text-lg font-black px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-[0_4px_20px_0_rgba(118,192,52,0.4)]"
                >
                  {t('home.enter_classroom')}
                  <Play size={20} className="fill-current" />
                </Link>
                <Link
                  to="/lab"
                  className="bg-white text-[#1a1a1a] hover:bg-gray-50 hover:scale-105 transition-all text-lg font-black px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-md border border-gray-100"
                >
                  {t('home.enter_lab')}
                  <FlaskConical size={20} />
                </Link>
              </motion.div>
            </div>

            {/* Right — Hero Image */}
            <motion.div variants={fadeUp} className="w-full lg:w-[45%] lg:flex-none max-w-[520px] lg:max-w-none">
              <div className="relative rounded-[32px] overflow-hidden shadow-[0_30px_80px_0_rgba(0,0,0,0.18)] group">
                <img
                  src="/assets/images/home-viet-journey.png"
                  alt={t('home.hero_image_alt')}
                  className="w-full h-[360px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────── */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-[900px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <StatItem value={t('home.stats.students_count')} label={t('home.stats.students_label')} />
          <StatItem value={t('home.stats.schools_count')} label={t('home.stats.schools_label')} />
          <StatItem value={t('home.stats.lessons_count')} label={t('home.stats.lessons_label')} />
        </div>
      </section>

      {/* ─── FEATURE ROWS ────────────────────────────────── */}

      {/* 1. Lộ trình học tập — image right */}
      <FeatureRow
        badge={t('home.features.journey.badge')}
        badgeColor="text-viet-green"
        title={t('home.features.journey.title')}
        titleHighlight={t('home.features.journey.highlight')}
        highlightColor="text-viet-green"
        description={t('home.features.journey.desc_long')}
        buttonText={t('home.features.journey.link')}
        buttonUrl="/classroom"
        buttonIcon={<BookOpen size={16} />}
        imageSrc="/assets/images/home-viet-journey.png"
        imageAlt={t('home.features.journey.image_alt')}
        imageRight={true}
        bgClass="bg-white"
      />

      {/* 2. Phòng thí nghiệm — image left */}
      <FeatureRow
        badge={t('home.features.lab.badge')}
        badgeColor="text-blue-500"
        title={t('home.features.lab.title')}
        titleHighlight={t('home.features.lab.highlight')}
        highlightColor="text-blue-500"
        description={t('home.features.lab.desc_long')}
        buttonText={t('home.features.lab.link')}
        buttonUrl="/lab"
        buttonIcon={<FlaskConical size={16} />}
        imageSrc="/assets/images/home-viet-lab.png"
        imageAlt={t('home.features.lab.image_alt')}
        imageRight={false}
        bgClass="bg-[#f8f9fa]"
      />

      {/* 3. Đấu trường — image right */}
      <FeatureRow
        badge={t('home.features.arena.badge')}
        badgeColor="text-purple-600"
        title={t('home.features.arena.title')}
        titleHighlight={t('home.features.arena.highlight')}
        highlightColor="text-purple-600"
        description={t('home.features.arena.desc_long')}
        buttonText={t('home.features.arena.link')}
        buttonUrl="/arena"
        buttonIcon={<Trophy size={16} />}
        imageSrc="/assets/images/home-viet-arena.png"
        imageAlt={t('home.features.arena.image_alt')}
        imageRight={true}
        bgClass="bg-white"
      />

      {/* 4. Hành trình — image left */}
      <FeatureRow
        badge={t('home.features.map.badge')}
        badgeColor="text-amber-500"
        title={t('home.features.map.title')}
        titleHighlight={t('home.features.map.highlight')}
        highlightColor="text-amber-500"
        description={t('home.features.map.desc')}
        buttonText={t('home.features.map.link')}
        buttonUrl="/classroom"
        buttonIcon={<Map size={16} />}
        imageSrc="/assets/images/home-viet-map.png"
        imageAlt={t('home.features.map.image_alt')}
        imageRight={false}
        bgClass="bg-[#f4faef]"
      />

      {/* 5. Bài giảng tương tác — image right */}
      <FeatureRow
        badge={t('home.features.lessons.badge')}
        badgeColor="text-viet-green"
        title={t('home.features.lessons.title')}
        titleHighlight={t('home.features.lessons.highlight')}
        highlightColor="text-viet-green"
        description={t('home.features.lessons.desc')}
        buttonText={t('home.features.lessons.link')}
        buttonUrl="/classroom"
        buttonIcon={<BookOpen size={16} />}
        imageSrc="/assets/images/home-viet-lessons.png"
        imageAlt={t('home.features.lessons.image_alt')}
        imageRight={true}
        bgClass="bg-white"
      />

      {/* ─── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-24 bg-[#f8f9fa] overflow-hidden border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-black text-viet-green uppercase tracking-widest text-sm mb-3 block">
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13 }}
                className="bg-white p-8 rounded-3xl border-2 border-duo-border border-b-4 hover:-translate-y-2 transition-transform flex flex-col h-full shadow-sm"
              >
                <div className="flex text-amber-400 mb-4">
                  {[...Array(review.rating || 5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-[15px] font-medium text-[#1a1a1a] mb-6 italic flex-1">"{review.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f4faef] rounded-full border-2 border-duo-border flex items-center justify-center font-black text-viet-green text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#1a1a1a]">{review.name}</h4>
                    <span className="text-xs text-gray-400 font-medium">{review.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEADERBOARD ─────────────────────────────────── */}
      <div className="bg-[#f4faef] py-20 border-t-2 border-duo-border">
        <LeaderboardSection />
      </div>

      {/* ─── FINAL CTA ───────────────────────────────────── */}
      {!isLoggedIn && (
        <section className="py-24 bg-viet-green relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/icons.svg')] bg-repeat bg-[length:100px_100px]" />
          <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
            <h2 className="font-rubik text-4xl md:text-5xl font-black text-white mb-4">
              {t('home.final_cta.title')}
            </h2>
            <p className="text-lg text-white/90 font-medium mb-10 max-w-xl mx-auto">
              {t('home.final_cta.subtitle')}
            </p>
            <Link
              to="/login"
              className="bg-white text-viet-green hover:bg-gray-50 hover:scale-105 transition-all text-lg font-black px-10 py-5 rounded-full inline-flex items-center justify-center gap-3 shadow-lg"
            >
              {t('home.final_cta.button')}
              <Zap className="fill-current" size={20} />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;
