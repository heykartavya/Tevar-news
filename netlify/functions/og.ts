import { MOCK_ARTICLES } from '../../src/data';

export const handler = async (event: any) => {
  const pathParts = event.path.split('/');
  const articleId = pathParts[pathParts.length - 1];

  const host = event.headers.host || '';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    // 1. Fetch original index.html
    const indexResponse = await fetch(`${baseUrl}/index.html`);
    let html = await indexResponse.text();

    if (!articleId || articleId === 'article') {
      return { statusCode: 200, body: html, headers: { 'Content-Type': 'text/html' } };
    }

    // 2. Fetch from Firestore REST API
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0445592793';
    const databaseId = process.env.VITE_FIREBASE_DATABASE_ID || 'ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd';
    const apiKey = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI';
    
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/articles/${articleId}?key=${apiKey}`;
    
    let title = 'Tevar News';
    let description = 'Latest News';
    let imageUrl = 'https://tevarnews.in/default-og.jpg'; // We can let the default take over or use a logo

    try {
      const fsRes = await fetch(firestoreUrl);
      const fsData = await fsRes.json();

      if (fsData && fsData.fields) {

        title = fsData.fields.title?.stringValue || fsData.fields.titleHi?.stringValue || title;
        description = fsData.fields.excerpt?.stringValue || fsData.fields.excerptHi?.stringValue || description;
        
        let fetchedImageUrl = fsData.fields.imageUrl?.stringValue || '';
        
        // Quick helper to check for youtube
        const getYouTubeId = (url: string) => {
          if (!url) return null;
          const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          return match ? match[1] : null;
        }

        const defaultFallback = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000';
        
        let ytId = getYouTubeId(fetchedImageUrl);
        if (ytId) {
          imageUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
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
                   imageUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
                   foundYt = true;
                   break;
                }
             }
          }
          if (!foundYt) {
             imageUrl = defaultFallback;
          }
        }

      } else {
        // Fallback to mock data
        const mockArticle = MOCK_ARTICLES.find(a => a.id === articleId);
        if (mockArticle) {
          title = mockArticle.titleHi || mockArticle.title || title;
          description = mockArticle.excerptHi || mockArticle.excerpt || description;
          imageUrl = mockArticle.imageUrl || imageUrl;
        }
      }
    } catch (e) {
      console.error('Error fetching from Firestore:', e);
    }

    // 3. Inject OG tags into HTML
    
    const ogTags = `
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${baseUrl}/article/${articleId}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <title>${title.replace(/"/g, '&quot;')}</title>
    `;

    // Replace generic OG block
    html = html.replace(/<!-- OG_TAGS_START -->[\s\S]*?<!-- OG_TAGS_END -->/, ogTags);
    html = html.replace(/<title>.*?<\/title>/, '');


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
