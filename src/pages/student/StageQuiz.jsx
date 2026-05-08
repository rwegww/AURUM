import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MissionModal from '@/components/lessons/MissionModal';
import { useTranslation } from 'react-i18next';

const StageQuiz = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState('level1'); // level1, level2, level3
  const order = searchParams.get('order') || '1';

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error('Lỗi tải bài kiểm tra:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleLevelComplete = () => {
    if (currentLevel === 'level1') {
      setCurrentLevel('level2');
    } else if (currentLevel === 'level2') {
      setCurrentLevel('level3');
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    navigate(`/classroom/${grade}/journey/${lessonId}/reward?order=${order}`);
  };

  const handleCancel = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Helper to check if level data exists
  const getLevelData = (lvl) => {
    if (!lesson?.quizzes) return [];
    if (Array.isArray(lesson.quizzes)) return lvl === 'level1' ? lesson.quizzes : [];
    return lesson.quizzes[lvl] || [];
  };

  const currentQuestions = getLevelData(currentLevel);

  // If no quizzes at all, skip
  if (!lesson?.quizzes || (Array.isArray(lesson.quizzes) && lesson.quizzes.length === 0)) {
    handleComplete();
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      {/* Level Indicator Overlay */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-viet-border">
         <div className="flex items-center gap-1">
            {['level1', 'level2', 'level3'].map((lvl, idx) => (
              <div 
                key={lvl}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all duration-500 ${
                  currentLevel === lvl 
                    ? 'bg-amber-400 text-white scale-110' 
                    : (idx < ['level1', 'level2', 'level3'].indexOf(currentLevel) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300')
                }`}
              >
                {idx < ['level1', 'level2', 'level3'].indexOf(currentLevel) ? '✓' : '⭐'}
              </div>
            ))}
         </div>
         <div className="h-8 w-px bg-slate-200" />
         <div className="text-sm font-bold text-slate-700">
            {currentLevel === 'level1' ? 'Đoạn 1: Học' : currentLevel === 'level2' ? 'Đoạn 2: Hiểu' : 'Đoạn 3: Ôn tập'}
         </div>
      </div>

      <MissionModal
        key={currentLevel} // Force re-render for each level
        lessonTitle={`${lesson?.title || 'Bài kiểm tra'} - ${currentLevel === 'level1' ? 'Học' : currentLevel === 'level2' ? 'Hiểu' : 'Ôn tập'}`}
        challenges={currentQuestions.map(q => ({
          ...q,
          type: 'multiple-choice',
          correctAnswer: q.answer
        }))}
        onUnlock={handleLevelComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default StageQuiz;
