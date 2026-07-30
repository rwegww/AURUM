import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { ShieldCheck, Gamepad2, Eye } from 'lucide-react';
import Footer from '@/components/common/Footer';

const About = () => {
  const { t } = useTranslation();

  const visionPillars = [
    { 
      title: t('about.pillars.safety.title'), 
      desc: t('about.pillars.safety.desc'),
      icon: <ShieldCheck className="w-14 h-14 text-blue-500 drop-shadow-md" />
    },
    { 
      title: t('about.pillars.gamification.title'), 
      desc: t('about.pillars.gamification.desc'),
      icon: <Gamepad2 className="w-14 h-14 text-purple-500 drop-shadow-md" />
    },
    { 
      title: t('about.pillars.visualization.title'), 
      desc: t('about.pillars.visualization.desc'),
      icon: <Eye className="w-14 h-14 text-viet-green drop-shadow-md" />
    }
  ];

  const teamMembers = t('about.team_section.members', { returnObjects: true });

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-[180px]">
      <div className="max-w-[1000px] mx-auto px-6 mb-32">
        
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
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-2xl shadow-inner border border-gray-100">{item.icon}</div>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                 {Array.isArray(teamMembers) && teamMembers.map((member, i) => (
                    <div key={i} className="bg-white/80 p-4 rounded-2xl border-2 border-viet-border hover:border-viet-green/50 transition-colors shadow-sm flex items-center gap-4">
                       <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden border-2 border-viet-green shadow-inner bg-gray-100 flex items-center justify-center">
                         {member.image ? (
                           <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-gray-400 font-bold text-xl">{member.name.charAt(0)}</span>
                         )}
                       </div>
                       <div>
                         <h4 className="text-lg font-black text-viet-text mb-0.5">{member.name}</h4>
                         <p className="text-[12px] font-bold text-viet-green uppercase tracking-wide leading-snug">{member.role}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
