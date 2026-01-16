import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    
    // Deactivate escaping for React as it's already safe
    interpolation: { 
      escapeValue: false 
    },
    
    // Path to load translations
    backend: { 
      loadPath: '/locales/{{lng}}/translation.json' 
    },

    // React specific options
    react: {
      useSuspense: true // Use Suspense for loading translations
    }
  });

export default i18n;
