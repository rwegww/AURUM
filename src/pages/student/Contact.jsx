import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

const ContactInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-viet-border hover:border-viet-green/20 transition-all shadow-sm">
    <div className="w-12 h-12 rounded-2xl bg-viet-green/10 text-viet-green flex items-center justify-center text-2xl shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[12px] font-black text-viet-text-light/50 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[15px] font-bold text-viet-text">{value}</p>
    </div>
  </div>
);

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-[180px] pb-32">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Left Column: Info & Map */}
          <div className="flex-1 space-y-10">
            <div>
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-viet-green font-black text-[13px] uppercase tracking-[4px] mb-4 block"
              >
                {t('contact.badge')}
              </motion.span>
              <h1 className="text-4xl md:text-5xl font-black text-viet-text mb-6">
                <Trans i18nKey="contact.title">
                  Liên hệ với <br/> Đội ngũ sáng lập
                </Trans>
              </h1>
              <p className="text-[16px] text-viet-text-light font-medium leading-relaxed max-w-lg">
                {t('contact.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ContactInfo icon="📞" label={t('contact.info.hotline')} value="0334 681 752" />
              <a href="https://maps.app.goo.gl/6Xye2dPzwe4GqhjX9" target="_blank" rel="noopener noreferrer">
                <ContactInfo icon="📍" label={t('contact.info.address')} value={t('contact.info.google_maps')} />
              </a>
            </div>

            {/* Real Google Maps Embed */}
            <div className="aspect-video w-full rounded-[40px] bg-viet-text overflow-hidden relative shadow-2xl border border-viet-border">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3919.8242442464104!2d106.701535!3d10.743143!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9fa1b72f8b%3A0x26780c08db949052!2zROG6oWkgaOG7jWMgTmd1ecOqbiBU4bqldCBUaMOgbmggQ8ahIHPhu58gTmd1ecOqbiBI4buvdSBUaOG7jQ!5e0!3m2!1svi!2s!4v1776326177000!5m2!1svi!2s" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
               />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full lg:w-[450px]">
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="bg-white rounded-[40px] p-10 shadow-2xl border border-viet-border sticky top-[150px]"
             >
                <h2 className="text-2xl font-black text-viet-text mb-8">{t('contact.form.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div>
                      <label className="block text-[12px] font-black text-viet-text-light/60 uppercase tracking-widest mb-2 px-1">{t('contact.form.name_label')}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-6 py-4 bg-[#f8f9fa] border border-viet-border rounded-2xl outline-none focus:border-viet-green transition-all font-medium text-[15px]" 
                        placeholder={t('contact.form.name_placeholder')}
                      />
                   </div>
                   <div>
                      <label className="block text-[12px] font-black text-viet-text-light/60 uppercase tracking-widest mb-2 px-1">{t('contact.form.email_label')}</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-6 py-4 bg-[#f8f9fa] border border-viet-border rounded-2xl outline-none focus:border-viet-green transition-all font-medium text-[15px]" 
                        placeholder={t('contact.form.email_placeholder')}
                      />
                   </div>
                   <div>
                      <label className="block text-[12px] font-black text-viet-text-light/60 uppercase tracking-widest mb-2 px-1">{t('contact.form.message_label')}</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full px-6 py-4 bg-[#f8f9fa] border border-viet-border rounded-2xl outline-none focus:border-viet-green transition-all font-medium text-[15px] resize-none" 
                        placeholder={t('contact.form.message_placeholder')}
                      ></textarea>
                   </div>
                   <button 
                     type="submit"
                     disabled={sent}
                     className={`w-full py-5 rounded-2xl font-black text-[15px] shadow-lg transition-all ${sent ? 'bg-viet-green text-white' : 'bg-viet-text text-white hover:bg-viet-green shadow-viet-text/10'}`}
                   >
                     {sent ? t('contact.form.success') : t('contact.form.submit')}
                   </button>
                </form>
             </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
