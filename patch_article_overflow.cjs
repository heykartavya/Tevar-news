const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

// Replace article-body with added utility classes
content = content.replace('className="article-body"', 'className="article-body word-break-all break-words"');

// Replace text block wrapper
content = content.replace(
  'className="text-gray-800 [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4"',
  'className="text-gray-800 [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 word-break-all break-words max-w-full overflow-x-hidden"'
);

// Fallback legacy content wrapper
content = content.replace(
  'className="font-serif text-lg md:text-xl leading-relaxed text-gray-800 [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4"',
  'className="font-serif text-lg md:text-xl leading-relaxed text-gray-800 [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 word-break-all break-words max-w-full overflow-x-hidden"'
);

// We should also check for <h1> / Title wrapping issue
content = content.replace(
  '<h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 leading-tight mb-6">',
  '<h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 leading-tight mb-6 word-break-all break-words">'
);

fs.writeFileSync('src/pages/ArticlePage.tsx', content);
console.log("Patched ArticlePage");
