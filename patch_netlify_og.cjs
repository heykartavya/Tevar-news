const fs = require('fs');
let content = fs.readFileSync('netlify/functions/og.ts', 'utf8');

const replacement = `
        title = fsData.fields.title?.stringValue || fsData.fields.titleHi?.stringValue || title;
        description = fsData.fields.excerpt?.stringValue || fsData.fields.excerptHi?.stringValue || description;
        
        let fetchedImageUrl = fsData.fields.imageUrl?.stringValue || '';
        
        // Quick helper to check for youtube
        function getYouTubeId(url) {
          if (!url) return null;
          const match = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?|shorts)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
          return match ? match[1] : null;
        }

        const defaultFallback = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000';
        
        let ytId = getYouTubeId(fetchedImageUrl);
        if (ytId) {
          imageUrl = \`https://img.youtube.com/vi/\${ytId}/hqdefault.jpg\`;
        } else if (fetchedImageUrl && !fetchedImageUrl.includes('auto=format&fit=crop&q=80&w=1000') && fetchedImageUrl !== defaultFallback) {
          imageUrl = fetchedImageUrl;
        } else {
          // Look into blocks for youtube
          const blocksArray = fsData.fields.blocks?.arrayValue?.values || [];
          let foundYt = false;
          for (const blockWrapper of blocksArray) {
             const b = blockWrapper.mapValue?.fields || {};
             const type = b.type?.stringValue;
             const contentStr = b.content?.stringValue;
             if (type === 'youtube' && contentStr) {
                const id = getYouTubeId(contentStr);
                if (id) {
                   imageUrl = \`https://img.youtube.com/vi/\${id}/hqdefault.jpg\`;
                   foundYt = true;
                   break;
                }
             }
          }
          if (!foundYt) {
             imageUrl = defaultFallback;
          }
        }
`;

content = content.replace(
  "        title = fsData.fields.title?.stringValue || fsData.fields.titleHi?.stringValue || title;\n        description = fsData.fields.excerpt?.stringValue || fsData.fields.excerptHi?.stringValue || description;\n        imageUrl = fsData.fields.imageUrl?.stringValue || imageUrl;",
  replacement
);

fs.writeFileSync('netlify/functions/og.ts', content);
console.log("Patched netlify/functions/og.ts");
