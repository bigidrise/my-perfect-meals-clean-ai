// Unification Layer - Main Export
// Phase 2: Canonical meal format system (additive, not yet used in production)

// Types
export * from './types';

// Normalizers
export * from './utils/ingredientNormalizer';
export * from './utils/instructionNormalizer';
export * from './utils/nutritionNormalizer';
export * from './utils/badgeNormalizer';

// Mappers
export * from './mappers/fridgeRescueMapper';
export * from './mappers/cravingCreatorMapper';
export * from './mappers/restaurantGuideMapper';
export * from './mappers/mealFinderMapper';
export * from './mappers/aiMealCreatorMapper';
export * from './mappers/aiPremadeMapper';

// Validators
export * from './validators/unifiedMealValidator';

// Helper function to map any meal to UnifiedMeal based on source
import type { UnifiedMeal } from './types';
import { mapFridgeRescueToUnified } from './mappers/fridgeRescueMapper';
import { mapCravingCreatorToUnified } from './mappers/cravingCreatorMapper';
import { mapRestaurantGuideToUnified } from './mappers/restaurantGuideMapper';
import { mapMealFinderToUnified } from './mappers/mealFinderMapper';
import { mapAIMealCreatorToUnified } from './mappers/aiMealCreatorMapper';
import { mapAIPremadeToUnified } from './mappers/aiPremadeMapper';

export function mapToUnifiedMeal(meal: any, source?: string): UnifiedMeal {
  const detectedSource = source || meal.source;

  switch (detectedSource) {
    case 'fridge-rescue':
      return mapFridgeRescueToUnified(meal);
    case 'craving-creator':
      return mapCravingCreatorToUnified(meal);
    case 'restaurant-guide':
      return mapRestaurantGuideToUnified(meal);
    case 'meal-finder':
      return mapMealFinderToUnified(meal);
    case 'ai-meal-creator':
      return mapAIMealCreatorToUnified(meal);
    case 'ai-premade':
      return mapAIPremadeToUnified(meal);
    default:
      // Default to fridge rescue mapper as fallback
      return mapFridgeRescueToUnified(meal);
  }
}
