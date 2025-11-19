// AI Meal Creator Mapper
// Converts AI Meal Creator meals to UnifiedMeal format
// Note: AI Meal Creator uses Fridge Rescue backend, so format is identical

import type { UnifiedMeal } from '../types';
import { mapFridgeRescueToUnified } from './fridgeRescueMapper';

export function mapAIMealCreatorToUnified(meal: any): UnifiedMeal {
  // AI Meal Creator is a UI wrapper around Fridge Rescue
  // Use the same mapper but override the source
  const unified = mapFridgeRescueToUnified(meal);
  
  return {
    ...unified,
    source: 'ai-meal-creator',
    sourceMetadata: {
      ...unified.sourceMetadata,
      originalFormat: 'ai-meal-creator',
      underlyingService: 'fridge-rescue'
    }
  };
}
