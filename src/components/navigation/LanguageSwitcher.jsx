import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'vi', label: 'Tiếng Việt', flag: 'VN' },
  { code: 'en', label: 'English', flag: 'GB' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-all group"
      >
        <svg 
          className="w-5 h-5 text-viet-text-light group-hover:text-viet-green transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2" />
          <path d="M2 12h20" strokeWidth="2" />
        </svg>
        <span className="text-[13px] font-black text-viet-text-light uppercase tracking-widest">
          {currentLanguage.code}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white border border-viet-border rounded-2xl shadow-2xl p-1 z-[120]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  i18n.language === lang.code 
                  ? 'bg-viet-green/10 text-viet-green' 
                  : 'hover:bg-slate-50 text-viet-text'
                }`}
              >
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                    i18n.language === lang.code ? 'border-viet-green' : 'border-slate-200'
                }`}>
                  {lang.flag}
                </span>
                <span className="text-[13px] font-bold">{lang.label}</span>
                {i18n.language === lang.code && (
                   <div className="ml-auto w-1.5 h-1.5 rounded-full bg-viet-green" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
