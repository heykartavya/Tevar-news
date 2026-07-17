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
}

export type Category = 'All' | 'World' | 'Politics' | 'Business' | 'Technology' | 'Culture' | 'Science';
