import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactionSimulator from '@/components/lab/ReactionSimulator';

const LabSimulatorPage = () => {
  return (
    <div className="min-h-screen bg-[#fffbf0] pb-12 pt-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/lab" className="inline-flex items-center gap-2 text-viet-text-light hover:text-viet-green font-bold text-sm mb-4 transition-colors">
              <span>←</span> Quay lại Phòng Thí Nghiệm
            </Link>
            <h1 className="text-3xl md:text-5xl font-black text-viet-text italic tracking-tighter uppercase">
              Mô phỏng <span className="text-viet-green">phản ứng</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-4 rounded-2xl border-2 border-viet-border flex items-center gap-4 shadow-sm"
          >
            <div className="w-12 h-12 bg-viet-green/10 rounded-xl flex items-center justify-center text-2xl">⚗️</div>
            <div>
              <p className="text-xs font-black text-viet-text-light uppercase tracking-widest">Chế độ</p>
              <p className="text-base font-black text-viet-text">Thí nghiệm tự do</p>
            </div>
          </motion.div>
        </header>

        <ReactionSimulator />
      </div>
    </div>
  );
};

export default LabSimulatorPage;
