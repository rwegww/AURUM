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
  const [results, setResults] = useState({
    level1: null, // { mistakes, total, stars }
    level2: null,
    level3: null
  });
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

  const handleLevelComplete = ({ mistakes, total }) => {
    // Tính toán sao dựa trên số lỗi
    // < 2 lỗi: 3 sao (Hoàn hảo)
    // 2-4 lỗi: 2 sao (Tốt)
    // > 4 lỗi: 1 sao (Hoàn thành)
    let stars = 1;
    if (mistakes <= 2) stars = 3;
    else if (mistakes <= 4) stars = 2;

    const newResults = {
      ...results,
      [currentLevel]: { mistakes, total, stars }
    };
    setResults(newResults);

    // Chuyển sang đoạn tiếp theo sau một khoảng trễ ngắn
    setTimeout(() => {
      if (currentLevel === 'level1') {
        setCurrentLevel('level2');
      } else if (currentLevel === 'level2') {
        setCurrentLevel('level3');
      } else {
        handleFinalComplete(newResults);
      }
    }, 500);
  };

  const handleFinalComplete = (finalResults) => {
    // Tính tổng sao hoặc lưu kết quả vào DB ở đây nếu cần
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

  const getLevelData = (lvl) => {
    if (!lesson?.quizzes) return [];
    if (Array.isArray(lesson.quizzes)) return lvl === 'level1' ? lesson.quizzes : [];
    return lesson.quizzes[lvl] || [];
  };

  const currentQuestions = getLevelData(currentLevel);

  if (!lesson?.quizzes || (Array.isArray(lesson.quizzes) && lesson.quizzes.length === 0)) {
    handleFinalComplete({});
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      {/* Level Indicator Overlay */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-viet-border">
         <div className="flex items-center gap-2">
            {['level1', 'level2', 'level3'].map((lvl, idx) => {
              const res = results[lvl];
              const isCurrent = currentLevel === lvl;
              const isDone = !!res;
              
              return (
                <div key={lvl} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all duration-500 ${
                      isCurrent 
                        ? 'bg-amber-400 text-white scale-110 ring-4 ring-amber-100' 
                        : (isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300')
                    }`}
                  >
                    {isDone ? '✓' : '⭐'}
                  </div>
                  {isDone && (
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3].map(s => (
                        <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= res.stars ? 'bg-amber-400' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
         </div>
         <div className="h-10 w-px bg-slate-200" />
         <div className="pr-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đoạn hiện tại</div>
            <div className="text-sm font-bold text-slate-700">
               {currentLevel === 'level1' ? '1. Học tập' : currentLevel === 'level2' ? '2. Thông hiểu' : '3. Ôn tập'}
            </div>
         </div>
      </div>

      <MissionModal
        key={currentLevel}
        lessonTitle={`${lesson?.title || 'Bài kiểm tra'}`}
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
