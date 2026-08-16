import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MissionModal from '@/components/lessons/MissionModal';
import LessonSummaryFallback from '@/components/lessons/LessonSummaryFallback';
import { useAuth } from '@/context/AuthContext';
import { getLessonInfographicUrl } from '@/utils/lessonAssets';
import { getJourneyQuizGroups, JOURNEY_LEVELS } from '@/utils/journeyLessonData';

const LEVEL_LABELS = {
  level1: 'Mốc 1: Khởi động',
  level2: 'Mốc 2: Luyện hiểu',
  level3: 'Mốc 3: Chốt bài',
};

const getResultStars = (mistakes, total) => {
  const safeTotal = Math.max(1, total);
  const accuracy = Math.max(0, safeTotal - mistakes) / safeTotal;
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.7) return 2;
  return 1;
};

const StageQuiz = () => {
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, completeLessonSegment } = useAuth();

  const requestedLevel = searchParams.get('level') || 'level1';
  const currentLevel = JOURNEY_LEVELS.includes(requestedLevel) ? requestedLevel : 'level1';
  const order = searchParams.get('order') || '1';

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [failedRewardSrc, setFailedRewardSrc] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`/api/lessons/${lessonId}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Không thể tải câu hỏi của chặng này.');
        setLesson(await response.json());
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.error('Lỗi tải bài học:', fetchError);
          setError(fetchError.message || 'Không thể tải bài học.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchLesson();
    return () => controller.abort();
  }, [lessonId]);

  const quizGroups = useMemo(() => getJourneyQuizGroups(lesson), [lesson]);
  const currentQuestions = quizGroups[currentLevel] || [];
  const rewardSrc = getLessonInfographicUrl(lesson, grade, order);
  const rewardImageError = failedRewardSrc === rewardSrc;

  const persistResult = async (result) => {
    if (!user) {
      setSaveError('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại để lưu tiến độ.');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    try {
      const response = await completeLessonSegment(lessonId, currentLevel, result.stars);
      if (!response?.success) throw new Error(response?.message || 'Không thể lưu mốc sao.');
      setLastResult(result);
      setShowResult(true);
      setPendingResult(null);
    } catch (saveFailure) {
      console.error('Lỗi khi lưu giai đoạn:', saveFailure);
      setSaveError(saveFailure.message || 'Không thể lưu tiến độ. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLevelComplete = ({ mistakes, total }) => {
    if (isSaving || showResult || pendingResult) return;
    const result = {
      mistakes,
      total,
      stars: getResultStars(mistakes, total),
    };
    setPendingResult(result);
    persistResult(result);
  };

  const handleContinue = () => navigate(`/classroom/${grade}/journey`);
  const handleCancel = () => navigate(`/classroom/${grade}/journey`);

  if (loading) return (
    <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || currentQuestions.length === 0) return (
    <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-xl">
        <div className="text-5xl">🧭</div>
        <h1 className="mt-4 text-xl font-black text-viet-text">
          {error ? 'Chưa tải được câu hỏi' : 'Mốc sao đang được cập nhật'}
        </h1>
        <p className="mt-3 text-sm font-medium leading-6 text-viet-text-light">
          {error || 'Bài học này chưa có câu hỏi hợp lệ cho mốc hiện tại. Tiến độ sẽ không bị ghi nhận sai.'}
        </p>
        <button type="button" onClick={handleCancel} className="mt-6 rounded-2xl bg-viet-green px-6 py-3 font-black text-white">
          Quay lại lộ trình
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-viet-border">
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đang làm</div>
          <div className="text-sm font-bold text-slate-700">{LEVEL_LABELS[currentLevel]}</div>
        </div>
      </div>

      <MissionModal
        key={currentLevel}
        lessonTitle={lesson?.title || 'Bài kiểm tra'}
        challenges={currentQuestions}
        onUnlock={handleLevelComplete}
        onCancel={handleCancel}
      />

      <AnimatePresence>
        {(isSaving || saveError) && !showResult && (
          <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              {isSaving ? (
                <>
                  <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-viet-green border-t-transparent" />
                  <h2 className="mt-5 text-lg font-black text-viet-text">Đang lưu mốc sao...</h2>
                  <p className="mt-2 text-sm text-viet-text-light">Vui lòng giữ nguyên màn hình trong giây lát.</p>
                </>
              ) : (
                <>
                  <div className="text-5xl">⚠️</div>
                  <h2 className="mt-4 text-lg font-black text-viet-text">Chưa lưu được tiến độ</h2>
                  <p className="mt-2 text-sm leading-6 text-viet-text-light">{saveError}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button type="button" onClick={handleCancel} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600">
                      Về lộ trình
                    </button>
                    <button type="button" onClick={() => pendingResult && persistResult(pendingResult)} className="rounded-2xl bg-viet-green px-4 py-3 text-sm font-black text-white">
                      Thử lưu lại
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] p-8 md:p-10 max-w-lg w-full text-center shadow-2xl border-4 border-viet-green my-8"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-viet-text mb-2">Hoàn thành mốc sao!</h2>
              <p className="text-viet-text-light font-medium mb-6 uppercase tracking-widest text-xs">
                {currentLevel === 'level1'
                  ? 'Bạn đã khởi động hành trình xuất sắc'
                  : currentLevel === 'level2'
                    ? 'Bạn đã nắm vững kiến thức'
                    : 'Bạn đã chốt bài thành công'}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex justify-around">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase">Chính xác</div>
                  <div className="text-xl font-black text-viet-green">{Math.max(0, lastResult.total - lastResult.mistakes)}/{lastResult.total}</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase">Số sao</div>
                  <div className="text-xl font-black text-amber-500">{'★'.repeat(lastResult.stars)}{'☆'.repeat(3 - lastResult.stars)}</div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', damping: 14 }}
                className="relative w-full bg-[#fcf8f0] rounded-[24px] border-2 border-viet-border overflow-hidden shadow-lg mb-6 group"
              >
                <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-viet-green text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-md">
                  Trang sổ tay mới
                </div>
                {!rewardImageError ? (
                  <img
                    src={rewardSrc}
                    alt={`Infographic - ${lesson?.title || 'Phần thưởng'}`}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={() => setFailedRewardSrc(rewardSrc)}
                  />
                ) : (
                  <div className="h-[420px]">
                    <LessonSummaryFallback lesson={lesson} compact />
                  </div>
                )}
              </motion.div>

              <button
                type="button"
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
