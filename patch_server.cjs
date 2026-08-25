const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
  // Dynamic OG tags for articles
  app.get('/article/:id', async (req, res, next) => {
    try {
      const articleId = req.params.id;
      const distPath = path.join(process.cwd(), 'dist');
      let htmlPath = path.join(distPath, 'index.html');
      
      // If dev mode, we can't easily read dist/index.html since it's built in memory,
      // but in prod mode we read the static file.
      let html = '';
      if (process.env.NODE_ENV === 'production') {
        html = fs.readFileSync(htmlPath, 'utf8');
      } else {
        // In dev, let Vite handle it or fallback
        return next();
      }

      const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0445592793';
      const databaseId = process.env.VITE_FIREBASE_DATABASE_ID || 'ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd';
      const apiKey = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI';
      const firestoreUrl = \`https://firestore.googleapis.com/v1/projects/\${projectId}/databases/\${databaseId}/documents/articles/\${articleId}?key=\${apiKey}\`;
      
      let title = 'Tevar News';
      let description = 'Latest News';
      let imageUrl = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

      try {
        const fsRes = await fetch(firestoreUrl);
        const fsData = await fsRes.json();

        if (fsData && fsData.fields) {
          title = fsData.fields.title?.stringValue || fsData.fields.titleHi?.stringValue || title;
          description = fsData.fields.excerpt?.stringValue || fsData.fields.excerptHi?.stringValue || description;
          imageUrl = fsData.fields.imageUrl?.stringValue || imageUrl;
        }
      } catch (e) {
        console.error('Error fetching from Firestore in Express:', e);
      }

      const baseUrl = req.protocol + '://' + req.get('host');
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

      res.send(html);
    } catch (err) {
      next(err);
    }
  });

  // Vite middleware for development
`;

content = content.replace('  // Vite middleware for development', replacement);
content = `import fs from 'fs';\n` + content;
fs.writeFileSync('server.ts', content);
