import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

import { MOCK_ARTICLES } from './src/data';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, addDoc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { GoogleAuth } from 'google-auth-library';

let appletConfig: any = {};
try {
  appletConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
} catch (e) {}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey || "AIzaSyCQ7ZD-ZVvxpIisyNlZG0GO0KACCD83auo",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId || "tevar-news",
};
const firebaseApp = getApps().find(a => a.name === "serverApp") || initializeApp(firebaseConfig, "serverApp");
const dbId = process.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId;
const serverDb = (dbId && dbId !== '(default)') ? getFirestore(firebaseApp, dbId) : getFirestore(firebaseApp);



// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });



const app = express();

app.get('/sitemap.xml', async (req, res) => {
  try {
    const isCustomFirebase = !!process.env.VITE_FIREBASE_API_KEY;
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0445592793';
    let databaseId = process.env.VITE_FIREBASE_DATABASE_ID;
    if (!databaseId) {
       databaseId = isCustomFirebase ? '(default)' : 'ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd';
    }
    const apiKey = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI';
    
    let firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/articles?key=${apiKey}&pageSize=100&orderBy=date%20desc`;
    
    let fsRes = await fetch(firestoreUrl);
    let fsData = await fsRes.json();
    
    if (fsData.error && fsData.error.code === 404 && databaseId !== '(default)') {
       firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/articles?key=${apiKey}&pageSize=100&orderBy=date%20desc`;
       fsRes = await fetch(firestoreUrl);
       fsData = await fsRes.json();
    }

    const host = req.get('host') || 'tevarnews.in';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    if (fsData && fsData.documents) {
      fsData.documents.forEach((doc) => {
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

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});


// Image Upload Route using Cloudinary
app.post("/api/upload", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image provided." });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: "Cloudinary is not configured on the server." });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "tevarnews", // Optional: organizes images in a folder
      resource_type: "auto",
    });

    res.json({ 
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
});

// Translation API Route
app.post("/api/translate", async (req, res) => {
  try {
    const { title, excerpt, content, blocks } = req.body;
    
    if (!title || !excerpt) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Strip large base64 image data before sending to AI to avoid token limits
    const sanitizedBlocks = (blocks || []).map((b: any) => ({
      ...b,
      content: b.type === 'image' ? '[IMAGE_DATA_REMOVED_FOR_TRANSLATION]' : b.content
    }));

    const prompt = `
Translate the following news article into Hindi and English.
Also, detect the original language (Hindi, English, or Hinglish).
Return a JSON object containing the translations.

Original Title: ${title}
Original Excerpt: ${excerpt}
Original Content: ${content || 'N/A'}
Original Blocks JSON: ${blocks ? JSON.stringify(sanitizedBlocks) : 'N/A'}

For the blocks, translate only the 'content' field if the type is 'text'. For 'image' or 'youtube', copy the block exactly and set the contentHi and contentEn to be the same URL as the original content. Return the full array of translated blocks.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: {
              type: Type.STRING,
              description: "Detected original language: 'English', 'Hindi', or 'Hinglish'"
            },
            titleEn: { type: Type.STRING },
            excerptEn: { type: Type.STRING },
            contentEn: { type: Type.STRING },
            titleHi: { type: Type.STRING },
            excerptHi: { type: Type.STRING },
            contentHi: { type: Type.STRING },
            blocksEn: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  content: { type: Type.STRING },
                  contentEn: { type: Type.STRING },
                  contentHi: { type: Type.STRING }
                }
              }
            },
            blocksHi: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  content: { type: Type.STRING },
                  contentEn: { type: Type.STRING },
                  contentHi: { type: Type.STRING }
                }
              }
            }
          },
          required: ["detectedLanguage", "titleEn", "excerptEn", "contentEn", "titleHi", "excerptHi", "contentHi"],
        },
      }
    });

    const jsonText = response.text?.trim() || "{}";
    const result = JSON.parse(jsonText);
    
    res.json(result);
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Failed to translate article. " + (error instanceof Error ? error.message : String(error)) });
  }
});

// Push Notification Persistence Helpers
const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data_subscribers.json');
const ALERTS_FILE = path.join(process.cwd(), 'data_alerts.json');

const getLocalSubscribers = (): Record<string, any> => {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
    }
  } catch (e) {}
  return {};
};

const saveLocalSubscribers = (data: Record<string, any>) => {
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
};

const getLocalAlerts = (): any[] => {
  try {
    if (fs.existsSync(ALERTS_FILE)) {
      return JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
};

const saveLocalAlerts = (alerts: any[]) => {
  try {
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(alerts, null, 2), 'utf8');
  } catch (e) {}
};

// Push Notification Subscription API
app.post("/api/notifications/subscribe", async (req, res) => {
  try {
    const { token, userAgent, topics } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    const safeId = token.replace(/[^a-zA-Z0-9_-]/g, '_').slice(-80);
    const subRecord = {
      token,
      userAgent: userAgent || req.headers['user-agent'] || '',
      topics: topics || ['breaking_news'],
      active: true,
      subscribedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save locally
    const local = getLocalSubscribers();
    local[safeId] = subRecord;
    saveLocalSubscribers(local);

    // Attempt Firestore
    try {
      await setDoc(doc(serverDb, 'subscribers', safeId), subRecord, { merge: true });
    } catch (fsErr) {
      console.warn("Firestore save notice (using local fallback):", fsErr);
    }

    res.json({ success: true });
  } catch (e) {
    console.error("Subscription error:", e);
    res.status(500).json({ error: "Could not save subscriber" });
  }
});

// Push Notification Unsubscribe API
app.post("/api/notifications/unsubscribe", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    const safeId = token.replace(/[^a-zA-Z0-9_-]/g, '_').slice(-80);
    const local = getLocalSubscribers();
    if (local[safeId]) {
      delete local[safeId];
      saveLocalSubscribers(local);
    }

    try {
      await deleteDoc(doc(serverDb, 'subscribers', safeId));
    } catch (e) {}

    res.json({ success: true });
  } catch (e) {
    console.error("Unsubscribe error:", e);
    res.status(500).json({ error: "Could not remove subscriber" });
  }
});

// Push Notification Stats API
app.get("/api/notifications/stats", async (req, res) => {
  try {
    let count = Object.values(getLocalSubscribers()).filter((s: any) => s.active !== false).length;
    let recentAlerts = getLocalAlerts().slice(-5).reverse();

    try {
      const snap = await getDocs(collection(serverDb, 'subscribers'));
      const fsCount = snap.docs.filter(d => d.data().active !== false).length;
      if (fsCount > count) count = fsCount;

      const alertsSnap = await getDocs(query(collection(serverDb, 'breaking_alerts'), orderBy('createdAt', 'desc'), limit(5)));
      if (!alertsSnap.empty) {
        recentAlerts = alertsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {}

    res.json({
      subscribersCount: count,
      recentAlerts
    });
  } catch (e) {
    res.json({ subscribersCount: 0, recentAlerts: [] });
  }
});

// Send Breaking News Push Notification API
app.post("/api/notifications/send-breaking-news", async (req, res) => {
  try {
    const { title, body, url, imageUrl, articleId } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required." });
    }

    const alertData = {
      id: 'alert_' + Date.now(),
      title,
      body,
      url: url || (articleId ? `/article/${articleId}` : '/'),
      imageUrl: imageUrl || '',
      articleId: articleId || '',
      createdAt: new Date().toISOString()
    };

    // Save alert locally
    const alerts = getLocalAlerts();
    alerts.push(alertData);
    saveLocalAlerts(alerts);

    // Save to Firestore
    try {
      await addDoc(collection(serverDb, 'breaking_alerts'), alertData);
    } catch (e) {}

    // Gather subscriber tokens from both local and Firestore
    const localTokens = Object.values(getLocalSubscribers())
      .filter((s: any) => s.active !== false && s.token)
      .map((s: any) => s.token);

    let fsTokens: string[] = [];
    try {
      const snap = await getDocs(collection(serverDb, 'subscribers'));
      fsTokens = snap.docs
        .map(d => d.data())
        .filter((d: any) => d.active !== false && d.token)
        .map((d: any) => d.token);
    } catch (e) {}

    const allTokens = Array.from(new Set([...localTokens, ...fsTokens]));

    // 3. Dispatch Push Notifications via modern FCM HTTP v1 (Service Account) or Legacy Server Key
    const fcmServerKey = process.env.FIREBASE_SERVER_KEY || process.env.FCM_SERVER_KEY;
    let serviceAccountCredentials: any = null;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccountCredentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch (e) {
        console.warn("Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON format");
      }
    } else if (fs.existsSync(path.join(process.cwd(), 'service-account.json'))) {
      try {
        serviceAccountCredentials = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'service-account.json'), 'utf8'));
      } catch (e) {}
    }

    let pushSentCount = 0;
    const realTokens = allTokens.filter(t => !t.startsWith('web_subscriber_'));

    if (serviceAccountCredentials && realTokens.length > 0) {
      // Modern FCM HTTP v1 API (Recommended by Google)
      try {
        const projectId = serviceAccountCredentials.project_id || firebaseConfig.projectId || 'tevar-news';
        const auth = new GoogleAuth({
          credentials: serviceAccountCredentials,
          scopes: ['https://www.googleapis.com/auth/firebase.messaging']
        });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const accessToken = tokenResponse.token;

        if (accessToken) {
          for (const targetToken of realTokens) {
            try {
              const v1Res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                  message: {
                    token: targetToken,
                    notification: {
                      title,
                      body,
                      image: imageUrl || undefined
                    },
                    webpush: {
                      fcm_options: {
                        link: alertData.url
                      },
                      notification: {
                        icon: '/tevar-icon.png',
                        badge: '/tevar-icon.png'
                      }
                    },
                    data: {
                      title,
                      body,
                      url: alertData.url,
                      articleId: articleId || '',
                      imageUrl: imageUrl || ''
                    }
                  }
                })
              });
              if (v1Res.ok) {
                pushSentCount++;
              }
            } catch (err) {
              console.warn("Error dispatching FCM v1 message:", err);
            }
          }
        }
      } catch (fcmV1Err) {
        console.error("FCM v1 dispatch error:", fcmV1Err);
      }
    } else if (fcmServerKey && realTokens.length > 0) {
      // Legacy FCM API (if user enabled legacy API)
      try {
        const fcmRes = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${fcmServerKey}`
          },
          body: JSON.stringify({
            registration_ids: realTokens,
            notification: {
              title,
              body,
              icon: '/tevar-icon.png',
              badge: '/tevar-icon.png',
              image: imageUrl || undefined,
              click_action: alertData.url
            },
            data: {
              title,
              body,
              url: alertData.url,
              articleId: articleId || '',
              image: imageUrl || ''
            }
          })
        });
        const fcmResult = await fcmRes.json();
        pushSentCount = fcmResult.success || 0;
      } catch (fcmErr) {
        console.error("FCM dispatch error:", fcmErr);
      }
    }

    res.json({
      success: true,
      alertId: alertData.id,
      totalSubscribers: allTokens.length,
      pushSentCount,
      fcmConfigured: !!(serviceAccountCredentials || fcmServerKey),
      fcmMode: serviceAccountCredentials ? 'v1' : (fcmServerKey ? 'legacy' : 'none')
    });
  } catch (error) {
    console.error("Failed to send breaking news notification:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to send notification" });
  }
});



