import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/generate-workflow", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Using flash for speed
        contents: `Design an autonomous enterprise intelligence network for: "${prompt}". 
        The workflow should reflect a "VOXFLOW AOC" (AI Operations Core) orchestration.
        Available Node Labels: 'File Watcher', 'Cloud Event', 'Webhook In', 'CADD Update', 'Form Entry', 'Cron Timer', 'Slack Notify', 'Discord Push', 'Teams Bridge', 'Email SMTP', 'WhatsApp API', 'CAD Archive', 'Layer Map', 'Plot Check', 'Revise Sync', 'Filter Data', 'JSON Map', 'Security Gate', 'AI Classify', 'Auto Summarize', 'Vector Index', 'Agent Hub', 'Archive Agent', 'Coord Agent', 'CAD Agent', 'Guardian'.
        Available Node Icons: 'Upload', 'Activity', 'Webhook', 'Layers', 'FileText', 'Clock', 'Message', 'Send', 'Users', 'Globe', 'Zip', 'Refresh', 'Filter', 'Braces', 'ShieldCheck', 'AI', 'Search', 'Cpu', 'Store'.
        Types: 'trigger' (entry points), 'action' (processing/agent steps).
        Design specialized agent-driven logic that self-corrects and optimizes enterprise data flow. Positioning should flow horizontally (x increasing).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['trigger', 'action'] },
                    data: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        icon: { type: Type.STRING }
                      },
                      required: ['label', 'icon']
                    },
                    position: {
                      type: Type.OBJECT,
                      properties: {
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER }
                      },
                      required: ['x', 'y']
                    }
                  },
                  required: ['id', 'type', 'data', 'position']
                }
              },
              edges: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    source: { type: Type.STRING },
                    target: { type: Type.STRING },
                    animated: { type: Type.BOOLEAN }
                  },
                  required: ['id', 'source', 'target']
                }
              }
            },
            required: ['nodes', 'edges']
          }
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate workflow" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
