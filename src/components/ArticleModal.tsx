import React, { useEffect } from 'react';
import { Article } from '../types';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../lib/LanguageContext';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const { l, t, language } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-4xl max-h-full overflow-y-auto rounded-sm shadow-2xl flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-full h-[300px] sm:h-[400px] shrink-0 relative">
          <img 
            src={article.imageUrl} 
            alt={l(article, 'title')}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 md:p-10 lg:p-12">
          <div className="flex items-center space-x-3 mb-6">
            <span className="font-sans font-bold text-sm uppercase tracking-widest text-red-700 bg-red-50 px-3 py-1 rounded-sm">
              {t(`nav.${article.category.toLowerCase()}`)}
            </span>
            <span className="text-gray-300">•</span>
            <span className="font-sans text-sm text-gray-500">
              {new Date(article.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-gray-300">•</span>
            <span className="font-sans text-sm text-gray-500">{article.readTime}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            {l(article, 'title')}
          </h1>

          <div className="flex items-center justify-between border-y border-gray-100 py-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-serif font-bold text-lg">
                {article.author.charAt(0)}
              </div>
              <div>
                <div className="font-sans font-bold text-sm text-gray-900">{article.author}</div>
                <div className="font-sans text-xs text-gray-500">{t('article.staffWriter')}</div>
              </div>
            </div>
            {article.isTrending && (
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-red-600 flex items-center">
                {t('article.trending')}
              </span>
            )}
          </div>

          <div className="font-serif text-xl text-gray-600 leading-relaxed mb-8 italic border-l-4 border-red-700 pl-4">
            {l(article, 'excerpt')}
          </div>

          <div className="font-serif text-lg text-gray-800 leading-loose space-y-6">
            {l(article, 'content') ? (
              <div dangerouslySetInnerHTML={{ __html: l(article, 'content').replace(/\n/g, '<br />') }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: article.content ? article.content.replace(/\n/g, '<br />') : '' }} />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
