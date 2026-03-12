import { createContext, useContext, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";

type Lang = "en" | "ur";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, options?: Record<string, any>) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { t: i18nT, i18n } = useTranslation();
  const lang = (i18n.language === "ur" ? "ur" : "en") as Lang;
  const dir = lang === "ur" ? "rtl" : "ltr";

  const setLang = (newLang: Lang) => {
    i18n.changeLanguage(newLang);
  };

  const t = (key: string, options?: Record<string, any>): string => {
    return i18nT(key, options) as string;
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    if (lang === "ur") {
      document.body.style.fontFamily = "'Noto Nastaliq Urdu', 'Plus Jakarta Sans', serif";
    } else {
      document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    }
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
