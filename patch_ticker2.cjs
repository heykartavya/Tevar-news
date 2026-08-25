const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetTicker = `              <div className="flex-1 overflow-hidden relative h-full flex items-center group">
                <div className="whitespace-nowrap animate-marquee inline-block font-sans text-sm tracking-wide group-hover:[animation-play-state:paused]">
                  {recentArticles.map((a, idx) => (
                    <span key={idx} className="inline-flex items-center cursor-pointer hover:underline" onClick={() => navigate(\`/article/\${a.id}\`)}>
                      {l(a, 'title')}
                      {idx < recentArticles.length - 1 && <span className="mx-4 text-red-300">•</span>}
                    </span>
                  ))}
                </div>
              </div>`;

const replacementTicker = `              <div className="flex-1 overflow-hidden relative h-full flex items-center group">
                <div className="flex w-max animate-marquee font-sans text-sm tracking-wide group-hover:[animation-play-state:paused]">
                  <div className="flex shrink-0 items-center pr-8">
                    {recentArticles.map((a, idx) => (
                      <span key={idx} className="inline-flex items-center cursor-pointer hover:underline" onClick={() => navigate(\`/article/\${a.id}\`)}>
                        {l(a, 'title')}
                        <span className="mx-4 text-red-300">•</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex shrink-0 items-center pr-8" aria-hidden="true">
                    {recentArticles.map((a, idx) => (
                      <span key={\`dup-\${idx}\`} className="inline-flex items-center cursor-pointer hover:underline" onClick={() => navigate(\`/article/\${a.id}\`)}>
                        {l(a, 'title')}
                        <span className="mx-4 text-red-300">•</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>`;

if (content.includes(targetTicker)) {
    content = content.replace(targetTicker, replacementTicker);
    fs.writeFileSync('src/pages/Home.tsx', content);
    console.log("Ticker patched successfully");
} else {
    console.log("Could not find target ticker");
}
