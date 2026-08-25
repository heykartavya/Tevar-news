const fs = require('fs');
let content = fs.readFileSync('src/components/ArticleCard.tsx', 'utf8');

content = content.replace("import { useLanguage } from '../lib/LanguageContext';", "import { useLanguage } from '../lib/LanguageContext';\nimport { getArticleImage } from '../lib/utils';");

// Replace all instances of `article.imageUrl` with `getArticleImage(article)`
content = content.replace(/article\.imageUrl/g, "getArticleImage(article)");

fs.writeFileSync('src/components/ArticleCard.tsx', content);
console.log("Patched ArticleCard.tsx");
