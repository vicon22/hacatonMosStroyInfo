import i18next from 'i18next';
import {Langs} from '@/features/appearance/types';
import {initReactI18next} from 'react-i18next';
import {config} from './config';

export function init(lng: Langs) {
    const instance = i18next.createInstance();

    instance
        .use(initReactI18next)
        .init({
            ...config,
            initAsync: false,
            lng,
        });

    return instance;
}