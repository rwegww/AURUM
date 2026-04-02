import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const PLACEMENT_TESTS = {
  9: [
    { question: "Nguyên tử được cấu tạo từ các loại hạt nào?", options: ["Proton và Neutron", "Proton và Electron", "Proton, Neutron và Electron", "Neutron và Electron"], correctAnswer: 2 },
    { question: "Hóa trị của Oxy thường là bao nhiêu?", options: ["I", "II", "III", "IV"], correctAnswer: 1 },
    { question: "Ký hiệu hóa học của Sắt là gì?", options: ["Fe", "Cu", "Ag", "Au"], correctAnswer: 0 },
    { question: "Phân tử khối của Nước (H2O) là bao nhiêu?", options: ["16", "17", "18", "20"], correctAnswer: 2 },
    { question: "Hiện tượng nào sau đây là hiện tượng hóa học?", options: ["Nước bay hơi", "Củi cháy thành than", "Hòa tan muối vào nước", "Bẻ gãy thước kẻ"], correctAnswer: 1 },
    { question: "Axit nào có trong dịch vị dạ dày?", options: ["H2SO4", "HNO3", "HCl", "CH3COOH"], correctAnswer: 2 },
    { question: "Chất nào làm quỳ tím hóa đỏ?", options: ["Bazơ", "Axit", "Muối", "Nước"], correctAnswer: 1 },
    { question: "Khí nào duy trì sự cháy?", options: ["Nitơ", "Cacbon đioxit", "Oxy", "Hiđro"], correctAnswer: 2 },
    { question: "Công thức hóa học của Muối ăn là gì?", options: ["NaOH", "HCl", "NaCl", "KCl"], correctAnswer: 2 },
    { question: "Đơn vị đo lượng chất trong hóa học là gì?", options: ["Gam", "Lít", "Mol", "Nguyên tử khối"], correctAnswer: 2 },
    { question: "Thanh kim loại nào dẫn điện tốt nhất?", options: ["Sắt", "Nhôm", "Bạc", "Đồng"], correctAnswer: 2 },
    { question: "Khí Hiđro nhẹ hơn hay nặng hơn không khí?", options: ["Nặng hơn nhiều", "Nặng hơn một chút", "Nhẹ hơn", "Bằng nhau"], correctAnswer: 2 }
  ],
  10: [
      // Placeholder for G10
      { question: "Bảng tuần hoàn hiện đại được sắp xếp theo chiều tăng dần của?", options: ["Khối lượng nguyên tử", "Số hiệu nguyên tử", "Số Neutron", "Số khối"], correctAnswer: 1 },
      { question: "Liên kết trong phân tử NaCl là liên kết gì?", options: ["Liên kết cộng hóa trị", "Liên kết Ion", "Liên kết Kim loại", "Liên kết Hiđro"], correctAnswer: 1 },
      { question: "Lớp electron ngoài cùng của khí hiếm thường có bao nhiêu electron?", options: ["2 hoặc 8", "4", "6", "1"], correctAnswer: 0 },
      { question: "Nguyên tố nào có độ âm điện lớn nhất?", options: ["Oxy", "Clo", "Flo", "Nitơ"], correctAnswer: 2 },
      { question: "Số electron tối đa trong lớp L (n=2) là?", options: ["2", "8", "18", "32"], correctAnswer: 1 },
      { question: "Phản ứng tỏa nhiệt là phản ứng?", options: ["Hấp thụ năng lượng", "Giải phóng năng lượng", "Không thay đổi năng lượng", "Xảy ra ở nhiệt độ thấp"], correctAnswer: 1 },
      { question: "Chất oxi hóa là chất?", options: ["Cho electron", "Nhận electron", "Tăng số oxi hóa", "Không tham gia phản ứng"], correctAnswer: 1 },
      { question: "Cấu hình electron của Neon (Z=10) là?", options: ["1s2 2s2 2p4", "1s2 2s2 2p6", "1s2 2s2 2p5", "1s2 2s2 2p2"], correctAnswer: 1 },
      { question: "Nguyên tố Halogen thuộc nhóm mấy?", options: ["IA", "VIIA", "VIIIA", "IVA"], correctAnswer: 1 },
      { question: "Công thức Lewis đại diện cho?", options: ["Tổng số hạt", "Lớp electron vỏ", "Số electron hóa trị", "Hạt nhân nguyên tử"], correctAnswer: 2 }
  ]
};

