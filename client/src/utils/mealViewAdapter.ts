import type { UnifiedMeal } from '@/types/unifiedMeal';

export interface ViewMeal {
  id: string;
  name: string;
  description: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  ingredients: {
    name: string;
    displayQuantity?: string;
    amount?: number;
    unit?: string;
    notes?: string;
  }[];
  instructions: string[];
  medicalBadges: {
    label: string;
    level?: 'green' | 'yellow' | 'red';
    reason?: string;
    category?: string;
  }[];
  imageUrl?: string;
  cookingTime?: string;
  difficulty?: string;
  servings?: number;
  servingSize?: string;
  mealType?: string;
  suggestedTime?: string;
  restaurantContext?: {
    restaurantName: string;
    cuisine: string;
    address?: string;
    rating?: number;
    orderingTips?: string;
  };
  source?: string;
}

function normalizeLegacyIngredients(ingredients: any[]): ViewMeal['ingredients'] {
  if (!Array.isArray(ingredients)) return [];
  
  return ingredients.map(ing => {
    if (typeof ing === 'string') {
      return { name: ing };
    }
    
    const name = ing.name || ing.item || 'Ingredient';
    const amount = ing.amount || ing.quantity;
    const unit = ing.unit;
    const notes = ing.notes;
    
    return { name, amount, unit, notes };
  });
}

function normalizeLegacyBadges(badges: any[]): ViewMeal['medicalBadges'] {
  if (!Array.isArray(badges)) return [];
  
  return badges.map(badge => {
    if (typeof badge === 'string') {
      return { label: badge };
    }
    return {
      label: badge.badge || badge.label || badge.id || 'Badge',
      level: badge.type === 'safe' ? 'green' : badge.type === 'warning' ? 'yellow' : 'red',
      reason: badge.explanation || badge.reason,
      category: badge.category
    };
  });
}

export function mapLegacyMealToView(meal: any): ViewMeal {
  const nutrition = meal.nutrition || {};
  const calories = nutrition.calories ?? 0;
  const protein = nutrition.protein ?? nutrition.protein_g ?? 0;
  const carbs = nutrition.carbs ?? nutrition.carbs_g ?? 0;
  const fat = nutrition.fat ?? nutrition.fat_g ?? 0;
  
  let instructions: string[] = [];
  if (typeof meal.instructions === 'string') {
    instructions = [meal.instructions];
  } else if (Array.isArray(meal.instructions)) {
    instructions = meal.instructions;
  }
  
  return {
    id: meal.id || 'unknown',
    name: meal.name || meal.title || 'Meal',
    description: meal.description || '',
    calories,
    protein,
    carbs,
    fat,
    ingredients: normalizeLegacyIngredients(meal.ingredients || []),
    instructions,
    medicalBadges: normalizeLegacyBadges(meal.medicalBadges || meal.badges || []),
    imageUrl: meal.imageUrl,
    cookingTime: meal.cookingTime,
    difficulty: meal.difficulty,
    servings: meal.servings,
    servingSize: meal.servingSize || meal.servingDesc,
    mealType: meal.mealType,
    suggestedTime: meal.suggestedTime,
    restaurantContext: meal.restaurantContext,
    source: meal.source
  };
}

function mapUnifiedMealToView(unifiedMeal: UnifiedMeal): ViewMeal {
  let instructions: string[] = [];
  if (typeof unifiedMeal.instructions === 'string') {
    instructions = [unifiedMeal.instructions];
  } else if (Array.isArray(unifiedMeal.instructions)) {
    instructions = unifiedMeal.instructions;
  } else if (unifiedMeal.instructions === null) {
    instructions = [];
  }
  
  return {
    id: unifiedMeal.id,
    name: unifiedMeal.name,
    description: unifiedMeal.description,
    calories: unifiedMeal.nutrition.calories,
    protein: unifiedMeal.nutrition.protein,
    carbs: unifiedMeal.nutrition.carbs,
    fat: unifiedMeal.nutrition.fat,
    ingredients: unifiedMeal.ingredients.map(ing => ({
      name: ing.name,
      displayQuantity: ing.displayQuantity,
      amount: ing.amount,
      unit: ing.unit,
      notes: ing.notes
    })),
    instructions,
    medicalBadges: unifiedMeal.medicalBadges.map(badge => ({
      label: badge.label,
      level: badge.level,
      reason: badge.reason,
      category: badge.category
    })),
    imageUrl: unifiedMeal.imageUrl,
    cookingTime: unifiedMeal.cookingTime,
    difficulty: unifiedMeal.difficulty,
    servings: unifiedMeal.servings,
    servingSize: unifiedMeal.servingSize,
    mealType: unifiedMeal.mealType,
    restaurantContext: unifiedMeal.restaurantContext,
    source: unifiedMeal.source
  };
}

export function mapToViewMeal(opts: { 
  legacyMeal?: any; 
  unifiedMeal?: UnifiedMeal | null 
}): ViewMeal {
  const { legacyMeal, unifiedMeal } = opts;
  
  if (unifiedMeal) {
    return mapUnifiedMealToView(unifiedMeal);
  }
  
  if (legacyMeal) {
    return mapLegacyMealToView(legacyMeal);
  }
  
  return {
    id: 'unknown',
    name: 'Unknown Meal',
    description: '',
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
    ingredients: [],
    instructions: [],
    medicalBadges: []
  };
}
