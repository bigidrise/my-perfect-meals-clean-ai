// UnifiedMeal Zod Validator
// Runtime validation for UnifiedMeal objects

import { z } from 'zod';

const BadgeLevelSchema = z.enum(['safe', 'caution', 'warning', 'danger']);

const MedicalCategorySchema = z.enum([
  'diabetes',
  'heart-health',
  'kidney-health',
  'allergies',
  'dietary-restriction',
  'therapeutic-diet',
  'general'
]);

const UnifiedMedicalBadgeSchema = z.object({
  label: z.string(),
  level: BadgeLevelSchema,
  category: MedicalCategorySchema,
  reason: z.string().optional()
});

const UnifiedIngredientSchema = z.object({
  name: z.string(),
  amount: z.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional()
});

const UnifiedInstructionsSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.null()
]);

const UnifiedRestaurantContextSchema = z.object({
  restaurantName: z.string(),
  cuisine: z.string().optional(),
  address: z.string().optional(),
  rating: z.number().optional(),
  priceLevel: z.string().optional(),
  distance: z.string().optional(),
  placeId: z.string().optional()
});

const UnifiedMealSourceSchema = z.enum([
  'fridge-rescue',
  'craving-creator',
  'restaurant-guide',
  'meal-finder',
  'ai-meal-creator',
  'ai-premade'
]);

export const UnifiedMealSchema = z.object({
  // Core Identity
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),

  // Classification
  mealType: z.string().optional(),
  source: UnifiedMealSourceSchema,

  // Recipe Components
  ingredients: z.array(UnifiedIngredientSchema),
  instructions: UnifiedInstructionsSchema,

  // Nutrition (ALWAYS FLAT)
  nutrition: z.object({
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0)
  }),

  // Recipe Metadata
  cookingTime: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  servingSize: z.string().optional(),
  servings: z.number().optional(),

  // Medical & Safety
  medicalBadges: z.array(UnifiedMedicalBadgeSchema),

  // Visual
  imageUrl: z.string().optional(),

  // Restaurant-Specific
  restaurantContext: UnifiedRestaurantContextSchema.optional(),

  // Extensibility
  sourceMetadata: z.record(z.any()).optional(),

  // Timestamps
  createdAt: z.date().optional()
});

export type ValidatedUnifiedMeal = z.infer<typeof UnifiedMealSchema>;

export function validateUnifiedMeal(meal: any): ValidatedUnifiedMeal {
  return UnifiedMealSchema.parse(meal);
}

export function isValidUnifiedMeal(meal: any): boolean {
  return UnifiedMealSchema.safeParse(meal).success;
}
