/**
 * Unified Meal Generation Pipeline
 * 
 * This service provides a single, consistent interface for all meal generation
 * across the application. It ensures:
 * - Consistent response formats
 * - Guaranteed image URLs (DALL-E or fallback)
 * - Proper error handling with catalog fallbacks
 * - Retry logic for transient failures
 * 
 * Used by: AI Meal Creator, AI Premades, Fridge Rescue
 */

import { generateImage } from './imageService';

// Fallback images by meal type
const FALLBACK_IMAGES: Record<string, string> = {
  breakfast: '/images/cravings/protein-pancakes.jpg',
  lunch: '/images/cravings/mediterranean-hummus-plate.jpg',
  dinner: '/images/cravings/turkey-nacho-skillet.jpg',
  snack: '/images/cravings/protein-trailmix-clusters.jpg',
  snacks: '/images/cravings/protein-trailmix-clusters.jpg', // Handle plural form
  dessert: '/images/cravings/choc-strawberry-bites.jpg',
  default: '/images/cravings/satisfy-cravings.jpg'
};

/**
 * Normalize meal type to canonical form (handle plural forms, etc.)
 */
function normalizeMealType(mealType: string): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  const normalized = mealType.toLowerCase().trim();
  
  // Handle plural forms
  if (normalized === 'snacks') return 'snack';
  if (normalized === 'breakfasts') return 'breakfast';
  if (normalized === 'lunches') return 'lunch';
  if (normalized === 'dinners') return 'dinner';
  
  // Validate and return canonical form
  if (['breakfast', 'lunch', 'dinner', 'snack'].includes(normalized)) {
    return normalized as 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }
  
  // Default to lunch for unknown types
  console.warn(`⚠️ Unknown meal type "${mealType}", defaulting to lunch`);
  return 'lunch';
}

// Standard meal interface
export interface UnifiedMeal {
  id: string;
  name: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string | string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cookingTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string; // ALWAYS present
  medicalBadges?: Array<{
    id: string;
    label: string;
    description: string;
    color: string;
    textColor: string;
    category: string;
  }>;
  source?: 'ai' | 'catalog' | 'fallback';
}

export interface MealGenerationRequest {
  type: 'craving' | 'fridge-rescue' | 'premade';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  input: string | string[]; // craving text or ingredient list
  userId?: string;
  macroTargets?: {
    protein_g?: number;
    fibrous_carbs_g?: number;
    starchy_carbs_g?: number;
    fat_g?: number;
  };
  count?: number; // number of meals to generate (default 1)
}

export interface MealGenerationResponse {
  success: boolean;
  meal?: UnifiedMeal;
  meals?: UnifiedMeal[];
  source: 'ai' | 'catalog' | 'fallback';
  error?: string;
}

/**
 * Get a fallback image URL based on meal type
 */
function getFallbackImage(mealType: string): string {
  return FALLBACK_IMAGES[mealType.toLowerCase()] || FALLBACK_IMAGES.default;
}

/**
 * Ensure a meal has an image URL, generating one if needed
 */
async function ensureImage(meal: Partial<UnifiedMeal>, mealType: string): Promise<string> {
  // If meal already has a valid image URL, use it
  if (meal.imageUrl && meal.imageUrl.startsWith('http')) {
    return meal.imageUrl;
  }

  // Try to generate an image with DALL-E
  try {
    const imageUrl = await generateImage({
      name: meal.name || 'Delicious Meal',
      description: meal.description || 'A healthy homemade meal',
      type: 'meal',
      style: 'homemade'
    });

    if (imageUrl) {
      console.log(`🖼️ Generated DALL-E image for: ${meal.name}`);
      return imageUrl;
    }
  } catch (error) {
    console.warn(`⚠️ DALL-E image generation failed for ${meal.name}, using fallback`);
  }

  // Fall back to static image
  return getFallbackImage(mealType);
}

/**
 * Convert FinalMeal ingredients to unified format
 */
function normalizeIngredients(ingredients: any[]): Array<{ name: string; quantity: string; unit: string }> {
  if (!ingredients || !Array.isArray(ingredients)) return [];
  
  return ingredients.map(ing => ({
    name: ing.name || '',
    quantity: String(ing.quantity || ing.amount || 'as needed'),
    unit: ing.unit || ''
  }));
}

/**
 * Convert medical badges to unified format
 */
function normalizeMedicalBadges(badges: any[]): Array<{ id: string; label: string; description: string; color: string; textColor: string; category: string }> {
  if (!badges || !Array.isArray(badges)) return [];
  
  return badges.map(badge => {
    if (typeof badge === 'string') {
      return {
        id: badge.toLowerCase().replace(/\s+/g, '-'),
        label: badge,
        description: badge,
        color: '#4CAF50',
        textColor: '#FFFFFF',
        category: 'dietary'
      };
    }
    return badge;
  });
}

/**
 * Generate a single meal using the craving creator
 */
