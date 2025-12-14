import { Langs } from './types';

export const langCookie = 'fm_ui_lang';

const langRe = new RegExp(`${langCookie}=([a-z]+)`);

export function stringToLang(input?: string) {
    if (input === 'ru') {
        return Langs.ru;
    }

    if (input === 'en') {
        return Langs.en;
    }

    return Langs.ru;
}

export function getLangFromCookie(cookie: string) {
    const raw = (cookie.match(langRe) || new Array(2))[1] || '';
    const lang = encodeURIComponent(raw);

    return stringToLang(lang);
}