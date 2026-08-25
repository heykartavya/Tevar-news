const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
        const metaTags = \`
          <meta property="og:title" content="\${title.replace(/"/g, '&quot;')}" />
          <meta property="og:description" content="\${description}" />
          <meta property="og:image" content="\${imageUrl}" />
          <meta property="og:url" content="\${url}" />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="\${title.replace(/"/g, '&quot;')}" />
          <meta name="twitter:description" content="\${description}" />
          <meta name="twitter:image" content="\${imageUrl}" />
        \`;
        
        // Replace everything between <!-- OG_TAGS_START --> and <!-- OG_TAGS_END -->
        if (html.includes('<!-- OG_TAGS_START -->') && html.includes('<!-- OG_TAGS_END -->')) {
            html = html.replace(/<!-- OG_TAGS_START -->[\\s\\S]*?<!-- OG_TAGS_END -->/, metaTags);
        } else {
            html = html.replace('</head>', \`\${metaTags}</head>\`);
        }
`;

content = content.replace(/const metaTags = `[\s\S]*?`;\s*html = html\.replace\('<\/head>', `\$\{metaTags\}<\/head>`\);/, replacement);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with OG tag replacement");
