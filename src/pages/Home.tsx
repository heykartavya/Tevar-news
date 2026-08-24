import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AdSpace } from '../components/AdSpace';
import { ArticleCard } from '../components/ArticleCard';
import { HeroSkeleton, GridSkeleton, CompactSkeleton, TrendingSkeleton } from '../components/ArticleSkeleton';
import { Category, Article } from '../types';
import { MOCK_ARTICLES } from '../data';
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
  const trendingArticles = articles.filter(a => a.isTrending).slice(0, 4);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="flex-1 flex flex-col">
        {/* Top Ad Space */}
        <div className="w-full bg-gray-50 py-4 border-b border-gray-100">
          <AdSpace format="leaderboard" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
          {/* Section Header */}
          <div className="mb-8 border-b-2 border-black pb-2">
            <h2 className="font-serif text-2xl font-bold tracking-tight">
              {activeCategory === 'All' ? 'Top Stories' : `${activeCategory} News`}
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
                    {displayedArticles.slice(1, 4).map(article => (
                      <ArticleCard key={`compact-${article.id}`} article={article} compact={true} onClick={(article) => navigate(`/article/${article.id}`)} />
                    ))}
                  </div>
                )}

                {/* Sidebar Ad 2 */}
                <div className="sticky top-24 pt-4">
                  <AdSpace format="rectangle" />
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
