// Meal Finder API Routes
// Endpoint: POST /api/meal-finder
// Finds nearby restaurants based on meal craving + ZIP code

import express from 'express';
import { findMealsNearby } from '../services/mealFinderService';
import { 
  mapMealFinderToUnified,
  validateUnifiedMeal,
  type UnifiedMeal 
} from '../services/unification';

const router = express.Router();

/**
 * POST /api/meal-finder
 * Body: { mealQuery: string, zipCode: string }
 * Returns: Array of restaurant + meal recommendations
 */
router.post('/meal-finder', async (req, res) => {
  try {
    const { mealQuery, zipCode } = req.body;
    
    // Validate request
    if (!mealQuery || typeof mealQuery !== 'string') {
      return res.status(400).json({ 
        error: 'mealQuery is required and must be a string' 
      });
    }
    
    if (!zipCode || typeof zipCode !== 'string') {
      return res.status(400).json({ 
        error: 'zipCode is required and must be a string' 
      });
    }
    
    // Validate ZIP code format (5 digits)
    if (!/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({ 
        error: 'zipCode must be a valid 5-digit US ZIP code' 
      });
    }
    
    console.log(`📍 Meal Finder request: "${mealQuery}" near ZIP ${zipCode}`);
    
    // Get user from session (if available)
    const user = (req as any).user;
    
    // Find meals
    const results = await findMealsNearby({
      mealQuery,
      zipCode,
      user
    });
    
    // PHASE 3D: Map results to UnifiedMeal format
    const unifiedMeals: UnifiedMeal[] = [];
    for (const result of results) {
      try {
        const unified = mapMealFinderToUnified(result);
        validateUnifiedMeal(unified);
        unifiedMeals.push(unified);
      } catch (err) {
        console.warn(
          "[UnifiedMeal][MealFinder] Validation failed:",
          (err as Error).message
        );
      }
    }
    console.log(`✅ [UnifiedMeal][MealFinder] Mapped ${unifiedMeals.length}/${results.length} meals`);
    
    // Always return 200, even if no results - let frontend handle UX
    return res.json({
      success: true,
      query: mealQuery,
      zipCode,
      results,
      unifiedMeals,
      message: results.length === 0 
        ? `No restaurants found near ZIP ${zipCode}. Try a nearby ZIP code or different search.`
        : undefined
    });
    
  } catch (error) {
    console.error('❌ Meal Finder error:', error);
    return res.status(500).json({ 
      error: 'Failed to find meals',
      message: 'An error occurred while searching for meals. Please try again.'
    });
  }
});

export default router;
