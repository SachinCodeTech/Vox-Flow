import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generateWorkflow = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
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
  return JSON.parse(text);
};
