import i18next from "i18next";
import { config } from "./config";
import { Langs } from "@/features/appearance/types";

export async function init(lng: Langs) {
  const instance = i18next.createInstance();

  await i18next.init({
    ...config,
    lng,
  });

  return instance;
}
