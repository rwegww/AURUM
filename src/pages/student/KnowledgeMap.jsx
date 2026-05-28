import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHEMISTRY_KNOWLEDGE_BASE } from '@/data/theory';
import { CORE_KNOWLEDGE_LESSONS } from '@/data/coreKnowledge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Lock, ChevronRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import InfographicBook from '@/components/lessons/InfographicBook';

// Grade theme colors
const GRADE_THEME = {
  8: { color: '#16a34a', light: '#f0fdf4', border: '#bbf7d0', label: 'Lớp 8' },
  9: { color: '#f97316', light: '#fff7ed', border: '#fed7aa', label: 'Lớp 9' },
  10: { color: '#3b82f6', light: '#eff6ff', border: '#bfdbfe', label: 'Lớp 10' },
  11: { color: '#8b5cf6', light: '#f5f3ff', border: '#ddd6fe', label: 'Lớp 11' },
  12: { color: '#ec4899', light: '#fdf2f8', border: '#fbcfe8', label: 'Lớp 12' },
};

const KnowledgeMap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expandedGrade, setExpandedGrade] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [selectedInfographicLesson, setSelectedInfographicLesson] = useState(null);

  const unlockedLessons = user?.unlockedLessons || [];

  // Build tree: Grade → Lesson → Knowledge Topics
  const mindMapTree = useMemo(() => {
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
        if (!lessonToTopics[key].topics.find(t => t.id === topicId)) {
          lessonToTopics[key].topics.push(topicData);
        }
      });
    });

    const gradeMap = {};
    Object.values(lessonToTopics).forEach(lesson => {
      const g = lesson.classId;
      if (!gradeMap[g]) gradeMap[g] = [];
      gradeMap[g].push(lesson);
    });

    Object.keys(gradeMap).forEach(g => {
      gradeMap[g].sort((a, b) => a.lessonId.localeCompare(b.lessonId));
    });

    return gradeMap;
  }, []);

  const grades = [8, 9, 10, 11, 12];

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
    <div className="min-h-screen bg-[#fafaf8] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-viet-green selection:text-white flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col">

        {/* Header */}
        <header className="mb-6 shrink-0">
          <Link
            to="/classroom"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-viet-green font-bold text-sm mb-4 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            QUAY LẠI LỚP HỌC
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-rubik text-3xl md:text-4xl font-black text-[#1a1a1a] mb-2 tracking-tight uppercase leading-tight">
              Sơ Đồ Tư Duy <span className="text-viet-green">Hóa Học</span>
            </h1>

            {/* Overall progress */}
            <div className="mt-4 flex items-center gap-4 max-w-xs">
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-viet-green to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <span className="text-xs font-black text-slate-600 whitespace-nowrap">
                {completedTopics}/{totalTopics} chủ đề
              </span>
            </div>
          </motion.div>
        </header>

        {/* ====== HORIZONTAL MIND MAP TREE ====== */}
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-white/50 rounded-3xl border-2 border-slate-100 p-8 shadow-inner relative min-h-[600px]">
          <div className="flex flex-row items-center min-w-max h-full py-10">

            {/* 1. ROOT NODE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="shrink-0 relative z-10"
            >
              <div className="px-8 py-5 bg-viet-green text-white rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-lg shadow-viet-green/20 border-b-[6px] border-emerald-700 select-none">
                Hóa Học
              </div>
            </motion.div>

            {/* Root Connector */}
            <div className="w-10 h-[3px] bg-slate-200 shrink-0" />

            {/* 2. GRADES COLUMN */}
            <div className="flex flex-col gap-6 shrink-0 relative">
              {grades.map((grade, gIdx) => {
                const isFirstGrade = gIdx === 0;
                const isLastGrade = gIdx === grades.length - 1;
                const isOnlyGrade = grades.length === 1;

                const theme = GRADE_THEME[grade];
                const isExpanded = expandedGrade === grade;
                const lessons = mindMapTree[grade] || [];
                const progress = getGradeProgress(grade);
                const isGradeComplete = progress.done === progress.total && progress.total > 0;

                return (
                  <div key={grade} className="flex flex-row items-center relative">
                    {/* Vertical Branch Line */}
                    {!isOnlyGrade && (
                      <div
                        className="absolute left-0 w-[3px] bg-slate-200 z-0"
                        style={{
                          top: isFirstGrade ? '50%' : '0',
                          bottom: isLastGrade ? '50%' : '0',
                        }}
                      />
                    )}

                    {/* Horizontal Connector to Grade */}
                    <div className="w-10 h-[3px] bg-slate-200 shrink-0 z-0" />

                    {/* Grade Node */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: gIdx * 0.05 }}
                      className="shrink-0 relative z-10"
                    >
                      <button
                        onClick={() => {
                          setExpandedGrade(isExpanded ? null : grade);
                          setExpandedLesson(null); // Reset lesson when changing grade
                        }}
                        className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 transition-all duration-200 w-[240px] text-left group ${isExpanded
                            ? 'bg-white shadow-xl scale-[1.02]'
                            : 'bg-white hover:shadow-md hover:scale-[1.01]'
                          }`}
                        style={{
                          borderColor: isExpanded ? theme.color : '#e2e8f0',
                          boxShadow: isExpanded ? `0 12px 30px ${theme.color}20` : undefined
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-sm"
                          style={{ backgroundColor: theme.color }}
                        >
                          {grade}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-[15px] font-black text-[#1a1a1a] leading-tight mb-1">
                            {theme.label}
                          </h2>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-400">
                              {progress.done}/{progress.total} bài
                            </span>
                            {isGradeComplete && <CheckCircle2 size={12} className="text-viet-green" />}
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                          style={{ color: isExpanded ? theme.color : undefined }}
                        />
                      </button>
                    </motion.div>

                    {/* 3. LESSONS COLUMN */}
                    <AnimatePresence>
                      {isExpanded && lessons.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                          className="flex flex-row items-center shrink-0 overflow-hidden"
                        >
                          {/* Connector from Grade to Lessons */}
                          <div className="w-10 h-[3px] bg-slate-200 shrink-0" />

                          <div className="flex flex-col gap-4 shrink-0 relative py-2">
                            {lessons.map((lesson, lIdx) => {
                              const isFirstLesson = lIdx === 0;
                              const isLastLesson = lIdx === lessons.length - 1;
                              const isOnlyLesson = lessons.length === 1;

                              const lessonDone = isLessonDone(lesson.lessonId);
                              const isLessonExpanded = expandedLesson === lesson.lessonId;
                              const shortTitle = lesson.title.replace(/^Bài \d+: /, '');

                              return (
                                <div key={lesson.lessonId} className="flex flex-row items-center relative">
                                  {/* Vertical Branch Line */}
                                  {!isOnlyLesson && (
                                    <div
                                      className="absolute left-0 w-[3px] bg-slate-200 z-0"
                                      style={{
                                        top: isFirstLesson ? '50%' : '0',
                                        bottom: isLastLesson ? '50%' : '0',
                                      }}
                                    />
                                  )}

                                  {/* Horizontal Connector to Lesson */}
                                  <div className="w-10 h-[3px] bg-slate-200 shrink-0 z-0" />

                                  {/* Lesson Node */}
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: lIdx * 0.03 }}
                                    className="shrink-0 relative z-10"
                                  >
                                    <button
                                      onClick={() => setExpandedLesson(isLessonExpanded ? null : lesson.lessonId)}
                                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left w-[280px] group ${isLessonExpanded
                                          ? 'bg-white shadow-lg scale-[1.02]'
                                          : lessonDone
                                            ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                            : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'
                                        }`}
                                      style={{
                                        borderColor: isLessonExpanded ? theme.color : undefined,
                                        boxShadow: isLessonExpanded ? `0 8px 20px ${theme.color}15` : undefined
                                      }}
                                    >
                                      <div
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black text-white ${lessonDone ? '' : 'bg-slate-300'
                                          }`}
                                        style={{ backgroundColor: lessonDone ? theme.color : undefined }}
                                      >
                                        {lessonDone ? '✓' : <Lock size={12} />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-[13px] font-bold leading-snug truncate ${lessonDone ? 'text-slate-800' : 'text-slate-500'
                                          }`}>
                                          {shortTitle}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                          {lesson.topics.length} kiến thức cốt lõi
                                        </p>
                                      </div>
                                      <ChevronRight
                                        size={16}
                                        className={`text-slate-300 transition-transform duration-300 ${isLessonExpanded ? 'rotate-90' : ''}`}
                                        style={{ color: isLessonExpanded ? theme.color : undefined }}
                                      />
                                    </button>
                                  </motion.div>

                                  {/* 4. TOPICS COLUMN */}
                                  <AnimatePresence>
                                    {isLessonExpanded && lesson.topics.length > 0 && (
                                      <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                                        className="flex flex-row items-center shrink-0 overflow-hidden"
                                      >
                                        {/* Connector from Lesson to Topics */}
                                        <div className="w-10 h-[3px] bg-slate-200 shrink-0" />

                                        <div className="flex flex-col gap-3 shrink-0 relative py-2">
                                          {lesson.topics.map((topic, tIdx) => {
                                            const isFirstTopic = tIdx === 0;
                                            const isLastTopic = tIdx === lesson.topics.length - 1;
                                            const isOnlyTopic = lesson.topics.length === 1;

                                            const topicLessons = CORE_KNOWLEDGE_LESSONS[topic.id] || [];
                                            const topicDone = topicLessons.some(l => unlockedLessons.includes(l.lessonId));

                                            return (
                                              <div key={topic.id} className="flex flex-row items-center relative">
                                                {/* Vertical Branch Line */}
                                                {!isOnlyTopic && (
                                                  <div
                                                    className="absolute left-0 w-[3px] bg-slate-200 z-0"
                                                    style={{
                                                      top: isFirstTopic ? '50%' : '0',
                                                      bottom: isLastTopic ? '50%' : '0',
                                                    }}
                                                  />
                                                )}

                                                {/* Horizontal Connector to Topic */}
                                                <div className="w-10 h-[3px] bg-slate-200 shrink-0 z-0" />

                                                {/* Topic Node (Leaf) */}
                                                <motion.div
                                                  initial={{ opacity: 0, x: -10 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  transition={{ delay: tIdx * 0.04 }}
                                                  className="shrink-0 relative z-10"
                                                >
                                                  <div
                                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all w-[300px] ${topicDone
                                                        ? 'bg-white border-slate-200 shadow-sm'
                                                        : 'bg-slate-50 border-slate-100 opacity-60'
                                                      }`}
                                                  >
                                                    <div
                                                      className="w-2.5 h-2.5 rounded-full shrink-0"
                                                      style={{
                                                        backgroundColor: topicDone ? theme.color : '#cbd5e1',
                                                        boxShadow: topicDone ? `0 0 8px ${theme.color}50` : 'none'
                                                      }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                      <p className={`text-[12.5px] font-bold leading-snug ${topicDone ? 'text-slate-800' : 'text-slate-500'
                                                        }`}>
                                                        {topic.title}
                                                      </p>
                                                    </div>
                                                    {topicDone && (
                                                      <CheckCircle2 size={14} className="text-viet-green shrink-0" />
                                                    )}
                                                  </div>
                                                </motion.div>
                                              </div>
                                            );
                                          })}

                                          {/* Action Buttons for the Lesson */}
                                          {lessonDone && (
                                            <div className="flex flex-row items-center relative mt-2">
                                              <div className="absolute left-0 top-0 bottom-1/2 w-[3px] bg-slate-200 z-0" />
                                              <div className="w-10 h-[3px] bg-slate-200 shrink-0 z-0" />
                                              <div className="flex flex-row gap-2 shrink-0 z-10">
                                                <motion.button
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  onClick={() => navigate(`/lessons/${lesson.classId}/${lesson.lessonId}`)}
                                                  className="text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-500 hover:text-viet-green transition-all shadow-sm"
                                                >
                                                  Xem lại bài học →
                                                </motion.button>

                                                <motion.button
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  onClick={() => {
                                                    const orderMatch = lesson.lessonId.match(/bai(\d+)/i);
                                                    const order = orderMatch ? parseInt(orderMatch[1], 10) : 1;

                                                    setSelectedInfographicLesson({
                                                      ...lesson,
                                                      order,
                                                      title: lesson.title
                                                    });
                                                  }}
                                                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 text-emerald-700 transition-all shadow-sm"
                                                >
                                                  <ImageIcon size={14} /> Infographic
                                                </motion.button>
                                              </div>
                                            </div>
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
                  </div>
                );
              })}
            </div>

            {/* End Cap padding */}
            <div className="w-16 shrink-0" />
          </div>
        </div>
      </div>

      {/* Infographic Modal */}
      {selectedInfographicLesson && (
        <InfographicBook
          isOpen={true}
          onClose={() => setSelectedInfographicLesson(null)}
          lessons={[selectedInfographicLesson]}
          grade={selectedInfographicLesson.classId.toString()}
          unlockedLessons={unlockedLessons}
        />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.15);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.25);
        }
      `}} />
    </div>
  );
};

export default KnowledgeMap;
