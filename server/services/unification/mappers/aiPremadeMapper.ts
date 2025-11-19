// AI Premade Mapper
// Converts AI Premade meals to UnifiedMeal format
// Note: AI Premades use Fridge Rescue backend, so format is identical

import type { UnifiedMeal } from '../types';
import { mapFridgeRescueToUnified } from './fridgeRescueMapper';

export function mapAIPremadeToUnified(meal: any): UnifiedMeal {
  // AI Premades are a UI wrapper around Fridge Rescue
  // Use the same mapper but override the source
  const unified = mapFridgeRescueToUnified(meal);
  
  return {
    ...unified,
    source: 'ai-premade',
    sourceMetadata: {
      ...unified.sourceMetadata,
      originalFormat: 'ai-premade',
      underlyingService: 'fridge-rescue',
      premadeCategory: meal.category
    }
  };
}
