import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viTranslation from './locales/vi.json';
import enTranslation from './locales/en.json';

const fillMissingKeys = (primary, fallback) => {
  if (!fallback || typeof fallback !== 'object' || Array.isArray(fallback)) return primary;
  const output = { ...(primary || {}) };

  Object.entries(fallback).forEach(([key, fallbackValue]) => {
    const primaryValue = output[key];
    if (primaryValue === undefined) {
      output[key] = fallbackValue;
    } else if (
      primaryValue &&
      fallbackValue &&
      typeof primaryValue === 'object' &&
      typeof fallbackValue === 'object' &&
      !Array.isArray(primaryValue) &&
      !Array.isArray(fallbackValue)
    ) {
      output[key] = fillMissingKeys(primaryValue, fallbackValue);
    }
  });

  return output;
};

const viResources = fillMissingKeys(viTranslation, enTranslation);
const enResources = fillMissingKeys(enTranslation, viTranslation);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        translation: viResources
      },
      en: {
        translation: enResources
      }
    },
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
