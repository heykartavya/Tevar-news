export interface PostBlock {
  id: string;
  type: 'text' | 'image' | 'youtube';
  content?: string; // HTML for text, URL for image/youtube
  contentEn?: string;
  contentHi?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  blocks?: PostBlock[];
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
export type Category = 'All' | 'National' | 'Uttar Pradesh' | 'Bundelkhand' | 'Politics' | 'Education' | 'Crime' | 'Employment' | 'Video' | 'Special News' | 'Breaking';


export interface TeamMember {
  nameHi?: string;
  designationHi?: string;
  id: string;
  name: string;
  designation: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
}
