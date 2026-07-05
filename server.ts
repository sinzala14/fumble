/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini API Client
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment. Please configure it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Interactive Dating Scenario Roleplay Endpoint
app.post("/api/fumble/roleplay", async (req: express.Request, res: express.Response) => {
  try {
    const { scenario, messages, userMessage } = req.body;
    if (!scenario || !userMessage) {
      res.status(400).json({ error: "Missing required parameters: scenario or userMessage" });
      return;
    }

    const ai = getGeminiClient();

    // Format interaction history for context
    const conversationHistory = messages
      .map((m: any) => `${m.sender === "user" ? "User (practicing)" : `${scenario.characterName} (${scenario.avatar})`}: ${m.text}`)
      .join("\n");

    const systemInstruction = `You are a social intelligence coaching simulator. You are simulating a conversation partner named ${scenario.characterName} in the context of: "${scenario.context}".
Difficulty level: ${scenario.difficulty}.
Character guidelines: ${scenario.promptDirections}

Your task is twofold:
1. Act as ${scenario.characterName}. Answer the User naturally. Do not be overly compliant or excessively cruel; react naturally according to the charm, empathy, or awkwardness of the user's message. Keep replies realistic, brief, and authentic to a typical human interaction.
2. Step out of character and evaluate the user's LATEST message ("${userMessage}"). Grade their approach, give them a 'Rizz Level' rating (Fumble, Average, Smooth, or Rizzler), a score from 0 to 100, constructive coaching feedback, and rewrite their text in a much better way.

You must return a strict JSON object matches this exact schema structure:
{
  "characterReply": "Spoken reaction of ${scenario.characterName}",
  "analysis": {
    "score": 85,
    "level": "Smooth",
    "critique": "A brief, supportive coaching note detailing what makes the user message work or fail.",
    "suggestion": "A revised, highly-charismatic formulation of what they wanted to say."
  }
}`;

    const prompt = `Conversation history so far:
${conversationHistory}
User's latest reply: "${userMessage}"

Act as ${scenario.characterName} and analyze the latest user message. Return the response in the JSON format requested.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            characterReply: {
              type: Type.STRING,
              description: `Spoken dialogue from ${scenario.characterName}. Short, interactive, and aligned with context.`
            },
            analysis: {
              type: Type.OBJECT,
              properties: {
                score: {
                  type: Type.INTEGER,
                  description: "Rizz score out of 100. <45 is Fumble, 45-70 is Average, 70-90 is Smooth, 90+ is Rizzler."
                },
                level: {
                  type: Type.STRING,
                  description: "Must be one of: 'Fumble', 'Average', 'Smooth', 'Rizzler'"
                },
                critique: {
                  type: Type.STRING,
                  description: "Friendly, direct critique from the dating coach. Tell them if they sounded needy, boring, smooth, funny, or too formal."
                },
                suggestion: {
                  type: Type.STRING,
                  description: "How a charismatic guy would say it. Make it sound smooth, respectful, and fully natural."
                }
              },
              required: ["score", "level", "critique", "suggestion"]
            }
          },
          required: ["characterReply", "analysis"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Roleplay Error:", error);
    res.status(500).json({ error: error.message || "Failed to process roleplay simulation." });
  }
});

// 2. Chat Audit & Re-phrase Endpoint
app.post("/api/fumble/audit", async (req: express.Request, res: express.Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Missing text for audit" });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Analyze this opening line, draft message, or chat text the user is thinking of sending or has sent:
"${text}"

Provide an honest critique of this message. Score it, identify core social pitfalls, write two highly-charismatic, safe alternatives (one Warm/Honest, one Playful/Humorous), and supply 3 golden rules.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite conversational expert. Evaluate messages for clarity, respect, visual pacing, engagement, and humor. Return structured social critiques.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: {
              type: Type.STRING,
              description: "Must be one of: 'Severe Fumble', 'Awkward', 'Decent', 'Smooth'"
            },
            fumbleCause: {
              type: Type.STRING,
              description: "Briefly explain the conversational pitfall (e.g. 'Dry/Boring', 'Too eager', 'Passive aggressive', 'Vague plans')."
            },
            critique: {
              type: Type.STRING,
              description: "Tactful, precise coaching breakdown of why this message could trigger a bad reaction or what is lacking."
            },
            alternativeWarm: {
              type: Type.STRING,
              description: "A transparent, genuine, high-value alternative phrasing."
            },
            alternativePlayful: {
              type: Type.STRING,
              description: "A funny, playful, witty alternative phrasing with light banter."
            },
            goldenRules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 bulletproof principles for this kind of interaction."
            }
          },
          required: ["rating", "critique", "alternativeWarm", "alternativePlayful", "goldenRules"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Audit Error:", error);
    res.status(500).json({ error: error.message || "Failed to audit the message." });
  }
});

// 3. Ask dating coach custom question
app.post("/api/fumble/ask-coach", async (req: express.Request, res: express.Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: "Missing query for the coach" });
      return;
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `User question: "${query}"`,
      config: {
        systemInstruction: `You are the ultimate modern social skills & dating coach for guys. Answer with premium, respectful, high-integrity coaching advice. Focus on building real connections, social confidence, emotional intelligence, and clean communication. Avoid any toxic, deceptive, or manipulative playbooks.

Your reply must be a JSON object with:
- assessment: High-level overview of their situation.
- confidenceScore: Ideal confidence rating (0-100) needed for this.
- strategicSteps: Array of 4-5 actionable steps.
- phrasesToUse: Array of 3 exact templates or words they can speak/text.
- trapsToAvoid: Array of 3 pitfalls or desperation signals they must avoid.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assessment: {
              type: Type.STRING,
              description: "Empathetic, deep, social-dynamic evaluation."
            },
            confidenceScore: {
              type: Type.INTEGER,
              description: "0 to 100 rating indicating how much calm confidence is required."
            },
            strategicSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4-5 clear, sequentially organized tactical steps."
            },
            phrasesToUse: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 highly direct, natural templates to use."
            },
            trapsToAvoid: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 behaviors that ruin attraction or dynamic."
            }
          },
          required: ["assessment", "confidenceScore", "strategicSteps", "phrasesToUse", "trapsToAvoid"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Coach QA Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch response from Coach." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fumble Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
