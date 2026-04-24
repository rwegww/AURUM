import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LessonSidebar = ({ grade, lessons = [], currentLessonId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = React.useState({});

  // Group lessons by chapter
  const sections = useMemo(() => {
    const groups = {};
    lessons.forEach((lesson, index) => {
      const chapter = lesson.chapter || "Chương khác";
      if (!groups[chapter]) {
        groups[chapter] = {
          name: chapter,
          lessons: [],
          startIndex: index + 1
        };
      }
      groups[chapter].lessons.push({ ...lesson, globalIndex: index + 1 });
    });
    return Object.values(groups);
  }, [lessons]);

  // Initial expand: show the section containing the current lesson
  React.useEffect(() => {
    const currentSection = sections.find(s => s.lessons.some(l => l.lessonId === currentLessonId));
    if (currentSection) {
      setExpandedSections(prev => ({ ...prev, [currentSection.name]: true }));
    } else if (sections.length > 0) {
      // If no lesson active, expand the first one
      setExpandedSections(prev => ({ ...prev, [sections[0].name]: true }));
    }
  }, [sections, currentLessonId]);

  const toggleSection = (name) => {
    setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const calculateProgress = () => {
    if (!lessons.length) return 0;
    const currentIndex = lessons.findIndex(l => l.lessonId === currentLessonId);
    return Math.round(((currentIndex + 1) / lessons.length) * 100) || 0;
  };

  return (
    <aside className="w-[320px] min-h-[calc(100vh-70px)] bg-white border-r border-viet-border absolute top-0 left-0 z-40 flex flex-col shadow-sm">
      {/* Top Header / Context */}
      <div className="p-6 pb-4 border-b border-viet-border bg-viet-bg/20">
        <Link to="/lessons" className="flex items-center gap-2 text-viet-green text-[10px] font-black uppercase tracking-widest mb-4 hover:underline">
          <span>←</span> {t('lesson_page.back_btn')}
        </Link>
        
        <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px] mb-2 block">Lộ trình học tập</label>
        <div className="relative">
          <select 
            value={grade}
            onChange={(e) => navigate(`/lessons/${e.target.value}`)}
            className="w-full h-[48px] bg-white border-2 border-viet-border rounded-2xl px-5 text-[14px] font-bold text-viet-text appearance-none cursor-pointer outline-none focus:border-viet-green focus:ring-4 focus:ring-viet-green/5 transition-all"
          >
            {[8, 9, 10, 11, 12].map(g => (
              <option key={g} value={g}>Hóa học Lớp {g}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-viet-green">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

      </div>

      <div className="flex-1 p-4 pt-6">
        <div className="mb-4 px-2">
          <h3 className="text-[11px] font-black text-[#3f3e3e] uppercase tracking-[2px] opacity-40">Cấu trúc chương trình</h3>
        </div>

        {/* Sections and Modules */}
        <div className="space-y-3">
          {sections.map((section, sIdx) => {
            const isExpanded = expandedSections[section.name];
            return (
              <div key={section.name} className={`rounded-[24px] transition-all overflow-hidden ${isExpanded ? 'bg-viet-bg/30 ring-1 ring-viet-border' : 'bg-transparent'}`}>
                <button 
                  onClick={() => toggleSection(section.name)}
                  className={`w-full flex items-center justify-between px-4 py-4 transition-colors group ${isExpanded ? 'bg-white/50' : 'hover:bg-viet-bg rounded-2xl'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-black text-[12px] transition-all ${
                      isExpanded ? 'bg-viet-green border-viet-green text-white shadow-lg shadow-viet-green/20' : 'bg-white border-viet-border text-viet-text-light group-hover:border-viet-green/30 group-hover:text-viet-green'
                    }`}>
                      {sIdx + 1}
                    </div>
                    <h4 className={`text-[13px] font-black uppercase tracking-tight text-left leading-tight max-w-[180px] ${isExpanded ? 'text-viet-text' : 'text-viet-text-light'}`}>
                      {section.name}
                    </h4>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-viet-text-light transition-transform duration-500 ${isExpanded ? 'rotate-180 text-viet-green' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 p-2 pt-0"
                    >
                      {section.lessons.map((lesson) => {
                        const isActive = lesson.lessonId === currentLessonId;
                        return (
                          <Link
                            key={lesson.lessonId}
                            to={`/lessons/${grade}/${lesson.lessonId}`}
                            className={`group block p-3.5 rounded-[20px] transition-all border-2 relative overflow-hidden ${
                              isActive 
                                ? 'bg-white border-viet-green shadow-xl shadow-viet-green/5' 
                                : 'bg-transparent border-transparent hover:bg-white hover:border-viet-border shadow-none'
                            }`}
                          >
                            <div className="flex gap-4 items-start">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                                isActive 
                                  ? 'bg-viet-green border-viet-green text-white' 
                                  : 'bg-white border-viet-border text-viet-text-light group-hover:border-viet-green/30 group-hover:text-viet-green'
                              }`}>
                                {isActive ? (
                                  <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                ) : (
                                  <span className="text-[14px] font-black">{lesson.globalIndex}</span>
                                )}
                              </div>
                              <div className="flex-1 pt-0.5">
                                <h5 className={`text-[12px] font-extrabold leading-[1.4] transition-colors ${
                                  isActive ? 'text-viet-text' : 'text-viet-text-light group-hover:text-viet-text'
                                }`}>
                                  {lesson.title.replace(`Bài ${lesson.globalIndex}: `, '').replace(`Bài ${lesson.lessonId}: `, '').replace(`Bài ${lesson.order}: `, '')}
                                </h5>
                                
                                {isActive && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-viet-green">Đang học</span>
                                    <motion.div 
                                      animate={{ scale: [1, 1.2, 1] }} 
                                      transition={{ repeat: Infinity, duration: 2 }}
                                      className="w-1.5 h-1.5 rounded-full bg-viet-green shadow-[0_0_8px_rgba(118,192,52,0.6)]" 
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-viet-green" />
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Search / Footer info */}
      <div className="p-6 border-t border-viet-border bg-viet-bg/10">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b4bac2] group-focus-within:text-viet-green transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth={3} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm bài học..."
            className="w-full h-[44px] bg-white border-2 border-viet-border rounded-xl pl-12 pr-4 text-[12px] font-bold text-viet-text focus:border-viet-green focus:ring-4 focus:ring-viet-green/5 outline-none transition-all placeholder:text-[#b4bac2]"
          />
        </div>
        <p className="mt-4 text-[9px] text-[#b4bac2] font-black uppercase tracking-[2px] text-center">Aurum Chemistry v2.4</p>
      </div>
    </aside>
  );
};

export default LessonSidebar;
