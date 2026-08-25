const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetMainEnd = `              </aside>
            </div>
          )}
        </div>
      </main>`;

const videoSection = `

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
                  <div key={\`video-\${article.id}-\${i}\`} className="relative group cursor-pointer aspect-[9/16] bg-zinc-800 rounded-md overflow-hidden" onClick={() => navigate(\`/article/\${article.id}\`)}>
                    <img src={article.imageUrl} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
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

`;

// Insert videoSection before targetMainEnd
content = content.replace(targetMainEnd, videoSection + targetMainEnd);


// Insert Breaking News ticker before top ad space
const targetTopAd = `{/* Top Ad Space */}`;
const breakingSection = `
        {/* Breaking News Ticker */}
        {!loading && articles.length > 0 && (
          <div className="w-full bg-red-700 text-white flex items-center h-10 overflow-hidden relative z-10">
            <div className="bg-red-800 h-full flex items-center px-4 md:px-6 font-sans font-bold text-xs md:text-sm uppercase tracking-wider whitespace-nowrap shadow-md z-20 shrink-0">
              {language === 'en' ? 'Breaking News' : 'ब्रेकिंग न्यूज़'}
            </div>
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
              <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] inline-block font-sans text-sm tracking-wide">
                {articles.filter(a => a.category === 'Breaking').length > 0 
                  ? articles.filter(a => a.category === 'Breaking').map(a => l(a, 'title')).join(' • ')
                  : articles.map(a => l(a, 'title')).slice(0, 3).join('  •  ')}
              </div>
            </div>
          </div>
        )}
`;

content = content.replace(targetTopAd, breakingSection + targetTopAd);

fs.writeFileSync('src/pages/Home.tsx', content);
