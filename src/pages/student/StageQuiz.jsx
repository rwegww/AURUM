import React, { useState, useEffect, useRef } from 'react';
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
  const { user, completeLessonSegment } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(searchParams.get('level') || 'level1');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  
  const order = searchParams.get('order') || '1';

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error('Lỗi tải bài học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  // Xử lý hoàn thành quiz (level2, level3)
  const handleLevelComplete = async ({ mistakes, total }) => {
    let stars = 1;
    if (mistakes <= 1) stars = 3;
    else if (mistakes <= 3) stars = 2;

    const result = { mistakes, total, stars };
    setLastResult(result);
    setShowResult(true);

    if (user) {
      const xpMap = { level2: 50, level3: 100 };
      const xpGain = xpMap[currentLevel] || 50;
      const isLessonCompletion = currentLevel === 'level3';

      try {
        await completeLessonSegment(lessonId, currentLevel, stars, xpGain, isLessonCompletion);
        console.log('✅ Đã lưu giai đoạn:', { lessonId, currentLevel, stars });
      } catch (err) {
        console.error('❌ Lỗi khi lưu giai đoạn:', err);
      }
    }
  };

  // Xử lý hoàn thành xem video (level1)
  const handleVideoComplete = async () => {
    setVideoCompleted(true);

    if (user) {
      try {
        await completeLessonSegment(lessonId, 'level1', 3, 30, false);
        console.log('✅ Đã lưu giai đoạn xem video:', { lessonId });
      } catch (err) {
        console.error('❌ Lỗi khi lưu giai đoạn video:', err);
      }
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
    if (Array.isArray(lesson.quizzes)) return lvl === 'level2' ? lesson.quizzes : [];
    return lesson.quizzes[lvl] || [];
  };

  const currentQuestions = getLevelData(currentLevel);

  // ========== LEVEL 1: XEM VIDEO BÀI GIẢNG ==========
  if (currentLevel === 'level1') {
    const videoUrl = lesson?.introVideoUrl;

    return (
      <div className="min-h-screen bg-[#fffbf0]">
        {/* Header */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-viet-border">
          <div className="pr-4 border-r border-slate-200">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đoạn 1</div>
            <div className="text-sm font-bold text-slate-700">Xem bài giảng</div>
          </div>
          <button onClick={handleCancel} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">
            Thoát
          </button>
        </div>

        {/* Video Content */}
        <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl font-black text-viet-text mb-2">{lesson?.title || 'Bài giảng'}</h1>
            <p className="text-viet-text-light text-sm font-medium">Xem video bài giảng để nắm vững kiến thức cơ bản</p>
          </motion.div>

          {videoUrl ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <div className="relative aspect-video bg-black rounded-[28px] overflow-hidden shadow-2xl border-4 border-white mb-8">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  onEnded={handleVideoComplete}
                  playsInline
                />
              </div>

              {/* Nút hoàn thành */}
              <div className="text-center">
                {videoCompleted ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
                    <div className="text-5xl">🎓</div>
                    <h3 className="text-xl font-black text-viet-green">Tuyệt vời! Bạn đã xem xong bài giảng</h3>
                    <p className="text-viet-text-light text-sm">Tiếp theo hãy làm bài tập để kiểm tra kiến thức nhé!</p>
                    <button
                      onClick={handleContinue}
                      className="px-10 py-4 bg-viet-green text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-viet-green/20 hover:scale-105 transition-all"
                    >
                      Tiếp tục hành trình
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-viet-text-light text-xs font-bold uppercase tracking-widest">Xem hết video để hoàn thành đoạn này</p>
                    <button
                      onClick={handleVideoComplete}
                      className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-viet-green hover:text-white transition-all"
                    >
                      Đã xem xong
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-6">📭</div>
              <h3 className="text-lg font-black text-slate-400 mb-2">Chưa có video bài giảng</h3>
              <p className="text-slate-300 text-sm mb-8">Bài học này chưa được cập nhật video. Bạn có thể bỏ qua đoạn này.</p>
              <button
                onClick={async () => { await handleVideoComplete(); handleContinue(); }}
                className="px-8 py-3 bg-viet-green text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
              >
                Bỏ qua và tiếp tục
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== LEVEL 2 & 3: LÀM BÀI KIỂM TRA ==========
  if (currentQuestions.length === 0) {
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
               {currentLevel === 'level2' ? 'Đoạn 2: Thông hiểu' : 'Đoạn 3: Ôn tập'}
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
                {currentLevel === 'level2' ? 'Bạn đã thông hiểu vấn đề' : 'Bạn đã ôn tập xuất sắc'}
              </p>

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

