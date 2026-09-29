import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Smartphone, Download, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const [isAndroid, setIsAndroid] = useState(false);
  const apkDownloadUrl = import.meta.env.VITE_MOBILE_APK_URL || '/AURUM-mobile.apk';

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsAndroid(/Android/i.test(navigator.userAgent));
    }
  }, []);

  return (
    <footer className="w-full bg-white border-t border-viet-border py-20 relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 space-y-12">
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
                { label: t('footer.support.terms_of_service'), path: '/terms' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-[14px] font-bold text-viet-text-light hover:text-viet-green transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={apkDownloadUrl}
                  download="AURUM-mobile.apk"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  title={t('footer.mobile_app.android_only', 'Chỉ áp dụng cho hệ điều hành Android')}
                >
                  <Smartphone size={16} />
                  <span>{t('footer.mobile_app.button', 'Tải APK (Android)')}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase">Android</span>
                </a>
              </li>
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
                  <a href="tel:+84334681752" className="text-[14px] font-black text-viet-text hover:text-viet-green transition-colors">(+84) 334 681 752</a>
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

        {/* Android App Download Banner (Dedicated Footer Bottom Section) */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-emerald-50/80 via-white to-slate-50 p-6 rounded-2xl border border-emerald-100/90 shadow-sm">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 mt-0.5 md:mt-0">
              <Smartphone size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h5 className="text-[15px] font-black text-slate-800">
                  {t('footer.mobile_app.title', 'Ứng dụng Di động AURUM')}
                </h5>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide border border-emerald-200">
                  Android APK
                </span>
                {isAndroid && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 animate-pulse">
                    <CheckCircle2 size={11} />
                    {t('footer.mobile_app.detected_android', 'Đã nhận diện thiết bị Android')}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-slate-600 font-medium mt-1">
                {t('footer.mobile_app.desc', 'Trải nghiệm học Hóa học tương tác ngay trên thiết bị di động Android của bạn.')}
              </p>
              <span className="text-[11px] text-slate-500 font-semibold block mt-1">
                ⚠️ {t('footer.mobile_app.android_only', 'Chỉ áp dụng cho hệ điều hành Android')} • APK File (~107MB)
              </span>
            </div>
          </div>

          <a
            href={apkDownloadUrl}
            download="AURUM-mobile.apk"
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-900 hover:bg-emerald-600 text-white text-[14px] font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            <span>{t('footer.mobile_app.button', 'Tải APK cho Android')}</span>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
