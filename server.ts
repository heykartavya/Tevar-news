import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Translation API Route
app.post("/api/translate", async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const prompt = `
Translate the following news article into Hindi and English.
Also, detect the original language (Hindi, English, or Hinglish).
Return a JSON object containing the translations.

Original Title: ${title}
Original Excerpt: ${excerpt}
Original Content: ${content}
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
