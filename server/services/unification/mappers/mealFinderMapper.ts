// Meal Finder Mapper
// Converts Meal Finder meals to UnifiedMeal format

import type { UnifiedMeal } from '../types';
import { normalizeIngredients } from '../utils/ingredientNormalizer';
import { normalizeInstructions } from '../utils/instructionNormalizer';
import { normalizeNutrition } from '../utils/nutritionNormalizer';
import { normalizeBadges } from '../utils/badgeNormalizer';

export function mapMealFinderToUnified(meal: any): UnifiedMeal {
  // Meal Finder has flat macros
  const nutrition = normalizeNutrition({
    calories: meal.calories || 0,
    protein: meal.protein || 0,
    carbs: meal.carbs || 0,
    fat: meal.fat || 0
  });
  
  return {
    id: meal.id || `meal-finder-${Date.now()}`,
    name: meal.name || 'Nearby Restaurant Meal',
    description: meal.description || '',
    mealType: meal.mealType,
    source: 'meal-finder',
    
    ingredients: normalizeIngredients(meal.ingredients),
    instructions: normalizeInstructions(meal.instructions),
    
    nutrition,
    
    servingSize: meal.servingSize,
    
    medicalBadges: normalizeBadges(meal.medicalBadges),
    
    imageUrl: meal.imageUrl,
    
    restaurantContext: {
      restaurantName: meal.restaurantName || 'Unknown Restaurant',
      cuisine: meal.cuisine,
      address: meal.address,
      rating: meal.rating,
      priceLevel: meal.priceLevel,
      distance: meal.distance,
      placeId: meal.placeId
    },
    
    sourceMetadata: {
      originalFormat: 'meal-finder'
    },
    
    createdAt: meal.createdAt || new Date()
  };
}
