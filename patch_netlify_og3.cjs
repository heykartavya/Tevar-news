const fs = require('fs');

const content = `import { MOCK_ARTICLES } from '../../src/data';

export const handler = async (event: any) => {
  const pathParts = event.path.split('/');
  const articleId = pathParts[pathParts.length - 1];
  const host = event.headers.host || '';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = \`\${protocol}://\${host}\`;

  try {
    const indexResponse = await fetch(\`\${baseUrl}/index.html\`);
    let html = await indexResponse.text();

    if (!articleId || articleId === 'article') {
      return { statusCode: 200, body: html, headers: { 'Content-Type': 'text/html' } };
    }

    const isCustomFirebase = !!process.env.VITE_FIREBASE_API_KEY;
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0445592793';
    let databaseId = process.env.VITE_FIREBASE_DATABASE_ID;
    if (!databaseId) {
       databaseId = isCustomFirebase ? '(default)' : 'ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd';
    }
    const apiKey = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI';
    
    let firestoreUrl = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/\${databaseId}/documents/articles/\${articleId}?key=\${apiKey}\`;

    let title = 'Tevar News';
    let description = 'Latest News';
    let imageUrl = 'https://tevarnews.in/default-og.jpg';
    
    const getYouTubeId = (url: string) => {
      if (!url) return null;
      const match = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?|shorts)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
      return match ? match[1] : null;
    };
    
    const resolveImage = (mainImg: string, blocks: any[]) => {
       const ytId = getYouTubeId(mainImg);
       if (ytId) return \`https://img.youtube.com/vi/\${ytId}/hqdefault.jpg\`;
       
       let firstCloudinary = mainImg && mainImg.includes('res.cloudinary.com') ? mainImg : null;
       
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
       
       if (firstCloudinary) return firstCloudinary;
       return mainImg || imageUrl;
    };

    try {
      let fsRes = await fetch(firestoreUrl);
      let fsData = await fsRes.json();
      
      // If 404, maybe they are using the default database, let's try it if we haven't already
      if (fsData.error && fsData.error.code === 404 && databaseId !== '(default)') {
         firestoreUrl = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/(default)/documents/articles/\${articleId}?key=\${apiKey}\`;
         fsRes = await fetch(firestoreUrl);
         fsData = await fsRes.json();
      }

      if (fsData && fsData.fields) {
        title = fsData.fields.title?.stringValue || fsData.fields.titleHi?.stringValue || title;
        description = fsData.fields.excerpt?.stringValue || fsData.fields.excerptHi?.stringValue || description;
        
        let fetchedImageUrl = fsData.fields.imageUrl?.stringValue || '';
        
        const blocksArray = fsData.fields.blocks?.arrayValue?.values || [];
        const blocks = blocksArray.map((wrapper: any) => ({
           type: wrapper.mapValue?.fields?.type?.stringValue,
           content: wrapper.mapValue?.fields?.content?.stringValue
        }));
        
        imageUrl = resolveImage(fetchedImageUrl, blocks);
        
      } else {
        const mockArticle = MOCK_ARTICLES.find(a => a.id === articleId);
        if (mockArticle) {
          title = mockArticle.titleHi || mockArticle.title || title;
          description = mockArticle.excerptHi || mockArticle.excerpt || description;
          imageUrl = resolveImage(mockArticle.imageUrl || '', mockArticle.blocks || []);
        }
      }
    } catch (e) {
      console.error('Error fetching from Firestore:', e);
    }

    const defaultFallback = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000';
    if (!imageUrl || imageUrl.includes('auto=format&fit=crop&q=80&w=1000')) {
       imageUrl = defaultFallback;
    }

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

    html = html.replace(/<!-- OG_TAGS_START -->[\\s\\S]*?<!-- OG_TAGS_END -->/, ogTags);
    html = html.replace(/<title>.*?<\\/title>/, '');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html
    };
  } catch (error: any) {
    console.error("OG Handler error:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
};
`;
fs.writeFileSync('netlify/functions/og.ts', content);
