// Restaurant Guide Mapper
// Converts Restaurant Guide meals to UnifiedMeal format

import type { UnifiedMeal } from '../types';
import { normalizeIngredients } from '../utils/ingredientNormalizer';
import { normalizeInstructions } from '../utils/instructionNormalizer';
import { normalizeNutrition } from '../utils/nutritionNormalizer';
import { normalizeBadges } from '../utils/badgeNormalizer';
import { normalizeIngredientMeasurements } from '../utils/measurementNormalizer';

export function mapRestaurantGuideToUnified(meal: any): UnifiedMeal {
  // Restaurant meals may have calories/protein/carbs/fat at top level
  const nutrition = normalizeNutrition(
    meal.nutrition || {
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0
    }
  );
  
  return {
    id: meal.id || `restaurant-${Date.now()}`,
    name: meal.name || 'Restaurant Meal',
    description: meal.description || '',
    mealType: meal.mealType,
    source: 'restaurant-guide',
    
    // First normalize to UnifiedIngredient format, then apply ounce measurements
    ingredients: normalizeIngredientMeasurements(normalizeIngredients(meal.ingredients)),
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
      distance: meal.distance
    },
    
    sourceMetadata: {
      originalFormat: 'restaurant-guide'
    },
    
    createdAt: meal.createdAt || new Date()
  };
}
