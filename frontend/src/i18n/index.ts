import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import az from './locales/az';
import ru from './locales/ru';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'az', label: 'Azərbaycanca', short: 'AZ' },
  { code: 'ru', label: 'Русский', short: 'RU' },
] as const;

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      az: { translation: az },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'az', 'ru'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'hm_lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
