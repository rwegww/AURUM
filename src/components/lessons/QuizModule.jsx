import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizModule = ({ quizData = [] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  if (!quizData || quizData.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-viet-border">
        <p className="text-viet-text-light font-bold">Chưa có bài tập cho phần này.</p>
      </div>
    );
  }

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === quizData[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-[11px] font-black text-viet-green uppercase tracking-widest bg-viet-green/5 px-3 py-1 rounded-full">
                Câu hỏi {currentQuestion + 1}/{quizData.length}
              </span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-viet-green transition-all" 
                  style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-xl font-black text-viet-text mb-8 leading-tight">
              {quizData[currentQuestion].question}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                    selectedAnswer === index
                      ? isCorrect 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-viet-border hover:border-viet-green/30 hover:bg-viet-green/5 text-viet-text'
                  }`}
                >
                  <span className="font-bold">{option}</span>
                  {selectedAnswer === index && (
                    <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border border-viet-border p-12 text-center shadow-xl"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-black text-viet-text mb-2">Hoàn thành bài tập!</h2>
            <p className="text-viet-text-light font-bold text-lg mb-8">
              Bạn trả lời đúng {score}/{quizData.length} câu.
            </p>

            <div className="inline-block px-8 py-4 bg-viet-green/10 rounded-2xl border border-viet-green/20 mb-8">
              <p className="text-[11px] font-black text-viet-green uppercase tracking-widest mb-1">Kinh nghiệm nhận được</p>
              <p className="text-3xl font-black text-viet-green">+{score * 10} XP</p>
            </div>

            <button 
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setShowResult(false);
                setSelectedAnswer(null);
                setIsCorrect(null);
              }}
              className="viet-btn-green w-full"
            >
              Làm lại thử thách
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizModule;
