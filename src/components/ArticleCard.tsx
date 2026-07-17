import React, { useState } from 'react';
import { Article } from '../types';
import { X, ZoomIn } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../lib/LanguageContext';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  compact?: boolean;
  onClick?: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false, compact = false, onClick }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { l, t } = useLanguage();

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxOpen(true);
  };

  const closeLightbox = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxOpen(false);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(article);
    }
  };

  const renderLightbox = () => {
    if (!lightboxOpen) return null;
    return createPortal(
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity"
        onClick={closeLightbox}
      >
        <button className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 z-10 transition-colors">
          <X size={32} />
        </button>
        <img 
          src={article.imageUrl} 
          alt={l(article, 'title')} 
          className="max-w-full max-h-full object-contain cursor-default shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>,
      document.body
    );
  };

  if (featured) {
    return (
      <article className="group cursor-pointer flex flex-col mb-8 border-b border-gray-200 pb-8 last:border-0 last:pb-0" onClick={handleCardClick}>
        <div className="relative overflow-hidden mb-4 rounded-sm" onClick={handleImageClick}>
          <img 
            src={article.imageUrl} 
            alt={l(article, 'title')} 
            className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <ZoomIn className="text-white drop-shadow-lg" size={48} />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-red-700">{t(`nav.${article.category.toLowerCase()}`)}</span>
            <span className="text-gray-300 text-xs">•</span>
            <span className="font-sans text-xs text-gray-500">{article.readTime}</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-3 text-gray-900 group-hover:text-red-700 transition-colors">
            {l(article, 'title')}
          </h2>
          <p className="font-serif text-lg text-gray-600 leading-relaxed mb-4">
            {l(article, 'excerpt')}
          </p>
          <div className="font-sans text-sm text-gray-500">
            {t('article.by')} <span className="font-medium text-gray-900">{article.author}</span>
          </div>
        </div>
        {renderLightbox()}
      </article>
    );
  }

  if (compact) {
    return (
      <article className="group cursor-pointer flex gap-4 mb-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0" onClick={handleCardClick}>
        <div className="flex-1">
          <span className="block font-sans font-bold text-[10px] uppercase tracking-widest text-red-700 mb-1">{t(`nav.${article.category.toLowerCase()}`)}</span>
          <h3 className="font-serif text-lg font-bold leading-snug mb-2 text-gray-900 group-hover:text-red-700 transition-colors">
            {l(article, 'title')}
          </h3>
          <div className="font-sans text-xs text-gray-500">
            {article.readTime}
          </div>
        </div>
        <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-sm" onClick={handleImageClick}>
          <img 
            src={article.imageUrl} 
            alt={l(article, 'title')} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <ZoomIn className="text-white drop-shadow-md" size={24} />
          </div>
        </div>
        {renderLightbox()}
      </article>
    );
  }

  return (
    <article className="group cursor-pointer flex flex-col h-full" onClick={handleCardClick}>
      <div className="relative overflow-hidden mb-3 rounded-sm aspect-[4/3]" onClick={handleImageClick}>
        <img 
          src={article.imageUrl} 
          alt={l(article, 'title')} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <ZoomIn className="text-white drop-shadow-md" size={32} />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <span className="block font-sans font-bold text-xs uppercase tracking-widest text-red-700 mb-2">{t(`nav.${article.category.toLowerCase()}`)}</span>
        <h3 className="font-serif text-xl font-bold leading-snug mb-2 text-gray-900 group-hover:text-red-700 transition-colors line-clamp-3">
          {l(article, 'title')}
        </h3>
        <p className="font-serif text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {l(article, 'excerpt')}
        </p>
        <div className="font-sans text-xs text-gray-500 mt-auto">
          {article.author} <span className="mx-1">•</span> {article.readTime}
        </div>
      </div>
      {renderLightbox()}
    </article>
  );
};
