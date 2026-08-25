const fs = require('fs');
const file = 'src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setTranslating(true);
    try {
      // Auto-translate using the API
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newArticle.title,
          excerpt: newArticle.excerpt,
          content: newArticle.content || '',
          blocks: newArticle.blocks || []
        })
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(()=>({})); throw new Error(errData.error || 'Translation failed');
      }
      
      const translation = await res.json();
      
      // Merge translated blocks back into the article structure
      const translatedBlocks = (newArticle.blocks || []).map((block, index) => {
        const enBlock = translation.blocksEn?.[index] || {};
        const hiBlock = translation.blocksHi?.[index] || {};
        return {
          ...block,
          contentEn: block.type === 'text' ? (enBlock.contentEn || enBlock.content || block.content) : block.content,
          contentHi: block.type === 'text' ? (hiBlock.contentHi || hiBlock.content || block.content) : block.content
        };
      });

      const firstImageBlock = translatedBlocks.find(b => b.type === 'image' && b.content);
      const imageUrl = firstImageBlock ? firstImageBlock.content : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000'; // Default news fallback image

      const rawArticle = {
        ...newArticle,
        blocks: translatedBlocks,
        imageUrl,
        titleEn: translation.titleEn,
        titleHi: translation.titleHi,
        excerptEn: translation.excerptEn,
        excerptHi: translation.excerptHi,
        contentEn: translation.contentEn || '',
        contentHi: translation.contentHi || '',
        originalLanguage: translation.detectedLanguage || 'Hinglish'
      };
      
      // Strip undefined values to prevent Firestore errors
      const articleToSave = Object.fromEntries(
        Object.entries(rawArticle).filter(([_, v]) => v !== undefined)
      );

      await addArticle(articleToSave as Omit<Article, 'id'>);
      setNewArticle({
        title: '', excerpt: '', content: '', blocks: [], category: 'World', author: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), readTime: '5 min read', isTrending: false
      });
      fetchArticles();
    } catch (err) {
      console.error(err);`;

const replacement = `  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setTranslating(true);
    try {
      // Publisher types in Hindi, so map directly without translation
      const blocks = (newArticle.blocks || []).map((block) => {
        return {
          ...block,
          contentEn: block.content,
          contentHi: block.content
        };
      });

      const firstImageBlock = blocks.find(b => b.type === 'image' && b.content);
      const imageUrl = firstImageBlock ? firstImageBlock.content : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000'; // Default news fallback image

      const rawArticle = {
        ...newArticle,
        blocks: blocks,
        imageUrl,
        titleEn: newArticle.title,
        titleHi: newArticle.title,
        excerptEn: newArticle.excerpt,
        excerptHi: newArticle.excerpt,
        contentEn: newArticle.content || '',
        contentHi: newArticle.content || '',
        originalLanguage: 'hi'
      };
      
      // Strip undefined values to prevent Firestore errors
      const articleToSave = Object.fromEntries(
        Object.entries(rawArticle).filter(([_, v]) => v !== undefined)
      );

      await addArticle(articleToSave as Omit<Article, 'id'>);
      setNewArticle({
        title: '', excerpt: '', content: '', blocks: [], category: 'World', author: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), readTime: '5 min read', isTrending: false
      });
      fetchArticles();
    } catch (err) {
      console.error(err);`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Success");
} else {
    console.log("Target not found");
}
