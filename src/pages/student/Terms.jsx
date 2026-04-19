import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import Footer from '@/components/common/Footer';

const Section = ({ title, icon, children, index }) => (
  <motion.section 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 * index }}
    className="mb-16 last:mb-0"
  >
    <div className="flex items-center gap-5 mb-8">
      <div className="w-14 h-14 bg-viet-green/10 rounded-2xl flex items-center justify-center text-viet-green shadow-[0_8px_20px_rgba(118,192,52,0.15)] border border-viet-green/20">
        {icon}
      </div>
      <h2 className="text-2xl font-black text-viet-text tracking-tight">
        {title}
      </h2>
    </div>
    <div className="text-[16px] text-viet-text/80 font-medium leading-[1.8] space-y-6 pl-5 border-l-4 border-viet-green/10 ml-6">
      {children}
    </div>
  </motion.section>
);

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-[160px] pb-32">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute top-40 -left-20 w-96 h-96 rounded-full bg-viet-green blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
      </div>

      <div className="max-w-[1000px] mx-auto px-6 relative">
        
        <header className="mb-20 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block px-4 py-1.5 bg-viet-green/10 text-viet-green rounded-full text-[11px] font-black uppercase tracking-widest mb-6"
           >
             Cập nhật lần cuối: 23/04/2026
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-5xl md:text-7xl font-black text-viet-text mb-6 tracking-tighter"
           >
             <Trans i18nKey="terms.title">
               Điều khoản &<br/><span className="text-viet-green">Chính sách</span> Bảo mật
             </Trans>
           </motion.h1>
           <p className="text-viet-text-light font-medium text-lg max-w-2xl mx-auto opacity-70">
             Chào mừng bạn đến với Aurum Chemistry Odyssey. Vui lòng đọc kỹ các điều khoản dưới đây để hiểu quyền và nghĩa vụ của bạn khi sử dụng nền tảng của chúng tôi.
           </p>
        </header>

        <div className="bg-white rounded-[60px] p-12 md:p-24 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-viet-border/30 relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-viet-green/5 rounded-bl-[60px]" />
          
          <Section 
            index={1}
            title={t('terms.sections.acceptance.title')}
            icon={<svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          >
            <p>{t('terms.sections.acceptance.p1')}</p>
            <p>{t('terms.sections.acceptance.p2')}</p>
          </Section>

          <Section 
            index={2}
            title={t('terms.sections.accounts.title')}
            icon={<svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          >
            <p>{t('terms.sections.accounts.p1')}</p>
            <p>{t('terms.sections.accounts.p2')}</p>
          </Section>

          <Section 
            index={3}
            title={t('terms.sections.intellectual.title')}
            icon={<svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l5 5"/><path d="M9.5 14.5L16 8"/></svg>}
          >
            <p>{t('terms.sections.intellectual.p1')}</p>
            <p>{t('terms.sections.intellectual.p2')}</p>
          </Section>

          <Section 
            index={4}
            title={t('terms.sections.privacy.title')}
            icon={<svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
          >
            <p>{t('terms.sections.privacy.p1')}</p>
            <p>{t('terms.sections.privacy.p2')}</p>
          </Section>

          <Section 
            index={5}
            title={t('terms.sections.liability.title')}
            icon={<svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          >
            <p>{t('terms.sections.liability.p1')}</p>
            <p>{t('terms.sections.liability.p2')}</p>
          </Section>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-32 pt-16 border-t border-viet-border/50 text-center"
          >
             <div className="inline-flex items-center gap-3 px-8 py-4 bg-viet-text text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-viet-text/20">
               <svg className="w-5 h-5 text-viet-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
               <Trans 
                 i18nKey="terms.footer_question"
                 components={{ 
                   contact: <a href="/contact" className="text-viet-green hover:underline" /> 
                 }}
               >
                 Vui lòng <contact>Liên hệ với chúng tôi</contact> nếu bạn có thắc mắc.
               </Trans>
             </div>
          </motion.div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Terms;
