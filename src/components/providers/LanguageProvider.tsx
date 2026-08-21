"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, I18nDictionary, dictionaries, formatLocalizedWeight, formatLocalizedOrderStatus, formatLocalizedCategory, getLocalizedProduct } from "@/lib/i18n";
import { Product } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dict: I18nDictionary;
  tDynamic: (enText: string, hiText: string) => string;
  formatWeight: (weightStr: string | undefined | null) => string;
  formatStatus: (status: string | undefined | null) => string;
  formatCategory: (category: string | undefined | null) => string;
  getLocalizedProduct: (product: Product | null | undefined) => {
    name: string;
    tagline: string;
    description: string;
    category: string;
    highlights: string[];
    features: string[];
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "manoj_traders_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (savedLang === "en" || savedLang === "hi") {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {
      // Ignore local storage errors in private mode
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const dict = dictionaries[language] || dictionaries.en;

  const tDynamic = (enText: string, hiText: string) => {
    return language === "hi" && hiText ? hiText : enText;
  };

  const formatWeight = (weightStr: string | undefined | null) => {
    return formatLocalizedWeight(weightStr, language);
  };

  const formatStatus = (status: string | undefined | null) => {
    return formatLocalizedOrderStatus(status, language);
  };

  const formatCategory = (category: string | undefined | null) => {
    return formatLocalizedCategory(category, language);
  };

  const getProduct = (product: Product | null | undefined) => {
    return getLocalizedProduct(product, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        dict,
        tDynamic,
        formatWeight,
        formatStatus,
        formatCategory,
        getLocalizedProduct: getProduct,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "en" as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      dict: dictionaries.en,
      tDynamic: (enText: string) => enText,
      formatWeight: (w: string | undefined | null) => w || "",
      formatStatus: (s: string | undefined | null) => s || "",
      formatCategory: (c: string | undefined | null) => c || "",
      getLocalizedProduct: (p: Product | null | undefined) => ({
        name: p?.name || "",
        tagline: p?.tagline || "",
        description: p?.description || "",
        category: p?.category || "",
        highlights: p?.highlights || [],
        features: p?.features || [],
      }),
    };
  }
  return context;
}
