import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it to your secrets or environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for AI recipe generation
app.post("/api/generate-recipe", async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Ingredients array is required and cannot be empty." });
    }

    const client = getGeminiClient();
    
    const prompt = `You are an expert chef building a recipe for "FreshCart", a smart grocery assistant app.
Given the following ingredients currently in the user's shopping list:
${ingredients.map(i => `- ${i.name} (Quantity: ${i.quantity}, Price: $${i.price || "0.00"})`).join("\n")}

Please generate a delicious, creative, and healthy recipe that utilizes these ingredients.
You may suggest a few additional pantry staple ingredients (like salt, pepper, oil, water) if they are needed, but prioritize the list.

The output MUST be a JSON object matching this schema strictly:
{
  "name": "Recipe Title",
  "description": "Short mouthwatering description",
  "prepTime": "Prep time (e.g. 15 mins)",
  "cookTime": "Cook time (e.g. 20 mins)",
  "difficulty": "Easy" | "Medium" | "Hard",
  "calories": "Calories (e.g. 450 kcal)",
  "ingredients": [
    { "name": "Ingredient name", "amount": "Amount required (e.g. 2 pieces, 1 tbsp)" }
  ],
  "steps": [
    "Step 1...",
    "Step 2..."
  ],
  "chefTips": "A professional chef tip for this meal"
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["name", "description", "prepTime", "cookTime", "difficulty", "calories", "ingredients", "steps", "chefTips"],
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            cookTime: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            calories: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "amount"],
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.STRING },
                },
              },
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            chefTips: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Failed to generate content from Gemini API.");
    }

    const recipeData = JSON.parse(text.trim());
    return res.json(recipeData);
  } catch (error: any) {
    console.error("Error generating recipe:", error);
    return res.status(500).json({
      error: "Error generating recipe with AI chef",
      details: error.message || error,
    });
  }
});

// Setup Vite Dev Server / Static files
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
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
