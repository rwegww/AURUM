import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const MissionModal = ({ challenges = [], lessonTitle, onUnlock, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [dragItems, setDragItems] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  const currentChallenge = challenges[currentStep] || {
    type: "image-selection",
    images: [
      "/assets/images/lab-equipment/beaker.png",
      "/assets/images/lab-equipment/test-tube.png",
      "/assets/images/lab-equipment/graduated-cylinder.png",
      "/assets/images/lab-equipment/erlenmeyer-flask.png"
    ],
    question: "Đâu là hình ảnh mô tả đúng nhất về 'Cốc thủy tinh' (Beaker)?",
    correctAnswer: 0,
    targetType: "dụng cụ",
    source: "Tư liệu thực hành"
  };

  const type = currentChallenge.type || 'multiple-choice';
  const progress = ((currentStep) / challenges.length) * 100;
  const isFinalStep = currentStep === challenges.length - 1;

  // Initialize Drag Items if needed
  useEffect(() => {
    if ((type === 'drag-drop' || type === 'matching') && currentChallenge.items) {
      setDragItems([...currentChallenge.items].sort(() => Math.random() - 0.5));
    }
    setInputValue("");
    setSelected(null);
    setIsCorrect(null);
  }, [currentStep]);

  const handleSelect = (index) => {
    if (isCorrect !== null) return;
    setSelected(index);
  };

  const validateAnswer = (answer) => {
    let correct = false;

    if (type === 'multiple-choice' || type === 'image-selection') {
      correct = answer === currentChallenge.correctAnswer;
    } else if (type === 'fill-in-the-blank') {
      const normalizedInput = answer.toLowerCase().trim();
      const normalizedTarget = (currentChallenge.correctAnswer || "").toLowerCase().trim();
      correct = normalizedInput === normalizedTarget;
    } else if (type === 'drag-drop' || type === 'matching') {
      correct = JSON.stringify(answer.map(i => i.id)) === JSON.stringify(currentChallenge.correctOrder);
    }

    if (correct) {
      setIsCorrect(true);
      setTimeout(() => {
        if (isFinalStep) {
          onUnlock();
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, 1200);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
        setSelected(null);
      }, 1200);
    }
  };

  // Label map for image-selection
  const imageLabels = ["1", "2", "3", "4"];

  // Determine header label
  const typeLabels = {
    'multiple-choice': 'Trắc nghiệm',
    'image-selection': 'Nhận biết hình ảnh',
    'fill-in-the-blank': 'Điền đáp án',
    'drag-drop': 'Sắp xếp',
    'matching': 'Nối cột A - B'
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 py-12 bg-[#fffbf0]/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[40px] border border-viet-border shadow-2xl overflow-hidden relative"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-viet-green/5">
           <motion.div 
             className="h-full bg-viet-green" 
             initial={{ width: '0%' }} 
             animate={{ width: `${progress}%` }} 
             transition={{ duration: 0.5 }}
           />
        </div>

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-viet-green/5 rounded-2xl flex items-center justify-center text-4xl border border-viet-green/10">
                   {type === 'image-selection' ? '🔍' : '🧭'}
                </div>
                <div>
                   <h3 className="text-[12px] font-black text-viet-green uppercase tracking-[3px] mb-1">{typeLabels[type] || 'Nhiệm vụ'}</h3>
                   <h2 className="text-xl font-bold text-viet-text line-clamp-1">{lessonTitle}</h2>
                </div>
             </div>
             <div className="text-right">
                <div className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1">Mục tiêu</div>
                <div className="text-lg font-black text-viet-green">
                   {currentStep + 1}<span className="text-viet-text-light/30"> / {challenges.length}</span>
                </div>
             </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#fcf8f0] rounded-[30px] p-6 mb-8 border border-viet-border"
            >
               {/* Character Narrative */}
               <div className="flex items-start gap-4 mb-6">
                  <img 
                    src="/assets/images/characters/professor_mole.png" 
                    className="w-14 h-14 object-contain grayscale-[0.5] opacity-80" 
                    alt="Prof Mole" 
                  />
                  <div className="bg-white px-4 py-3 rounded-2xl border border-viet-border text-[14px] font-medium text-viet-text-light relative shadow-sm">
                     <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-b border-viet-border rotate-45" />
                     {currentChallenge.narrative || "Hãy sử dụng kiến thức của bạn để hoàn thành thử thách này!"}
                  </div>
               </div>

               {/* Single Image (for MCQ / fill-blank) */}
               {type !== 'image-selection' && currentChallenge.image && (
                 <div className="aspect-[16/10] bg-white rounded-2xl border border-viet-border overflow-hidden mb-6 group relative">
                    <img 
                      src={currentChallenge.image} 
                      alt="Challenge" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm font-mono">
                       {currentChallenge.source || "Tư liệu"}
                    </div>
                 </div>
               )}

               <h4 className="text-[16px] font-black text-viet-text mb-6 text-center italic leading-relaxed">
                  {currentChallenge.question}
               </h4>

               {/* ========= Challenge Type Renderers ========= */}
               <div className="min-h-[120px] flex flex-col justify-center">

                  {/* ---- IMAGE SELECTION (2x2 Grid) ---- */}
                  {type === 'image-selection' && currentChallenge.images && (
                    <div className="grid grid-cols-2 gap-3">
                       {currentChallenge.images.map((imgSrc, i) => {
                         const isSelected = selected === i;
                         const isAnswered = isCorrect !== null;
                         const isRight = i === currentChallenge.correctAnswer;
                         
                         let borderClass = 'border-viet-border hover:border-viet-green/50';
                         if (isAnswered && isSelected && isRight) borderClass = 'border-viet-green ring-4 ring-viet-green/30';
                         if (isAnswered && isSelected && !isRight) borderClass = 'border-red-500 ring-4 ring-red-300/30';
                         if (isSelected && !isAnswered) borderClass = 'border-viet-green ring-2 ring-viet-green/20';
                         if (isAnswered && !isSelected) borderClass = 'opacity-40 border-viet-border grayscale-[0.5]';

                         return (
                           <button
                             key={i}
                             disabled={isAnswered}
                             onClick={() => handleSelect(i)}
                             className={`relative aspect-square rounded-2xl border-2 overflow-hidden transition-all duration-300 group ${borderClass}`}
                           >
                              <img 
                                src={imgSrc} 
                                alt={`Lựa chọn ${imageLabels[i]}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              {/* Label Badge */}
                              <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black shadow-lg transition-all
                                ${isSelected 
                                  ? 'bg-viet-green text-white scale-110' 
                                  : 'bg-white/90 text-viet-text-light backdrop-blur-sm'}
                              `}>
                                {imageLabels[i]}
                              </div>
                              {/* Checkmark overlay on correct */}
                              {isAnswered && isSelected && isRight && (
                                <motion.div 
                                  initial={{ scale: 0 }} 
                                  animate={{ scale: 1 }} 
                                  className="absolute inset-0 bg-viet-green/20 flex items-center justify-center"
                                >
                                  <span className="text-5xl">✅</span>
                                </motion.div>
                              )}
                              {isAnswered && isSelected && !isRight && (
                                <motion.div 
                                  initial={{ scale: 0 }} 
                                  animate={{ scale: 1 }} 
                                  className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
                                >
                                  <span className="text-5xl">❌</span>
                                </motion.div>
                              )}
                           </button>
                         );
                       })}
                    </div>
                  )}

                  {/* Confirm button for image-selection */}
                  {type === 'image-selection' && selected !== null && isCorrect === null && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => validateAnswer(selected)}
                      className="mt-4 w-full py-4 bg-viet-green text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:brightness-110 shadow-lg"
                    >
                      Xác nhận lựa chọn {imageLabels[selected]} ➔
                    </motion.button>
                  )}

                  {/* ---- MULTIPLE CHOICE (Text) ---- */}
                  {(type === 'multiple-choice') && currentChallenge.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {currentChallenge.options.map((opt, i) => (
                         <button
                           key={i}
                           disabled={isCorrect !== null}
                           onClick={() => { setSelected(i); validateAnswer(i); }}
                           className={`px-6 py-4 rounded-[18px] text-[13px] font-bold border-2 transition-all text-center
                             ${selected === i 
                               ? (i === currentChallenge.correctAnswer ? 'bg-viet-green border-viet-green text-white scale-95' : 'bg-red-500 border-red-500 text-white scale-95')
                               : 'bg-white border-viet-border text-viet-text-light hover:border-viet-green/40 hover:bg-viet-green/5 shadow-sm'}
                           `}
                         >
                           {opt}
                         </button>
                       ))}
                    </div>
                  )}

                  {/* ---- FILL IN THE BLANK ---- */}
                  {type === 'fill-in-the-blank' && (
                    <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
                       <input 
                         type="text"
                         value={inputValue}
                         onChange={(e) => setInputValue(e.target.value)}
                         placeholder={currentChallenge.placeholder || "Gõ câu trả lời..."}
                         className={`w-full px-6 py-4 rounded-2xl border-2 text-center text-[15px] font-bold outline-none transition-all
                           ${isCorrect === true ? 'border-viet-green bg-viet-green/5 text-viet-green' : 
                             isCorrect === false ? 'border-red-500 bg-red-50 text-red-500' : 'border-viet-border focus:border-viet-green'}
                         `}
                         onKeyDown={(e) => e.key === 'Enter' && !isCorrect && validateAnswer(inputValue)}
                       />
                       <button
                         onClick={() => validateAnswer(inputValue)}
                         disabled={!inputValue || isCorrect !== null}
                         className="w-full py-4 bg-viet-green text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:brightness-110 disabled:opacity-50"
                       >
                         Xác nhận
                       </button>
                    </div>
                  )}

                  {/* ---- DRAG & DROP ---- */}
                  {type === 'drag-drop' && (
                    <div className="flex flex-col gap-6">
                       <p className="text-[10px] text-center font-black text-viet-text-light/50 uppercase tracking-widest">Kéo để sắp xếp lại thứ tự đúng</p>
                       <Reorder.Group axis="y" values={dragItems} onReorder={setDragItems} className="flex flex-col gap-2">
                          {dragItems.map((item) => (
                            <Reorder.Item 
                              key={item.id} 
                              value={item}
                              disabled={isCorrect !== null}
                              className={`px-6 py-3 bg-white border-2 border-viet-border rounded-xl cursor-grab active:cursor-grabbing font-bold text-viet-text text-sm flex items-center gap-3 transition-colors ${isCorrect !== null ? 'opacity-50 select-none' : 'hover:border-viet-green/30'}`}
                            >
                               <span className="opacity-30">☰</span>
                               {item.label}
                            </Reorder.Item>
                          ))}
                       </Reorder.Group>
                       <button
                         onClick={() => validateAnswer(dragItems)}
                         disabled={isCorrect !== null}
                         className="w-full py-4 bg-viet-green text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:brightness-110 disabled:opacity-50 shadow-lg"
                       >
                         Xác nhận thứ tự ➔
                       </button>
                    </div>
                  )}

                  {/* ---- MATCHING (A - B) ---- */}
                  {type === 'matching' && currentChallenge.leftItems && (
                    <div className="flex flex-col gap-6">
                       <div className="grid grid-cols-2 gap-8 items-start relative">
                          {/* Column A (Static) */}
                          <div className="flex flex-col gap-2">
                             <div className="text-[10px] font-black text-viet-text-light/40 uppercase tracking-[3px] mb-2 px-2">Cột A</div>
                             {currentChallenge.leftItems.map((item, idx) => (
                               <div key={idx} className="h-[52px] px-6 py-3 bg-viet-green/5 border-2 border-viet-green/10 rounded-xl font-bold text-viet-green text-sm flex items-center shadow-sm">
                                  {item.label}
                               </div>
                             ))}
                          </div>
                          
                          {/* Column B (Draggable) */}
                          <div className="flex flex-col gap-2">
                             <div className="text-[10px] font-black text-viet-text-light/40 uppercase tracking-[3px] mb-2 px-2 text-right">Cột B (Kéo thả)</div>
                             <Reorder.Group axis="y" values={dragItems} onReorder={setDragItems} className="flex flex-col gap-2">
                                {dragItems.map((item) => (
                                  <Reorder.Item 
                                    key={item.id} 
                                    value={item}
                                    disabled={isCorrect !== null}
                                    className={`h-[52px] px-6 py-3 bg-white border-2 border-viet-border rounded-xl cursor-grab active:cursor-grabbing font-bold text-viet-text text-sm flex items-center justify-between group transition-all ${isCorrect !== null ? 'opacity-50' : 'hover:border-viet-green/40 shadow-sm hover:shadow-md'}`}
                                  >
                                     <span>{item.label}</span>
                                     <span className="opacity-20 group-hover:opacity-100 transition-opacity">☰</span>
                                  </Reorder.Item>
                                ))}
                             </Reorder.Group>
                          </div>

                          {/* Matching Lines (Visual Decor) */}
                          <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-12 opacity-5">
                             {[1,2,3].map(i => <div key={i} className="h-[2px] bg-viet-green w-full" />)}
                          </div>
                       </div>

                       <button
                         onClick={() => validateAnswer(dragItems)}
                         disabled={isCorrect !== null}
                         className="w-full py-4 bg-viet-green text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:brightness-110 disabled:opacity-50 shadow-xl"
                       >
                         Xác nhận liên kết ➔
                       </button>
                    </div>
                  )}
               </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer UI */}
          <div className="flex justify-between items-center mt-2">
             <button 
               onClick={onCancel}
               className="text-[11px] font-black text-viet-text-light/50 uppercase tracking-widest hover:text-red-500 transition-colors"
             >
               Hủy lộ trình
             </button>
             
             <AnimatePresence>
               {isCorrect === true && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-viet-green font-black text-[12px] uppercase flex items-center gap-2">
                   <span>✨ Chính xác! {isFinalStep ? "Hoàn thành nhiệm vụ!" : "Tiếp theo..."}</span>
                 </motion.div>
               )}
               {isCorrect === false && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 font-black text-[12px] uppercase flex items-center gap-2">
                   <span>❌ Chưa đúng, hãy thử lại!</span>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MissionModal;