const PlacementTestModal = ({ grade, isOpen, onClose, onPass, firstLessonId }) => {
  const { updateProgress } = useAuth();
  const [step, setStep] = useState('start'); // start, quiz, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const questions = PLACEMENT_TESTS[grade] || PLACEMENT_TESTS[9];
  const passingScore = Math.ceil(questions.length * 0.7);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setStep('result');
      }
    }, 1000);
  };

  const handleFinish = async () => {
    if (score >= passingScore) {
      await updateProgress(500, firstLessonId);
      onPass();
    } else {
      onClose();
    }
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
          
          {/* Header */}
          <div className="bg-viet-green p-8 text-white relative">
             <div className="absolute top-4 right-4 text-white/20 text-6xl font-black">TEST</div>
             <h2 className="text-3xl font-black font-sora italic uppercase">Bài Test Học Vượt</h2>
             <p className="text-white/80 font-bold">Khám phá tiềm năng hóa học lớp {grade} của bạn</p>
          </div>

          <div className="p-10 flex-1 overflow-y-auto">
             <AnimatePresence mode="wait">
                {step === 'start' && (
                  <motion.div 
                    key="start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-10"
                  >
                     <div className="text-6xl mb-6">🎓</div>
                     <h3 className="text-2xl font-black text-viet-text mb-4 uppercase">Sẵn sàng thử thách?</h3>
                     <p className="text-viet-text-light font-bold mb-8 leading-relaxed">
                        Bài test gồm {questions.length} câu hỏi tổng hợp kiến thức nền tảng. 
                        Vượt qua {passingScore} câu để mở khóa chương trình Lớp {grade} ngay lập tức!
                     </p>
                     <button 
                       onClick={() => setStep('quiz')}
                       className="viet-btn-green w-full py-4 text-lg"
                     >
                       Bắt đầu ngay ➔
                     </button>
                  </motion.div>
                )}

                {step === 'quiz' && (
                  <motion.div 
                    key="quiz"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-viet-green uppercase tracking-widest bg-viet-green/5 px-4 py-2 rounded-full border border-viet-green/20">
                          Câu {currentQuestion + 1} / {questions.length}
                        </span>
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-viet-green transition-all duration-500"
                             style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                           />
                        </div>
                     </div>

                     <h4 className="text-2xl font-black text-viet-text leading-tight uppercase italic">
                        {questions[currentQuestion].question}
                     </h4>

                     <div className="grid grid-cols-1 gap-3">
                        {questions[currentQuestion].options.map((option, idx) => (
                           <button
                             key={idx}
                             onClick={() => handleAnswer(idx)}
                             className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center justify-between group
                               ${selectedAnswer === idx 
                                 ? isCorrect 
                                   ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                                   : 'border-red-500 bg-red-50 text-red-700'
                                 : 'border-gray-100 hover:border-viet-green/40 hover:bg-viet-green/5 text-viet-text'
                               }
                             `}
                           >
                              <span className="font-bold">{option}</span>
                              {selectedAnswer === idx && (
                                <span className="text-2xl">{isCorrect ? '✨' : '💥'}</span>
                              )}
                           </button>
                        ))}
                     </div>
                  </motion.div>
                )}

                {step === 'result' && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                     {score >= passingScore ? (
                       <>
                         <div className="text-7xl mb-6">🏆</div>
                         <h3 className="text-3xl font-black text-viet-green mb-2 uppercase italic">Hành Trình Đã Mở!</h3>
                         <p className="text-viet-text-light font-bold mb-8">
                           Tuyệt vời! Bạn đã đúng {score}/{questions.length} câu. 
                           Chương trình lớp {grade} đã sẵn sàng chờ đón bạn.
                         </p>
                         <div className="bg-viet-green/10 p-6 rounded-3xl border border-viet-green/20 mb-8 inline-block">
                            <p className="text-[10px] font-black text-viet-green uppercase tracking-widest mb-1">Thưởng Học Vượt</p>
                            <p className="text-4xl font-black text-viet-green">+500 XP</p>
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="text-7xl mb-6">📚</div>
                         <h3 className="text-3xl font-black text-red-500 mb-2 uppercase italic">Cần Cố Gắng Thêm</h3>
                         <p className="text-viet-text-light font-bold mb-8">
                           Bạn đúng {score}/{questions.length} câu. (Cần tối thiểu {passingScore} câu). 
                           Hãy ôn tập lại kiến thức lớp cũ trước khi thử lại nhé!
                         </p>
                       </>
                     )}

                     <button 
                       onClick={handleFinish}
                       className="viet-btn-green w-full py-4 text-lg"
                     >
                       {score >= passingScore ? "Bắt đầu hành trình ➔" : "Quay lại map"}
                     </button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            ✕
          </button>
      </div>
    </motion.div>
  );
};

export default PlacementTestModal;
