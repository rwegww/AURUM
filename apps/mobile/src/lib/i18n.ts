import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslation, fillMissingKeys, viTranslation } from '@aurum/shared/i18n';

const viResources = fillMissingKeys(viTranslation as Record<string, unknown>, enTranslation as Record<string, unknown>);
const enResources = fillMissingKeys(enTranslation as Record<string, unknown>, viTranslation as Record<string, unknown>);

if (!i18n.isInitialized) {
  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    resources: {
      vi: { translation: viResources },
      en: { translation: enResources },
    },
    lng: 'vi',
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
