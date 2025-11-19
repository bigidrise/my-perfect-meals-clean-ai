// Craving Creator Mapper
// Converts Craving Creator meals to UnifiedMeal format

import type { UnifiedMeal } from '../types';
import { normalizeIngredients } from '../utils/ingredientNormalizer';
import { normalizeInstructions } from '../utils/instructionNormalizer';
import { normalizeNutrition } from '../utils/nutritionNormalizer';
import { normalizeBadges } from '../utils/badgeNormalizer';

export function mapCravingCreatorToUnified(meal: any): UnifiedMeal {
  const nutrition = normalizeNutrition(meal.nutrition);
  
  return {
    id: meal.id || `craving-${Date.now()}`,
    name: meal.name || 'Craving Meal',
    description: meal.description || '',
    mealType: meal.mealType,
    source: 'craving-creator',
    
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
      craving: meal.craving,
      originalFormat: 'craving-creator'
    },
    
    createdAt: meal.createdAt || new Date()
  };
}
