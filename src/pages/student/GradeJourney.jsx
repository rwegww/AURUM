import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, FlaskConical, Lock, Compass, Trophy, 
  Sparkles, BookOpen, ArrowRight, HelpCircle, 
  CheckCircle2, Beaker, GraduationCap 
} from 'lucide-react';
import InfographicBook from '@/components/lessons/InfographicBook';
import PlacementTestModal from '@/components/lessons/PlacementTestModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

// Expanded Class Themes for a spectacular look
const CLASS_THEMES = {
  '8': {
    titleKey: 'journey.themes.8.title',
    subtitleKey: 'journey.themes.8.subtitle',
    primary: 'rgb(118, 192, 52)',      // viet-green (#76c034)
    primaryLight: 'rgba(118, 192, 52, 0.1)',
    primaryGlow: 'rgba(118, 192, 52, 0.4)',
    gradient: 'from-[#76c034] to-[#589d24]',
    blobColor: 'bg-emerald-400',
    doodleSymbol: '🧪'
  },
  '9': {
    titleKey: 'journey.themes.9.title',
    subtitleKey: 'journey.themes.9.subtitle',
    primary: 'rgb(99, 102, 241)',      // indigo-500
    primaryLight: 'rgba(99, 102, 241, 0.1)',
    primaryGlow: 'rgba(99, 102, 241, 0.4)',
    gradient: 'from-indigo-500 to-purple-600',
    blobColor: 'bg-indigo-400',
    doodleSymbol: '⚡'
  },
  '10': {
    titleKey: 'journey.themes.10.title',
    subtitleKey: 'journey.themes.10.subtitle',
    primary: 'rgb(20, 184, 166)',      // teal-500
    primaryLight: 'rgba(20, 184, 166, 0.1)',
    primaryGlow: 'rgba(20, 184, 166, 0.4)',
    gradient: 'from-teal-500 to-emerald-600',
    blobColor: 'bg-teal-400',
    doodleSymbol: '⚛️'
  },
  '11': {
    titleKey: 'journey.themes.11.title',
    subtitleKey: 'journey.themes.11.subtitle',
    primary: 'rgb(244, 63, 94)',       // rose-500
    primaryLight: 'rgba(244, 63, 94, 0.1)',
    primaryGlow: 'rgba(244, 63, 94, 0.4)',
    gradient: 'from-rose-500 to-pink-600',
    blobColor: 'bg-rose-400',
    doodleSymbol: '🧬'
  },
  '12': {
    titleKey: 'journey.themes.12.title',
    subtitleKey: 'journey.themes.12.subtitle',
    primary: 'rgb(245, 158, 11)',      // amber-500
    primaryLight: 'rgba(245, 158, 11, 0.1)',
    primaryGlow: 'rgba(245, 158, 11, 0.4)',
    gradient: 'from-amber-500 to-orange-600',
    blobColor: 'bg-amber-400',
    doodleSymbol: '☢️'
  }
};

const CHEMICAL_DOODLES = [
  { symbol: 'H₂O', name: 'Nước', x: '8%', y: '15%' },
  { symbol: 'CO₂', name: 'Cacbon đioxit', x: '88%', y: '25%' },
  { symbol: 'O₂', name: 'Oxy', x: '5%', y: '45%' },
  { symbol: 'NaCl', name: 'Muối ăn', x: '92%', y: '55%' },
  { symbol: 'H₂', name: 'Hiđro', x: '7%', y: '70%' },
  { symbol: 'HCl', name: 'Axit clohiđric', x: '89%', y: '80%' },
  { symbol: 'NH₃', name: 'Amoniac', x: '4%', y: '90%' },
  { symbol: 'CH₄', name: 'Metan', x: '91%', y: '12%' },
];

