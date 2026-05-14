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
      {/* Decorative Lab Grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-dashed rounded-full animate-[spin_8s_linear_infinite]" style={{ borderColor: activeTheme.primary }} />
        <div className="text-3xl animate-bounce">{activeTheme.doodleSymbol}</div>
      </div>
      <p className="mt-4 font-black uppercase tracking-[4px] text-viet-text-light text-xs animate-pulse">Khai mở bản đồ...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-28 pb-20 overflow-x-hidden relative">
      {/* Premium background overlays */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />
      
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
          
          {/* DNA Double Helix SVG Path Winding down the middle */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-32 pointer-events-none z-0">
            <svg className="w-full h-full opacity-[0.15]" preserveAspectRatio="none" viewBox="0 0 128 1000">
              {/* Helix strand A */}
              <path 
                d="M 64,0 Q 128,100 64,200 Q 0,300 64,400 Q 128,500 64,600 Q 0,700 64,800 Q 128,900 64,1000" 
                fill="none" 
                stroke={activeTheme.primary} 
                strokeWidth="4" 
                strokeDasharray="6,6"
              />
              {/* Helix strand B */}
              <path 
                d="M 64,0 Q 0,100 64,200 Q 128,300 64,400 Q 0,500 64,600 Q 128,700 64,800 Q 0,900 64,1000" 
                fill="none" 
                stroke={activeTheme.primary} 
                strokeWidth="4"
              />
              {/* Helix connectors (rungs) */}
              {[...Array(20)].map((_, i) => {
                const y = i * 50;
                const xOffset = Math.sin((y / 200) * Math.PI) * 48;
                return (
                  <line 
                    key={i}
                    x1={64 - xOffset} 
                    y1={y} 
                    x2={64 + xOffset} 
                    y2={y} 
                    stroke={activeTheme.primary} 
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                );
              })}
            </svg>
          </div>

          {/* Placement Test Banner */}
          {grade !== '8' && lessons.length > 0 && !user?.balancingProgress?.passedGrades?.includes(grade) && !user?.unlockedLessons?.includes(lessons[0].lessonId) && user?.role === 'student' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-20 relative z-10">
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
          <div className="flex flex-col gap-20 relative z-10">
            {lessons.map((lesson, index) => {
              const isEven = index % 2 === 0;
              const isFirstLessonDefaultUnlocked = grade === '8';
              const isGradePassed = user?.balancingProgress?.passedGrades?.includes(grade);
              
              const prevLessonStars = index > 0 
                ? (user?.balancingProgress?.lessonStars?.[lessons[index - 1].lessonId] || { level1: 0, level2: 0, level3: 0 })
                : null;
              const previousLessonFullyCompleted = prevLessonStars 
                ? (prevLessonStars.level1 > 0 && prevLessonStars.level2 > 0 && prevLessonStars.level3 > 0)
                : false;
              
              const currentLessonStars = user?.balancingProgress?.lessonStars?.[lesson.lessonId] || { level1: 0, level2: 0, level3: 0 };
              const isCompleted = currentLessonStars.level1 > 0 && currentLessonStars.level2 > 0 && currentLessonStars.level3 > 0;
              
              const isUnlocked = user?.role === 'admin' || user?.role === 'teacher' || (index === 0 && (isFirstLessonDefaultUnlocked || isGradePassed)) || previousLessonFullyCompleted || isCompleted;
              const isLocked = !isUnlocked;

              const lessonStars = currentLessonStars;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className={`flex items-center w-full ${isEven ? 'flex-row' : 'flex-row-reverse'} ${isLocked ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                >
                  {/* Stage Card */}
                  <div className={`w-[42%] flex ${isEven ? 'justify-end' : 'justify-start'}`}>
                    <button
                      onClick={() => handleStageClick(lesson, index, isLocked)}
                      className={`group relative ${isLocked ? 'cursor-not-allowed' : ''} text-left`}
                      disabled={isLocked}
                    >
                      <div 
                        className={`bg-white rounded-[28px] p-6 w-full max-w-[300px] transition-all border-2 shadow-sm relative overflow-hidden flex flex-col justify-between ${
                          isLocked 
                            ? 'border-slate-200 bg-slate-50' 
                            : 'hover:scale-[1.03] cursor-pointer hover:shadow-xl hover:-translate-y-1'
                        }`}
                        style={{ 
                          borderColor: isLocked ? 'rgb(226, 232, 240)' : 'transparent',
                          boxShadow: !isLocked ? '0 10px 30px -10px rgba(0,0,0,0.05)' : 'none'
                        }}
                      >
                        {/* Tactile border on active */}
                        {!isLocked && (
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2" 
                            style={{ backgroundColor: activeTheme.primary }} 
                          />
                        )}

                        <div className="flex justify-between items-center mb-3">
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
                              <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeTheme.primary }} />
                            )
                          )}
                        </div>

                        <h3 className={`text-[15px] font-black leading-snug transition-colors mb-4 ${
                          isLocked ? 'text-slate-400' : 'text-slate-800 group-hover:text-slate-900 font-sora'
                        }`}>
                          {lesson.title.split(': ').pop()}
                        </h3>

                        {/* segment status trackers */}
                        {!isLocked && (
                          <div className="flex gap-1.5 h-2 w-full mt-auto bg-slate-50 p-0.5 rounded-full border border-slate-100">
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
                        )}
                      </div>
                      
                      {/* Floating tooltip on hover */}
                      {!isLocked && (
                        <div 
                          className={`absolute top-1/2 -translate-y-1/2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-30 pointer-events-none border text-white ${
                            isEven 
                              ? '-left-6 -translate-x-full group-hover:-translate-x-[90%]' 
                              : '-right-6 translate-x-full group-hover:translate-x-[90%]'
                          }`}
                          style={{ 
                            backgroundColor: activeTheme.primary,
                            borderColor: activeTheme.primaryGlow
                          }}
                        >
                          {lessonStars.level1 === 0 ? 'Bắt đầu: Video + Học' : (lessonStars.level2 === 0 ? 'Tiếp tục: Hiểu' : (lessonStars.level3 === 0 ? 'Tiếp tục: Ôn tập' : 'Làm lại ôn tập'))}
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Molecular Orbit Central Node */}
                  <div className="w-[16%] flex justify-center relative">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      
                      {/* Electron Orbits */}
                      {!isLocked && (
                        <div className="absolute inset-0 pointer-events-none z-0">
                          <div 
                            className="absolute inset-[-6px] rounded-full border-2 border-dashed animate-[spin_10s_linear_infinite]" 
                            style={{ borderColor: activeTheme.primary, opacity: 0.35 }}
                          />
                          <div 
                            className="absolute inset-[-14px] rounded-full border border-dotted animate-[spin_16s_linear_infinite_reverse]" 
                            style={{ borderColor: activeTheme.primary, opacity: 0.2 }}
                          />
                          {/* Subatomic orbital electron */}
                          <div 
                            className="absolute top-[-9px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full shadow-lg"
                            style={{ 
                              backgroundColor: activeTheme.primary,
                              boxShadow: `0 0 10px ${activeTheme.primary}` 
                            }} 
                          />
                        </div>
                      )}

                      {/* Main node bubble */}
                      <div 
                        className={`w-12 h-12 rounded-[18px] border-4 flex items-center justify-center shadow-md z-20 transition-all ${
                          isLocked 
                            ? 'border-slate-200 bg-slate-100' 
                            : 'bg-white cursor-pointer hover:scale-115 active:scale-95'
                        }`}
                        style={{ 
                          borderColor: isLocked ? '#e2e8f0' : activeTheme.primary,
                          boxShadow: !isLocked ? `0 10px 20px -5px ${activeTheme.primaryGlow}` : 'none'
                        }}
                      >
                        <span 
                          className="text-[14px] font-black font-mono leading-none"
                          style={{ color: isLocked ? '#cbd5e1' : activeTheme.primary }}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description side */}
                  <div className="w-[42%] px-6">
                    <p className={`text-[13px] font-medium leading-relaxed italic line-clamp-3 ${
                      isLocked ? 'text-slate-300' : 'text-slate-600 font-medium'
                    }`}>
                      {isLocked ? t('journey.stage.locked_desc') : (lesson.description || t('journey.stage.default_desc'))}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End Milestone Book section */}
          {(() => {
            const lesson1Stars = lessons.length > 0 
              ? (user?.balancingProgress?.lessonStars?.[lessons[0].lessonId] || { level1: 0, level2: 0, level3: 0 })
              : { level1: 0, level2: 0, level3: 0 };
            const isLesson1Complete = lesson1Stars.level1 > 0 && lesson1Stars.level2 > 0 && lesson1Stars.level3 > 0;
            const canOpenBook = isLesson1Complete || user?.role === 'admin' || user?.role === 'teacher';
            
            return (
              <div className={`mt-40 mb-20 flex flex-col items-center relative ${!canOpenBook ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                
                {/* Book Milestone */}
                <motion.button 
                  whileHover={canOpenBook ? { scale: 1.05 } : {}} 
                  whileTap={canOpenBook ? { scale: 0.95 } : {}} 
                  onClick={() => canOpenBook && setIsBookOpen(true)} 
                  className="relative group w-36 h-36 flex items-center justify-center cursor-pointer"
                >
                  {/* Radiant background glowing portal aura */}
                  <div 
                    className="absolute inset-0 blur-3xl opacity-50 transition-all duration-500 group-hover:opacity-80 rounded-full animate-pulse"
                    style={{ backgroundColor: activeTheme.primary }} 
                  />
                  
                  {/* Floating book frame */}
                  <div 
                    className={`relative w-28 h-28 bg-white rounded-3xl border-4 shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                      canOpenBook ? 'group-hover:rotate-3 group-hover:-translate-y-2' : ''
                    }`}
                    style={{ borderColor: canOpenBook ? activeTheme.primary : '#cbd5e1' }}
                  >
                    {/* Glowing background inside cover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: activeTheme.primary }}
                    />
                    
                    <div className="text-5xl drop-shadow-md select-none">{canOpenBook ? '📔' : '🔒'}</div>
                    <div 
                      className="absolute bottom-1.5 w-full text-center text-[8px] font-black uppercase tracking-widest"
                      style={{ color: canOpenBook ? activeTheme.primary : '#94a3b8' }}
                    >
                      {t('journey.milestone.book_label')}
                    </div>
                  </div>
                  
                  {/* Animated Badge indicator */}
                  {canOpenBook && (
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg animate-bounce border-2 border-white uppercase tracking-wider">
                      {t('journey.milestone.book_badge')}
                    </div>
                  )}
                </motion.button>

                <div className="mt-8 text-center max-w-sm">
                  <h3 className="text-2xl font-black text-slate-800 font-sora uppercase italic">
                    {canOpenBook ? t('journey.milestone.title') : 'Hoàn thành chặng 1 để mở'}
                  </h3>
                  <p className="text-slate-500 text-[13px] font-bold mt-2 uppercase tracking-widest">
                    {t('journey.milestone.subtitle', { grade })}
                  </p>
                </div>
              </div>
            );
          })()}
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
