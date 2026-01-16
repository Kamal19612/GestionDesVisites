import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frJSON from './locales/fr.json';
import enJSON from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frJSON },
      en: { translation: enJSON }
    },
    lng: "fr", // langue par défaut
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
