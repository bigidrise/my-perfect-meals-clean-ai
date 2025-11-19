
// client/src/data/aiPremadeDinner.ts

import type { AiPremadeMeal, MealType, CookingMethod } from './aiPremadeBreakfast';

// Dinner category types
export type DinnerCategory = "lean-plates" | "protein-carb-bowls" | "high-protein-pastas" | "veggie-lean-bowls";

// DINNER CATEGORY 1: LEAN PLATES (30 meals, d1-01 to d1-30)
export const AI_PREMADE_DINNER_LEAN_PLATES: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// DINNER CATEGORY 2: PROTEIN + CARB BOWLS (30 meals, d2-01 to d2-30)
export const AI_PREMADE_DINNER_PROTEIN_CARB_BOWLS: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// DINNER CATEGORY 3: HIGH-PROTEIN PASTAS (30 meals, d3-01 to d3-30)
export const AI_PREMADE_DINNER_HIGH_PROTEIN_PASTAS: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// DINNER CATEGORY 4: VEGGIE + LEAN PROTEIN BOWLS (30 meals, d4-01 to d4-30)
export const AI_PREMADE_DINNER_VEGGIE_LEAN_BOWLS: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// Combined dinner meals array (120 total)
export const AI_PREMADE_DINNER_MEALS: AiPremadeMeal[] = [
  ...AI_PREMADE_DINNER_LEAN_PLATES,
  ...AI_PREMADE_DINNER_PROTEIN_CARB_BOWLS,
  ...AI_PREMADE_DINNER_HIGH_PROTEIN_PASTAS,
  ...AI_PREMADE_DINNER_VEGGIE_LEAN_BOWLS,
];

// Helper function to get dinner meals by category
export function getDinnerMealsByCategory(category: DinnerCategory): AiPremadeMeal[] {
  switch (category) {
    case 'lean-plates':
      return AI_PREMADE_DINNER_LEAN_PLATES;
    case 'protein-carb-bowls':
      return AI_PREMADE_DINNER_PROTEIN_CARB_BOWLS;
    case 'high-protein-pastas':
      return AI_PREMADE_DINNER_HIGH_PROTEIN_PASTAS;
    case 'veggie-lean-bowls':
      return AI_PREMADE_DINNER_VEGGIE_LEAN_BOWLS;
    default:
      return [];
  }
}

// Category display names
export const dinnerCategoryDisplayNames: Record<DinnerCategory, string> = {
  'lean-plates': 'Lean Protein Plates',
  'protein-carb-bowls': 'Protein + Carb Bowls',
  'high-protein-pastas': 'High-Protein Pastas',
  'veggie-lean-bowls': 'Veggie + Lean Protein Bowls'
};
