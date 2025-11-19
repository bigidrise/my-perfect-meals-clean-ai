// Minimal client wrapper for the Meal Engine

export type Ingredient = { item: string; amount: number; unit: string; notes?: string };
export type Meal = {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: { calories: number; protein_g: number; carbs_g: number; fat_g: number; fiber_g?: number; sugar_g?: number };
  servings: number;
  prepTime?: number; // in minutes
  imageUrl?: string | null;
  source: "craving" | "weekly" | "potluck" | "fridge-rescue";
  compliance: { allergiesCleared: boolean; medicalCleared: boolean; unitsStandardized: boolean };
};

type GenerateSingleMealReq = {
  userId: string;
  source: "craving" | "fridge-rescue" | "potluck";
  selectedIngredients?: string[];
  tempDietOverride?: string;
  tempDietPreference?: string;
  tempMedicalOverride?: string;
  servings?: number;
  fridgeItems?: string[];
  potluckServings?: number;
  generateImages?: boolean;
};

const API = (path: string) => `/api${path}`;

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(API(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = "Request failed";
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

/** Single meal generator (Craving / Fridge Rescue / Potluck) */
export function generateSingleMeal(req: GenerateSingleMealReq) {
  return postJSON<Meal>("/meal-engine/generate", req);
}

/** Weekly Plan Response Type */
export type PlanResponse = {
  plan: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

/** Weekly meal plan generator */
export function generateWeeklyPlan(req: GenerateSingleMealReq): Promise<PlanResponse> {
  // Use working fallback endpoint
  return postJSON<PlanResponse>("/meal-engine/weekly", req);
}

/** Optional helpers if/when you wire them */
export function generateFridgeRescue(req: Omit<GenerateSingleMealReq, "source"> & { fridgeItems: string[] }) {
  return postJSON<Meal>("/meal-engine/generate", { ...req, source: "fridge-rescue" });
}
export function generatePotluckMeal(req: Omit<GenerateSingleMealReq, "source"> & { potluckServings: number }) {
  return postJSON<Meal>("/meal-engine/potluck", { ...req, source: "potluck" });
}

/** Replace existing meal with brand new recipe */
export function replaceMeal(userId: string, mealId: string, dietPreference?: string, mealType?: string): Promise<Meal> {
  return postJSON<Meal>("/meal-engine/replace", { 
    userId, 
    mealId, 
    dietPreference, 
    mealType 
  });
}

// GLOBAL REQUEST NORMALIZER FOR GENERATORS
export function normalizeGeneratorInput(payload: any) {
  // Craving Creator conversion
  if (payload.craving) {
    payload.query = payload.craving;
    delete payload.craving;
  }
  if (payload.dietaryRestrictions) {
    payload.dietFlags = payload.dietaryRestrictions;
    delete payload.dietaryRestrictions;
  }

  // Fridge Rescue conversions
  if (payload.fridgeItems) {
    payload.items = payload.fridgeItems;
    delete payload.fridgeItems;
  }

  // Legacy string formats
  if (typeof payload.ingredients === "string") {
    payload.items = payload.ingredients
      .split(",")
      .map((i: string) => i.trim())
      .filter(Boolean);
    delete payload.ingredients;
  }

  // Default fallback fields
  payload.servings ??= 1;
  payload.dietFlags ??= [];

  return payload;
}

// GLOBAL RESPONSE NORMALIZER FOR UNIFIED MEAL
// All AI endpoints now return: {meal: {...}, unifiedMeal: {...}}
export function normalizeUnifiedMealOutput(meal: any) {
  if (!meal) return meal;
  
  // Ensure consistent shape across all sources
  const normalized = {
    id: meal.id,
    name: meal.name,
    description: meal.description || '',
    ingredients: meal.ingredients || [],
    instructions: meal.instructions || '',
    calories: meal.calories || meal.nutrition?.calories || 0,
    protein: meal.protein || meal.nutrition?.protein || 0,
    carbs: meal.carbs || meal.nutrition?.carbs || 0,
    fat: meal.fat || meal.nutrition?.fat || 0,
    imageUrl: meal.imageUrl,
    cookingTime: meal.cookingTime,
    difficulty: meal.difficulty,
    servingSize: meal.servingSize || '1 serving',
    medicalBadges: meal.medicalBadges || []
  };
  
  return normalized;

  return {
    ...meal,
    name: meal.title || meal.name,
    ingredients: meal.ingredients?.map((i: any) => ({
      name: i.name || i.item,  // Backward compatibility: keep 'name' field
      item: i.name || i.item,  // UnifiedMeal compatibility: keep 'item' field
      amount: i.amount,
      unit: i.unit ?? null,
      quantity: i.quantity ?? i.amount,  // Legacy support
      category: i.category ?? null
    })) ?? [],
    instructions: meal.instructions ?? [],
    calories: meal.macros?.calories ?? meal.calories ?? null,
    protein: meal.macros?.protein ?? meal.protein ?? null,
    carbs: meal.macros?.carbs ?? meal.carbs ?? null,
    fat: meal.macros?.fat ?? meal.fat ?? null,
    ounces: meal.ounces ?? null
  };
}