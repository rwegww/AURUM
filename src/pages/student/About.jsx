import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import Footer from '@/components/common/Footer';

const About = () => {
  const { t } = useTranslation();

  const visionPillars = [
    { 
      title: t('about.pillars.safety.title'), 
      desc: t('about.pillars.safety.desc'),
      icon: "🛡️"
    },
    { 
      title: t('about.pillars.gamification.title'), 
      desc: t('about.pillars.gamification.desc'),
      icon: "🎮"
    },
    { 
      title: t('about.pillars.visualization.title'), 
      desc: t('about.pillars.visualization.desc'),
      icon: "👁️"
    }
  ];

  const teamAchievements = t('about.team_section.achievements', { returnObjects: true });

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-[180px] pb-32">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Story Section */}
        <section className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-viet-green/10 text-viet-green rounded-full text-[11px] font-black uppercase tracking-[3px] mb-8"
          >
            {t('about.mission_badge')}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[40px] md:text-[60px] font-black text-viet-text leading-[1.1] tracking-tight mb-10"
          >
            <Trans i18nKey="about.title">
              Khơi nguồn đam mê<br/><span className="text-viet-green">Hóa học</span>cho thế hệ trẻ
            </Trans>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-viet-text-light/80 font-medium leading-relaxed max-w-3xl mx-auto"
          >
            {t('about.description')}
          </motion.p>
        </section>

        {/* Vision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {visionPillars.map((item, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="viet-card p-10 flex flex-col items-center text-center gap-6"
             >
                <div className="text-5xl">{item.icon}</div>
                <h3 className="text-xl font-black text-viet-text">{item.title}</h3>
                <p className="text-[15px] text-viet-text-light font-medium leading-relaxed">{item.desc}</p>
             </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="relative aspect-square bg-viet-text rounded-[50px] overflow-hidden shadow-2xl"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-viet-green/30 to-blue-500/30" />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                 <svg viewBox="0 0 100 100" className="w-full h-full text-white/20">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.5" />
                    <circle cx="80" cy="30" r="10" fill="currentColor" opacity="0.3" />
                 </svg>
              </div>
           </motion.div>
           <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black text-viet-text">{t('about.team_section.title')}</h2>
              <p className="text-[16px] text-viet-text-light/80 font-medium leading-relaxed">
                {t('about.team_section.description')}
              </p>
              <ul className="space-y-4">
                 {Array.isArray(teamAchievements) && teamAchievements.map((text, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-viet-text">
                       <div className="w-6 h-6 rounded-full bg-viet-green flex items-center justify-center text-white text-[12px]">✓</div>
                       {text}
                    </li>
                 ))}
              </ul>
           </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
