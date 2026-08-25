const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
        const defaultFallback = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000';
        let imageUrl = articleData.imageUrl || defaultFallback;
        
        // Quick helper to check for youtube
        function getYouTubeId(url) {
          if (!url) return null;
          const match = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?|shorts)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
          return match ? match[1] : null;
        }

        let ytId = getYouTubeId(articleData.imageUrl);
        if (ytId) {
          imageUrl = \`https://img.youtube.com/vi/\${ytId}/hqdefault.jpg\`;
        } else if (articleData.blocks) {
          const ytBlock = articleData.blocks.find(b => b.type === 'youtube' && b.content);
          if (ytBlock && ytBlock.content) {
            ytId = getYouTubeId(ytBlock.content);
            if (ytId) {
              imageUrl = \`https://img.youtube.com/vi/\${ytId}/hqdefault.jpg\`;
            }
          }
        }
        
        const url = \`https://\${req.get('host')}/article/\${id}\`;
`;

content = content.replace(
  "        const imageUrl = articleData.imageUrl || '';\n        const url = `https://${req.get('host')}/article/${id}`;",
  replacement
);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts");
