const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetLogic = `  const heroArticle = displayedArticles[0];
  const gridArticles = displayedArticles.slice(1, 5);
  const trendingArticles = articles.filter(a => a.isTrending).slice(0, 4);`;

const replacementLogic = `  const heroArticle = displayedArticles[0];
  const gridArticles = displayedArticles.slice(1, 5);

  const usedIds = new Set<string>();
  if (heroArticle) usedIds.add(heroArticle.id);
  gridArticles.forEach(a => usedIds.add(a.id));

  const trendingArticles = articles.filter(a => a.isTrending && !usedIds.has(a.id)).slice(0, 4);
  trendingArticles.forEach(a => usedIds.add(a.id));

  const editorPicks = displayedArticles.filter(a => !usedIds.has(a.id)).slice(0, 3);`;

content = content.replace(targetLogic, replacementLogic);

const targetEditors = `{displayedArticles.slice(1, 4).map(article => (
                      <ArticleCard key={\`compact-\${article.id}\`} article={article} compact={true} onClick={(article) => navigate(\`/article/\${article.id}\`)} />
                    ))}`;

const replacementEditors = `{editorPicks.map(article => (
                      <ArticleCard key={\`compact-\${article.id}\`} article={article} compact={true} onClick={(article) => navigate(\`/article/\${article.id}\`)} />
                    ))}`;

content = content.replace(targetEditors, replacementEditors);

// Update section header to use Hindi if activeCategory is 'All'
const targetHeader = `{activeCategory === 'All' ? 'Top Stories' : \`\${activeCategory} News\`}`;
const replacementHeader = `{activeCategory === 'All' ? (language === 'en' ? 'Top Stories' : 'ताज़ा खबरें') : \`\${t('nav.' + activeCategory.toLowerCase().replace(/\\s+/g, ''))}\`}`;
content = content.replace(targetHeader, replacementHeader);

fs.writeFileSync('src/pages/Home.tsx', content);
