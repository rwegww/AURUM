/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const PLACEMENT_TESTS = {
  9: [
    { question: "NguyÃªn tá»­ Ä‘Æ°á»£c cáº¥u táº¡o tá»« cÃ¡c loáº¡i háº¡t nÃ o?", options: ["Proton vÃ  Neutron", "Proton vÃ  Electron", "Proton, Neutron vÃ  Electron", "Neutron vÃ  Electron"], correctAnswer: 2 },
    { question: "HÃ³a trá»‹ cá»§a Oxy thÆ°á»ng lÃ  bao nhiÃªu?", options: ["I", "II", "III", "IV"], correctAnswer: 1 },
    { question: "KÃ½ hiá»‡u hÃ³a há»c cá»§a Sáº¯t lÃ  gÃ¬?", options: ["Fe", "Cu", "Ag", "Au"], correctAnswer: 0 },
    { question: "PhÃ¢n tá»­ khá»‘i cá»§a NÆ°á»›c (H2O) lÃ  bao nhiÃªu?", options: ["16", "17", "18", "20"], correctAnswer: 2 },
    { question: "Hiá»‡n tÆ°á»£ng nÃ o sau Ä‘Ã¢y lÃ  hiá»‡n tÆ°á»£ng hÃ³a há»c?", options: ["NÆ°á»›c bay hÆ¡i", "Cá»§i chÃ¡y thÃ nh than", "HÃ²a tan muá»‘i vÃ o nÆ°á»›c", "Báº» gÃ£y thÆ°á»›c káº»"], correctAnswer: 1 },
    { question: "Axit nÃ o cÃ³ trong dá»‹ch vá»‹ dáº¡ dÃ y?", options: ["H2SO4", "HNO3", "HCl", "CH3COOH"], correctAnswer: 2 },
    { question: "Cháº¥t nÃ o lÃ m quá»³ tÃ­m hÃ³a Ä‘á»?", options: ["BazÆ¡", "Axit", "Muá»‘i", "NÆ°á»›c"], correctAnswer: 1 },
    { question: "KhÃ­ nÃ o duy trÃ¬ sá»± chÃ¡y?", options: ["NitÆ¡", "Cacbon Ä‘ioxit", "Oxy", "HiÄ‘ro"], correctAnswer: 2 },
    { question: "CÃ´ng thá»©c hÃ³a há»c cá»§a Muá»‘i Äƒn lÃ  gÃ¬?", options: ["NaOH", "HCl", "NaCl", "KCl"], correctAnswer: 2 },
    { question: "ÄÆ¡n vá»‹ Ä‘o lÆ°á»£ng cháº¥t trong hÃ³a há»c lÃ  gÃ¬?", options: ["Gam", "LÃ­t", "Mol", "NguyÃªn tá»­ khá»‘i"], correctAnswer: 2 },
    { question: "Thanh kim loáº¡i nÃ o dáº«n Ä‘iá»‡n tá»‘t nháº¥t?", options: ["Sáº¯t", "NhÃ´m", "Báº¡c", "Äá»“ng"], correctAnswer: 2 },
    { question: "KhÃ­ HiÄ‘ro nháº¹ hÆ¡n hay náº·ng hÆ¡n khÃ´ng khÃ­?", options: ["Náº·ng hÆ¡n nhiá»u", "Náº·ng hÆ¡n má»™t chÃºt", "Nháº¹ hÆ¡n", "Báº±ng nhau"], correctAnswer: 2 }
  ],
  10: [
      // Placeholder for G10
      { question: "Báº£ng tuáº§n hoÃ n hiá»‡n Ä‘áº¡i Ä‘Æ°á»£c sáº¯p xáº¿p theo chiá»u tÄƒng dáº§n cá»§a?", options: ["Khá»‘i lÆ°á»£ng nguyÃªn tá»­", "Sá»‘ hiá»‡u nguyÃªn tá»­", "Sá»‘ Neutron", "Sá»‘ khá»‘i"], correctAnswer: 1 },
      { question: "LiÃªn káº¿t trong phÃ¢n tá»­ NaCl lÃ  liÃªn káº¿t gÃ¬?", options: ["LiÃªn káº¿t cá»™ng hÃ³a trá»‹", "LiÃªn káº¿t Ion", "LiÃªn káº¿t Kim loáº¡i", "LiÃªn káº¿t HiÄ‘ro"], correctAnswer: 1 },
      { question: "Lá»›p electron ngoÃ i cÃ¹ng cá»§a khÃ­ hiáº¿m thÆ°á»ng cÃ³ bao nhiÃªu electron?", options: ["2 hoáº·c 8", "4", "6", "1"], correctAnswer: 0 },
      { question: "NguyÃªn tá»‘ nÃ o cÃ³ Ä‘á»™ Ã¢m Ä‘iá»‡n lá»›n nháº¥t?", options: ["Oxy", "Clo", "Flo", "NitÆ¡"], correctAnswer: 2 },
      { question: "Sá»‘ electron tá»‘i Ä‘a trong lá»›p L (n=2) lÃ ?", options: ["2", "8", "18", "32"], correctAnswer: 1 },
      { question: "Pháº£n á»©ng tá»a nhiá»‡t lÃ  pháº£n á»©ng?", options: ["Háº¥p thá»¥ nÄƒng lÆ°á»£ng", "Giáº£i phÃ³ng nÄƒng lÆ°á»£ng", "KhÃ´ng thay Ä‘á»•i nÄƒng lÆ°á»£ng", "Xáº£y ra á»Ÿ nhiá»‡t Ä‘á»™ tháº¥p"], correctAnswer: 1 },
      { question: "Cháº¥t oxi hÃ³a lÃ  cháº¥t?", options: ["Cho electron", "Nháº­n electron", "TÄƒng sá»‘ oxi hÃ³a", "KhÃ´ng tham gia pháº£n á»©ng"], correctAnswer: 1 },
      { question: "Cáº¥u hÃ¬nh electron cá»§a Neon (Z=10) lÃ ?", options: ["1s2 2s2 2p4", "1s2 2s2 2p6", "1s2 2s2 2p5", "1s2 2s2 2p2"], correctAnswer: 1 },
      { question: "NguyÃªn tá»‘ Halogen thuá»™c nhÃ³m máº¥y?", options: ["IA", "VIIA", "VIIIA", "IVA"], correctAnswer: 1 },
      { question: "CÃ´ng thá»©c Lewis Ä‘áº¡i diá»‡n cho?", options: ["Tá»•ng sá»‘ háº¡t", "Lá»›p electron vá»", "Sá»‘ electron hÃ³a trá»‹", "Háº¡t nhÃ¢n nguyÃªn tá»­"], correctAnswer: 2 }
  ]
};

