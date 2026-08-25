import React, { useEffect } from 'react';
import { Article } from '../types';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../lib/LanguageContext';
import { getArticleImage } from '../lib/utils';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 md:p-12">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-full overflow-y-auto sm:rounded-sm shadow-2xl flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-full h-[300px] sm:h-[400px] shrink-0 relative">
          <img 
            src={getArticleImage(article)} 
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
            {article.blocks && article.blocks.length > 0 ? (
              article.blocks.map(block => (
                <div key={block.id} className="mb-6">
                  {block.type === 'text' && (
                    <div dangerouslySetInnerHTML={{ __html: l(block, 'content') || '' }} />
                  )}
                  {block.type === 'image' && block.content && (
                    <figure className="my-8">
                      <img src={block.content} alt="" className="w-full h-auto rounded" />
                    </figure>
                  )}
                  {block.type === 'youtube' && block.content && block.content.includes('youtube.com/watch?v=') && (
                    <div className="mt-4 aspect-video rounded-md overflow-hidden bg-gray-100 my-8">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${new URL(block.content).searchParams.get('v')}`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              ))
            ) : l(article, 'content') ? (
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
