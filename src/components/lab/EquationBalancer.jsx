import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import EquationSkillTree from './EquationSkillTree';

const EquationBalancer = () => {
  const { user } = useAuth();
  const [view, setView] = useState('tree'); // 'tree' or 'stage'
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [progress, setProgress] = useState({
    completedNodeIds: [],
    completedCount: 0
  });

  // Fetch real progress from backend
  useEffect(() => {
    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/lab/balancing/progress', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setProgress(data);
            }
        } catch (err) {
            console.error('Lỗi tải tiến trình cân bằng:', err);
        }
    };
    fetchProgress();
  }, [user]);

  const saveProgress = async (newProgress) => {
    try {
        const token = localStorage.getItem('token');
        await fetch('/api/lab/balancing/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ balancingProgress: newProgress })
        });
    } catch (err) {
        console.error('Lỗi lưu tiến trình:', err);
    }
  };

  const handleSelectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    setView('stage');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <AnimatePresence mode="wait">
        {view === 'tree' ? (
          <motion.div
            key="tree"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
             <EquationSkillTree 
                progress={progress} 
                onSelectNode={handleSelectNode} 
             />
          </motion.div>
        ) : (
          <motion.div
            key="stage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <EquationStage 
                nodeId={selectedNodeId} 
                onBack={() => setView('tree')}
                onComplete={(qCount) => {
                    const isNewNode = !progress.completedNodeIds.includes(selectedNodeId);
                    const newProgress = {
                        completedCount: progress.completedCount + (isNewNode ? qCount : 0),
                        completedNodeIds: isNewNode 
                            ? [...progress.completedNodeIds, selectedNodeId]
                            : progress.completedNodeIds
                    };
                    setProgress(newProgress);
                    saveProgress(newProgress);
                    setView('tree');
                }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for the 6-question stage
const EquationStage = ({ nodeId, onBack, onComplete }) => {
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [userCoeffs, setUserCoeffs] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [stepStatus, setStepStatus] = useState(new Array(6).fill('idle'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/lab/balancing/${nodeId}`);
                const data = await res.json();
                
                if (data && data.length > 0) {
                    // Shuffle the questions as requested
                    const shuffled = [...data].sort(() => Math.random() - 0.5);
                    setQuestions(shuffled.slice(0, 6)); // Ensure we only take 6
                    setStepStatus(new Array(Math.min(data.length, 6)).fill('idle'));
                } else {
                    setQuestions([]);
                }
            } catch (err) {
                console.error('Error fetching questions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [nodeId]);

    const currentQuestion = questions[currentStep];
    const allFormulas = currentQuestion ? [...currentQuestion.reactants, ...currentQuestion.products] : [];

    useEffect(() => {
        if (allFormulas.length > 0) {
            setUserCoeffs(new Array(allFormulas.length).fill(1));
            setShowResult(false);
            setIsCorrect(false);
        }
    }, [currentStep, questions]);

    const checkAnswer = () => {
        const correct = currentQuestion.answer.every((a, i) => a === userCoeffs[i]);
        setIsCorrect(correct);
        setShowResult(true);
        setStepStatus(prev => {
            const next = [...prev];
            next[currentStep] = correct ? 'correct' : 'wrong';
            return next;
        });
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(questions.length);
        }
    };

    if (loading) return (
        <div className="bg-white rounded-[32px] border border-viet-border p-20 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-viet-green font-black uppercase tracking-widest text-[10px]">Đang tải thử thách...</p>
        </div>
    );

    if (!questions || questions.length === 0) return (
        <div className="bg-white rounded-[32px] border border-viet-border p-20 text-center">
            <p className="text-red-500 font-bold mb-4">Rất tiếc, không tìm thấy câu hỏi cho chặng này!</p>
            <button onClick={onBack} className="viet-btn-pill px-8 py-2">Quay lại cây kỹ năng</button>
        </div>
    );

    return (
        <div className="bg-white rounded-[32px] border border-viet-border p-10 shadow-sm relative overflow-hidden">
            <button onClick={onBack} className="absolute top-8 left-8 text-viet-text-light font-bold hover:text-viet-green transition-colors">← Thoát</button>
            <div className="text-center mb-12">
                <span className="text-[10px] font-black text-viet-green uppercase tracking-[4px]">Chặng số {nodeId}</span>
                <h2 className="text-2xl font-black text-viet-text italic">THỬ THÁCH CÂN BẰNG</h2>
            </div>

            {/* Step Indicators (the 6 dots/tabs) */}
            <div className="flex justify-center gap-3 mb-12">
                {stepStatus.map((status, i) => (
                    <div 
                        key={i}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all border-2 ${
                            i === currentStep ? 'bg-viet-green text-white border-viet-green shadow-lg' :
                            status === 'correct' ? 'bg-emerald-100 border-emerald-300 text-emerald-600' :
                            status === 'wrong' ? 'bg-red-100 border-red-300 text-red-600' :
                            'bg-gray-50 border-gray-100 text-gray-300'
                        }`}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>

            <div className="bg-[#fdfaf1] rounded-[24px] p-12 border border-viet-border/50 text-center">
                 <p className="text-[11px] font-black text-viet-green uppercase tracking-[3px] mb-8">Cân bằng phương trình sau</p>
                 
                 <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                    {allFormulas.map((f, i) => (
                        <React.Fragment key={i}>
                            {i === currentQuestion.reactants.length && <span className="text-3xl font-black text-viet-green">→</span>}
                            {i > 0 && i !== currentQuestion.reactants.length && <span className="text-2xl font-bold text-gray-300">+</span>}
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setUserCoeffs(p => { const next = [...p]; next[i] = Math.max(1, next[i]-1); return next; })} className="w-8 h-8 rounded-lg bg-white border border-gray-200 font-bold hover:bg-viet-green/5">−</button>
                                    <div className="w-12 h-12 rounded-xl bg-white border-2 border-viet-green/20 flex items-center justify-center text-xl font-black">{userCoeffs[i]}</div>
                                    <button onClick={() => setUserCoeffs(p => { const next = [...p]; next[i] = Math.min(20, next[i]+1); return next; })} className="w-8 h-8 rounded-lg bg-white border border-gray-200 font-bold hover:bg-viet-green/5">+</button>
                                </div>
                                <span className="text-2xl font-black text-viet-text">{f}</span>
                            </div>
                        </React.Fragment>
                    ))}
                 </div>

                 {showResult ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <p className={`text-lg font-black mb-6 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isCorrect ? '✨ TUYỆT VỜI, CHÍNH XÁC!' : `❌ SAI RỒI! ĐÁP ÁN LÀ: ${currentQuestion.answer.join(', ')}`}
                        </p>
                        <button onClick={handleNext} className="viet-btn-green px-12 py-4 shadow-xl">
                            {currentStep < 5 ? 'Câu tiếp theo →' : 'Hoàn thành chặng'}
                        </button>
                    </motion.div>
                 ) : (
                    <button onClick={checkAnswer} className="viet-btn-green px-12 py-4 shadow-xl">Kiểm tra kết quả</button>
                 )}
            </div>
        </div>
    );
};

export default EquationBalancer;
