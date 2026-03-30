import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactionSimulator from '@/components/lab/ReactionSimulator';
import EquationBalancer from '@/components/lab/EquationBalancer';
import MoleculeViewer from '@/components/lab/MoleculeViewer';
import CraftingStation from '@/components/lab/CraftingStation';

const tabs = [
  { id: 'reaction', label: 'Mô phỏng phản ứng', icon: '⚗️', desc: 'Chọn hóa chất và cho phản ứng' },
  { id: 'balance', label: 'Cân bằng phương trình', icon: '⚖️', desc: 'Luyện tập cân bằng PTHH' },
  { id: 'molecule', label: 'Mô hình phân tử', icon: '🔬', desc: 'Xem cấu trúc phân tử 2D' },
  { id: 'craft', label: 'Phòng chế tạo', icon: '🧬', desc: 'Thu thập & chế tạo chất mới' },
];

const ChemLab = () => {
  const [activeTab, setActiveTab] = useState('reaction');

  return (
    <div className="min-h-screen bg-viet-bg pt-[70px] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-viet-text italic tracking-tighter uppercase mb-3">
            Phòng thí nghiệm <span className="text-viet-green underline decoration-4 underline-offset-8">ảo</span>
          </h1>
          <p className="text-viet-text-light font-bold text-lg max-w-2xl mx-auto">
            Khám phá, thí nghiệm và sáng tạo với hàng trăm phản ứng hóa học
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group px-6 py-4 rounded-2xl transition-all border-2 text-left flex items-center gap-4 min-w-[220px] ${
                activeTab === tab.id
                  ? 'bg-viet-green text-white border-viet-green shadow-xl shadow-viet-green/20 scale-105'
                  : 'bg-white border-viet-border text-viet-text hover:border-viet-green/30 hover:shadow-lg'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <div>
                <p className={`text-[13px] font-black ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.label}</p>
                <p className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-white/70' : 'text-viet-text-light'}`}>{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'reaction' && <ReactionSimulator />}
          {activeTab === 'balance' && <EquationBalancer />}
          {activeTab === 'molecule' && <MoleculeViewer />}
          {activeTab === 'craft' && <CraftingStation />}
        </motion.div>
      </div>
    </div>
  );
};

export default ChemLab;
