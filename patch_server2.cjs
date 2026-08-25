const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const routeCode = `
  app.get("/article/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      
      let articleData = null;
      try {
        const docRef = doc(serverDb, 'articles', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          articleData = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (e) {
        console.error("Firestore error on server:", e);
      }
      
      if (!articleData) {
         articleData = MOCK_ARTICLES.find(a => a.id === id) || null;
      }
      
      let html = "";
      const isProd = process.env.NODE_ENV === "production";
      
      if (isProd) {
        html = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf-8');
      } else {
        html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
      }
      
      if (articleData) {
        const title = articleData.title || 'Tevar News';
        let fullText = articleData.excerpt || "";
        if (articleData.content) fullText += " " + articleData.content;
        if (articleData.blocks) {
           articleData.blocks.forEach((b) => {
              if (b.type === 'text' && b.content) {
                 fullText += " " + b.content.replace(/<[^>]*>?/gm, '');
              }
           });
        }
        
        const targetLength = Math.min(Math.floor(fullText.length * 0.4), 800);
        let description = fullText.substring(0, targetLength) + (fullText.length > targetLength ? '...' : '');
        description = description.replace(/"/g, '&quot;');
        
        const imageUrl = articleData.imageUrl || '';
        const url = \`https://\${req.get('host')}/article/\${id}\`;
        
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
        
        html = html.replace('</head>', \`\${metaTags}</head>\`);
      }
      
      if (!isProd && vite) {
         html = await vite.transformIndexHtml(req.url, html);
      }
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      return;
    } catch(e) {
      console.error(e);
      next();
    }
  });
`;

const startServerOld = `async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }`;

const startServerNew = `async function startServer() {
  let vite;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

${routeCode}

  if (process.env.NODE_ENV !== "production") {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false })); // Prevent static middleware from serving index.html for root if it conflicts, but we actually just want it not to serve index.html for /article/:id. 
    // Wait, express.static might serve index.html for root, which is fine. It won't match /article/:id unless there's a folder. So index: false is not needed for distPath if /article/:id is above it.
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }`;

content = content.replace(startServerOld, startServerNew);
fs.writeFileSync('server.ts', content);
console.log("Patched successfully");