// Global Error Handler for Express to return JSON instead of HTML
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Express Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});


async function startServer() {
  let vite;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

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
        const getYouTubeId = (url) => {
          if (!url) return null;
          const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          return match ? match[1] : null;
        };

        const resolveImage = (mainImg, blocks) => {
           const ytId = getYouTubeId(mainImg);
           if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
           
           let firstCloudinary = mainImg && mainImg.includes('res.cloudinary.com') ? mainImg : null;
           
           if (blocks && Array.isArray(blocks)) {
             for (const b of blocks) {
                const type = b.type;
                const contentStr = b.content;
                if (type === 'youtube' && contentStr) {
                   const id = getYouTubeId(contentStr);
                   if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
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
        
        const url = `https://${req.get('host')}/article/${id}`;
        const cleanTitle = title.replace(/"/g, '&quot;');
        const cleanDesc = description; // Server already replaced quotes in description earlier
        const datePublished = articleData.date || new Date().toISOString();
        const author = articleData.author || 'Tevar News';

        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": cleanTitle,
          "image": [imageUrl],
          "datePublished": datePublished,
          "dateModified": articleData.updatedAt || datePublished,
          "author": [{
              "@type": "Person",
              "name": author.replace(/"/g, '&quot;')
          }],
          "publisher": {
              "@type": "Organization",
              "name": "Tevar News",
              "logo": {
                  "@type": "ImageObject",
                  "url": "https://tevarnews.in/logo.png"
              }
          }
        };
        
        const metaTags = `
          <title>${cleanTitle}</title>
          <meta name="description" content="${cleanDesc}" />
          <link rel="canonical" href="${url}" />
          
          <meta property="og:title" content="${cleanTitle}" />
          <meta property="og:description" content="${cleanDesc}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${url}" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Tevar News" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${cleanTitle}" />
          <meta name="twitter:description" content="${cleanDesc}" />
          <meta name="twitter:image" content="${imageUrl}" />
          
          <script type="application/ld+json">
            ${JSON.stringify(jsonLd)}
          </script>
        `;
        
        // Replace everything between <!-- OG_TAGS_START --> and <!-- OG_TAGS_END -->

        if (html.includes('<!-- OG_TAGS_START -->') && html.includes('<!-- OG_TAGS_END -->')) {
            html = html.replace(/<!-- OG_TAGS_START -->[\s\S]*?<!-- OG_TAGS_END -->/, metaTags);
        } else {
            html = html.replace('</head>', `${metaTags}</head>`);
        }

      }
      
      if (!isProd && vite) {
         html = await vite.transformIndexHtml(req.url, html);
      }
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      return;
    } catch(e) {
      console.error("Error in SSR route:", e);
      next();
    }
  });

  if (process.env.NODE_ENV !== "production") {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
