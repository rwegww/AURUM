import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, GraduationCap, LoaderCircle, RotateCcw, Trophy, XCircle } from 'lucide-react';

const GradePlacementModal = ({ assessment, onClose, onSubmit, onPass, onFail }) => {
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const questions = assessment?.questions || [];
  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((question) => Number.isInteger(answers[question.id])).length;

  if (!assessment || !currentQuestion) return null;

  const selectAnswer = (answerIndex) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: answerIndex }));
    setError('');
  };

  const handleNext = async () => {
    if (!Number.isInteger(answers[currentQuestion.id])) {
      setError('Hãy chọn một đáp án trước khi tiếp tục.');
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    setSubmitting(true);
    setError('');
    const response = await onSubmit({ attemptId: assessment.attemptId, answers });
    setSubmitting(false);
    if (!response?.success) {
      setError(response?.message || 'Chưa thể chấm bài. Vui lòng thử lại.');
      return;
    }
    setResult(response);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`Bài đánh giá xếp lớp ${assessment.grade}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
      >
        <header className="relative bg-viet-green px-7 py-6 text-white md:px-9">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15">
              <GraduationCap size={30} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Xếp lớp ban đầu</p>
              <h2 className="mt-1 text-2xl font-black">Bài đánh giá khối {assessment.grade}</h2>
              <p className="mt-1 text-sm font-semibold text-white/80">Cần đạt từ {assessment.passingPercent}% để xác nhận khối.</p>
            </div>
          </div>
          {!result && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/10 text-xl text-white/80 hover:bg-black/20"
              aria-label="Đóng bài đánh giá"
            >
              ×
            </button>
          )}
        </header>

        <div className="p-7 md:p-9">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <div className="mb-7 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                    Câu {currentIndex + 1}/{questions.length}
                  </span>
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-viet-green transition-all"
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-black leading-8 text-slate-900 md:text-2xl">{currentQuestion.question}</h3>
                <div className="mt-6 grid gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const selected = answers[currentQuestion.id] === index;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectAnswer(index)}
                        className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left font-bold transition-all ${
                          selected
                            ? 'border-viet-green bg-emerald-50 text-emerald-900'
                            : 'border-slate-100 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50'
                        }`}
                      >
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black ${selected ? 'bg-viet-green text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {error && <p className="mt-4 text-sm font-bold text-red-600">{error}</p>}

                <div className="mt-7 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                    disabled={currentIndex === 0 || submitting}
                    className="rounded-xl px-4 py-3 text-sm font-black text-slate-500 disabled:opacity-30"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={submitting}
                    className="inline-flex min-w-40 items-center justify-center gap-2 rounded-2xl bg-viet-green px-6 py-4 text-sm font-black text-white shadow-lg disabled:opacity-60"
                  >
                    {submitting ? <LoaderCircle className="animate-spin" size={20} /> : currentIndex === questions.length - 1 ? 'Nộp bài' : 'Tiếp tục'}
                    {!submitting && <ArrowRight size={19} />}
                  </button>
                </div>
                <p className="mt-5 text-center text-xs font-semibold text-slate-400">Đã trả lời {answeredCount}/{questions.length} câu · Kết quả được chấm trên máy chủ</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center"
              >
                {result.result.passed ? (
                  <>
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-amber-100 text-amber-600"><Trophy size={42} /></div>
                    <h3 className="mt-5 text-3xl font-black text-emerald-700">Bạn đã được xếp vào khối {result.result.grade}</h3>
                    <p className="mx-auto mt-3 max-w-lg font-semibold leading-7 text-slate-600">
                      Bạn trả lời đúng {result.result.correct}/{result.result.total} câu ({result.result.percent}%). Bài học đầu tiên đã sẵn sàng.
                    </p>
                    <button
                      type="button"
                      onClick={() => onPass(result)}
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-viet-green px-6 py-4 font-black text-white"
                    >
                      Vào bài học đầu tiên <ArrowRight size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-red-100 text-red-600"><XCircle size={42} /></div>
                    <h3 className="mt-5 text-3xl font-black text-slate-900">Chưa phù hợp với khối {result.result.grade}</h3>
                    <p className="mx-auto mt-3 max-w-lg font-semibold leading-7 text-slate-600">
                      Bạn trả lời đúng {result.result.correct}/{result.result.total} câu ({result.result.percent}%). Hệ thống gợi ý thử khối {result.result.recommendedGrade}; bạn vẫn có thể chọn lại bất kỳ khối nào.
                    </p>
                    <button
                      type="button"
                      onClick={() => onFail(result)}
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-black text-white"
                    >
                      <RotateCcw size={20} /> Chọn lại khối
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GradePlacementModal;
