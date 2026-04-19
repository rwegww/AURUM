import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-white border-t border-viet-border py-20 relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 shrink-0">
                <img src="/logo.png" alt="Aurum Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-viet-text leading-none italic uppercase tracking-tighter">
                  AURUM
                </span>
                <span className="text-[9px] font-bold text-viet-green uppercase tracking-[3px] mt-1">Chemistry Currency</span>
              </div>
            </Link>
            <p className="text-[14px] font-medium text-viet-text-light leading-relaxed max-w-[300px]">
              {t('footer.brand_desc')}
            </p>
            <div className="flex gap-4">
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-viet-border flex items-center justify-center text-viet-text-light hover:text-viet-green hover:bg-viet-green/5 hover:border-viet-green/20 transition-all shadow-sm">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore Column */}
          <div className="flex flex-col gap-6">
            <h4 className="flex items-center gap-2 text-[15px] font-black text-viet-text uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {t('footer.explore.title')}
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: t('footer.explore.learning_center'), path: '/classroom' },
                { label: t('footer.explore.chem_tools'), path: '/periodic-table' },
                { label: t('footer.explore.lectures'), path: '/lectures' },
                { label: t('footer.explore.virtual_lab'), path: '/lab' },
                { label: t('footer.explore.arena'), path: '/arena' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-[14px] font-bold text-viet-text-light hover:text-viet-green transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-6">
            <h4 className="flex items-center gap-2 text-[15px] font-black text-viet-text uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-viet-green" />
              {t('footer.support.title')}
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: t('footer.support.user_guide'), path: '/about' },
                { label: t('footer.support.faq'), path: '/about' },
                { label: t('footer.support.privacy_policy'), path: '/terms' },
                { label: t('footer.support.terms_of_service'), path: '/terms' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-[14px] font-bold text-viet-text-light hover:text-viet-green transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-6">
            <h4 className="flex items-center gap-2 text-[15px] font-black text-viet-text uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {t('footer.contact.title')}
            </h4>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-viet-border flex items-center justify-center text-blue-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1">{t('footer.contact.email')}</span>
                  <a href="mailto:support@aurum.edu.vn" className="text-[14px] font-black text-viet-text hover:text-viet-green transition-colors">support@aurum.edu.vn</a>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-viet-border flex items-center justify-center text-blue-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1">{t('footer.contact.hotline')}</span>
                  <a href="tel:+84981234567" className="text-[14px] font-black text-viet-text hover:text-viet-green transition-colors">(+84) 98 123 4567</a>
                </div>
              </div>
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-viet-border flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1">{t('footer.contact.address_title')}</span>
                  <p className="text-[14px] font-black text-viet-text leading-snug">
                    {t('footer.contact.address_value').split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i === 0 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>



      </div>
    </footer>
  );
};

export default Footer;