export async function generateCravingMealUnified(
  cravingInput: string,
  mealType: string,
  userId?: string
): Promise<MealGenerationResponse> {
  try {
    // Import the stable meal generator
    const { generateCravingMeal } = await import('./stableMealGenerator');

    const userPrefs = {
      userId: userId || '1',
      dietaryRestrictions: [],
      allergies: [],
      medicalFlags: []
    };

    // Normalize mealType to canonical form
    const validMealType = normalizeMealType(mealType);

    const generatedMeal = await generateCravingMeal(
      validMealType,
      cravingInput,
      userPrefs
    );

    // Ensure the meal has an image
    const imageUrl = await ensureImage({
      name: generatedMeal.name,
      description: generatedMeal.description,
      imageUrl: generatedMeal.imageUrl || undefined
    }, mealType);

    // Extract nutrition from nested object or direct properties
    const nutrition = generatedMeal.nutrition || {};

    const unifiedMeal: UnifiedMeal = {
      id: generatedMeal.id || `craving-${Date.now()}`,
      name: generatedMeal.name,
      description: generatedMeal.description,
      ingredients: normalizeIngredients(generatedMeal.ingredients),
      instructions: generatedMeal.instructions || '',
      calories: nutrition.calories || 350,
      protein: nutrition.protein || 25,
      carbs: nutrition.carbs || 30,
      fat: nutrition.fat || 15,
      cookingTime: '25 minutes',
      difficulty: 'Medium',
      imageUrl: imageUrl,
      medicalBadges: normalizeMedicalBadges(generatedMeal.medicalBadges),
      source: 'ai'
    };

    console.log(`✅ Unified pipeline generated meal: ${unifiedMeal.name} with image`);

    return {
      success: true,
      meal: unifiedMeal,
      source: 'ai'
    };

  } catch (error: any) {
    console.error('❌ Unified craving generation failed:', error.message);

    // Return a fallback meal
    const fallbackMeal: UnifiedMeal = {
      id: `fallback-${Date.now()}`,
      name: `Healthy ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
      description: `A nutritious ${mealType} prepared with fresh ingredients`,
      ingredients: [
        { name: 'Fresh ingredients', quantity: 'as needed', unit: '' }
      ],
      instructions: 'Prepare fresh ingredients and cook to your preference.',
      calories: 350,
      protein: 25,
      carbs: 30,
      fat: 15,
      cookingTime: '20 minutes',
      difficulty: 'Easy',
      imageUrl: getFallbackImage(mealType),
      medicalBadges: [],
      source: 'fallback'
    };

    return {
      success: true,
      meal: fallbackMeal,
      source: 'fallback',
      error: error.message
    };
  }
}

/**
 * Generate multiple meals using fridge rescue
 */
export async function generateFridgeRescueUnified(
  fridgeItems: string[],
  mealType: string,
  userId?: string,
  macroTargets?: MealGenerationRequest['macroTargets'],
  count: number = 3
): Promise<MealGenerationResponse> {
  try {
    // Import the fridge rescue generator
    const { generateFridgeRescueMeals } = await import('./fridgeRescueGenerator');

    const meals = await generateFridgeRescueMeals({
      fridgeItems,
      user: { healthConditions: [] },
      macroTargets
    });

    // Ensure all meals have images
    const unifiedMeals: UnifiedMeal[] = [];
    for (const meal of meals) {
      const imageUrl = await ensureImage(meal, mealType);
      
      unifiedMeals.push({
        id: meal.id || `fridge-${Date.now()}-${unifiedMeals.length}`,
        name: meal.name,
        description: meal.description,
        ingredients: meal.ingredients || [],
        instructions: meal.instructions || '',
        calories: meal.calories || 350,
        protein: meal.protein || 25,
        carbs: meal.carbs || 30,
        fat: meal.fat || 15,
        cookingTime: meal.cookingTime,
        difficulty: meal.difficulty,
        imageUrl: imageUrl,
        medicalBadges: meal.medicalBadges || [],
        source: 'ai'
      });
    }

    console.log(`✅ Unified pipeline generated ${unifiedMeals.length} fridge rescue meals with images`);

    return {
      success: true,
      meals: unifiedMeals,
      meal: unifiedMeals[0], // Also provide first meal for single-meal consumers
      source: 'ai'
    };

  } catch (error: any) {
    console.error('❌ Unified fridge rescue failed:', error.message);

    // Return fallback meals
    const fallbackMeals: UnifiedMeal[] = fridgeItems.slice(0, count).map((item, index) => ({
      id: `fallback-fridge-${Date.now()}-${index}`,
      name: `Quick ${item} ${mealType}`,
      description: `A simple ${mealType} featuring ${item} as the main ingredient`,
      ingredients: fridgeItems.map(ing => ({ name: ing, quantity: 'as needed', unit: '' })),
      instructions: `Combine ${fridgeItems.join(', ')} and cook until ready.`,
      calories: 300 + (index * 50),
      protein: 20 + (index * 5),
      carbs: 25,
      fat: 12,
      cookingTime: '15 minutes',
      difficulty: 'Easy' as const,
      imageUrl: getFallbackImage(mealType),
      medicalBadges: [],
      source: 'fallback' as const
    }));

    return {
      success: true, // Still return success with fallback
      meals: fallbackMeals,
      meal: fallbackMeals[0],
      source: 'fallback',
      error: error.message
    };
  }
}

/**
 * Main unified generation function - routes to appropriate generator
 */
export async function generateMealUnified(
  request: MealGenerationRequest
): Promise<MealGenerationResponse> {
  console.log(`🔄 Unified pipeline processing ${request.type} request for ${request.mealType}`);

  switch (request.type) {
    case 'craving':
      const cravingInput = Array.isArray(request.input) 
        ? request.input.join(', ') 
        : request.input;
      return generateCravingMealUnified(cravingInput, request.mealType, request.userId);

    case 'fridge-rescue':
    case 'premade':
      const fridgeItems = Array.isArray(request.input) 
        ? request.input 
        : request.input.split(',').map(s => s.trim());
      return generateFridgeRescueUnified(
        fridgeItems, 
        request.mealType, 
        request.userId,
        request.macroTargets,
        request.count || 1
      );

    default:
      return {
        success: false,
        source: 'fallback',
        error: `Unknown generation type: ${request.type}`
      };
  }
}
