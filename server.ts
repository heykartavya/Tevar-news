import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

import dotenv from "dotenv";

dotenv.config();

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
app.post("/api/upload", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: "Cloudinary is not configured on the server." });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
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
      model: "gemini-3.5-flash",
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
    res.status(500).json({ error: "Failed to translate article." });
  }
});

async function startServer() {
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
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
