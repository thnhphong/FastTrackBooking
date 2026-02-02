import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json';
import ja from './locales/ja.json';
import vi from './locales/vi.json';

i18n
  .use(LanguageDetector)                    // detects browser language or path (we'll use path later)
  .use(initReactI18next)                    // passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
      vi: { translation: vi },
    },
    fallbackLng: 'ja',                        // if detected lang not available → English
    debug: import.meta.env.DEV,               // show warnings only in dev
    interpolation: {
      escapeValue: false,                     // React already escapes values
    },
    // We will later rely on URL path for lang → but detector helps for first visit
    detection: {
      order: ['path', 'navigator'],           // first try to read from /:lang/..., then browser
      caches: [],                             // avoid cookie/localStorage for now (simpler)
    },
  });

export default i18n;