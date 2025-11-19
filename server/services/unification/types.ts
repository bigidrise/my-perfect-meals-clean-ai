// UnifiedMeal Type System
// Phase 2: Canonical meal format for cross-system compatibility

export type BadgeLevel = 'safe' | 'caution' | 'warning' | 'danger';

export type MedicalCategory = 
  | 'diabetes'
  | 'heart-health'
  | 'kidney-health'
  | 'allergies'
  | 'dietary-restriction'
  | 'therapeutic-diet'
  | 'general';

export interface UnifiedMedicalBadge {
  label: string;
  level: BadgeLevel;
  category: MedicalCategory;
  reason?: string;
}

export interface UnifiedIngredient {
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
  
  // Phase 4B: Ounce-based measurement normalization
  quantityOz?: number;           // Rounded UP to nearest 0.5 oz
  displayQuantity?: string;       // e.g. "8 oz (1 cup)" or "24 oz (1.5 lb)"
  originalUnit?: string;          // Preserves raw unit before conversion
}

export type UnifiedInstructions = string | string[] | null;

export interface UnifiedRestaurantContext {
  restaurantName: string;
  cuisine?: string;
  address?: string;
  rating?: number;
  priceLevel?: string;
  distance?: string;
  placeId?: string;
}

export type UnifiedMealSource = 
  | 'fridge-rescue'
  | 'craving-creator'
  | 'restaurant-guide'
  | 'meal-finder'
  | 'ai-meal-creator'
  | 'ai-premade';

export interface UnifiedMeal {
  // Core Identity
  id: string;
  name: string;
  description: string;

  // Classification
  mealType?: string;
  source: UnifiedMealSource;

  // Recipe Components
  ingredients: UnifiedIngredient[];
  instructions: UnifiedInstructions;

  // Nutrition (ALWAYS FLAT)
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  // Recipe Metadata
  cookingTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servingSize?: string;
  servings?: number;

  // Medical & Safety
  medicalBadges: UnifiedMedicalBadge[];

  // Visual
  imageUrl?: string;

  // Restaurant-Specific (only for restaurant-guide and meal-finder)
  restaurantContext?: UnifiedRestaurantContext;

  // Extensibility
  sourceMetadata?: Record<string, any>;

  // Timestamps
  createdAt?: Date;
}
