import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CHEMISTRY_KNOWLEDGE_BASE } from '@/data/theory';
import { CORE_KNOWLEDGE_LESSONS } from '@/data/coreKnowledge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Lock, ChevronDown, ArrowLeft } from 'lucide-react';

// Grade theme colors
const GRADE_THEME = {
  8:  { color: '#16a34a', light: '#f0fdf4', border: '#bbf7d0', label: 'Lớp 8' },
  9:  { color: '#f97316', light: '#fff7ed', border: '#fed7aa', label: 'Lớp 9' },
  10: { color: '#3b82f6', light: '#eff6ff', border: '#bfdbfe', label: 'Lớp 10' },
  11: { color: '#8b5cf6', light: '#f5f3ff', border: '#ddd6fe', label: 'Lớp 11' },
  12: { color: '#ec4899', light: '#fdf2f8', border: '#fbcfe8', label: 'Lớp 12' },
};

const KnowledgeMap = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expandedGrade, setExpandedGrade] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);

  const unlockedLessons = user?.unlockedLessons || [];

  // Build tree: Grade → Lesson → Knowledge Topics
  const mindMapTree = useMemo(() => {
    // Reverse map: lessonId → list of knowledge topic objects
    const lessonToTopics = {};
    Object.entries(CORE_KNOWLEDGE_LESSONS).forEach(([topicId, lessons]) => {
      const topicData = CHEMISTRY_KNOWLEDGE_BASE.find(t => t.id === topicId);
      if (!topicData) return;
      lessons.forEach(lesson => {
        const key = `${lesson.classId}_${lesson.lessonId}`;
        if (!lessonToTopics[key]) {
          lessonToTopics[key] = {
            classId: lesson.classId,
            lessonId: lesson.lessonId,
            title: lesson.title,
            topics: []
          };
        }
        // Avoid duplicate topics in same lesson
        if (!lessonToTopics[key].topics.find(t => t.id === topicId)) {
          lessonToTopics[key].topics.push(topicData);
        }
      });
    });

    // Group by grade
    const gradeMap = {};
    Object.values(lessonToTopics).forEach(lesson => {
      const g = lesson.classId;
      if (!gradeMap[g]) gradeMap[g] = [];
      gradeMap[g].push(lesson);
    });

    // Sort lessons within each grade by lessonId
    Object.keys(gradeMap).forEach(g => {
      gradeMap[g].sort((a, b) => a.lessonId.localeCompare(b.lessonId));
    });

    return gradeMap;
  }, []);

  const grades = [8, 9, 10, 11, 12];

  // Stats
  const totalTopics = CHEMISTRY_KNOWLEDGE_BASE.length;
  const completedTopics = CHEMISTRY_KNOWLEDGE_BASE.filter(topic => {
    const lessons = CORE_KNOWLEDGE_LESSONS[topic.id] || [];
    return lessons.some(l => unlockedLessons.includes(l.lessonId));
  }).length;

  const isLessonDone = (lessonId) => unlockedLessons.includes(lessonId);

  const getGradeProgress = (grade) => {
    const lessons = mindMapTree[grade] || [];
    const done = lessons.filter(l => isLessonDone(l.lessonId)).length;
    return { done, total: lessons.length };
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-viet-green selection:text-white">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-10">
          <Link
            to="/classroom"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-viet-green font-bold text-sm mb-6 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            QUAY LẠI LỚP HỌC
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-rubik text-4xl md:text-5xl font-black text-[#1a1a1a] mb-3 tracking-tight uppercase leading-tight">
              Sơ Đồ Tư Duy<br />
              <span className="text-viet-green">Hóa Học</span>
            </h1>
            <p className="text-slate-500 font-bold text-base max-w-xl leading-relaxed">
              Lớp → Bài học → Kiến thức cốt lõi. Chủ đề <span className="text-viet-green font-black">đã học sáng lên</span>, chưa học sẽ mờ.
            </p>
            {/* Overall progress */}
            <div className="mt-5 flex items-center gap-4 max-w-sm">
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-viet-green to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <span className="text-sm font-black text-slate-600 whitespace-nowrap">
                {completedTopics}/{totalTopics} chủ đề
              </span>
            </div>
          </motion.div>
        </header>

        {/* ====== MIND MAP TREE ====== */}
        <div className="relative">

          {/* Root Node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="px-8 py-4 bg-viet-green text-white rounded-full font-black text-lg uppercase tracking-widest shadow-lg shadow-viet-green/20 border-b-4 border-emerald-700 select-none">
              🧪 Hóa Học
            </div>
          </motion.div>

          {/* Trunk from root */}
          <div className="flex justify-center">
            <div className="w-[3px] h-8 bg-gradient-to-b from-viet-green to-slate-200 rounded-full" />
          </div>

          {/* Grade Branches */}
          <div className="space-y-0">
            {grades.map((grade, gIdx) => {
              const theme = GRADE_THEME[grade];
              const isExpanded = expandedGrade === grade;
              const lessons = mindMapTree[grade] || [];
              const progress = getGradeProgress(grade);
              const isGradeComplete = progress.done === progress.total && progress.total > 0;

              return (
                <motion.div
                  key={grade}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gIdx * 0.06 }}
                >
                  {/* Vertical connector before grade node */}
                  <div className="flex justify-center">
                    <div className="w-[3px] h-5 bg-slate-200 rounded-full" />
                  </div>

                  {/* Grade Node */}
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setExpandedGrade(isExpanded ? null : grade);
                        setExpandedLesson(null);
                      }}
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all duration-200 shadow-sm w-full max-w-lg ${
                        isExpanded
                          ? 'bg-white shadow-lg'
                          : 'bg-white hover:shadow-md'
                      }`}
                      style={{
                        borderColor: isExpanded ? theme.color : '#e2e8f0',
                        boxShadow: isExpanded ? `0 8px 25px ${theme.color}15` : undefined
                      }}
                    >
                      {/* Grade icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md"
                        style={{ backgroundColor: theme.color }}
                      >
                        {grade}
                      </div>

                      {/* Grade info */}
                      <div className="flex-1 text-left min-w-0">
                        <h2 className="text-[16px] font-black text-[#1a1a1a] leading-snug">
                          {theme.label}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[140px]">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
                                backgroundColor: theme.color
                              }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-400">
                            {progress.done}/{progress.total} bài
                          </span>
                          {isGradeComplete && <CheckCircle2 size={14} className="text-viet-green" />}
                        </div>
                      </div>

                      {/* Expand chevron */}
                      <ChevronDown
                        size={20}
                        className={`text-slate-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </motion.button>
                  </div>

                  {/* Expanded Lessons */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-2">
                          {lessons.map((lesson, lIdx) => {
                            const lessonDone = isLessonDone(lesson.lessonId);
                            const isLessonExpanded = expandedLesson === lesson.lessonId;
                            const shortTitle = lesson.title.replace(/^Bài \d+: /, '');

                            return (
                              <div key={lesson.lessonId}>
                                {/* Connector to lesson */}
                                <div className="flex justify-center">
                                  <div className="w-[2px] h-4" style={{ backgroundColor: `${theme.color}30` }} />
                                </div>

                                {/* Lesson Node */}
                                <div className="flex justify-center">
                                  <div className="flex items-start gap-0 w-full max-w-lg">
                                    {/* Horizontal branch line */}
                                    <div className="flex flex-col items-center shrink-0 mt-5">
                                      <div className="w-6 h-[2px]" style={{ backgroundColor: `${theme.color}40` }} />
                                    </div>

                                    {/* Lesson card */}
                                    <motion.button
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: lIdx * 0.03 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => setExpandedLesson(isLessonExpanded ? null : lesson.lessonId)}
                                      className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                                        isLessonExpanded
                                          ? 'bg-white shadow-md'
                                          : lessonDone
                                            ? 'bg-white border-slate-200 hover:shadow-sm'
                                            : 'bg-slate-50/50 border-slate-100 opacity-50 hover:opacity-70'
                                      }`}
                                      style={{
                                        borderColor: isLessonExpanded ? theme.color : undefined
                                      }}
                                    >
                                      {/* Status icon */}
                                      <div
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black ${
                                          lessonDone ? 'text-white' : 'text-white'
                                        }`}
                                        style={{
                                          backgroundColor: lessonDone ? theme.color : '#cbd5e1'
                                        }}
                                      >
                                        {lessonDone ? '✓' : <Lock size={12} />}
                                      </div>

                                      {/* Lesson text */}
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-[13px] font-bold leading-snug truncate ${
                                          lessonDone ? 'text-slate-700' : 'text-slate-400'
                                        }`}>
                                          {shortTitle}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                          {lesson.topics.length} kiến thức cốt lõi
                                        </p>
                                      </div>

                                      <ChevronDown
                                        size={14}
                                        className={`text-slate-300 shrink-0 transition-transform duration-200 ${
                                          isLessonExpanded ? 'rotate-180' : ''
                                        }`}
                                      />
                                    </motion.button>
                                  </div>
                                </div>

                                {/* Expanded Knowledge Topics */}
                                <AnimatePresence>
                                  {isLessonExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="ml-[calc(50%-220px)] pl-[38px] pt-1 pb-1 space-y-1.5">
                                        {lesson.topics.map((topic, tIdx) => {
                                          // Check if this specific topic has any completed lesson
                                          const topicLessons = CORE_KNOWLEDGE_LESSONS[topic.id] || [];
                                          const topicDone = topicLessons.some(l => unlockedLessons.includes(l.lessonId));

                                          return (
                                            <motion.div
                                              key={topic.id}
                                              initial={{ opacity: 0, x: -10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: tIdx * 0.04 }}
                                              className="flex items-start gap-0"
                                            >
                                              {/* Branch connector */}
                                              <div className="flex items-center shrink-0 mt-3">
                                                <div className="w-[2px] h-4" style={{ backgroundColor: `${theme.color}20` }} />
                                                <div className="w-4 h-[2px]" style={{ backgroundColor: `${theme.color}30` }} />
                                              </div>

                                              {/* Topic leaf */}
                                              <div
                                                className={`flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
                                                  topicDone
                                                    ? 'bg-white border-slate-200 shadow-sm'
                                                    : 'bg-slate-50/50 border-slate-100 opacity-40'
                                                }`}
                                              >
                                                {/* Dot */}
                                                <div
                                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                                  style={{
                                                    backgroundColor: topicDone ? theme.color : '#cbd5e1',
                                                    boxShadow: topicDone ? `0 0 6px ${theme.color}40` : 'none'
                                                  }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                  <p className={`text-[12px] font-bold leading-snug ${
                                                    topicDone ? 'text-slate-700' : 'text-slate-400'
                                                  }`}>
                                                    {topic.title}
                                                  </p>
                                                </div>
                                                {topicDone && (
                                                  <CheckCircle2 size={13} className="text-viet-green shrink-0" />
                                                )}
                                              </div>
                                            </motion.div>
                                          );
                                        })}

                                        {/* Navigate to lesson button */}
                                        {lessonDone && (
                                          <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onClick={() => navigate(`/lessons/${lesson.classId}/${lesson.lessonId}`)}
                                            className="ml-6 mt-1 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-400 hover:text-viet-green"
                                          >
                                            Xem lại bài học →
                                          </motion.button>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom cap */}
          <div className="flex justify-center mt-6">
            <div className="w-[3px] h-6 bg-slate-100 rounded-full" />
          </div>
          <div className="flex justify-center">
            <div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeMap;
