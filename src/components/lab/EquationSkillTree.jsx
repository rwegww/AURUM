import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const SkillNode = ({ node, index, isActive, isCompleted, onClick }) => {
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return '#10b981'; // Green
      case 'medium': return '#fbbf24'; // Yellow/Orange
      case 'hard': return '#ef4444'; // Red
      default: return '#10b981';
    }
  };

  const nodeColor = getDifficultyColor(node.difficulty);

  return (
    <div className="relative flex flex-col items-center mb-12 last:mb-0">
      {index > 0 && (
        <div className="absolute -top-12 w-0.5 h-12 bg-gradient-to-b from-transparent to-viet-border" />
      )}
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-xl ${
          isCompleted 
            ? 'bg-emerald-500 border-emerald-200 text-white' 
            : isActive 
              ? 'bg-white border-viet-green text-viet-green'
              : 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
        }`}
        style={{
          boxShadow: isActive ? `0 0 30px ${nodeColor}44` : 'none'
        }}
      >
        {isCompleted ? (
          <span className="text-2xl">✓</span>
        ) : (
          <span className="text-xl font-bold">{node.id}</span>
        )}

        {/* Floating Label */}
        <div className={`absolute left-24 w-48 text-left transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-viet-green">{node.category}</p>
            <p className="text-[14px] font-black text-viet-text line-clamp-1">{node.title}</p>
        </div>
      </motion.button>
    </div>
  );
};

const EquationSkillTree = ({ progress = {}, onSelectNode }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stately: 100,
    damping: 30,
    restDelta: 0.001
  });

  const nodes = useMemo(() => {
    const getTopic = (i) => {
      if (i < 11) return { cat: 'Hóa hợp', title: 'Nhập môn: Đơn chất & Oxy' };
      if (i < 18) return { cat: 'Thế', title: 'Kim loại hoạt động & Axit' };
      if (i < 25) return { cat: 'Trung hòa', title: 'Axit mạnh - Bazơ mạnh' };
      if (i < 32) return { cat: 'Oxit + Axit', title: 'Oxit Bazơ & Axit' };
      if (i < 110) return { cat: 'Trao đổi', title: 'Muối & Kết tủa' };
      if (i < 120) return { cat: 'Hữu cơ', title: 'Phản ứng cháy Hydrocarbon' };
      if (i < 125) return { cat: 'Khử oxit', title: 'Phản ứng Oxy hóa - Khử' };
      if (i < 200) return { cat: 'Muối + Bazơ', title: 'Trao đổi Muối & Bazơ' };
      return { cat: 'Nâng cao', title: 'Cân bằng phương trình phức tạp' };
    };
    
    return Array.from({ length: 500 }, (_, i) => {
      const topic = getTopic(i);
      return {
        id: i + 1,
        category: topic.cat,
        title: topic.title,
        difficulty: i < 50 ? 'easy' : (i < 200 ? 'medium' : 'hard')
      };
    });
  }, []);

  return (
    <div className="relative bg-[#f8f9fa] rounded-[32px] border border-viet-border p-12 overflow-hidden min-h-[800px]">
      <div className="relative z-10 flex flex-col items-center" ref={containerRef}>
        <div className="mb-16 text-center">
            <h3 className="text-2xl font-black text-viet-text uppercase italic">Lộ trình <span className="text-viet-green">Chinh phục</span></h3>
            <p className="text-[12px] font-bold text-viet-text-light uppercase tracking-widest mt-2">{progress.completedCount || 0} / 3000 Câu đã hoàn thành</p>
        </div>

        {/* Connecting Line */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-1.5 h-[calc(100%-160px)] bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
                className="w-full bg-viet-green origin-top"
                style={{ scaleY }}
            />
        </div>

        <div className="space-y-4">
            {nodes.slice(0, 20).map((node, i) => { // Render first 20 nodes for now, lazy load or pagination later
                const isCompleted = (progress.completedNodeIds || []).includes(node.id);
                const isActive = i === (progress.completedNodeIds?.length || 0);
                return (
                    <SkillNode 
                        key={node.id} 
                        node={node} 
                        index={i} 
                        isActive={isActive}
                        isCompleted={isCompleted}
                        onClick={() => onSelectNode(node.id)}
                    />
                );
            })}
        </div>

        {nodes.length > 20 && (
             <div className="mt-12 text-center">
                <p className="text-[11px] font-bold text-viet-text-light italic">Và còn hàng trăm thử thách khác...</p>
             </div>
        )}
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-viet-green/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full" />
    </div>
  );
};

export default EquationSkillTree;
