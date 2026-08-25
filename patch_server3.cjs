const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
        const getYouTubeId = (url) => {
          if (!url) return null;
          const match = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?|shorts)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
          return match ? match[1] : null;
        };

        const resolveImage = (mainImg, blocks) => {
           const ytId = getYouTubeId(mainImg);
           if (ytId) return \`https://img.youtube.com/vi/\${ytId}/hqdefault.jpg\`;
           
           let firstCloudinary = mainImg && mainImg.includes('res.cloudinary.com') ? mainImg : null;
           
           if (blocks && Array.isArray(blocks)) {
             for (const b of blocks) {
                const type = b.type;
                const contentStr = b.content;
                if (type === 'youtube' && contentStr) {
                   const id = getYouTubeId(contentStr);
                   if (id) return \`https://img.youtube.com/vi/\${id}/hqdefault.jpg\`;
                }
                if (type === 'image' && contentStr && !firstCloudinary && contentStr.includes('res.cloudinary.com')) {
                   firstCloudinary = contentStr;
                }
             }
           }
           
           if (firstCloudinary) return firstCloudinary;
           return mainImg || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000';
        };

        const imageUrl = resolveImage(articleData.imageUrl || '', articleData.blocks || []);
        
        const url = \`https://\${req.get('host')}/article/\${id}\`;
`;

// Looking for where imageUrl is currently computed in server.ts
// It might be something like this from our previous patch:
/*
        const defaultFallback = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000';
        let imageUrl = articleData.imageUrl || defaultFallback;
        
        // Quick helper to check for youtube
        function getYouTubeId(url) {
          ...
*/
// It's probably safer to replace everything between `description = description.replace(/"/g, '&quot;');` and `const url = ...`

content = content.replace(
  /description = description\.replace\(\/"\/g, '&quot;'\);[\s\S]*?const url = `https:\/\/\$\{req\.get\('host'\)\}\/article\/\$\{id\}`;/,
  `description = description.replace(/"/g, '&quot;');` + replacement
);

fs.writeFileSync('server.ts', content);
