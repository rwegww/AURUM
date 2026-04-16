import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MagicLab3D from '@/components/lab/three/MagicLab3D';

const LabSimulatorPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-viet-green/5 via-white to-white pb-32 pt-32 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="bg-blob bg-blob-green w-[500px] h-[500px] -top-64 -right-32 animate-pulse-slow" />
      <div className="bg-blob bg-blob-blue w-[400px] h-[400px] top-1/2 -left-32 opacity-10" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Link to="/lab" className="group inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-viet-border rounded-full text-viet-text-light hover:text-viet-green font-bold text-xs transition-all hover:border-viet-green/30 hover:shadow-sm">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> {t ? t('common.back') : 'Quay lại'}
              </Link>
              <div className="h-px w-8 bg-viet-border/50" />
              <span className="px-3 py-1 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-widest rounded-md italic">
                Pro Lab v2.0
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-viet-text italic tracking-tighter uppercase leading-none">
              Mô phỏng <br />
              <span className="text-viet-green drop-shadow-sm">phản ứng 3D</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-6 rounded-[2rem] border-2 border-viet-border flex items-center gap-5 shadow-xl hover:shadow-2xl transition-shadow relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-viet-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-viet-green text-white rounded-2xl flex items-center justify-center text-3xl shadow-tactile-green active:shadow-none active:translate-y-1 transition-all">⚗️</div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-viet-text-light uppercase tracking-[0.2em] mb-1">Trạng thái thiết bị</p>
              <p className="text-lg font-black text-viet-text">Phòng Lab Ma Thuật</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 bg-viet-green rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-viet-green uppercase tracking-wider">Đang hoạt động</span>
              </div>
            </div>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          {/* Backglow effect */}
          <div className="lab-backglow opacity-50" />
          
          <div className="w-full relative z-10 rounded-[2.5rem] overflow-hidden border-4 border-[#1a1a1a] shadow-2xl lab-container-shadow" style={{ height: 'calc(100vh - 320px)', minHeight: '600px' }}>
            <MagicLab3D />
          </div>

          {/* Decorative Footer Info */}
          <div className="absolute -bottom-12 left-8 right-8 flex justify-between items-center opacity-40">
             <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-viet-green" /> GPU Accelerated</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Real-time Physics</span>
             </div>
             <div className="text-[10px] font-bold italic">AURUM CHEMISTRY LAB ENGINE</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default LabSimulatorPage;
