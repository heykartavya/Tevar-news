import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AdSpace } from '../components/AdSpace';
import { ArticleCard } from '../components/ArticleCard';
import { HeroSkeleton, GridSkeleton, CompactSkeleton, TrendingSkeleton } from '../components/ArticleSkeleton';
import { Category, Article } from '../types';
import { MOCK_ARTICLES } from '../data';
import { getArticleImage } from '../lib/utils';
import { TrendingUp } from 'lucide-react';
import { getArticles } from '../lib/db';
import { useLanguage } from '../lib/LanguageContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t, l } = useLanguage();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await getArticles();
        if (fetchedArticles.length > 10) {
          setArticles(fetchedArticles);
        } else {
          // Fallback/merge with mock data to keep the site lively
          const existingTitles = new Set(fetchedArticles.map(a => a.title));
          const mockToAdd = MOCK_ARTICLES.filter(m => !existingTitles.has(m.title));
          setArticles([...fetchedArticles, ...mockToAdd]);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles(MOCK_ARTICLES);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Filter articles based on category and search query
  let displayedArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    displayedArticles = displayedArticles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.excerpt.toLowerCase().includes(query)
    );
  }

  const heroArticle = displayedArticles[0];
  const gridArticles = displayedArticles.slice(1, 5);

  const usedIds = new Set<string>();
  if (heroArticle) usedIds.add(heroArticle.id);
  gridArticles.forEach(a => usedIds.add(a.id));

  const trendingArticles = articles.filter(a => a.isTrending && !usedIds.has(a.id)).slice(0, 4);
  trendingArticles.forEach(a => usedIds.add(a.id));

  const editorPicks = displayedArticles.filter(a => !usedIds.has(a.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="flex-1 flex flex-col">
        
        {/* Breaking News Ticker */}
        {!loading && articles.length > 0 && (() => {
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
          const recentArticles = articles.filter(a => {
            const d = new Date(a.date);
            return d >= threeDaysAgo;
          });
          
          if (recentArticles.length === 0) return null;

          return (
            <div className="w-full bg-red-700 text-white flex items-center h-10 overflow-hidden relative z-10">
              <div className="bg-red-800 h-full flex items-center px-4 md:px-6 font-sans font-bold text-xs md:text-sm uppercase tracking-wider whitespace-nowrap shadow-md z-20 shrink-0">
                {language === 'en' ? 'Breaking News' : 'ब्रेकिंग न्यूज़'}
              </div>
              <div className="flex-1 overflow-hidden relative h-full flex items-center group">
                <div className="flex w-max animate-marquee font-sans text-sm tracking-wide group-hover:[animation-play-state:paused]">
                  <div className="flex shrink-0 items-center pr-8">
                    {recentArticles.map((a, idx) => (
                      <span key={idx} className="inline-flex items-center cursor-pointer hover:underline" onClick={() => navigate(`/article/${a.id}`)}>
                        {l(a, 'title')}
                        <span className="mx-4 text-red-300">•</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex shrink-0 items-center pr-8" aria-hidden="true">
                    {recentArticles.map((a, idx) => (
                      <span key={`dup-${idx}`} className="inline-flex items-center cursor-pointer hover:underline" onClick={() => navigate(`/article/${a.id}`)}>
                        {l(a, 'title')}
                        <span className="mx-4 text-red-300">•</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
{/* Top Ad Space */}
        <div className="w-full bg-gray-50 py-4 border-b border-gray-100">
          <AdSpace format="leaderboard" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
          {/* Section Header */}
          <div className="mb-8 border-b-2 border-black pb-2">
            <h2 className="font-serif text-2xl font-bold tracking-tight">
              {activeCategory === 'All' ? (language === 'en' ? 'Top Stories' : 'ताज़ा खबरें') : `${t('nav.' + activeCategory.toLowerCase().replace(/\s+/g, ''))}`}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-12 gap-8 lg:gap-12">
              <div className="col-span-12 lg:col-span-8">
                <div className="mb-10">
                  <HeroSkeleton />
                </div>
                <div className="my-10 hidden sm:block">
                  <AdSpace format="leaderboard" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-200 pt-8">
                  <GridSkeleton />
                  <GridSkeleton />
                  <GridSkeleton />
                  <GridSkeleton />
                </div>
              </div>
              <aside className="col-span-12 lg:col-span-4 space-y-10">
                <div>
                  <AdSpace format="rectangle" />
                </div>
                <div className="bg-gray-50 p-6 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-6 border-b border-gray-200 pb-3">
                    <TrendingUp className="text-red-700 text-opacity-50" size={20} />
                    <h3 className="font-serif text-xl font-bold text-gray-400">{t('home.trendingNow')}</h3>
                  </div>
                  <div className="flex flex-col space-y-6">
                    <TrendingSkeleton />
                    <TrendingSkeleton />
                    <TrendingSkeleton />
                    <TrendingSkeleton />
                  </div>
                </div>
                <div className="bg-zinc-900 text-white p-6 rounded-sm shadow-xl">
                  <h3 className="font-serif text-2xl font-bold mb-2 text-white">{t('home.theDailyBrief')}</h3>
                  <p className="font-sans text-sm text-zinc-400 mb-6">
                    {t('home.newsletterDesc')}
                  </p>
                  <div className="space-y-3">
                    <input 
                      disabled
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full bg-zinc-800 border-none rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white placeholder-zinc-500 opacity-50 cursor-not-allowed"
                    />
                    <button disabled className="w-full bg-red-700 bg-opacity-50 text-white font-sans font-bold text-sm py-3 rounded-sm opacity-50 cursor-not-allowed">
                      {t('home.signUpFree')}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-4 text-center">
                    {t('home.terms')}
                  </p>
                </div>
                <div>
                  <h3 className="font-sans font-bold uppercase tracking-wider text-sm mb-4 border-b border-black pb-2 text-gray-400">{t('home.editorsPicks')}</h3>
                  <CompactSkeleton />
                  <CompactSkeleton />
                  <CompactSkeleton />
                </div>
                <div className="sticky top-24 pt-4">
                  <AdSpace format="rectangle" />
                </div>
              </aside>
            </div>
          ) : displayedArticles.length === 0 ? (
            <div className="py-20 text-center text-gray-500 font-sans">
              No articles found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-8 lg:gap-12">
              {/* Main Content Column */}
              <div className="col-span-12 lg:col-span-8">
                {/* Hero Section */}
                {heroArticle && (
                  <div className="mb-10">
                    <ArticleCard article={heroArticle} featured={true} onClick={(article) => navigate(`/article/${article.id}`)} />
                  </div>
                )}

                {/* Mid-content Ad */}
                <div className="my-10 hidden sm:block">
                  <AdSpace format="leaderboard" />
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-200 pt-8">
                  {gridArticles.map(article => (
                    <ArticleCard key={article.id} article={article} onClick={(article) => navigate(`/article/${article.id}`)} />
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <aside className="col-span-12 lg:col-span-4 space-y-10">
                {/* Sidebar Ad 1 */}
                <div>
                  <AdSpace format="rectangle" />
                </div>

                {/* Trending Section */}
                {trendingArticles.length > 0 && (
                  <div className="bg-gray-50 p-6 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-6 border-b border-gray-200 pb-3">
                      <TrendingUp className="text-red-700" size={20} />
                      <h3 className="font-serif text-xl font-bold text-gray-900">{t('home.trendingNow')}</h3>
                    </div>
                    <div className="flex flex-col space-y-4">
                      {trendingArticles.map((article, index) => (
                        <div key={article.id} className="group cursor-pointer flex gap-4 items-start" onClick={() => navigate(`/article/${article.id}`)}>
                          <span className="font-serif text-4xl font-black text-gray-200 group-hover:text-red-200 transition-colors">
                            {index + 1}
                          </span>
                          <div className="pt-2">
                            <h4 className="font-serif font-bold text-gray-900 leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                              {l(article, 'title')}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter Widget */}
                <div className="bg-zinc-900 text-white p-6 rounded-sm shadow-xl">
                  <h3 className="font-serif text-2xl font-bold mb-2 text-white">{t('home.theDailyBrief')}</h3>
                  <p className="font-sans text-sm text-zinc-400 mb-6">
                    {t('home.newsletterDesc')}
                  </p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full bg-zinc-800 border-none rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white placeholder-zinc-500"
                    />
                    <button className="w-full bg-red-700 text-white font-sans font-bold text-sm py-3 rounded-sm hover:bg-red-600 transition-colors">
                      {t('home.signUpFree')}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-4 text-center">
                    {t('home.terms')}
                  </p>
                </div>

                {/* More News (Compact list) */}
                {displayedArticles.length > 1 && (
                  <div>
                    <h3 className="font-sans font-bold uppercase tracking-wider text-sm mb-4 border-b border-black pb-2">{t('home.editorsPicks')}</h3>
                    {editorPicks.map(article => (
                      <ArticleCard key={`compact-${article.id}`} article={article} compact={true} onClick={(article) => navigate(`/article/${article.id}`)} />
                    ))}
                  </div>
                )}

                {/* Sidebar Ad 2 */}
                <div className="sticky top-24 pt-4">
                  <AdSpace format="rectangle" />
                </div>


        {/* Video / Reels Section */}
        {!loading && displayedArticles.length > 0 && (
          <div className="w-full bg-zinc-900 py-12 mt-12 border-t-4 border-red-700">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between mb-8 border-b border-zinc-700 pb-2">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
                  {language === 'en' ? 'Video & Reels' : 'वीडियो और रील्स'}
                </h2>
                <button className="text-sm font-sans font-medium text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider">
                   {language === 'en' ? 'View All' : 'सभी देखें'} →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {articles.filter(a => a.category === 'Video' || true).slice(0, 4).map((article, i) => (
                  <div key={`video-${article.id}-${i}`} className="relative group cursor-pointer aspect-[9/16] bg-zinc-800 rounded-md overflow-hidden" onClick={() => navigate(`/article/${article.id}`)}>
                    <img src={getArticleImage(article)} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h4 className="font-sans font-bold text-white leading-tight line-clamp-3 group-hover:text-red-200 transition-colors text-sm">
                        {l(article, 'title')}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
