// Nutrition Normalizer
// Ensures nutrition is always flat with required fields

type LegacyNutrition = 
  | { calories: number; protein: number; carbs: number; fat: number }
  | { macros?: { calories: number; protein: number; carbs: number; fat: number } }
  | null
  | undefined;

export interface NormalizedNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function normalizeNutrition(
  nutrition: LegacyNutrition,
  fallbackCalories = 0,
  fallbackProtein = 0,
  fallbackCarbs = 0,
  fallbackFat = 0
): NormalizedNutrition {
  // Null or undefined - use fallbacks
  if (!nutrition) {
    return {
      calories: fallbackCalories,
      protein: fallbackProtein,
      carbs: fallbackCarbs,
      fat: fallbackFat
    };
  }

  // Nested format (macros wrapper)
  if ('macros' in nutrition && nutrition.macros) {
    return {
      calories: nutrition.macros.calories || 0,
      protein: nutrition.macros.protein || 0,
      carbs: nutrition.macros.carbs || 0,
      fat: nutrition.macros.fat || 0
    };
  }

  // Flat format (already correct)
  if ('calories' in nutrition) {
    return {
      calories: nutrition.calories || 0,
      protein: nutrition.protein || 0,
      carbs: nutrition.carbs || 0,
      fat: nutrition.fat || 0
    };
  }

  // Fallback
  return {
    calories: fallbackCalories,
    protein: fallbackProtein,
    carbs: fallbackCarbs,
    fat: fallbackFat
  };
}
