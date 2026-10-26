import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { I18nManager } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../store/redux/preferences";
import i18n, { initI18n } from "../services/i18n";
import { reloadAppAsync } from "expo";
import { rescheduleAllOnLanguageChange } from "../services/notificationService";

const LocaleContext = createContext({
  language: "en",
  isRTL: false,
  t: (key, opts) => i18n.t(key, opts),
  changeLanguage: () => {},
  isRestartRequired: false,
  requestAppRestart: async () => {},
});

export const LocaleProvider = ({ children }) => {
  const dispatch = useDispatch();
  const savedLanguage = useSelector(
    (state) => state.preferences?.language || "en",
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    initI18n(savedLanguage);
  }, [savedLanguage]);

  useEffect(() => {
    const onLanguageChanged = () => {
      setTick((t) => t + 1);
    };
    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, []);

  const activeLanguage = savedLanguage === "fa" ? "fa" : "en";
  const isRTL = activeLanguage === "fa";

  const isRestartRequired = false;

  const t = useCallback(
    (key, opts) => {
      const options = opts
        ? { lng: activeLanguage, ...opts }
        : { lng: activeLanguage };
      const res = i18n.t(key, options);
      if (activeLanguage === "fa" && typeof res === "string") {
        return res.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
      }
      return res;
    },
    [activeLanguage],
  );

  const changeLanguage = useCallback(
    (newLang) => {
      const validLang = newLang === "fa" ? "fa" : "en";
      if (validLang === activeLanguage) return;

      dispatch(setLanguage(validLang));

      if (i18n.language !== validLang) {
        i18n.changeLanguage(validLang);
      }

      rescheduleAllOnLanguageChange(validLang).catch(() => {});
    },
    [activeLanguage, dispatch],
  );

  const requestAppRestart = useCallback(async () => {
    try {
      if (typeof reloadAppAsync === "function") {
        await reloadAppAsync("Language & layout direction changed");
      }
    } catch (err) {
      console.warn("reloadAppAsync not supported in this runtime:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      language: activeLanguage,
      isRTL,
      t,
      changeLanguage,
      isRestartRequired,
      requestAppRestart,
    }),
    [
      activeLanguage,
      isRTL,
      t,
      changeLanguage,
      isRestartRequired,
      requestAppRestart,
    ],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
