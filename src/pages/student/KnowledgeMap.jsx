import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CHEMISTRY_KNOWLEDGE_BASE } from '@/data/theory';
import { Link } from 'react-router-dom';
import { 
  Atom, 
  Beaker, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Dna, 
  CircleDot, 
  ArrowLeft,
  ChevronRight,
  Info,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

const CATEGORY_META = {
  'Đại cương': { icon: Atom, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  'Liên kết': { icon: CircleDot, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  'Mol và định lượng': { icon: Beaker, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'Chất khí': { icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  'Dung dịch': { icon: Beaker, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  'Axit – bazơ – muối': { icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  'Phản ứng hóa học': { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  'Động hóa học': { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  'Cân bằng hóa học': { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  'Nhiệt hóa học': { icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
  'Oxi hóa – khử': { icon: Zap, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  'Điện hóa': { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-600/10' },
  'Kim loại': { icon: Dna, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  'Phi kim': { icon: Globe, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  'Hữu cơ': { icon: Dna, color: 'text-green-600', bg: 'bg-green-600/10' },
  'An toàn': { icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-600/10' },
};

const Globe = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const FallingSymbol = ({ x, delay, duration, opacity, size, blur, text }) => (
  <motion.div
    initial={{ y: -100, opacity: 0, rotate: 0 }}
    animate={{ 
      y: '120vh', 
      opacity: [0, opacity, opacity, 0],
      rotate: 360,
    }}
    transition={{ 
      duration: duration, 
      delay: delay, 
      repeat: Infinity, 
      ease: "linear" 
    }}
    className={`absolute font-black text-viet-green select-none pointer-events-none ${size} ${blur}`}
    style={{ left: `${x}%`, zIndex: 0 }}
  >
    {text}
  </motion.div>
);

const KnowledgeMap = () => {
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = useMemo(() => {
    const cats = {};
    CHEMISTRY_KNOWLEDGE_BASE.forEach(item => {
      if (!cats[item.category]) cats[item.category] = [];
      cats[item.category].push(item);
    });
    return cats;
  }, []);

  const categoryList = Object.keys(categories);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <FallingSymbol 
            key={i}
            x={Math.random() * 100}
            delay={Math.random() * -40}
            duration={20 + Math.random() * 25}
            opacity={0.05 + Math.random() * 0.1}
            size={['text-xs', 'text-sm', 'text-lg'][Math.floor(Math.random() * 3)]}
            blur={Math.random() > 0.5 ? 'blur-[1px]' : 'blur-none'}
            text={['H₂O', 'H₂SO₄', '⚛️', 'NaOH', 'C₆H₁₂O₆', 'NaCl'][Math.floor(Math.random() * 6)]}
          />
        ))}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-viet-green/[0.05] to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <header className="mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-viet-text/60 hover:text-viet-green font-bold text-sm mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            QUAY LẠI TRANG CHỦ
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-viet-text italic tracking-tighter uppercase leading-none">
              BẢN ĐỒ <br/>
              <span className="text-viet-green">KIẾN THỨC</span>
            </h1>
            <p className="mt-4 text-xl text-viet-text-light font-bold max-w-2xl">
              Hệ thống hóa toàn bộ lộ trình hóa học phổ thông. Nhấn vào một chủ đề để khám phá chiều sâu lý thuyết và các ứng dụng.
            </p>
          </motion.div>
        </header>

        {/* Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
          
          <div className="space-y-12">
            {categoryList.map((catName, catIdx) => {
              const Meta = CATEGORY_META[catName] || { icon: Info, color: 'text-gray-400', bg: 'bg-gray-100' };
              const Icon = Meta.icon;
              const isActive = activeCategory === catName;

              return (
                <motion.section 
                  key={catName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIdx * 0.05 }}
                  className="relative"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 ${Meta.bg} ${Meta.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-viet-text uppercase italic tracking-tight">{catName}</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-viet-border to-transparent" />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {categories[catName].map((topic, topicIdx) => (
                      <motion.button
                        key={topic.id}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTopicClick(topic)}
                        className={`px-6 py-4 rounded-3xl border-2 transition-all flex items-center gap-3 shadow-sm ${
                          selectedTopic?.id === topic.id 
                            ? 'bg-viet-green border-viet-green text-white shadow-viet-green/30' 
                            : 'bg-white border-viet-border text-viet-text hover:border-viet-green/40'
                        }`}
                      >
                        <span className="text-[14px] font-bold tracking-tight">{topic.title}</span>
                        {selectedTopic?.id === topic.id ? (
                           <ChevronRight className="w-4 h-4" />
                        ) : (
                          <div className={`w-1.5 h-1.5 rounded-full ${Meta.color.replace('text-', 'bg-')}`} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>

          {/* Side Panel (Desktop Sticky) */}
          <div className="lg:sticky lg:top-32 h-fit">
            <AnimatePresence mode="wait">
              {selectedTopic ? (
                <motion.div
                  key={selectedTopic.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[40px] border-2 border-viet-green/20 p-8 shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                    <Info className="w-32 h-32 text-viet-green" />
                  </div>
                  
                  <div className="relative z-10">
                    <span className="px-3 py-1 bg-viet-green/10 text-viet-green text-[10px] font-black uppercase tracking-widest rounded-full">
                      {selectedTopic.category}
                    </span>
                    <h3 className="text-3xl font-black text-viet-text italic mt-4 mb-6 leading-tight">
                      {selectedTopic.title}
                    </h3>
                    
                    <div className="prose prose-sm text-viet-text-light font-medium leading-relaxed mb-8">
                      {selectedTopic.explanation.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i} className="text-viet-green font-black">{part}</strong> : part
                      )}
                    </div>

                    {selectedTopic.formula && (
                      <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100 italic text-center font-serif text-lg">
                        {selectedTopic.formula}
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-viet-text/40 uppercase tracking-widest mb-2">Chủ đề liên quan</h4>
                      {(selectedTopic.suggestions || []).map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-[13px] font-bold text-viet-text hover:text-viet-green cursor-default transition-colors">
                          <ChevronRight className="w-3 h-3 text-viet-green" />
                          {s}
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 flex flex-col gap-3">
                      <button className="w-full py-4 bg-viet-text text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-viet-green transition-all shadow-lg flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Hỏi Aurum về nội dung này
                      </button>
                      <Link to="/classroom" className="w-full py-4 bg-white border-2 border-viet-border text-viet-text rounded-2xl font-black text-[13px] uppercase tracking-widest hover:border-viet-green hover:text-viet-green transition-all flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Xem trong Lớp học
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-viet-green/5 rounded-[40px] border-2 border-dashed border-viet-green/20 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 text-viet-green">
                    <Atom className="w-10 h-10 animate-spin-slow" />
                  </div>
                  <h3 className="text-xl font-black text-viet-text uppercase italic tracking-tight mb-2">Chọn một chủ đề</h3>
                  <p className="text-viet-text-light text-sm font-medium leading-relaxed max-w-[240px]">
                    Nhấn vào bất kỳ "vệ tinh" kiến thức nào để xem chi tiết lý thuyết và lộ trình học tập.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
      
      {/* Floating Action Button for AI */}
      <div className="fixed bottom-10 right-10 z-50">
        {/* Placeholder if AurumAiAgent is not enough, but usually it is global */}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default KnowledgeMap;
