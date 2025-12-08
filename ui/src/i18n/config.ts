
import { InitOptions } from 'i18next';
import en from './locales/en';
import ru from './locales/ru';

export const config: InitOptions = {
    resources: {
        en: { translation: en },
        ru: { translation: ru }
    },
    interpolation: {
        escapeValue: false
    },
    fallbackLng: 'ru',
}