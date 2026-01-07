import { InitOptions } from "i18next";
import ru from "./locales/ru";

export const config: InitOptions = {
  resources: {
    ru: { translation: ru },
  },
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: "ru",
};
