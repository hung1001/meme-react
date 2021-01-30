import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en/translation.json';
import vi from './translations/vi/translation.json';
import ja from './translations/ja/translation.json';

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
  ja: {
    translation: ja,
  },
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: window.localStorage.getItem('lang') || 'en',
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
