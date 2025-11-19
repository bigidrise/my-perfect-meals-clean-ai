// Ingredient Normalizer
// Converts any ingredient format to UnifiedIngredient[]

import type { UnifiedIngredient } from '../types';

type LegacyIngredient = 
  | string
  | { name: string; amount?: number; unit?: string; notes?: string }
  | { name: string; grams?: number }
  | { ingredient?: string; amount?: string };

export function normalizeIngredients(
  ingredients: LegacyIngredient[] | undefined
): UnifiedIngredient[] {
  if (!ingredients || !Array.isArray(ingredients)) {
    return [];
  }

  return ingredients.map(ing => {
    // String format: "2 cups rice"
    if (typeof ing === 'string') {
      return {
        name: ing,
        amount: undefined,
        unit: undefined,
        notes: undefined
      };
    }

    // Object format with 'name' field
    if ('name' in ing) {
      // Check if it has amount/unit (standard format)
      if ('amount' in ing || 'unit' in ing || 'notes' in ing) {
        return {
          name: ing.name,
          amount: 'amount' in ing ? ing.amount : undefined,
          unit: 'unit' in ing ? ing.unit : undefined,
          notes: 'notes' in ing ? ing.notes : undefined
        };
      }
      // Check if it has grams (legacy format)
      if ('grams' in ing) {
        return {
          name: ing.name,
          amount: ing.grams,
          unit: 'g',
          notes: undefined
        };
      }
      // Name-only format
      return {
        name: ing.name,
        amount: undefined,
        unit: undefined,
        notes: undefined
      };
    }

    // Object format with 'ingredient' field (old format)
    if ('ingredient' in ing && ing.ingredient) {
      return {
        name: ing.ingredient,
        amount: ing.amount ? parseFloat(ing.amount) : undefined,
        unit: undefined,
        notes: undefined
      };
    }

    // Fallback
    return {
      name: 'Unknown ingredient',
      amount: undefined,
      unit: undefined,
      notes: undefined
    };
  });
}
