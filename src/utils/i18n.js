import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from '../locales/en.json';
import deTranslations from '../locales/de.json';
import frTranslations from '../locales/fr.json';
import esTranslations from '../locales/es.json';
import nlTranslations from '../locales/nl.json';
import svTranslations from '../locales/sv.json';
import noTranslations from '../locales/no.json';
import ptTranslations from '../locales/pt.json';

const resources = {
  en: {
    translation: enTranslations
  },
  de: {
    translation: deTranslations
  },
  fr: {
    translation: frTranslations
  },
  es: {
    translation: esTranslations
  },
  nl: {
    translation: nlTranslations
  },
  sv: {
    translation: svTranslations
  },
  no: {
    translation: noTranslations
  },
  pt: {
    translation: ptTranslations
  }
};

// Supported languages with display names
export const supportedLanguages = {
  en: { name: 'English', nativeName: 'English' },
  de: { name: 'German', nativeName: 'Deutsch' },
  fr: { name: 'French', nativeName: 'Français' },
  es: { name: 'Spanish', nativeName: 'Español' },
  nl: { name: 'Dutch', nativeName: 'Nederlands' },
  sv: { name: 'Swedish', nativeName: 'Svenska' },
  no: { name: 'Norwegian', nativeName: 'Norsk' },
  pt: { name: 'Portuguese', nativeName: 'Português' }
};

// Detect browser language
const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0]; // Get base language code (e.g., 'en' from 'en-US')

  // Check if we support this language
  if (Object.keys(supportedLanguages).includes(langCode)) {
    return langCode;
  }

  return 'en'; // Default fallback
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectBrowserLanguage(),
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;