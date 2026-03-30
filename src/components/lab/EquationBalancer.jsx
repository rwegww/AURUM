import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { balancingExercises } from '@/utils/balancer';

const EquationBalancer = () => {
  const [mode, setMode] = useState('practice'); // 'practice' or 'free'
  const [currentEx, setCurrentEx] = useState(0);
  const [userCoeffs, setUserCoeffs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);

  // Free mode state
  const [freeReactants, setFreeReactants] = useState('');
  const [freeProducts, setFreeProducts] = useState('');

  const exercise = balancingExercises[currentEx];

  // Initialize user coefficients when exercise changes
  React.useEffect(() => {
    if (exercise) {
      const totalCompounds = exercise.reactants.length + exercise.products.length;
      setUserCoeffs(new Array(totalCompounds).fill(1));
      setShowResult(false);
      setShowHint(false);
      setIsCorrect(false);
    }
  }, [currentEx, exercise]);

  const updateCoeff = (index, delta) => {
    setUserCoeffs(prev => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(10, next[index] + delta));
      return next;
    });
  };

  const checkAnswer = () => {
    const correct = exercise.answer.every((a, i) => a === userCoeffs[i]);
    setIsCorrect(correct);
    setShowResult(true);
    if (correct && !completedExercises.includes(currentEx)) {
      setScore(prev => prev + 1);
      setCompletedExercises(prev => [...prev, currentEx]);
    }
  };

  const nextExercise = () => {
    if (currentEx + 1 < balancingExercises.length) {
      setCurrentEx(currentEx + 1);
    }
  };

  const prevExercise = () => {
    if (currentEx > 0) {
      setCurrentEx(currentEx - 1);
    }
  };

  const getDifficultyColor = (d) => {
    switch (d) {
      case 'easy': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (d) => {
    switch (d) {
      case 'easy': return 'Cơ bản';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Nâng cao';
      default: return d;
    }
  };

  const allFormulas = exercise ? [...exercise.reactants, ...exercise.products] : [];

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex bg-[#f0f2f5] p-1.5 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setMode('practice')}
          className={`flex-1 py-3 rounded-xl text-[13px] font-black uppercase tracking-wider transition-all ${
            mode === 'practice' ? 'bg-white text-viet-green shadow-sm' : 'text-viet-text-light'
          }`}
        >
          🎯 Luyện tập
        </button>
        <button
          onClick={() => setMode('free')}
          className={`flex-1 py-3 rounded-xl text-[13px] font-black uppercase tracking-wider transition-all ${
            mode === 'free' ? 'bg-white text-viet-green shadow-sm' : 'text-viet-text-light'
          }`}
        >
          ✏️ Tự do
        </button>
      </div>

      {mode === 'practice' ? (
        <>
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl border border-viet-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-viet-text-light uppercase tracking-widest">
                Tiến trình: {score}/{balancingExercises.length}
              </span>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${getDifficultyColor(exercise?.difficulty)}`}>
                {getDifficultyLabel(exercise?.difficulty)}
              </span>
            </div>
            <div className="w-full h-2 bg-[#f0f2f5] rounded-full overflow-hidden">
              <div className="h-full bg-viet-green transition-all duration-500" style={{ width: `${(score / balancingExercises.length) * 100}%` }} />
            </div>
          </div>

          {/* Exercise Navigation */}
          <div className="flex items-center justify-center gap-2">
            {balancingExercises.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => setCurrentEx(i)}
                className={`w-10 h-10 rounded-xl text-[13px] font-black transition-all border-2 ${
                  i === currentEx
                    ? 'bg-viet-green text-white border-viet-green shadow-lg shadow-viet-green/20'
                    : completedExercises.includes(i)
                    ? 'bg-emerald-100 text-emerald-600 border-emerald-200'
                    : 'bg-white text-viet-text-light border-viet-border hover:border-viet-green/30'
                }`}
              >
                {completedExercises.includes(i) ? '✓' : i + 1}
              </button>
            ))}
          </div>

          {/* Equation Display with Coefficient Controls */}
          {exercise && (
            <div className="bg-white rounded-[28px] border border-viet-border p-8 shadow-sm">
              <h3 className="text-[12px] font-black text-viet-green uppercase tracking-widest mb-8 text-center">
                Cân bằng phương trình sau
              </h3>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {allFormulas.map((formula, i) => (
                  <React.Fragment key={i}>
                    {i === exercise.reactants.length && (
                      <span className="text-3xl text-viet-green font-black mx-2">→</span>
                    )}
                    {i > 0 && i !== exercise.reactants.length && (
                      <span className="text-2xl text-viet-text-light font-bold">+</span>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      {/* Coefficient Control */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCoeff(i, -1)}
                          disabled={showResult}
                          className="w-8 h-8 rounded-lg bg-[#f0f2f5] border border-viet-border text-viet-text font-bold hover:bg-viet-green/10 hover:border-viet-green/30 transition-all text-lg leading-none disabled:opacity-40"
                        >
                          −
                        </button>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black border-2 transition-all ${
                          showResult
                            ? userCoeffs[i] === exercise.answer[i]
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                              : 'bg-red-100 border-red-400 text-red-700'
                            : 'bg-white border-viet-green/30 text-viet-text'
                        }`}>
                          {userCoeffs[i]}
                        </div>
                        <button
                          onClick={() => updateCoeff(i, 1)}
                          disabled={showResult}
                          className="w-8 h-8 rounded-lg bg-[#f0f2f5] border border-viet-border text-viet-text font-bold hover:bg-viet-green/10 hover:border-viet-green/30 transition-all text-lg leading-none disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      {/* Formula */}
                      <span className="text-2xl font-black text-viet-text">{formula}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Hint Button */}
              <div className="mt-8 text-center">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-[12px] font-bold text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    💡 Xem gợi ý
                  </button>
                ) : (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[13px] font-medium text-blue-600 bg-blue-50 rounded-xl p-3 inline-block"
                  >
                    💡 {exercise.hint}
                  </motion.p>
                )}
              </div>

              {/* Check / Next Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                {!showResult ? (
                  <button onClick={checkAnswer} className="viet-btn-green px-10 py-3 text-[14px]">
                    Kiểm tra kết quả
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-4 rounded-2xl ${isCorrect ? 'bg-emerald-50' : 'bg-red-50'}`}
                    >
                      <p className={`text-lg font-black ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isCorrect ? '🎉 Chính xác!' : '❌ Chưa đúng'}
                      </p>
                      {!isCorrect && (
                        <p className="text-[13px] font-medium text-viet-text-light mt-2">
                          Đáp án đúng: {exercise.answer.join(', ')}
                        </p>
                      )}
                    </motion.div>
                    <div className="flex gap-3 justify-center">
                      <button onClick={prevExercise} disabled={currentEx === 0} className="px-6 py-2 rounded-xl border border-viet-border font-bold text-viet-text-light disabled:opacity-30">
                        ← Trước
                      </button>
                      <button onClick={nextExercise} disabled={currentEx >= balancingExercises.length - 1} className="viet-btn-green px-6 py-2">
                        Tiếp theo →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Free Mode */
        <div className="bg-white rounded-[28px] border border-viet-border p-8 shadow-sm">
          <h3 className="text-[12px] font-black text-viet-green uppercase tracking-widest mb-6 text-center">
            Nhập phương trình cần cân bằng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div>
              <label className="text-[11px] font-black text-viet-text-light uppercase tracking-widest mb-2 block">Chất tham gia</label>
              <input
                type="text"
                value={freeReactants}
                onChange={(e) => setFreeReactants(e.target.value)}
                placeholder="VD: Fe + O₂"
                className="w-full h-[50px] bg-[#f8f9fa] border border-viet-border rounded-xl px-4 text-[16px] text-viet-text font-bold outline-none focus:border-viet-green/50"
              />
            </div>
            <div className="text-3xl font-black text-viet-green text-center py-2">→</div>
            <div>
              <label className="text-[11px] font-black text-viet-text-light uppercase tracking-widest mb-2 block">Sản phẩm</label>
              <input
                type="text"
                value={freeProducts}
                onChange={(e) => setFreeProducts(e.target.value)}
                placeholder="VD: Fe₂O₃"
                className="w-full h-[50px] bg-[#f8f9fa] border border-viet-border rounded-xl px-4 text-[16px] text-viet-text font-bold outline-none focus:border-viet-green/50"
              />
            </div>
          </div>
          <div className="mt-8 p-6 bg-[#fdfaf1] rounded-2xl border border-viet-border text-center">
            <p className="text-viet-text-light font-medium text-[14px]">
              ⚗️ Chức năng cân bằng tự do đang được phát triển. Hãy sử dụng chế độ <strong>Luyện tập</strong> để rèn luyện kỹ năng!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquationBalancer;
