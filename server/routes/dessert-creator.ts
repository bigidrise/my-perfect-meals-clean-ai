// --- server/routes/dessert-creator.ts ---
// Dessert Creator Route
// Uses OpenAI v4 client directly + your computeMedicalBadges helper.

import { Router } from "express";
import OpenAI from "openai";
import { computeMedicalBadges } from "../services/medicalBadges";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const dessertCreatorRouter = Router();

dessertCreatorRouter.post("/", async (req, res) => {
  try {
    const { dessert, flavor, dietary, servings, userId } = req.body ?? {};

    // Only REQUIRE dessert name; userId is optional for now
    if (!dessert) {
      return res.status(400).json({ error: "Dessert name is required" });
    }

    const safeServings =
      Number.isFinite(Number(servings)) && Number(servings) > 0
        ? Number(servings)
        : 1;

    // Build AI prompt optimized for dessert generation
    const prompt = `
You are a master pastry chef + nutrition expert inside the My Perfect Meals system.
Generate a FULL structured dessert recipe.

Return JSON ONLY, following this exact schema:

{
  "name": "",
  "description": "",
  "ingredients": [
    {
      "name": "",
      "amount": "",
      "unit": ""
    }
  ],
  "instructions": "",
  "nutrition": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0
  },
  "servingSize": "${safeServings} servings",
  "reasoning": "",
  "imageUrl": ""
}

CRITERIA:
- Dessert requested: "${dessert}"
- Flavor/texture vibe: "${flavor ?? ""}"
- Dietary requirements: "${dietary ?? ""}"
- Number of servings: ${safeServings}
- Include accurate measurements (cups, grams, teaspoons, etc.)
- Instructions must be step-by-step baking/cooking directions.
- Nutrition must be realistic and scaled for the total serving count.
- Reasoning explains why this dessert fits the cravings + dietary needs.
- imageUrl should be a short descriptive image prompt (no quotes).
`;

    // Call OpenAI Chat Completions API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    let meal: any;
    try {
      const rawText = completion.choices[0]?.message?.content || "{}";
      meal = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Dessert Creator JSON parse error:", parseErr);
      return res
        .status(500)
        .json({ error: "AI returned invalid JSON for dessert" });
    }

    // Collect ingredient names for badge computation
    const ingredientNames =
      Array.isArray(meal.ingredients) && meal.ingredients.length > 0
        ? meal.ingredients.map((i: any) =>
            String(i.name ?? i.item ?? "").toLowerCase(),
          )
        : [];

    // Neutral constraints for now (wire real profile later)
    const constraints: any = {
      lowGlycemicMode: false,
      conditions: [],
    };

    const medicalBadges = computeMedicalBadges(constraints, ingredientNames);

    return res.json({
      ...meal,
      medicalBadges,
      meta: {
        userId: userId ?? "1",
      },
    });
  } catch (err: any) {
    console.error("Dessert Creator Error:", err);
    return res.status(500).json({ error: "Failed to create dessert" });
  }
});

export default dessertCreatorRouter;
