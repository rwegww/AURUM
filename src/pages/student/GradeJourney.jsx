import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import InfographicBook from '@/components/lessons/InfographicBook';
import PlacementTestModal from '@/components/lessons/PlacementTestModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const GradeJourney = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);

  const theme = {
    title: t(`journey.themes.${grade}.title`),
    subtitle: t(`journey.themes.${grade}.subtitle`),
    color: grade === '8' ? 'bg-viet-green' : grade === '9' ? 'bg-indigo-500' : 'bg-blue-500'
  };

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
    navigate(`/classroom/${grade}/journey/${lesson.lessonId}/intro?order=${index + 1}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-viet-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-28 pb-20 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-6 relative">

        {/* Header Section */}
        <header className="text-center mb-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-4 py-1 bg-viet-green/10 text-viet-green text-[12px] font-black uppercase tracking-[4px] rounded-full">
              {t('journey.badge', { grade })}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-viet-text mt-4 mb-2 tracking-tight italic">
              {theme.title}
            </h1>
            <p className="text-viet-text-light font-bold text-lg">{theme.subtitle}</p>
          </motion.div>
        </header>

        {/* Winding Path */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-3 bg-viet-green/5 rounded-full" />

          {/* Placement Test Banner */}
          {grade !== '8' && lessons.length > 0 && !user?.unlockedLessons?.includes(lessons[0].lessonId) && user?.role === 'student' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-16 relative z-10">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-[32px] p-8 text-white shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <span className="text-[120px] font-black italic">{t('journey.test_banner.bg_text')}</span>
                </div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">{t('journey.test_banner.badge')}</span>
                  <h2 className="text-3xl font-black font-sora italic mt-4 mb-2 uppercase">{t('journey.test_banner.title', { grade })}</h2>
                  <p className="max-w-[500px] text-blue-100 font-medium text-sm leading-relaxed mb-8">
                    {t('journey.test_banner.description', { grade })}
                  </p>
                  <button
                    onClick={() => setIsTestOpen(true)}
                    className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3"
                  >
                    {t('journey.test_banner.button')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-16 relative z-10">
            {lessons.map((lesson, index) => {
              const isEven = index % 2 === 0;
              const isFirstLessonDefaultUnlocked = grade === '8';
              const previousLessonCompleted = index > 0 && user?.unlockedLessons?.includes(lessons[index - 1].lessonId);
              const isCompleted = user?.unlockedLessons?.includes(lesson.lessonId);
              const isUnlocked = user?.role === 'admin' || user?.role === 'teacher' || (index === 0 && isFirstLessonDefaultUnlocked) || previousLessonCompleted || isCompleted;
              const isLocked = !isUnlocked;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex items-center w-full ${isEven ? 'flex-row' : 'flex-row-reverse'} ${isLocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                >
                  <div className={`w-[42%] flex ${isEven ? 'justify-end' : 'justify-start'}`}>
                    <button
                      onClick={() => handleStageClick(lesson, index, isLocked)}
                      className={`group relative ${isLocked ? 'cursor-not-allowed' : ''}`}
                      disabled={isLocked}
                    >
                      <div className={`viet-card p-6 w-full max-w-[280px] transition-all border-2 bg-white ${isLocked ? 'border-gray-200' : 'hover:scale-105 cursor-pointer hover:border-viet-green/40'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-[10px] font-black text-viet-green uppercase tracking-widest">{t('journey.stage.label', { order: index + 1 })}</h4>
                          {isLocked && <span className="text-gray-400">🔒</span>}
                        </div>
                        <h3 className={`text-[14px] font-bold leading-tight transition-colors ${isLocked ? 'text-gray-400' : 'text-viet-text group-hover:text-viet-green'}`}>
                          {lesson.title.split(': ').pop()}
                        </h3>
                      </div>
                      {!isLocked && (
                        <div className={`absolute top-1/2 -translate-y-1/2 bg-viet-green text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${isEven ? '-left-4 -translate-x-full' : '-right-4 translate-x-full'}`}>
                          {t('journey.stage.mission')}
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="w-[16%] flex justify-center relative">
                    <div className={`w-12 h-12 bg-white rounded-2xl border-4 flex items-center justify-center shadow-xl z-20 transition-all ${isLocked ? 'border-gray-200 grayscale' : 'border-viet-green group cursor-pointer hover:scale-125'}`}>
                      <span className={`text-[14px] font-black ${isLocked ? 'text-gray-300' : 'text-viet-green'}`}>{index + 1}</span>
                    </div>
                  </div>

                  <div className="w-[42%] px-6">
                    <p className={`text-[13px] font-medium italic line-clamp-3 ${isLocked ? 'text-gray-300' : 'text-viet-text-light'}`}>
                      {isLocked ? t('journey.stage.locked_desc') : (lesson.description || t('journey.stage.default_desc'))}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End Milestone */}
          <div className="mt-40 mb-20 flex flex-col items-center">
            <motion.button whileHover={{ scale: 1.1, rotate: [-2, 2, -2] }} whileTap={{ scale: 0.9 }} onClick={() => setIsBookOpen(true)} className="relative group w-32 h-32 flex items-center justify-center cursor-pointer">
              <div className="absolute inset-0 bg-viet-green/20 blur-3xl group-hover:bg-viet-green/40 transition-all rounded-full" />
              <div className="relative w-24 h-24 bg-white rounded-2xl border-4 border-viet-green shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-transform group-hover:rotate-6">
                <div className="text-5xl">📖</div>
                <div className="absolute bottom-1 w-full text-center text-[10px] font-black text-viet-green/40 uppercase tracking-widest">{t('journey.milestone.book_label')}</div>
              </div>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce">{t('journey.milestone.book_badge')}</div>
            </motion.button>
            <div className="mt-8 text-center">
              <h3 className="text-xl font-black text-viet-text font-sora">{t('journey.milestone.title')}</h3>
              <p className="text-viet-text-light/60 text-[13px] font-bold mt-1 uppercase tracking-widest">{t('journey.milestone.subtitle', { grade })}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Modals... */}
      <AnimatePresence>
        {isBookOpen && <InfographicBook isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} lessons={lessons} grade={grade} unlockedLessons={user?.unlockedLessons} />}
      </AnimatePresence>
      <AnimatePresence>
        {isTestOpen && (
          <PlacementTestModal isOpen={isTestOpen} onClose={() => setIsTestOpen(false)} grade={grade} firstLessonId={lessons[0]?.lessonId} onPass={() => setIsTestOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GradeJourney;
