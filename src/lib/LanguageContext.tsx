import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteLanguage, Article } from './types';

interface LanguageContextType {
  language: SiteLanguage;
  setLanguage: (lang: SiteLanguage) => void;
  t: (key: string) => string;
  l: (article: Article, field: 'title' | 'excerpt' | 'content') => string;
}

const translations = {
  en: {
    'nav.all': 'All',
    'nav.world': 'World',
    'nav.politics': 'Politics',
    'nav.business': 'Business',
    'nav.technology': 'Technology',
    'nav.culture': 'Culture',
    'nav.science': 'Science',
    'home.topStories': 'Top Stories',
    'home.trendingNow': 'Trending Now',
    'home.theDailyBrief': 'The Daily Brief',
    'home.editorsPicks': 'Editor\'s Picks',
    'home.newsletterDesc': 'Expert analysis and breaking news, delivered to your inbox every morning.',
    'home.signUpFree': 'Sign Up Free',
    'home.terms': 'By subscribing, you agree to our Terms of Service.',
    'home.search': 'Search news...',
    'article.by': 'By',
    'article.staffWriter': 'Staff Writer',
    'article.trending': 'Trending',
  },
  hinglish: {
    // UI remains English in Hinglish mode
    'nav.all': 'All',
    'nav.world': 'World',
    'nav.politics': 'Politics',
    'nav.business': 'Business',
    'nav.technology': 'Technology',
    'nav.culture': 'Culture',
    'nav.science': 'Science',
    'home.topStories': 'Top Stories',
    'home.trendingNow': 'Trending Now',
    'home.theDailyBrief': 'The Daily Brief',
    'home.editorsPicks': 'Editor\'s Picks',
    'home.newsletterDesc': 'Expert analysis and breaking news, delivered to your inbox every morning.',
    'home.signUpFree': 'Sign Up Free',
    'home.terms': 'By subscribing, you agree to our Terms of Service.',
    'home.search': 'Search news...',
    'article.by': 'By',
    'article.staffWriter': 'Staff Writer',
    'article.trending': 'Trending',
  },
  hi: {
    'nav.all': 'सभी',
    'nav.world': 'दुनिया',
    'nav.politics': 'राजनीति',
    'nav.business': 'व्यापार',
    'nav.technology': 'तकनीकी',
    'nav.culture': 'संस्कृति',
    'nav.science': 'विज्ञान',
    'home.topStories': 'मुख्य खबरें',
    'home.trendingNow': 'ट्रेंडिंग न्यूज़',
    'home.theDailyBrief': 'दैनिक समाचार',
    'home.editorsPicks': 'संपादक की पसंद',
    'home.newsletterDesc': 'विशेषज्ञ विश्लेषण और ताज़ा खबरें, हर सुबह आपके इनबॉक्स में।',
    'home.signUpFree': 'मुफ़्त साइन अप करें',
    'home.terms': 'सदस्यता लेकर, आप हमारी सेवा की शर्तों से सहमत होते हैं।',
    'home.search': 'समाचार खोजें...',
    'article.by': 'द्वारा',
    'article.staffWriter': 'कर्मचारी लेखक',
    'article.trending': 'ट्रेंडिंग',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SiteLanguage>('en');

  useEffect(() => {
    const saved = localStorage.getItem('site_language') as SiteLanguage;
    if (saved && (saved === 'en' || saved === 'hinglish' || saved === 'hi')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SiteLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('site_language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || (translations['en'] as any)[key] || key;
  };

  const l = (article: Article, field: 'title' | 'excerpt' | 'content'): string => {
    // English mode: English text
    // Hinglish mode: Hindi text
    // Hindi mode: Hindi text
    
    // For older articles that don't have titleEn/titleHi, fallback to 'title'
    const isHindiMode = language === 'hi' || language === 'hinglish';
    
    if (field === 'title') {
      if (isHindiMode && article.titleHi) return article.titleHi;
      if (!isHindiMode && article.titleEn) return article.titleEn;
      return article.title; // fallback
    }
    
    if (field === 'excerpt') {
      if (isHindiMode && article.excerptHi) return article.excerptHi;
      if (!isHindiMode && article.excerptEn) return article.excerptEn;
      return article.excerpt; // fallback
    }
    
    if (field === 'content') {
      if (isHindiMode && article.contentHi) return article.contentHi;
      if (!isHindiMode && article.contentEn) return article.contentEn;
      return article.content || ''; // fallback
    }

    return '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, l }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
