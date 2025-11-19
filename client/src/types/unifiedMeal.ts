// Frontend mirror of backend UnifiedMeal structure
// This is a client-side type definition - does not import from backend

export interface UnifiedIngredient {
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
  quantityOz?: number;           // From Phase 4B ounce engine
  displayQuantity?: string;       // From Phase 4B ounce formatter
  originalUnit?: string;          // From Phase 4B
}

export interface UnifiedMedicalBadge {
  id: string;
  label: string;
  level: 'green' | 'yellow' | 'red';
  reason: string;
  category?: 'metabolic' | 'digestive' | 'cardiovascular' | 'allergies' | 'fitness' | 'dietary';
}

export interface UnifiedRestaurantContext {
  restaurantName: string;
  cuisine: string;
  address?: string;
  rating?: number;
  photoUrl?: string;
  orderingTips: string;
}

export type MealSource =
  | 'fridge-rescue'
  | 'craving-creator'
  | 'restaurant-guide'
  | 'meal-finder'
  | 'ai-meal-creator'
  | 'ai-premades'
  | 'manual';

export interface UnifiedMeal {
  id: string;
  name: string;
  description: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  source: MealSource;
  ingredients: UnifiedIngredient[];
  instructions: string | string[] | null;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  cookingTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servingSize?: string;
  servings?: number;
  medicalBadges: UnifiedMedicalBadge[];
  imageUrl?: string;
  restaurantContext?: UnifiedRestaurantContext;
  sourceMetadata?: Record<string, unknown>;
  createdAt?: string | Date;
}
