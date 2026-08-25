const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetTicker = `        {/* Breaking News Ticker */}
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
        )}`;

const replacementTicker = `        {/* Breaking News Ticker */}
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
                <div className="whitespace-nowrap animate-marquee inline-block font-sans text-sm tracking-wide group-hover:[animation-play-state:paused]">
                  {recentArticles.map((a, idx) => (
                    <span key={idx} className="inline-flex items-center cursor-pointer hover:underline" onClick={() => navigate(\`/article/\${a.id}\`)}>
                      {l(a, 'title')}
                      {idx < recentArticles.length - 1 && <span className="mx-4 text-red-300">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}`;

if (content.includes(targetTicker)) {
    content = content.replace(targetTicker, replacementTicker);
    fs.writeFileSync('src/pages/Home.tsx', content);
    console.log("Ticker patched successfully");
} else {
    console.log("Could not find target ticker");
}
