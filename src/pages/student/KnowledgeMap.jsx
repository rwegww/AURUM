import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CHEMISTRY_KNOWLEDGE_BASE } from '@/data/theory';
import { CORE_KNOWLEDGE_LESSONS } from '@/data/coreKnowledge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Lock, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';

// Category colors for tree branches
const CATEGORY_THEME = {
  'Đại cương': { color: '#3b82f6', light: '#eff6ff', icon: '⚛️' },
  'Liên kết': { color: '#6366f1', light: '#eef2ff', icon: '🔗' },
  'Mol và định lượng': { color: '#10b981', light: '#ecfdf5', icon: '⚖️' },
  'Chất khí': { color: '#f59e0b', light: '#fffbeb', icon: '💨' },
  'Dung dịch': { color: '#06b6d4', light: '#ecfeff', icon: '🧪' },
  'Axit – bazơ – muối': { color: '#f43f5e', light: '#fff1f2', icon: '🧫' },
  'Phản ứng hóa học': { color: '#f97316', light: '#fff7ed', icon: '🔥' },
  'Động hóa học': { color: '#eab308', light: '#fefce8', icon: '⚡' },
  'Cân bằng hóa học': { color: '#a855f7', light: '#faf5ff', icon: '⏳' },
  'Nhiệt hóa học': { color: '#ef4444', light: '#fef2f2', icon: '🌡️' },
  'Oxi hóa – khử': { color: '#0ea5e9', light: '#f0f9ff', icon: '🔋' },
  'Điện hóa': { color: '#2563eb', light: '#eff6ff', icon: '⚡' },
  'Kim loại': { color: '#64748b', light: '#f8fafc', icon: '🪙' },
  'Phi kim': { color: '#14b8a6', light: '#f0fdfa', icon: '🌍' },
  'Hữu cơ': { color: '#16a34a', light: '#f0fdf4', icon: '🧬' },
  'An toàn': { color: '#dc2626', light: '#fef2f2', icon: '🛡️' },
};

