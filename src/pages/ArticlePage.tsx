import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticleById, getRelatedArticles } from '../lib/db';
import { MOCK_ARTICLES } from '../data';
import { Article } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArticleCard } from '../components/ArticleCard';
import { useLanguage } from '../lib/LanguageContext';
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

export const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { l, t, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);
      
      let currentArticle = null;
      try {
        const fetched = await getArticleById(id);
        if (fetched) {
          currentArticle = fetched;
        } else {
          currentArticle = MOCK_ARTICLES.find(a => a.id === id) || null;
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        currentArticle = MOCK_ARTICLES.find(a => a.id === id) || null;
      } 
      
      setArticle(currentArticle);
      
      if (currentArticle) {
        try {
          const related = await getRelatedArticles(currentArticle.category, id);
          if (related.length > 0) {
            setRelatedArticles(related);
          } else {
            setRelatedArticles(MOCK_ARTICLES.filter(a => a.category === currentArticle?.category && a.id !== id).slice(0, 3));
          }
        } catch (err) {
          console.error("Error fetching related articles:", err);
          setRelatedArticles(MOCK_ARTICLES.filter(a => a.category === currentArticle?.category && a.id !== id).slice(0, 3));
        }
      }
      
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article) {
      const title = l(article, 'title');
      const excerpt = l(article, 'excerpt');
      document.title = `${title} | Tévar News`;
      
      const setMeta = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      setMeta('og:title', title);
      setMeta('og:description', excerpt);
      setMeta('og:image', article.imageUrl);
      setMeta('og:url', window.location.href);
      setMeta('og:type', 'article');
    }
  }, [article, language, l]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-20 flex justify-center">
          <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-20 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/" className="text-red-700 hover:underline">Return to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = l(article, 'title');

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 md:px-6 py-12">
          
          <Link to="/" className="inline-flex items-center text-sm font-sans font-medium text-gray-500 hover:text-black transition-colors mb-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>

          <header className="mb-10">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-red-700 font-sans font-bold text-sm tracking-wider uppercase">
                {article.category}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-sans text-sm">
                {article.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 leading-tight mb-6 word-break-all break-words">
              {l(article, 'title')}
            </h1>
            
            <p className="text-xl md:text-2xl font-serif text-gray-600 leading-snug mb-8">
              {l(article, 'excerpt')}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-gray-100 py-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center overflow-hidden">
                  <span className="font-serif font-bold text-gray-500">
                    {article.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-sans font-bold text-gray-900 text-sm">
                    {article.author}
                  </div>
                  <div className="font-sans text-gray-500 text-xs">
                    {article.date}
                  </div>
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline-block">Share</span>
                
                {/* WhatsApp Custom Icon */}
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Share on WhatsApp">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Share on Facebook">
                  <Facebook size={16} fill="currentColor" strokeWidth={0} />
                </a>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Share on X">
                  <Twitter size={16} fill="currentColor" strokeWidth={0} />
                </a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Share on LinkedIn">
                  <Linkedin size={16} fill="currentColor" strokeWidth={0} />
                </a>
                <button onClick={copyToClipboard} className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors" title="Copy Link">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </header>

          <div className="article-body word-break-all break-words">
            {article.blocks && article.blocks.length > 0 ? (
              <div className="space-y-6 md:space-y-8 font-serif text-lg md:text-xl leading-relaxed text-gray-800">
                {article.blocks.map((block, idx) => {
                  if (block.type === 'text') {
                    return (
                      <div 
                        key={idx} 
                        className="text-gray-800 [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 word-break-all break-words max-w-full overflow-x-hidden"
                        dangerouslySetInnerHTML={{ __html: l(block, 'content') }}
                      />
                    );
                  }
                  if (block.type === 'image') {
                    return (
                      <figure key={idx} className="my-10">
                        <img 
                          src={block.content} 
                          alt="" 
                          className="w-full h-auto rounded-sm bg-gray-100"
                          loading="lazy"
                        />
                      </figure>
                    );
                  }
                  if (block.type === 'youtube') {
                    const videoIdMatch = block.content.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : null;
                    if (videoId) {
                      return (
                        <div key={idx} className="my-10 aspect-video w-full rounded-sm overflow-hidden bg-gray-100">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      );
                    }
                  }
                  return null;
                })}
              </div>
            ) : (
              <div 
                className="font-serif text-lg md:text-xl leading-relaxed text-gray-800 [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 word-break-all break-words max-w-full overflow-x-hidden"
                dangerouslySetInnerHTML={{ __html: l(article, 'content') }}
              />
            )}
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 border-t border-gray-200 py-16 mt-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="font-sans font-bold text-2xl uppercase tracking-wider mb-8 text-gray-900 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard 
                    key={relatedArticle.id} 
                    article={relatedArticle} 
                    onClick={(a) => navigate(`/article/${a.id}`)} 
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
