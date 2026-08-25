const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

if (!content.includes('getArticleImage')) {
  // Let's find a good place to import
  content = content.replace("import { Helmet } from 'react-helmet-async';", "import { Helmet } from 'react-helmet-async';\nimport { getArticleImage } from '../lib/utils';");
  
  // Actually sometimes it might not have Helmet? Let's try replacing `import { useParams`
  content = content.replace("import { useParams", "import { getArticleImage } from '../lib/utils';\nimport { useParams");

  content = content.replace(/article\.imageUrl/g, "getArticleImage(article)");
  fs.writeFileSync('src/pages/ArticlePage.tsx', content);
  console.log("Patched ArticlePage.tsx");
}
