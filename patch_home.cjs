const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('getArticleImage')) {
  content = content.replace("import { MOCK_ARTICLES } from '../data';", "import { MOCK_ARTICLES } from '../data';\nimport { getArticleImage } from '../lib/utils';");
  // Check if MOCK_ARTICLES is even imported, maybe it's not.
  content = content.replace("import { CATEGORIES", "import { getArticleImage } from '../lib/utils';\nimport { CATEGORIES");

  content = content.replace(/article\.imageUrl/g, "getArticleImage(article)");
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log("Patched Home.tsx");
}
