export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
  isTrending?: boolean;
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  titleHi?: string;
  excerptHi?: string;
  contentHi?: string;
  originalLanguage?: string;
}

export type SiteLanguage = 'en' | 'hinglish' | 'hi';
export type Category = 'All' | 'World' | 'Politics' | 'Business' | 'Technology' | 'Culture' | 'Science';
