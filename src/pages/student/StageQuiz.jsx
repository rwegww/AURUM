import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MissionModal from '@/components/lessons/MissionModal';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const StageQuiz = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(searchParams.get('level') || 'level1');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  
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

  const handleLevelComplete = async ({ mistakes, total }) => {
    let stars = 1;
    if (mistakes <= 1) stars = 3;
    else if (mistakes <= 3) stars = 2;

    const result = { mistakes, total, stars };
    setLastResult(result);
    setShowResult(true);

    // Lưu tiến độ vào User Profile (JSON balancingProgress)
    if (user) {
      const currentProgress = user.balancingProgress || {};
      const lessonStars = currentProgress.lessonStars || {};
      const currentLessonStars = lessonStars[lessonId] || { level1: 0, level2: 0, level3: 0 };
      
      // Chỉ cập nhật nếu đạt số sao cao hơn
      if (stars > currentLessonStars[currentLevel]) {
        currentLessonStars[currentLevel] = stars;
      }

      await updateUser({
        balancingProgress: {
          ...currentProgress,
          lessonStars: {
            ...lessonStars,
            [lessonId]: currentLessonStars
          }
        }
      });
    }
  };

  const handleContinue = () => {
    navigate(`/classroom/${grade}/journey`);
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
    navigate(`/classroom/${grade}/journey`);
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      {/* Level Indicator Overlay */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-viet-border">
         <div className="pr-4 border-r border-slate-200">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đang làm</div>
            <div className="text-sm font-bold text-slate-700">
               {currentLevel === 'level1' ? 'Đoạn 1: Học tập' : currentLevel === 'level2' ? 'Đoạn 2: Thông hiểu' : 'Đoạn 3: Ôn tập'}
            </div>
         </div>
         <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(s => (
              <div key={s} className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 text-xs">⭐</div>
            ))}
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

      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl border-4 border-viet-green"
            >
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-black text-viet-text mb-2">Hoàn thành đoạn!</h2>
              <p className="text-viet-text-light font-medium mb-8 uppercase tracking-widest text-xs">
                {currentLevel === 'level1' ? 'Bạn đã học xong kiến thức cơ bản' : currentLevel === 'level2' ? 'Bạn đã thông hiểu vấn đề' : 'Bạn đã ôn tập xuất sắc'}
              </p>

              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3].map(s => (
                  <motion.div 
                    key={s}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * s, type: 'spring' }}
                    className={`text-4xl ${s <= (lastResult?.stars || 0) ? 'grayscale-0 drop-shadow-lg' : 'grayscale opacity-20'}`}
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex justify-around">
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase">Chính xác</div>
                   <div className="text-xl font-black text-viet-green">{lastResult?.total - lastResult?.mistakes}/{lastResult?.total}</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase">Đánh giá</div>
                   <div className="text-xl font-black text-amber-500">
                     {lastResult?.stars === 3 ? 'A+' : lastResult?.stars === 2 ? 'B' : 'C'}
                   </div>
                </div>
              </div>

              <button 
                onClick={handleContinue}
                className="w-full py-4 bg-viet-green text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-viet-green/20 hover:scale-105 transition-all"
              >
                Tiếp tục hành trình
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StageQuiz;
