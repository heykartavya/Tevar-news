const fs = require('fs');
let content = fs.readFileSync('netlify/functions/og.ts', 'utf8');

const replaceStr = `
    const ogTags = \`
    <meta property="og:title" content="\${title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="\${description.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="\${imageUrl}" />
    <meta property="og:url" content="\${baseUrl}/article/\${articleId}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="\${title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="\${description.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="\${imageUrl}" />
    <title>\${title.replace(/"/g, '&quot;')}</title>
    \`;

    // Replace generic OG block
    html = html.replace(/<!-- OG_TAGS_START -->[\\s\\S]*?<!-- OG_TAGS_END -->/, ogTags);
    html = html.replace(/<title>.*?<\\/title>/, '');
`;

content = content.replace(/const ogTags = `[\s\S]*?html = html.replace\('<head>', `<head>\${ogTags}`\);/, replaceStr);

fs.writeFileSync('netlify/functions/og.ts', content);
