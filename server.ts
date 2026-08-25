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
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0445592793",
};
const firebaseApp = initializeApp(firebaseConfig, "serverApp");
const dbId = process.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd";
const serverDb = getFirestore(firebaseApp, dbId);


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });



const app = express();
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
        

        const defaultFallback = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000';
        let imageUrl = articleData.imageUrl || defaultFallback;
        
        // Quick helper to check for youtube
        function getYouTubeId(url) {
          if (!url) return null;
          const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          return match ? match[1] : null;
        }

        let ytId = getYouTubeId(articleData.imageUrl);
        if (ytId) {
          imageUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        } else if (articleData.blocks) {
          const ytBlock = articleData.blocks.find(b => b.type === 'youtube' && b.content);
          if (ytBlock && ytBlock.content) {
            ytId = getYouTubeId(ytBlock.content);
            if (ytId) {
              imageUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
            }
          }
        }
        
        const url = `https://${req.get('host')}/article/${id}`;

        
        
        const metaTags = `
          <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${url}" />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${imageUrl}" />
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
