
// client/src/data/aiPremadeLunch.ts

import type { AiPremadeMeal, MealType, CookingMethod } from './aiPremadeBreakfast';

// Lunch category types
export type LunchCategory = "lean-plates" | "protein-carb-bowls" | "wraps-sandwiches" | "high-protein-salads";

// LUNCH CATEGORY 1: LEAN PLATES (30 meals, l1-01 to l1-30)
export const AI_PREMADE_LUNCH_LEAN_PLATES: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// LUNCH CATEGORY 2: PROTEIN + CARB BOWLS (30 meals, l2-01 to l2-30)
export const AI_PREMADE_LUNCH_PROTEIN_CARB_BOWLS: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// LUNCH CATEGORY 3: WRAPS, SANDWICHES & MELTS (30 meals, l3-01 to l3-30)
export const AI_PREMADE_LUNCH_WRAPS_SANDWICHES: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// LUNCH CATEGORY 4: HIGH-PROTEIN SALADS (30 meals, l4-01 to l4-30)
export const AI_PREMADE_LUNCH_HIGH_PROTEIN_SALADS: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// Combined lunch meals array (120 total)
export const AI_PREMADE_LUNCH_MEALS: AiPremadeMeal[] = [
  ...AI_PREMADE_LUNCH_LEAN_PLATES,
  ...AI_PREMADE_LUNCH_PROTEIN_CARB_BOWLS,
  ...AI_PREMADE_LUNCH_WRAPS_SANDWICHES,
  ...AI_PREMADE_LUNCH_HIGH_PROTEIN_SALADS,
];

// Helper function to get lunch meals by category
export function getLunchMealsByCategory(category: LunchCategory): AiPremadeMeal[] {
  switch (category) {
    case 'lean-plates':
      return AI_PREMADE_LUNCH_LEAN_PLATES;
    case 'protein-carb-bowls':
      return AI_PREMADE_LUNCH_PROTEIN_CARB_BOWLS;
    case 'wraps-sandwiches':
      return AI_PREMADE_LUNCH_WRAPS_SANDWICHES;
    case 'high-protein-salads':
      return AI_PREMADE_LUNCH_HIGH_PROTEIN_SALADS;
    default:
      return [];
  }
}

// Category display names
export const lunchCategoryDisplayNames: Record<LunchCategory, string> = {
  'lean-plates': 'Lean Protein Plates',
  'protein-carb-bowls': 'Protein + Carb Bowls',
  'wraps-sandwiches': 'Wraps, Sandwiches & Melts',
  'high-protein-salads': 'High-Protein Salads'
};
