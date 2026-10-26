import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import fa from "../locales/fa.json";

let isInitialized = false;

export const resources = {
  en: { translation: en },
  fa: { translation: fa },
};

const persianNumeralsPostProcessor = {
  type: "postProcessor",
  name: "persianNumerals",
  process: function (value, key, options, translator) {
    const lang = options?.lng || translator?.language || i18n.language;
    if (
      (lang === "fa" || String(lang).startsWith("fa")) &&
      typeof value === "string"
    ) {
      return value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
    }
    return value;
  },
};

if (!isInitialized) {
  i18n
    .use(persianNumeralsPostProcessor)
    .use(initReactI18next)
    .init({
      resources,
      lng: "en",
      fallbackLng: "en",
      postProcess: ["persianNumerals"],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  isInitialized = true;
}

/**
 * Syncs language with stored/persisted preference safely.
 */
export function initI18n(language = "en") {
  const lang = language === "fa" ? "fa" : "en";
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
  return i18n;
}

export default i18n;
