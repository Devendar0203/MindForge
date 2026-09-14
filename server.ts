import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiAvailable: !!process.env.GEMINI_API_KEY });
  });

  // AI Study Assistant: Explanations, practice problems, or reflection feedback
  app.post("/api/gemini/study-aid", async (req, res) => {
    try {
      const { type, day, title, sub, question, userReflection } = req.body;
      const ai = getAi();

      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured",
          fallback: true,
        });
      }

      let systemInstruction = "";
      let prompt = "";

      if (type === "explain") {
        systemInstruction =
          "You are a master software engineer and CS professor. Explain technical concepts with crystal clarity, minimal fluff, deep intuition, and clean pseudo-code or visual diagrams. Keep it under 250 words.";
        prompt = `Explain Day ${day} topic: "${title}". Context: ${sub}. Question/focus area: ${question || "Provide the core mental model, common pitfalls in interviews, and optimal patterns."}`;
      } else if (type === "problems") {
        systemInstruction =
          "You are a senior tech lead and technical interview coach. Provide 3 targeted, high-yield practice challenges ranging from easy to hard, with concise tips.";
        prompt = `For Day ${day} ("${title}" - ${sub}), provide 3 specific practice problems (similar to LeetCode or real ML implementations) with: 1) Problem name & brief summary, 2) Key trick/approach, 3) Time & Space complexity target.`;
      } else if (type === "reflection_coach") {
        systemInstruction =
          "You are a stoic, compassionate mentor for a person undergoing a rigorous 30-day rebuild. Offer brief, sharp, empowering insights on their daily review. Keep it under 150 words.";
        prompt = `Day ${day} Daily Review:
What was avoided: "${userReflection?.avoided || "Nothing logged"}"
What was faced despite fear: "${userReflection?.faced || "Nothing logged"}"
Provide a brief, perceptive observation acknowledging their courage and pinpointing what to focus on tomorrow to defeat avoidance.`;
      } else {
        systemInstruction = "You are a concise engineering coach.";
        prompt = `Day ${day}: "${title}" - ${question}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        result: response.text,
        day,
        type,
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({
        error: err.message || "Failed to generate AI response",
        fallback: true,
      });
    }
  });

  // Vite development middleware vs production static files
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
    console.log(`30-Day Rebuild server running on http://localhost:${PORT}`);
  });
}

startServer();