const GradeJourney = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);

  const activeTheme = CLASS_THEMES[grade] || CLASS_THEMES['8'];

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`/api/lessons?classId=${grade}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Lỗi server (${res.status}): ${text.substring(0, 100)}`);
        }
        const data = await res.json();
        setLessons(data.slice(0, 12));
      } catch (err) {
        console.error('Lỗi tải hành trình:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [grade]);

  // Save/Restore scroll position logic...
  useEffect(() => {
    const handleScroll = () => {
      if (!loading) sessionStorage.setItem(`scroll-pos-grade-${grade}`, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [grade, loading]);

  useLayoutEffect(() => {
    if (!loading) {
      const savedPos = sessionStorage.getItem(`scroll-pos-grade-${grade}`);
      if (savedPos) setTimeout(() => window.scrollTo(0, parseInt(savedPos, 10)), 100);
    }
  }, [loading, grade]);

  const handleStageClick = (lesson, index, isLocked) => {
    if (isLocked) return;
    
    const lessonStars = user?.balancingProgress?.lessonStars?.[lesson.lessonId] || { level1: 0, level2: 0, level3: 0 };
    let targetLevel = 'level1';
    
    if (lessonStars.level1 > 0 && lessonStars.level2 === 0) targetLevel = 'level2';
    else if (lessonStars.level1 > 0 && lessonStars.level2 > 0 && lessonStars.level3 === 0) targetLevel = 'level3';
    else if (lessonStars.level1 > 0 && lessonStars.level2 > 0 && lessonStars.level3 > 0) targetLevel = 'level3';

    navigate(`/classroom/${grade}/journey/${lesson.lessonId}/quiz?level=${targetLevel}&order=${index + 1}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-dashed rounded-full animate-[spin_8s_linear_infinite]" style={{ borderColor: activeTheme.primary }} />
        <div className="text-3xl animate-bounce">{activeTheme.doodleSymbol}</div>
      </div>
      <p className="mt-4 font-black uppercase tracking-[4px] text-viet-text-light text-xs animate-pulse">Khai mở bản đồ...</p>
    </div>
  );

  const isFirstLessonDefaultUnlocked = grade === '8';
  const isGradePassed = user?.balancingProgress?.passedGrades?.includes(grade);

  const lessonsStatus = lessons.map((lesson, index) => {
    const prevLessonStars = index > 0 
      ? (user?.balancingProgress?.lessonStars?.[lessons[index - 1].lessonId] || { level1: 0, level2: 0, level3: 0 })
      : null;
    const previousLessonFullyCompleted = prevLessonStars 
      ? (prevLessonStars.level1 > 0 && prevLessonStars.level2 > 0 && prevLessonStars.level3 > 0)
      : false;
    
    const currentLessonStars = user?.balancingProgress?.lessonStars?.[lesson.lessonId] || { level1: 0, level2: 0, level3: 0 };
    const isCompleted = currentLessonStars.level1 > 0 && currentLessonStars.level2 > 0 && currentLessonStars.level3 > 0;
    
    const isUnlocked = user?.role === 'admin' || user?.role === 'teacher' || (index === 0 && (isFirstLessonDefaultUnlocked || isGradePassed)) || previousLessonFullyCompleted || isCompleted;
    return {
      ...lesson,
      isUnlocked,
      isCompleted,
      stars: currentLessonStars
    };
  });

  let highestUnlockedIndex = 0;
  lessonsStatus.forEach((lesson, index) => {
    if (lesson.isUnlocked) {
      highestUnlockedIndex = index;
    }
  });

  const progressPercentage = lessonsStatus.length > 1 
    ? (highestUnlockedIndex / (lessonsStatus.length - 1)) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-28 pb-20 overflow-x-hidden relative">
      
      {/* Colored radial background blobs */}
      <div className={`absolute top-20 left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[150px] opacity-[0.08] pointer-events-none z-0 ${activeTheme.blobColor}`} />
      <div className={`absolute bottom-40 right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[150px] opacity-[0.08] pointer-events-none z-0 ${activeTheme.blobColor}`} />

      {/* Floating chemistry bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/40 border border-slate-200/50 shadow-inner animate-[floatUp_8s_ease-in-out_infinite]"
            style={{
              width: `${Math.random() * 30 + 15}px`,
              height: `${Math.random() * 30 + 15}px`,
              left: `${Math.random() * 90 + 5}%`,
              bottom: `-50px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 10 + 8}s`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          />
        ))}
      </div>

      {/* Floating Chemical Doodles */}
      {CHEMICAL_DOODLES.map((doodle, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0.3, 0.6, 0.3], y: [-5, 5, -5] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-0 select-none hidden lg:flex flex-col items-center p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm"
          style={{ left: doodle.x, top: doodle.y }}
        >
          <span className="text-[12px] font-black text-slate-400 font-mono tracking-widest">{doodle.symbol}</span>
          <span className="text-[8px] font-bold text-slate-400/70 uppercase mt-0.5 tracking-wider">{doodle.name}</span>
        </motion.div>
      ))}

      <div className="max-w-4xl mx-auto px-6 relative z-10">

        {/* Header Section */}
        <header className="text-center mb-20 relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span 
              className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[3px] shadow-sm border border-slate-200/50 bg-white"
              style={{ color: activeTheme.primary }}
            >
              {t('journey.badge', { grade })}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-viet-text mt-4 mb-2 tracking-tight italic uppercase font-sora">
              {activeTheme.titleKey ? t(activeTheme.titleKey) : activeTheme.title}
            </h1>
            <p className="text-viet-text-light font-bold text-lg max-w-xl mx-auto leading-relaxed">
              {activeTheme.subtitleKey ? t(activeTheme.subtitleKey) : activeTheme.subtitle}
            </p>
          </motion.div>
        </header>

        {/* Journey Map Path */}
        <div className="relative min-h-[500px]">

          {/* Placement Test Banner */}
          {grade !== '8' && lessons.length > 0 && !user?.balancingProgress?.passedGrades?.includes(grade) && !user?.unlockedLessons?.includes(lessons[0].lessonId) && user?.role === 'student' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12 relative z-10">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[36px] p-8 md:p-10 text-white shadow-2xl overflow-hidden relative border border-slate-800 group">
                {/* Hologram details */}
                <div className="absolute inset-0 opacity-[0.03] bg-grid-white" />
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform select-none">
                  <span className="text-[140px] font-black italic">{t('journey.test_banner.bg_text')}</span>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="max-w-[480px]">
                    <span className="px-3.5 py-1.5 bg-indigo-500/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 text-indigo-400 shadow-sm flex items-center gap-1.5 w-fit">
                      <GraduationCap size={12} />
                      {t('journey.test_banner.badge')}
                    </span>
                    <h2 className="text-3xl font-black font-sora mt-4 mb-3 uppercase tracking-tight leading-tight">
                      {t('journey.test_banner.title', { grade })}
                    </h2>
                    <p className="text-slate-300 font-medium text-sm leading-relaxed">
                      {t('journey.test_banner.description', { grade })}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTestOpen(true)}
                    className="bg-white text-indigo-950 px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 shrink-0 self-start md:self-auto"
                  >
                    <span>{t('journey.test_banner.button')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lessons Timeline List */}
          <div className="flex flex-col gap-12 relative z-10">
            {/* Timeline vertical track */}
            <div className="absolute left-[20px] top-[32px] bottom-[32px] w-[4px] bg-slate-200/80 rounded-full z-0 overflow-hidden">
              <div 
                className="w-full rounded-full transition-all duration-1000"
                style={{ 
                  height: `${progressPercentage}%`,
                  backgroundColor: activeTheme.primary,
                  boxShadow: `0 0 12px ${activeTheme.primaryGlow}`
                }}
              />
            </div>

            {lessonsStatus.map((lesson, index) => {
              const isLocked = !lesson.isUnlocked;
              const isCompleted = lesson.isCompleted;
              const lessonStars = lesson.stars;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="relative flex gap-6 md:gap-8 items-start w-full"
                >
                  {/* Molecular Orbit Central Node */}
                  <div className="w-10 flex-shrink-0 flex justify-center pt-3 relative">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      
                      {/* Electron Orbits */}
                      {!isLocked && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div 
                            className="absolute inset-[-6px] rounded-full border border-dashed animate-[spin_10s_linear_infinite]" 
                            style={{ borderColor: activeTheme.primary, opacity: 0.35 }}
                          />
                          <div 
                            className="absolute inset-[-12px] rounded-full border border-dotted animate-[spin_16s_linear_infinite_reverse]" 
                            style={{ borderColor: activeTheme.primary, opacity: 0.2 }}
                          />
                          {/* Subatomic orbital electron */}
                          <div 
                            className="absolute top-[-7px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-lg animate-pulse"
                            style={{ 
                              backgroundColor: activeTheme.primary,
                              boxShadow: `0 0 8px ${activeTheme.primary}` 
                            }} 
                          />
                        </div>
                      )}

                      {/* Main node bubble */}
                      <div 
                        className={`w-10 h-10 rounded-[14px] border-2 flex items-center justify-center shadow-sm z-10 transition-all ${
                          isLocked 
                            ? 'border-slate-200 bg-slate-100' 
                            : 'bg-white group-hover:scale-105'
                        }`}
                        style={{ 
                          borderColor: isLocked ? '#e2e8f0' : activeTheme.primary,
                          boxShadow: !isLocked ? `0 4px 12px -2px ${activeTheme.primaryGlow}` : 'none'
                        }}
                      >
                        <span 
                          className="text-xs font-black font-mono leading-none"
                          style={{ color: isLocked ? '#cbd5e1' : activeTheme.primary }}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage Card */}
                  <div 
                    onClick={() => !isLocked && handleStageClick(lesson, index, isLocked)}
                    className={`group relative flex-1 bg-white rounded-[24px] p-6 transition-all border-2 shadow-sm flex flex-col md:flex-row gap-6 justify-between overflow-hidden ${
                      isLocked 
                        ? 'border-slate-200 bg-slate-50/50 cursor-not-allowed opacity-50' 
                        : 'hover:scale-[1.01] cursor-pointer hover:shadow-xl hover:border-slate-200/85 active:scale-[0.99]'
                    }`}
                    style={{ 
                      borderColor: isLocked ? 'rgb(226, 232, 240)' : 'transparent',
                      boxShadow: !isLocked ? '0 10px 30px -10px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {/* Tactile left border on active */}
                    {!isLocked && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2" 
                        style={{ backgroundColor: activeTheme.primary }} 
                      />
                    )}

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <span 
                          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border bg-slate-50"
                          style={{ 
                            color: isLocked ? '#94a3b8' : activeTheme.primary,
                            borderColor: isLocked ? '#e2e8f0' : activeTheme.primaryLight
                          }}
                        >
                          {t('journey.stage.label', { order: index + 1 })}
                        </span>
                        {isLocked ? (
                          <Lock size={12} className="text-slate-300" />
                        ) : (
                          isCompleted ? (
                            <Trophy size={14} className="text-amber-500 animate-pulse" />
                          ) : (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeTheme.primary }} />
                              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: activeTheme.primary }} />
                            </span>
                          )
                        )}
                      </div>

                      <h3 className={`text-[17px] font-black leading-snug tracking-tight mb-2 font-sora ${
                        isLocked ? 'text-slate-400' : 'text-slate-800 group-hover:text-slate-900'
                      }`}>
                        {lesson.title.split(': ').pop()}
                      </h3>

                      <p className={`text-[13.5px] leading-relaxed mb-4 font-medium ${
                        isLocked ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {isLocked ? t('journey.stage.locked_desc') : (lesson.description || t('journey.stage.default_desc'))}
                      </p>

                      {/* segment status trackers */}
                      {!isLocked && (
                        <div className="flex items-center gap-3 mt-auto">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Tiến độ:</span>
                          <div className="flex gap-1.5 h-2.5 w-32 bg-slate-100 p-0.5 rounded-full border border-slate-200/50">
                            {['level1', 'level2', 'level3'].map((lvl, i) => {
                              const starsCount = lessonStars[lvl] || 0;
                              return (
                                <div 
                                  key={lvl} 
                                  className="flex-1 rounded-full transition-all duration-700 relative overflow-hidden"
                                  style={{ 
                                    backgroundColor: starsCount > 0 ? activeTheme.primary : 'rgb(241, 245, 249)',
                                    boxShadow: starsCount > 0 ? `0 0 6px ${activeTheme.primaryGlow}` : 'none'
                                  }}
                                >
                                  {/* Sparkle shine on complete */}
                                  {starsCount > 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive CTA Arrow */}
                    {!isLocked && (
                      <div className="flex items-center justify-end md:self-center shrink-0 mt-4 md:mt-0">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.primary})`,
                            boxShadow: `0 4px 14px ${activeTheme.primaryGlow}`
                          }}
                        >
                          <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Book Milestone — Final Timeline Node */}
            {(() => {
              const lesson1Stars = lessons.length > 0 
                ? (user?.balancingProgress?.lessonStars?.[lessons[0].lessonId] || { level1: 0, level2: 0, level3: 0 })
                : { level1: 0, level2: 0, level3: 0 };
              const isLesson1Complete = lesson1Stars.level1 > 0 && lesson1Stars.level2 > 0 && lesson1Stars.level3 > 0;
              const canOpenBook = isLesson1Complete || user?.role === 'admin' || user?.role === 'teacher';

              return (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`relative flex gap-6 md:gap-8 items-start w-full ${!canOpenBook ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                >
                  {/* Molecular Orbit Central Node — Special Book Node */}
                  <div className="w-10 flex-shrink-0 flex justify-center pt-3 relative">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      {canOpenBook && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div 
                            className="absolute inset-[-6px] rounded-full border-2 border-dashed animate-[spin_8s_linear_infinite]" 
                            style={{ borderColor: activeTheme.primary, opacity: 0.5 }}
                          />
                          <div 
                            className="absolute inset-[-12px] rounded-full border border-dotted animate-[spin_14s_linear_infinite_reverse]" 
                            style={{ borderColor: activeTheme.primary, opacity: 0.25 }}
                          />
                          <div 
                            className="absolute top-[-7px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-lg animate-pulse"
                            style={{ backgroundColor: activeTheme.primary, boxShadow: `0 0 8px ${activeTheme.primary}` }} 
                          />
                        </div>
                      )}
                      <div 
                        className={`w-10 h-10 rounded-[14px] border-2 flex items-center justify-center shadow-sm z-10 transition-all ${
                          !canOpenBook ? 'border-slate-200 bg-slate-100' : 'bg-white'
                        }`}
                        style={{ 
                          borderColor: !canOpenBook ? '#e2e8f0' : activeTheme.primary,
                          boxShadow: canOpenBook ? `0 4px 12px -2px ${activeTheme.primaryGlow}` : 'none'
                        }}
                      >
                        <BookOpen 
                          size={16} 
                          style={{ color: !canOpenBook ? '#cbd5e1' : activeTheme.primary }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Book Milestone Card — same pattern as lesson cards */}
                  <div 
                    onClick={() => canOpenBook && setIsBookOpen(true)}
                    className={`group relative flex-1 rounded-[24px] p-6 transition-all border-2 shadow-sm overflow-hidden flex flex-col md:flex-row gap-6 items-center ${
                      !canOpenBook 
                        ? 'border-slate-200 bg-slate-50/50 cursor-not-allowed opacity-50' 
                        : 'bg-white hover:scale-[1.01] cursor-pointer hover:shadow-xl hover:border-slate-200/85 active:scale-[0.99]'
                    }`}
                    style={{ 
                      borderColor: !canOpenBook ? 'rgb(226, 232, 240)' : 'transparent',
                      boxShadow: canOpenBook ? '0 10px 30px -10px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {/* Tactile left border */}
                    {canOpenBook && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2" 
                        style={{ backgroundColor: activeTheme.primary }} 
                      />
                    )}

                    {/* Mini 3D Book Visual */}
                    <div className="relative w-[68px] h-[92px] shrink-0 perspective-1000 preserve-3d">
                      <div 
                        className="absolute inset-0 blur-xl opacity-30 rounded-full animate-pulse"
                        style={{ backgroundColor: activeTheme.primary }} 
                      />
                      <div 
                        className={`relative w-full h-full rounded-[12px] shadow-xl flex flex-col justify-between p-2 overflow-hidden border border-white/10 transition-all duration-500 ${
                          canOpenBook ? 'group-hover:-translate-y-1 group-hover:shadow-[4px_8px_16px_rgba(0,0,0,0.3)]' : ''
                        }`}
                        style={{
                          background: canOpenBook 
                            ? `linear-gradient(135deg, ${activeTheme.primary} 0%, #0f172a 100%)`
                            : 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)',
                        }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/35 border-r border-white/5 z-20 rounded-l-[12px]" />
                        <div className={`absolute inset-1 border rounded-[8px] pointer-events-none z-10 ${canOpenBook ? 'border-amber-500/25' : 'border-slate-400/20'}`} />
                        {canOpenBook && (
                          <div className="absolute bottom-[-3px] left-4 w-1.5 h-3 bg-rose-500 rounded-b-sm shadow-md z-0" />
                        )}
                        <div className="my-auto mx-auto text-center relative z-10">
                          <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">
                            {canOpenBook ? activeTheme.doodleSymbol : '🔒'}
                          </span>
                        </div>
                        <div className={`w-full text-center text-[6px] font-black uppercase tracking-widest relative z-10 select-none ${canOpenBook ? 'text-amber-300/90' : 'text-slate-400'}`}>
                          {t('journey.milestone.book_label')}
                        </div>
                      </div>
                      {canOpenBook && (
                        <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg animate-bounce border border-white uppercase tracking-wider z-30">
                          {t('journey.milestone.book_badge')}
                        </div>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <span 
                          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border bg-slate-50"
                          style={{ 
                            color: !canOpenBook ? '#94a3b8' : activeTheme.primary,
                            borderColor: !canOpenBook ? '#e2e8f0' : activeTheme.primaryLight
                          }}
                        >
                          CỘT MỐC
                        </span>
                        {canOpenBook && (
                          <Sparkles size={14} className="text-amber-500 animate-pulse" />
                        )}
                      </div>
                      <h3 className={`text-[17px] font-black leading-snug tracking-tight mb-1.5 font-sora ${
                        !canOpenBook ? 'text-slate-400' : 'text-slate-800 group-hover:text-slate-900'
                      }`}>
                        {canOpenBook ? t('journey.milestone.title') : 'Hoàn thành chặng 1 để mở'}
                      </h3>
                      <p className={`text-[13px] leading-relaxed font-medium ${
                        !canOpenBook ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {t('journey.milestone.subtitle', { grade })}
                      </p>
                    </div>

                    {/* CTA Arrow — same as lesson cards */}
                    {canOpenBook && (
                      <div className="flex items-center justify-end md:self-center shrink-0 mt-4 md:mt-0">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.primary})`,
                            boxShadow: `0 4px 14px ${activeTheme.primaryGlow}`
                          }}
                        >
                          <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isBookOpen && (
          <InfographicBook 
            isOpen={isBookOpen} 
            onClose={() => setIsBookOpen(false)} 
            lessons={lessons} 
            grade={grade} 
            unlockedLessons={user?.unlockedLessons} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTestOpen && (
          <PlacementTestModal 
            isOpen={isTestOpen} 
            onClose={() => setIsTestOpen(false)} 
            grade={grade} 
            firstLessonId={lessons[0]?.lessonId} 
            onPass={() => setIsTestOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Embedded CSS custom keyframes for float up and shimmers */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-80vh) scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default GradeJourney;
