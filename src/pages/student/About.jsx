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

        {/* Team Section (Moved Up) */}
        <section className="max-w-4xl mx-auto text-center flex flex-col items-center mb-32">
           <div className="space-y-8 w-full">
              <h2 className="text-3xl md:text-5xl font-black text-viet-text mb-6">{t('about.team_section.title')}</h2>
              <p className="text-lg text-viet-text-light/80 font-medium leading-relaxed max-w-2xl mx-auto">
                {t('about.team_section.description')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 w-full">
                 {Array.isArray(teamMembers) && teamMembers.map((member, i) => (
                    <div key={i} className="bg-white/80 p-8 rounded-2xl border-2 border-viet-border hover:border-viet-green/50 transition-colors shadow-sm flex flex-col items-center text-center gap-6">
                       <div className="w-32 h-32 sm:w-44 sm:h-44 shrink-0 rounded-full overflow-hidden border-4 border-white ring-2 ring-viet-green shadow-md bg-gray-100 flex items-center justify-center relative">
                         {member.image ? (
                           <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                         ) : null}
                         <span className="text-gray-400 font-black text-6xl" style={{ display: member.image ? 'none' : 'flex' }}>
                           {member.name.charAt(0)}
                         </span>
                       </div>
                       <div className="flex-1 w-full flex flex-col items-center">
                         <h4 className="text-xl font-black text-viet-text mb-1.5">{member.name}</h4>
                         <p className="text-[13px] font-bold text-viet-green uppercase tracking-wide leading-relaxed max-w-[250px] mb-2">{member.role}</p>
                         {member.email && (
                           <a href={`mailto:${member.email}`} className="text-[12px] font-bold text-blue-500 hover:text-blue-600 hover:underline">{member.email}</a>
                         )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
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
      </div>
      <Footer />
    </div>
  );
};

export default About;
