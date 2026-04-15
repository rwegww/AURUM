import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", bounce: 0, duration: 0.8 } 
  }
};

const ChemLab = () => {
  const { t } = useTranslation();

  const labModules = [
    { 
      id: 'reaction', 
      label: t('chem_lab.modules.reaction.label'), 
      icon: '⚗️', 
      desc: t('chem_lab.modules.reaction.desc'),
      path: '/lab/simulator',
      colorClass: 'bg-[#1a1a1a] text-white hover:bg-blue-600'
    },
    { 
      id: 'balance', 
      label: t('chem_lab.modules.balance.label'), 
      icon: '⚖️', 
      desc: t('chem_lab.modules.balance.desc'),
      path: '/lab/balancer',
      colorClass: 'bg-[#1a1a1a] text-white hover:bg-amber-500'
    },
    { 
      id: 'molecule', 
      label: t('chem_lab.modules.molecule.label'), 
      icon: '🔬', 
      desc: t('chem_lab.modules.molecule.desc'),
      path: '/lab/molecules',
      colorClass: 'bg-[#1a1a1a] text-white hover:bg-emerald-500'
    },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.02_135)] pb-24 pt-32 selection:bg-viet-green selection:text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1.5 bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full mb-6">
            <span className="text-[#1a1a1a] font-black text-xs uppercase tracking-widest italic">
              {t('chem_lab.header.badge')}
            </span>
          </div>
          <h1 className="font-rubik text-4xl md:text-6xl font-black text-[#1a1a1a] uppercase mb-6 leading-tight tracking-tight">
            {t('chem_lab.header.title_1')} <br /> 
            <span className="text-viet-green">{t('chem_lab.header.title_2')}</span> {t('chem_lab.header.title_3')}
          </h1>
          <p className="text-[#1a1a1a]/70 font-bold text-lg max-w-2xl mx-auto">
            {t('chem_lab.header.desc')}
          </p>
        </motion.div>

        {/* Module Selection Hub */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {labModules.map((module) => (
            <motion.div key={module.id} variants={itemVariants} className="flex flex-col h-full">
              <Link 
                to={module.path}
                className="group relative flex flex-col h-full bg-white rounded-[1.5rem] border-4 border-[#1a1a1a] hover:translate-y-1 transition-all duration-200 shadow-tactile hover:shadow-tactile-hover overflow-hidden"
              >
                <div className="p-8 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-[1rem] bg-white border-4 border-[#1a1a1a] shadow-tactile-sm flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    {module.icon}
                  </div>
                  
                  <h3 className="font-rubik text-2xl font-black text-[#1a1a1a] uppercase mb-4 leading-tight group-hover:text-viet-green transition-colors">
                    {module.label}
                  </h3>
                  
                  <p className="text-[#1a1a1a]/70 font-medium text-[15px] leading-relaxed mb-8 flex-grow">
                    {module.desc}
                  </p>
                  
                  <div className={`mt-auto py-3 px-6 rounded-full font-black text-[13px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border-2 border-[#1a1a1a] ${module.colorClass}`}>
                    {t('chem_lab.modules.start_btn')} <span className="text-lg">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats/Footer Decoration */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-24 p-10 rounded-[1.5rem] bg-[#1a1a1a] border-4 border-[#1a1a1a] shadow-tactile-green text-center relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-center">
              <p className="font-rubik text-5xl font-black text-viet-green mb-2">3,000+</p>
              <p className="text-[11px] font-black text-white/70 uppercase tracking-widest">{t('chem_lab.stats.chemicals')}</p>
            </div>
            <div className="w-full h-1 md:w-1 md:h-16 bg-white/10 rounded-full"></div>
            <div className="text-center">
              <p className="font-rubik text-5xl font-black text-viet-green mb-2">10,000+</p>
              <p className="text-[11px] font-black text-white/70 uppercase tracking-widest">{t('chem_lab.stats.reactions')}</p>
            </div>
            <div className="w-full h-1 md:w-1 md:h-16 bg-white/10 rounded-full"></div>
            <div className="text-center">
              <p className="font-rubik text-5xl font-black text-white mb-2">∞</p>
              <p className="text-[11px] font-black text-white/70 uppercase tracking-widest">{t('chem_lab.stats.creativity')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChemLab;
