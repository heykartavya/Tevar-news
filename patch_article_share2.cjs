const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

const regex = /const shareUrl = window\.location\.href;\s*const shareTitle = l\(article, 'title'\);\s*const shareLinks = {[\s\S]*?};\s*const copyToClipboard/;

const newText = `const shareUrl = window.location.href;
  const shareTitle = l(article, 'title');
  const shareExcerpt = l(article, 'excerpt');
  const whatsappMessage = \`*\${shareTitle}*\\n\\n\${shareExcerpt}\\n\\nपूरी खबर पढ़ें:\\n\${shareUrl}\`;
  const shareLinks = {
    whatsapp: \`https://api.whatsapp.com/send?text=\${encodeURIComponent(whatsappMessage)}\`,
    facebook: \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(shareUrl)}\`,
    twitter: \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(shareUrl)}&text=\${encodeURIComponent(shareTitle)}\`,
    linkedin: \`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(shareUrl)}&title=\${encodeURIComponent(shareTitle)}\`
  };

  const copyToClipboard`;

if(regex.test(content)) {
    content = content.replace(regex, newText);
    fs.writeFileSync('src/pages/ArticlePage.tsx', content);
    console.log("Patched successfully!");
} else {
    console.log("Regex didn't match!");
}
