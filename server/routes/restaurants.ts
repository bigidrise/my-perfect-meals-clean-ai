// 🔒 RESTAURANT GUIDE BACKEND - DUAL-SOURCE ARCHITECTURE 🔒
// AI-powered generator with locked fallback (October 28, 2025)
import { Router } from "express";
import { generateRestaurantMealsAI } from "../services/restaurantMealGeneratorAI";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// NEW: Smart Restaurant Guide endpoint with craving + restaurant
// TODO: Backend architect will replace this stub with GPT-5 + Google Places integration
router.post("/guide", async (req, res) => {
  try {
    const { restaurantName, craving, cuisine, userId } = req.body;
    
    if (!restaurantName || !craving) {
      return res.status(400).json({ 
        error: "Restaurant name and craving are required" 
      });
    }

    console.log(`🍽️ Smart Restaurant Guide: ${craving} at ${restaurantName} (${cuisine} cuisine)`);
    
    // Fetch user data in parallel with generation - don't block
    const userPromise = userId ? 
      db.select().from(users).where(eq(users.id, userId)).limit(1).catch(() => []) : 
      Promise.resolve([]);
    
    // Start generation immediately
    const generationStart = Date.now();
    
    // Use AI generator with craving context - with 30s timeout
    const recommendationsPromise = generateRestaurantMealsAI({
      restaurantName: restaurantName,
      cuisine: cuisine || "International",
      cravingContext: craving,
      user: undefined // Will add user context in next iteration if needed
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Generation timeout')), 30000)
    );

    const recommendations = await Promise.race([
      recommendationsPromise,
      timeoutPromise
    ]) as any;

    const generationTime = Date.now() - generationStart;
    console.log(`✅ Generated ${recommendations.length} recommendations in ${generationTime}ms`);

    return res.json({
      recommendations,
      restaurantName,
      craving,
      cuisine,
      generatedAt: new Date().toISOString(),
      generationTime
    });

  } catch (error) {
    console.error("Smart Restaurant Guide error:", error);
    return res.status(500).json({ 
      error: "Failed to generate restaurant recommendations",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Restaurant meal generation endpoint - uses AI with fallback
router.post("/analyze-menu", async (req, res) => {
  try {
    const { restaurantName, cuisine, userId } = req.body;
    
    if (!restaurantName || !cuisine) {
      return res.status(400).json({ 
        error: "Restaurant name and cuisine are required" 
      });
    }

    console.log(`🍽️ Generating restaurant meals for ${restaurantName} (${cuisine} cuisine)`);
    
    // Fetch user data for health-based personalization
    let user = undefined;
    if (userId) {
      try {
        const [foundUser] = await db.select().from(users).where(eq(users.id, userId));
        if (foundUser) {
          user = foundUser;
          console.log(`👤 User found with health conditions: ${foundUser.healthConditions?.join(', ') || 'none'}`);
        }
      } catch (userError) {
        console.warn(`⚠️ Could not fetch user ${userId}:`, userError);
        // Continue without user data - generator will work without it
      }
    }
    
    // Use AI generator (automatically falls back to locked generator if AI fails)
    const recommendations = await generateRestaurantMealsAI({
      restaurantName: restaurantName || `${cuisine} Restaurant`,
      cuisine: cuisine || "International",
      user
    });

    console.log(`✅ Generated ${recommendations.length} restaurant meal recommendations`);

    return res.json({
      recommendations,
      restaurantName,
      cuisine,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Restaurant meal generation error:", error);
    return res.status(500).json({ 
      error: "Failed to generate restaurant meals",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;