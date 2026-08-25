const fs = require('fs');
let content = fs.readFileSync('src/components/ArticleCard.tsx', 'utf8');

// Replace heading 2
content = content.replace(
  'className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-3 text-gray-900 group-hover:text-red-700 transition-colors"',
  'className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-3 text-gray-900 group-hover:text-red-700 transition-colors word-break-all break-words max-w-full"'
);

// Replace paragraph in featured
content = content.replace(
  'className="font-serif text-lg text-gray-600 leading-relaxed mb-4"',
  'className="font-serif text-lg text-gray-600 leading-relaxed mb-4 word-break-all break-words max-w-full"'
);

// Replace heading 3 in compact
content = content.replace(
  'className="font-serif text-lg font-bold leading-snug mb-2 text-gray-900 group-hover:text-red-700 transition-colors"',
  'className="font-serif text-lg font-bold leading-snug mb-2 text-gray-900 group-hover:text-red-700 transition-colors word-break-all break-words max-w-full"'
);

// Replace heading 3 in standard
content = content.replace(
  'className="font-serif text-xl font-bold leading-snug mb-2 text-gray-900 group-hover:text-red-700 transition-colors line-clamp-3"',
  'className="font-serif text-xl font-bold leading-snug mb-2 text-gray-900 group-hover:text-red-700 transition-colors line-clamp-3 word-break-all break-words max-w-full"'
);

// Replace paragraph in standard
content = content.replace(
  'className="font-serif text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1"',
  'className="font-serif text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1 word-break-all break-words max-w-full"'
);

fs.writeFileSync('src/components/ArticleCard.tsx', content);
console.log("Patched ArticleCard");