export const AVAILABLE_PLACEMENT_TEST_GRADES = Object.keys(PLACEMENT_TESTS);

const PlacementTestModal = ({ grade, isOpen, onClose, onPass }) => {
  const { completePlacementTest } = useAuth();
  const [step, setStep] = useState('start'); // start, quiz, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const normalizedGrade = String(grade);
  const questions = PLACEMENT_TESTS[normalizedGrade] || [];
  const hasPlacementTest = questions.length > 0;
  const passingScore = Math.ceil(questions.length * 0.7);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null || !questions[currentQuestion]) return;
    
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
      await completePlacementTest(normalizedGrade);
      onPass();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (!hasPlacementTest) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      >
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-black text-viet-text mb-3 uppercase">Chua co bai test</h2>
          <p className="text-viet-text-light font-bold mb-6">
            He thong chua co du lieu placement test cho lop {normalizedGrade}. Hay hoc theo lo trinh duoc mo khoa san.
          </p>
          <button onClick={onClose} className="viet-btn-green w-full py-4 text-lg">
            Quay lai
          </button>
        </div>
      </motion.div>
    );
  }

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
             <h2 className="text-3xl font-black font-sora italic uppercase">BÃ i Test Há»c VÆ°á»£t</h2>
             <p className="text-white/80 font-bold">KhÃ¡m phÃ¡ tiá»m nÄƒng hÃ³a há»c lá»›p {grade} cá»§a báº¡n</p>
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
                     <div className="text-6xl mb-6">ðŸŽ“</div>
                     <h3 className="text-2xl font-black text-viet-text mb-4 uppercase">Sáºµn sÃ ng thá»­ thÃ¡ch?</h3>
                     <p className="text-viet-text-light font-bold mb-8 leading-relaxed">
                        BÃ i test gá»“m {questions.length} cÃ¢u há»i tá»•ng há»£p kiáº¿n thá»©c ná»n táº£ng. 
                        VÆ°á»£t qua {passingScore} cÃ¢u Ä‘á»ƒ má»Ÿ khÃ³a chÆ°Æ¡ng trÃ¬nh Lá»›p {grade} ngay láº­p tá»©c!
                     </p>
                     <button 
                       onClick={() => setStep('quiz')}
                       className="viet-btn-green w-full py-4 text-lg"
                     >
                       Báº¯t Ä‘áº§u ngay âž”
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
                          CÃ¢u {currentQuestion + 1} / {questions.length}
                        </span>
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-viet-green transition-all duration-500"
                             style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                           />
                        </div>
                     </div>

                     <h4 className="text-2xl font-black text-viet-text leading-tight uppercase italic">
                        {questions[currentQuestion].question || questions[currentQuestion].content}
                     </h4>

                     <div className="grid grid-cols-1 gap-3">
                        {(Array.isArray(questions[currentQuestion].options) ? questions[currentQuestion].options : (questions[currentQuestion].options ? Object.values(questions[currentQuestion].options) : [])).map((option, idx) => (
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
                                <span className="text-2xl">{isCorrect ? 'âœ¨' : 'ðŸ’¥'}</span>
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
                         <div className="text-7xl mb-6">ðŸ†</div>
                         <h3 className="text-3xl font-black text-viet-green mb-2 uppercase italic">HÃ nh TrÃ¬nh ÄÃ£ Má»Ÿ!</h3>
                         <p className="text-viet-text-light font-bold mb-8">
                           Tuyá»‡t vá»i! Báº¡n Ä‘Ã£ Ä‘Ãºng {score}/{questions.length} cÃ¢u. 
                           ChÆ°Æ¡ng trÃ¬nh lá»›p {grade} Ä‘Ã£ sáºµn sÃ ng chá» Ä‘Ã³n báº¡n.
                         </p>
                         <div className="bg-viet-green/10 p-6 rounded-3xl border border-viet-green/20 mb-8 inline-block">
                            <p className="text-[10px] font-black text-viet-green uppercase tracking-widest mb-1">ThÆ°á»Ÿng Há»c VÆ°á»£t</p>
                            <p className="text-4xl font-black text-viet-green">+500 XP</p>
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="text-7xl mb-6">ðŸ“š</div>
                         <h3 className="text-3xl font-black text-red-500 mb-2 uppercase italic">Cáº§n Cá»‘ Gáº¯ng ThÃªm</h3>
                         <p className="text-viet-text-light font-bold mb-8">
                           Báº¡n Ä‘Ãºng {score}/{questions.length} cÃ¢u. (Cáº§n tá»‘i thiá»ƒu {passingScore} cÃ¢u). 
                           HÃ£y Ã´n táº­p láº¡i kiáº¿n thá»©c lá»›p cÅ© trÆ°á»›c khi thá»­ láº¡i nhÃ©!
                         </p>
                       </>
                     )}

                     <button 
                       onClick={handleFinish}
                       className="viet-btn-green w-full py-4 text-lg"
                     >
                       {score >= passingScore ? "Báº¯t Ä‘áº§u hÃ nh trÃ¬nh âž”" : "Quay láº¡i map"}
                     </button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            âœ•
          </button>
      </div>
    </motion.div>
  );
};

export default PlacementTestModal;

