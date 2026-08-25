import { Article } from '../types';

export function getYouTubeId(url: string) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

export function getArticleImage(article: Article): string {
  const defaultFallback = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000';
  
  // 1. Check if imageUrl is actually a YouTube URL
  if (article.imageUrl) {
    const ytId = getYouTubeId(article.imageUrl);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }

  // 2. If imageUrl is NOT the default fallback, use it
  if (article.imageUrl && article.imageUrl !== defaultFallback && !article.imageUrl.includes('auto=format&fit=crop&q=80&w=1000')) {
    return article.imageUrl;
  }

  // 3. Check if there is a youtube block
  if (article.blocks) {
    const ytBlock = article.blocks.find(b => b.type === 'youtube' && b.content);
    if (ytBlock && ytBlock.content) {
      const ytId = getYouTubeId(ytBlock.content);
      if (ytId) {
        return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }
  }

  return article.imageUrl || defaultFallback;
}