const KnowledgeMap = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const unlockedLessons = user?.unlockedLessons || [];

  // Group topics by category
  const categories = useMemo(() => {
    const cats = {};
    CHEMISTRY_KNOWLEDGE_BASE.forEach(item => {
      if (!cats[item.category]) cats[item.category] = [];
      cats[item.category].push(item);
    });
    return cats;
  }, []);

  const categoryList = Object.keys(categories);

  // Check if a topic is "completed" — at least one related lesson is unlocked
  const isTopicCompleted = (topicId) => {
    const lessons = CORE_KNOWLEDGE_LESSONS[topicId] || [];
    if (lessons.length === 0) return false;
    return lessons.some(l => unlockedLessons.includes(l.lessonId));
  };

  // Check if ALL lessons of a topic are completed
  const isTopicFullyCompleted = (topicId) => {
    const lessons = CORE_KNOWLEDGE_LESSONS[topicId] || [];
    if (lessons.length === 0) return false;
    return lessons.every(l => unlockedLessons.includes(l.lessonId));
  };

  // Count completed topics in a category
  const getCategoryProgress = (catName) => {
    const topics = categories[catName] || [];
    const completed = topics.filter(t => isTopicCompleted(t.id)).length;
    return { completed, total: topics.length };
  };

  // Related lessons for selected topic
  const relatedLessons = selectedTopic ? (CORE_KNOWLEDGE_LESSONS[selectedTopic.id] || []) : [];

  // Stats
  const totalTopics = CHEMISTRY_KNOWLEDGE_BASE.length;
  const completedTopics = CHEMISTRY_KNOWLEDGE_BASE.filter(t => isTopicCompleted(t.id)).length;

  return (
    <div className="min-h-screen bg-[#fafaf8] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-viet-green selection:text-white">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <header className="mb-12">
          <Link 
            to="/classroom" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-viet-green font-bold text-sm mb-6 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            QUAY LẠI LỚP HỌC
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-rubik text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4 tracking-tight uppercase leading-tight">
              Cây Kiến Thức<br/>
              <span className="text-viet-green">Hóa Học</span>
            </h1>
            <p className="text-slate-500 font-bold text-base max-w-2xl leading-relaxed">
              Hệ thống hóa toàn bộ lộ trình hóa học phổ thông. Chủ đề <span className="text-viet-green font-black">đã học sẽ sáng lên</span>, chủ đề chưa học sẽ mờ đi.
            </p>

            {/* Progress Bar */}
            <div className="mt-6 flex items-center gap-4 max-w-md">
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  className="h-full bg-gradient-to-r from-viet-green to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <span className="text-sm font-black text-slate-600 whitespace-nowrap">
                {completedTopics}/{totalTopics}
              </span>
            </div>
          </motion.div>
        </header>

        {/* Main Layout: Tree + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">

          {/* === LEFT: Tree Structure === */}
          <div className="relative">
            {/* Main trunk line */}
            <div className="absolute left-[23px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-viet-green/30 via-slate-200 to-slate-100 rounded-full" />

            <div className="space-y-10">
              {categoryList.map((catName, catIdx) => {
                const theme = CATEGORY_THEME[catName] || { color: '#6b7280', light: '#f9fafb', icon: '📚' };
                const progress = getCategoryProgress(catName);
                const isCatComplete = progress.completed === progress.total && progress.total > 0;

                return (
                  <motion.div
                    key={catName}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIdx * 0.04, type: 'spring', bounce: 0 }}
                  >
                    {/* Category Branch Node */}
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md border-2 bg-white relative z-10 shrink-0"
                        style={{ 
                          borderColor: isCatComplete ? theme.color : '#e2e8f0',
                          boxShadow: isCatComplete ? `0 4px 14px ${theme.color}30` : 'none'
                        }}
                      >
                        {theme.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-black text-[#1a1a1a] uppercase tracking-tight truncate">
                            {catName}
                          </h2>
                          <span 
                            className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0"
                            style={{ 
                              backgroundColor: theme.light, 
                              color: theme.color 
                            }}
                          >
                            {progress.completed}/{progress.total}
                          </span>
                          {isCatComplete && (
                            <CheckCircle2 size={16} className="text-viet-green shrink-0" />
                          )}
                        </div>
                        {/* Category progress bar */}
                        <div className="mt-1.5 h-1.5 w-full max-w-[200px] bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-700"
                            style={{ 
                              width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%`,
                              backgroundColor: theme.color 
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Topic Leaves */}
                    <div className="ml-[23px] pl-8 border-l-[3px] space-y-2" style={{ borderColor: `${theme.color}20` }}>
                      {categories[catName].map((topic) => {
                        const completed = isTopicCompleted(topic.id);
                        const fullyCompleted = isTopicFullyCompleted(topic.id);
                        const isSelected = selectedTopic?.id === topic.id;
                        const lessons = CORE_KNOWLEDGE_LESSONS[topic.id] || [];

                        return (
                          <motion.button
                            key={topic.id}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTopic(topic)}
                            className={`w-full group relative rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                              isSelected
                                ? 'bg-white border-viet-green shadow-lg shadow-viet-green/10'
                                : completed
                                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                                  : 'bg-slate-50/70 border-slate-100 hover:border-slate-200 opacity-50 hover:opacity-70'
                            }`}
                          >
                            {/* Branch connector dot */}
                            <div 
                              className="absolute left-[-17px] top-5 w-3 h-3 rounded-full border-2 bg-white transition-all"
                              style={{ 
                                borderColor: completed ? theme.color : '#cbd5e1',
                                backgroundColor: fullyCompleted ? theme.color : 'white',
                                boxShadow: completed ? `0 0 8px ${theme.color}40` : 'none'
                              }}
                            />

                            <div className="flex items-center gap-3">
                              {/* Status icon */}
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                fullyCompleted
                                  ? 'bg-viet-green/10'
                                  : completed
                                    ? 'bg-amber-50'
                                    : 'bg-slate-100'
                              }`}>
                                {fullyCompleted ? (
                                  <CheckCircle2 size={16} className="text-viet-green" />
                                ) : completed ? (
                                  <Sparkles size={14} className="text-amber-500" />
                                ) : (
                                  <Lock size={14} className="text-slate-300" />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-[14px] font-bold leading-snug transition-colors ${
                                  isSelected 
                                    ? 'text-viet-green' 
                                    : completed 
                                      ? 'text-slate-700 group-hover:text-slate-900' 
                                      : 'text-slate-400'
                                }`}>
                                  {topic.title}
                                </h4>
                                {lessons.length > 0 && (
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`text-[10px] font-bold ${completed ? 'text-slate-400' : 'text-slate-300'}`}>
                                      {lessons.filter(l => unlockedLessons.includes(l.lessonId)).length}/{lessons.length} bài học
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Arrow */}
                              <ChevronRight 
                                size={16} 
                                className={`shrink-0 transition-all ${
                                  isSelected 
                                    ? 'text-viet-green' 
                                    : 'text-slate-300 group-hover:text-slate-400'
                                }`} 
                              />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Tree root cap */}
            <div className="flex justify-center mt-10">
              <div className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-viet-green bg-white text-viet-green shadow-sm">
                ✦ Nền tảng Hóa Học ✦
              </div>
            </div>
          </div>

          {/* === RIGHT: Detail Panel === */}
          <div className="lg:sticky lg:top-28 h-fit">
            <AnimatePresence mode="wait">
              {selectedTopic ? (
                <motion.div
                  key={selectedTopic.id}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: 'spring', bounce: 0.1 }}
                  className="card-tactile bg-white p-8 relative overflow-hidden"
                >
                  {/* Status badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-viet-green/10 text-viet-green text-[10px] font-black uppercase tracking-widest rounded-full">
                      {selectedTopic.category}
                    </span>
                    {isTopicCompleted(selectedTopic.id) && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                        ✓ Đã học
                      </span>
                    )}
                  </div>

                  <h3 className="font-rubik text-2xl font-black text-[#1a1a1a] mb-4 leading-tight tracking-tight">
                    {selectedTopic.title}
                  </h3>

                  <div className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6">
                    {selectedTopic.explanation.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i} className="text-viet-green font-black">{part}</strong> : part
                    )}
                  </div>

                  {selectedTopic.formula && (
                    <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100 text-center font-mono text-sm text-slate-600">
                      {selectedTopic.formula.replace(/\\/g, '').replace(/text\{|\}/g, '')}
                    </div>
                  )}

                  {/* Related Lessons */}
                  {relatedLessons.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Bài học liên quan
                      </h4>
                      <div className="space-y-2">
                        {relatedLessons.map((lesson, idx) => {
                          const isLessonDone = unlockedLessons.includes(lesson.lessonId);
                          return (
                            <motion.button
                              key={`${lesson.classId}-${lesson.lessonId}-${idx}`}
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate(`/lessons/${lesson.classId}/${lesson.lessonId}`)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group/lesson cursor-pointer ${
                                isLessonDone
                                  ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                                  : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black text-white ${
                                isLessonDone ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}>
                                {isLessonDone ? '✓' : lesson.classId}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[12px] font-bold truncate transition-colors ${
                                  isLessonDone 
                                    ? 'text-emerald-700 group-hover/lesson:text-emerald-800' 
                                    : 'text-slate-500 group-hover/lesson:text-slate-700'
                                }`}>
                                  {lesson.title.replace(/^Bài \d+: /, '')}
                                </p>
                                <p className={`text-[10px] font-bold ${isLessonDone ? 'text-emerald-500' : 'text-slate-400'}`}>
                                  Lớp {lesson.classId} {isLessonDone ? '· Hoàn thành' : ''}
                                </p>
                              </div>
                              <ChevronRight size={14} className={`shrink-0 opacity-0 group-hover/lesson:opacity-100 transition-all ${
                                isLessonDone ? 'text-emerald-500' : 'text-slate-400'
                              }`} />
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Related topics */}
                  {(selectedTopic.suggestions || []).length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">
                        Chủ đề liên quan
                      </h4>
                      <div className="space-y-1.5">
                        {selectedTopic.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const searchStr = s.toLowerCase().replace(/\s+/g, '');
                              const relatedTopic = CHEMISTRY_KNOWLEDGE_BASE.find(t =>
                                t.id.toLowerCase() === searchStr ||
                                t.title.toLowerCase().replace(/\s+/g, '') === searchStr ||
                                t.patterns.some(p => p.toLowerCase().replace(/\s+/g, '') === searchStr) ||
                                t.title.toLowerCase().includes(s.toLowerCase())
                              );
                              if (relatedTopic) setSelectedTopic(relatedTopic);
                            }}
                            className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-viet-green transition-colors w-full text-left"
                          >
                            <ChevronRight size={12} className="text-viet-green shrink-0" />
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Button */}
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('aurum-ask', {
                        detail: { query: `Hãy giải thích chi tiết cho tôi về: ${selectedTopic.title}. Nội dung này nằm trong phần ${selectedTopic.category}.` }
                      }));
                    }}
                    className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-[1rem] font-black text-[12px] uppercase tracking-widest hover:bg-viet-green transition-all border-b-4 border-[#0a0a0a] hover:border-emerald-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    Hỏi Aurum về nội dung này
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card-tactile bg-white p-12 text-center flex flex-col items-center justify-center min-h-[350px]"
                >
                  <div className="w-16 h-16 bg-viet-green/10 rounded-3xl flex items-center justify-center mb-5">
                    <span className="text-3xl">🌳</span>
                  </div>
                  <h3 className="text-lg font-black text-[#1a1a1a] uppercase tracking-tight mb-2">
                    Chọn một chủ đề
                  </h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[220px]">
                    Nhấn vào bất kỳ nhánh kiến thức nào bên trái để xem chi tiết lý thuyết
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeMap;
