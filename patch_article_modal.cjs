const fs = require('fs');
let content = fs.readFileSync('src/components/ArticleModal.tsx', 'utf8');

if (!content.includes('getArticleImage')) {
  content = content.replace("import { useLanguage } from '../lib/LanguageContext';", "import { useLanguage } from '../lib/LanguageContext';\nimport { getArticleImage } from '../lib/utils';");
  content = content.replace(/article\.imageUrl/g, "getArticleImage(article)");
  fs.writeFileSync('src/components/ArticleModal.tsx', content);
  console.log("Patched ArticleModal.tsx");
}
