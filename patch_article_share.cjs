const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

const oldShareLinks = `  const shareUrl = window.location.href;
  const shareTitle = l(article, 'title');
  const shareLinks = {
    whatsapp: \`https://api.whatsapp.com/send?text=\${encodeURIComponent(shareTitle + ' ' + shareUrl)}\`,
    facebook: \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(shareUrl)}\`,
    twitter: \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(shareUrl)}&text=\${encodeURIComponent(shareTitle)}\`,
    linkedin: \`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(shareUrl)}&title=\${encodeURIComponent(shareTitle)}\`
  };`;

const newShareLinks = `  const shareUrl = window.location.href;
  const shareTitle = l(article, 'title');
  const shareExcerpt = l(article, 'excerpt');
  
  // Create a rich text message for WhatsApp
  const whatsappMessage = \`*\${shareTitle}*\\n\\n\${shareExcerpt}\\n\\nपूरी खबर पढ़ें:\\n\${shareUrl}\`;
  
  const shareLinks = {
    whatsapp: \`https://api.whatsapp.com/send?text=\${encodeURIComponent(whatsappMessage)}\`,
    facebook: \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(shareUrl)}\`,
    twitter: \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(shareUrl)}&text=\${encodeURIComponent(shareTitle)}\`,
    linkedin: \`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(shareUrl)}&title=\${encodeURIComponent(shareTitle)}\`
  };`;

content = content.replace(oldShareLinks, newShareLinks);
fs.writeFileSync('src/pages/ArticlePage.tsx', content);
console.log("Patched ArticlePage.tsx");
