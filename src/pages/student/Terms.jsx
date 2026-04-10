import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

const Section = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-black text-viet-text mb-6 flex items-center gap-4">
      <div className="w-2 h-8 bg-viet-green rounded-full" />
      {title}
    </h2>
    <div className="text-[15px] text-viet-text-light font-medium leading-relaxed space-y-4 px-6 border-l border-viet-border ml-1">
      {children}
    </div>
  </section>
);

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-[180px] pb-32">
      <div className="max-w-[900px] mx-auto px-6">
        
        <header className="mb-16 text-center">
           <motion.h1 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-4xl md:text-5xl font-black text-viet-text mb-4"
           >
             <Trans i18nKey="terms.title">
               Điều khoản & <br/> Chính sách Bảo mật
             </Trans>
           </motion.h1>
           <p className="text-viet-text-light font-bold text-[14px] uppercase tracking-widest opacity-50">{t('terms.last_updated', { date: 'April 16, 2026' })}</p>
        </header>

        <div className="viet-card p-10 md:p-16 border-none shadow-2xl">
          <Section title={t('terms.sections.acceptance.title')}>
            <p>{t('terms.sections.acceptance.p1')}</p>
            <p>{t('terms.sections.acceptance.p2')}</p>
          </Section>

          <Section title={t('terms.sections.accounts.title')}>
            <p>{t('terms.sections.accounts.p1')}</p>
            <p>{t('terms.sections.accounts.p2')}</p>
          </Section>

          <Section title={t('terms.sections.intellectual.title')}>
            <p>{t('terms.sections.intellectual.p1')}</p>
            <p>{t('terms.sections.intellectual.p2')}</p>
          </Section>

          <Section title={t('terms.sections.privacy.title')}>
            <p>{t('terms.sections.privacy.p1')}</p>
            <p>{t('terms.sections.privacy.p2')}</p>
          </Section>

          <Section title={t('terms.sections.liability.title')}>
            <p>{t('terms.sections.liability.p1')}</p>
            <p>{t('terms.sections.liability.p2')}</p>
          </Section>

          <div className="mt-20 pt-10 border-t border-viet-border text-center">
             <p className="text-[14px] text-viet-text-light/50 font-medium">
               <Trans i18nKey="terms.footer_question">
                 Bạn có câu hỏi về điều khoản? <br/> Vui lòng <a href="/contact" className="text-viet-green font-bold hover:underline">Liên hệ với chúng tôi</a>.
               </Trans>
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;
