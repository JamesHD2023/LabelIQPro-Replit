import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentLanguage, setCurrentLanguage } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLang] = useState(getCurrentLanguage());

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    setCurrentLanguage(langCode);
  };

  useEffect(() => {
    // Initialize language from localStorage
    const savedLang = getCurrentLanguage();
    if (savedLang !== currentLanguage) {
      setCurrentLang(savedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};