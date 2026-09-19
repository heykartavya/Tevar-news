import { Article } from '../types';

export function getYouTubeId(url: string) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function getFacebookEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (
    trimmed.includes('facebook.com') ||
    trimmed.includes('fb.watch') ||
    trimmed.includes('fb.com')
  ) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=0&t=0`;
  }
  return null;
}

export function isFacebookReel(url: string): boolean {
  if (!url) return false;
  return url.includes('/reel/') || url.includes('/reels/');
}

export function getInstagramEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/embed/`;
  }
  return null;
}

export function getISTDateTime(dateInput: Date | string | number = new Date()): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return String(dateInput);
  }
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(/\b(am|pm)\b/gi, m => m.toUpperCase()) + ' IST';
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

    const imgBlock = article.blocks.find(b => b.type === 'image' && b.content);
    if (imgBlock && imgBlock.content) {
      return imgBlock.content;
    }
  }

  return article.imageUrl || defaultFallback;
}
