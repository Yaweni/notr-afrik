import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "fr";

interface LocalizedFallbacks {
  en: string;
  fr: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isFrench: boolean;
  locale: string;
  formatCurrency: (value: number, currency: string) => string;
  formatDate: (value: string | Date) => string;
  formatDateTime: (value: string | Date) => string;
  formatNumber: (value: number) => string;
  getLocalizedContent: (
    content: Record<string, string> | undefined,
    key: string,
    fallbacks: LocalizedFallbacks,
  ) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLanguage = window.localStorage.getItem("immigrationcm.language");
  if (savedLanguage === "en" || savedLanguage === "fr") {
    return savedLanguage;
  }

  return window.navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const isFrench = language === "fr";
  const locale = isFrench ? "fr-FR" : "en-US";

  useEffect(() => {
    window.localStorage.setItem("immigrationcm.language", language);
    document.documentElement.lang = language;
  }, [language]);

  const formatCurrency = (value: number, currency: string) => `${new Intl.NumberFormat(locale).format(value)} ${currency}`;
  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);
  const formatDate = (value: string | Date) => new Intl.DateTimeFormat(locale).format(toDate(value));
  const formatDateTime = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(toDate(value));

  const getLocalizedContent = (
    content: Record<string, string> | undefined,
    key: string,
    fallbacks: LocalizedFallbacks,
  ) => {
    const primaryKey = isFrench ? `${key}_fr` : key;
    const secondaryKey = isFrench ? key : `${key}_fr`;
    const primaryFallback = isFrench ? fallbacks.fr : fallbacks.en;
    const secondaryFallback = isFrench ? fallbacks.en : fallbacks.fr;

    return content?.[primaryKey] || primaryFallback || content?.[secondaryKey] || secondaryFallback;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isFrench,
        locale,
        formatCurrency,
        formatDate,
        formatDateTime,
        formatNumber,
        getLocalizedContent,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }

  return context;
}