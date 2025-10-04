import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Locale } from '../types';

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useLocalStorage<Locale>('storywizard-locale', 'en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Dynamically fetch the translation file based on the current locale.
        // This assumes the `locales` folder is served from the root of the application.
        const response = await fetch(`./locales/${locale}.json`);
        if (!response.ok) {
            throw new Error(`Could not load translations for locale: ${locale}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(error);
        setTranslations({}); // Fallback to empty translations on error
      }
    };

    fetchTranslations();
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = useCallback((key: string): string => {
    return translations[key] || key;
  }, [translations]);

  const value = { locale, setLocale, t };

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
