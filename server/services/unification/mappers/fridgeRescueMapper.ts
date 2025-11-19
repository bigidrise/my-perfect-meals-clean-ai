// Fridge Rescue Mapper
// Converts Fridge Rescue meals to UnifiedMeal format

import type { UnifiedMeal } from '../types';
import { normalizeIngredients } from '../utils/ingredientNormalizer';
import { normalizeInstructions } from '../utils/instructionNormalizer';
import { normalizeNutrition } from '../utils/nutritionNormalizer';
import { normalizeBadges } from '../utils/badgeNormalizer';
import { normalizeIngredientMeasurements } from '../utils/measurementNormalizer';

export function mapFridgeRescueToUnified(meal: any): UnifiedMeal {
  // FridgeRescueMeal has flat macros (calories, protein, carbs, fat)
  const nutrition = normalizeNutrition({
    calories: meal.calories || 0,
    protein: meal.protein || 0,
    carbs: meal.carbs || 0,
    fat: meal.fat || 0
  });
  
  // FridgeRescueMeal ingredients have { name, quantity, unit } format
  // Convert to normalized format
  const baseIngredients = meal.ingredients?.map((ing: any) => ({
    name: ing.name,
    amount: ing.quantity ? parseFloat(ing.quantity) : undefined,
    unit: ing.unit,
    notes: undefined
  })) || [];
  
  // Phase 4B: Apply ounce-based measurement normalization
  const ingredients = normalizeIngredientMeasurements(baseIngredients);
  
  return {
    id: meal.id || `fridge-rescue-${Date.now()}`,
    name: meal.name || 'Fridge Rescue Meal',
    description: meal.description || '',
    mealType: meal.mealType,
    source: 'fridge-rescue',
    
    ingredients,
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
