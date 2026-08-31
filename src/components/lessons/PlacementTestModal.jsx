/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, GraduationCap, Trophy } from 'lucide';
import MorphIcon from '@/components/common/MorphIcon';
import MathText from '@/components/common/MathText';
import { useAuth } from '@/context/AuthContext';

export const AVAILABLE_PLACEMENT_TEST_GRADES = Object.freeze(['9', '10', '11', '12']);

const PlacementTestModal = ({ grade, isOpen, onClose, onPass }) => {
  const { startOptionalPlacementTest, completePlacementTest } = useAuth();
  const [step, setStep] = useState('start');
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const normalizedGrade = String(grade);
  const questions = assessment?.questions || [];
  const question = questions[currentQuestion];
  const selectedAnswer = question ? answers[question.id] : undefined;

  const handleStart = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    const response = await startOptionalPlacementTest(normalizedGrade);
    setIsSubmitting(false);

    if (!response.success || !response.assessment?.questions?.length) {
      setError(response.message || 'Không thể tải bài kiểm tra học vượt.');
      return;
    }

    setAssessment(response.assessment);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setStep('quiz');
  };

  const handleNext = async () => {
    if (!question || !Number.isInteger(selectedAnswer) || isSubmitting) return;
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(index => index + 1);
      setError('');
      return;
    }

    setIsSubmitting(true);
    setError('');
    const response = await completePlacementTest(assessment.attemptId, answers);
    setIsSubmitting(false);

    if (!response.success || !response.result) {
      setError(response.message || 'Không thể chấm bài kiểm tra.');
      return;
    }

    setResult(response.result);
    setStep('result');
  };

  const handleFinish = () => {
    if (result?.passed) onPass();
    else onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-viet-green p-8 text-white relative">
          <div className="absolute top-4 right-4 text-white/20 text-6xl font-black">TEST</div>
          <h2 className="text-3xl font-black font-sora italic uppercase">Bài Test Học Vượt</h2>
          <p className="text-white/80 font-bold">Khám phá tiềm năng hóa học lớp {normalizedGrade} của bạn</p>
        </div>

        <div className="p-8 md:p-10 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'start' && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-10"
              >
                <div className="mb-6 flex justify-center text-viet-green">
                  <MorphIcon icon={GraduationCap} size={64} className="w-16 h-16 text-viet-green" />
                </div>
                <h3 className="text-2xl font-black text-viet-text mb-4 uppercase">Sẵn sàng thử thách?</h3>
                <p className="text-viet-text-light font-bold mb-8 leading-relaxed">
                  Đề thi được tải và chấm trực tiếp trên máy chủ. Đạt tối thiểu 70% để mở khóa chương trình lớp {normalizedGrade} và nhận 500 XP.
                </p>
                {error && <p className="mb-5 text-sm font-bold text-red-500" role="alert">{error}</p>}
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={isSubmitting}
                  className="viet-btn-green w-full py-4 text-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang tải đề...' : 'Bắt đầu ngay ➔'}
                </button>
              </motion.div>
            )}

            {step === 'quiz' && question && (
              <motion.div
                key={`quiz-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] font-black text-viet-green uppercase tracking-widest bg-viet-green/5 px-4 py-2 rounded-full border border-viet-green/20">
                    Câu {currentQuestion + 1} / {questions.length}
                  </span>
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-viet-green transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
                  </div>
                </div>

                <h4 className="text-2xl font-bold text-viet-text leading-tight">
                  <MathText>{question.question || question.content}</MathText>
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {(question.options || []).map((option, index) => (
                    <button
                      type="button"
                      key={`${index}-${option}`}
                      onClick={() => {
                        setAnswers(current => ({ ...current, [question.id]: index }));
                        setError('');
                      }}
                      className={`p-5 rounded-3xl border-2 text-left transition-all ${
                        selectedAnswer === index
                          ? 'border-viet-green bg-viet-green/5 text-viet-green'
                          : 'border-gray-100 hover:border-viet-green/40 hover:bg-viet-green/5 text-viet-text'
                      }`}
                    >
                      <span className="font-bold"><MathText>{option}</MathText></span>
                    </button>
                  ))}
                </div>

                {error && <p className="text-sm font-bold text-red-500" role="alert">{error}</p>}
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentQuestion(index => Math.max(0, index - 1))}
                    disabled={currentQuestion === 0 || isSubmitting}
                    className="px-5 py-3 font-black text-sm text-viet-text-light disabled:opacity-30"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!Number.isInteger(selectedAnswer) || isSubmitting}
                    className="viet-btn-green min-w-40 px-6 py-3 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang chấm...' : currentQuestion === questions.length - 1 ? 'Nộp bài' : 'Tiếp tục'}
                  </button>
                </div>
                <p className="text-center text-[11px] font-bold text-viet-text-light/60">Kết quả chỉ được xác nhận sau khi máy chủ chấm toàn bộ bài.</p>
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                {result.passed ? (
                  <>
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-amber-100 text-amber-600">
                      <MorphIcon icon={Trophy} size={40} className="h-10 w-10" aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-black text-viet-green mb-2 uppercase italic">Hành Trình Đã Mở!</h3>
                    <p className="text-viet-text-light font-bold mb-8">
                      Máy chủ xác nhận bạn đúng {result.correct}/{result.total} câu ({result.percent}%). Chương trình lớp {result.grade} đã được mở khóa.
                    </p>
                    <div className="bg-viet-green/10 p-6 rounded-3xl border border-viet-green/20 mb-8 inline-block">
                      <p className="text-[10px] font-black text-viet-green uppercase tracking-widest mb-1">Thưởng Học Vượt</p>
                      <p className="text-4xl font-black text-viet-green">+500 XP</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6 flex justify-center text-red-500">
                      <MorphIcon icon={BookOpen} size={64} className="w-16 h-16 text-red-500" />
                    </div>
                    <h3 className="text-3xl font-black text-red-500 mb-2 uppercase italic">Cần Cố Gắng Thêm</h3>
                    <p className="text-viet-text-light font-bold mb-8">
                      Bạn đúng {result.correct}/{result.total} câu ({result.percent}%). Hãy ôn tập lại kiến thức trước khi thử lại.
                    </p>
                  </>
                )}

                <button type="button" onClick={handleFinish} className="viet-btn-green w-full py-4 text-lg">
                  {result.passed ? 'Bắt đầu hành trình ➔' : 'Quay lại bản đồ'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step !== 'result' && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            aria-label="Đóng bài kiểm tra"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PlacementTestModal;
