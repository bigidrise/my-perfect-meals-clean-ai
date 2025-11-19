// Fridge Rescue Mapper
// Converts Fridge Rescue meals to UnifiedMeal format

import type { UnifiedMeal } from '../types';
import { normalizeIngredients } from '../utils/ingredientNormalizer';
import { normalizeInstructions } from '../utils/instructionNormalizer';
import { normalizeNutrition } from '../utils/nutritionNormalizer';
import { normalizeBadges } from '../utils/badgeNormalizer';

export function mapFridgeRescueToUnified(meal: any): UnifiedMeal {
  const nutrition = normalizeNutrition(meal.nutrition);
  
  return {
    id: meal.id || `fridge-rescue-${Date.now()}`,
    name: meal.name || 'Fridge Rescue Meal',
    description: meal.description || '',
    mealType: meal.mealType,
    source: 'fridge-rescue',
    
    ingredients: normalizeIngredients(meal.ingredients),
    instructions: normalizeInstructions(meal.instructions),
    
    nutrition,
    
    cookingTime: meal.cookingTime,
    difficulty: meal.difficulty,
    servingSize: meal.servingSize || '1 serving',
    servings: meal.servings,
    
    medicalBadges: normalizeBadges(meal.medicalBadges),
    
    imageUrl: meal.imageUrl,
    
    sourceMetadata: {
      flags: meal.flags,
      originalFormat: 'fridge-rescue'
    },
    
    createdAt: meal.createdAt || new Date()
  };
}
