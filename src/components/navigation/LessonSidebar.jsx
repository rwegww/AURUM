import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const LessonSidebar = ({ grade, lessons = [], currentLessonId }) => {
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

  return (
    <aside className="w-[300px] h-[calc(100vh-80px)] bg-white border-r border-viet-border fixed top-[80px] left-0 overflow-y-auto p-4 z-40 custom-scrollbar">
      {/* Grade Selector */}
      <div className="mb-6">
        <label className="text-[11px] font-bold text-[#b4bac2] uppercase tracking-[1px] mb-2 block">Lớp học</label>
        <div className="relative">
          <select 
            value={grade}
            onChange={(e) => navigate(`/lessons/${e.target.value}`)}
            className="w-full h-[45px] bg-[#f8f9fa] border border-viet-border rounded-xl px-4 text-[14px] font-semibold text-viet-text appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-viet-green/10"
          >
            {[8, 9, 10, 11, 12].map(g => (
              <option key={g} value={g}>Hóa học Lớp {g}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-[11px] font-bold text-[#b4bac2] uppercase mb-2">
          <span>Tiến độ hành trình</span>
          <span>0/{lessons.length} Module</span>
        </div>
        <div className="w-full h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
          <div className="h-full bg-viet-green w-[0%]" />
        </div>
      </div>

      {/* Curriculum Header */}
      <div className="mb-4 px-1">
        <h3 className="text-[12px] font-extrabold text-[#3f3e3e] uppercase tracking-[1px]">Cấu trúc chương trình</h3>
      </div>

      {/* Sections and Modules */}
      <div className="space-y-2">
        {sections.map((section, sIdx) => (
          <div key={section.name} className="mb-2">
            <button 
              onClick={() => toggleSection(section.name)}
              className="w-full flex items-center justify-between px-2 py-3 hover:bg-viet-bg rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-viet-green/5 border border-viet-green/10 flex items-center justify-center text-viet-green font-black text-[10px]">
                  {sIdx + 1}
                </div>
                <h4 className="text-[13px] font-black text-viet-text uppercase tracking-tight text-left">
                  {section.name}
                </h4>
              </div>
              <svg 
                className={`w-4 h-4 text-viet-text-light transition-transform duration-300 ${expandedSections[section.name] ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {expandedSections[section.name] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-2 mt-1 pl-2"
                >
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.lessonId === currentLessonId;
                    return (
                      <Link
                        key={lesson.lessonId}
                        to={`/lessons/${grade}/${lesson.lessonId}`}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer group block relative overflow-hidden ${
                          isActive 
                            ? 'bg-white border-viet-green ring-1 ring-viet-green/10 shadow-lg shadow-viet-green/5' 
                            : 'bg-white/50 border-transparent hover:border-viet-green/30 hover:bg-white'
                        }`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                            isActive 
                              ? 'border-viet-green bg-viet-green text-white shadow-lg shadow-viet-green/20' 
                              : 'border-viet-border bg-white text-viet-text-light group-hover:border-viet-green group-hover:text-viet-green'
                          }`}>
                            {isActive ? (
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            ) : (
                              <span className="text-[14px] font-black">{lesson.globalIndex}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className={`text-[12px] font-bold leading-tight ${
                              isActive ? 'text-viet-green' : 'text-viet-text'
                            }`}>
                              {lesson.title.replace(`Bài ${lesson.globalIndex}: `, '').replace(`Bài ${lesson.lessonId}: `, '')}
                            </h5>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                isActive ? 'bg-viet-green/10 text-viet-green' : 'bg-[#f0f2f5] text-viet-text-light'
                              }`}>
                                Module {lesson.globalIndex}
                              </span>
                              <div className="flex items-center gap-0.5 text-[9px] text-[#b4bac2] font-bold">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 6v6l4 2" />
                                </svg>
                                <span>15p</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Search */}
      <div className="mt-8 pt-6 border-t border-viet-border">
        <label className="text-[11px] font-bold text-[#b4bac2] uppercase tracking-[1px] mb-3 block">Tìm kiếm học liệu</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b4bac2]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Mã bài học hoặc từ khóa..."
            className="w-full h-[40px] bg-[#f8f9fa] border border-viet-border rounded-xl pl-10 pr-4 text-[12px] text-viet-text focus:bg-white focus:border-viet-green/50 outline-none transition-all"
          />
        </div>
      </div>
    </aside>
  );
};

export default LessonSidebar;
