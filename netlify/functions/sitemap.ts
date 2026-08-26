export const handler = async (event: any) => {
  const host = event.headers.host || 'tevarnews.in';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    const isCustomFirebase = !!process.env.VITE_FIREBASE_API_KEY;
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0445592793';
    let databaseId = process.env.VITE_FIREBASE_DATABASE_ID;
    if (!databaseId) {
       databaseId = isCustomFirebase ? '(default)' : 'ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd';
    }
    const apiKey = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI';
    
    // Fetch last 100 articles
    let firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/articles?key=${apiKey}&pageSize=100&orderBy=date%20desc`;
    
    let fsRes = await fetch(firestoreUrl);
    let fsData = await fsRes.json();
    
    if (fsData.error && fsData.error.code === 404 && databaseId !== '(default)') {
       firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/articles?key=${apiKey}&pageSize=100&orderBy=date%20desc`;
       fsRes = await fetch(firestoreUrl);
       fsData = await fsRes.json();
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

    // Add homepage
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    if (fsData && fsData.documents) {
      fsData.documents.forEach((doc: any) => {
        const id = doc.name.split('/').pop();
        const dateRaw = doc.fields?.date?.stringValue || new Date().toISOString();
        let publishDate = new Date().toISOString();
        try {
           publishDate = new Date(dateRaw).toISOString();
        } catch (e) {}
        
        const title = (doc.fields?.title?.stringValue || doc.fields?.titleHi?.stringValue || 'News').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        
        xml += `  <url>
    <loc>${baseUrl}/article/${id}</loc>
    <lastmod>${publishDate}</lastmod>
    <news:news>
      <news:publication>
        <news:name>Tevar News</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${publishDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>\n`;
      });
    }

    xml += `</urlset>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      },
      body: xml
    };

  } catch (error) {
    console.error("Sitemap error:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
};
