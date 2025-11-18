
// client/src/data/aiPremadeBreakfast.ts

// Types
export type MealType = "breakfast" | "lunch" | "dinner";
export type BreakfastCategory = "all-protein" | "protein-carb" | "egg-based";

export type CookingMethod =
  | "air-fried"
  | "baked"
  | "boiled"
  | "fried"
  | "grilled"
  | "pan-seared"
  | "poached"
  | "scrambled"
  | "steamed"
  | "well-done"
  | "medium"
  | "medium-rare";

export interface AiPremadeMeal {
  id: string;
  name: string;
  category: BreakfastCategory;
  mealType: MealType;
  defaultCookingMethod?: CookingMethod;
  notes?: string;
}

// Global cooking methods dropdown (alphabetical)
export const COOKING_METHOD_OPTIONS: CookingMethod[] = [
  "air-fried",
  "baked",
  "boiled",
  "fried",
  "grilled",
  "medium",
  "medium-rare",
  "pan-seared",
  "poached",
  "scrambled",
  "steamed",
  "well-done",
];

// ✅ BREAKFAST – CATEGORY 1: ALL PROTEIN (40 MEALS, A–Z)
export const AI_PREMADE_BREAKFAST_MEALS: AiPremadeMeal[] = [
  {
    id: "breakfast-allprotein-01",
    name: "Baked Egg White Cups",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
  },
  {
    id: "breakfast-allprotein-02",
    name: "Boiled Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "boiled",
  },
  {
    id: "breakfast-allprotein-03",
    name: "Chicken Breast & Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
  },
  {
    id: "breakfast-allprotein-04",
    name: "Chicken Breast Strips",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
  },
  {
    id: "breakfast-allprotein-05",
    name: "Cottage Cheese Bowl (Plain)",
    category: "all-protein",
    mealType: "breakfast",
  },
  {
    id: "breakfast-allprotein-06",
    name: "Egg White & Turkey Crumbles",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-07",
    name: "Egg White Frittata (No Veggies)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
  },
  {
    id: "breakfast-allprotein-08",
    name: "Egg White Patty Stack",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-allprotein-09",
    name: "Egg White Scramble (Plain)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-allprotein-10",
    name: "Egg Whites & Smoked Salmon",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-11",
    name: "Greek Yogurt (Plain, Nonfat)",
    category: "all-protein",
    mealType: "breakfast",
  },
  {
    id: "breakfast-allprotein-12",
    name: "Grilled Chicken Medallions",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
  },
  {
    id: "breakfast-allprotein-13",
    name: "Grilled Turkey Cutlets",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
  },
  {
    id: "breakfast-allprotein-14",
    name: "Lean Ground Beef Crumbles (96%)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-15",
    name: "Lean Ground Turkey Crumbles (99%)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-16",
    name: "Low-Fat Cheese Omelet (Cheese Only)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-allprotein-17",
    name: "Plain Protein Shake",
    category: "all-protein",
    mealType: "breakfast",
  },
  {
    id: "breakfast-allprotein-18",
    name: "Protein Shake & Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
  },
  {
    id: "breakfast-allprotein-19",
    name: "Protein Soufflé (Plain)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
  },
  {
    id: "breakfast-allprotein-20",
    name: "Salmon Patty",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-21",
    name: "Scrambled Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-allprotein-22",
    name: "Shrimp & Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-23",
    name: "Shrimp Omelet",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-allprotein-24",
    name: "Smoked Turkey Slices",
    category: "all-protein",
    mealType: "breakfast",
  },
  {
    id: "breakfast-allprotein-25",
    name: "Smoked Salmon Roll-Ups",
    category: "all-protein",
    mealType: "breakfast",
  },
  {
    id: "breakfast-allprotein-26",
    name: "Soft-Scramble Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-allprotein-27",
    name: "Steak Bites (Lean)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-28",
    name: "Steamed Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "steamed",
  },
  {
    id: "breakfast-allprotein-29",
    name: "Tilapia Breakfast Plate",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-30",
    name: "Tuna & Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-31",
    name: "Turkey Breast Cutlets",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
  },
  {
    id: "breakfast-allprotein-32",
    name: "Turkey Burger Patty (No Bun)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-33",
    name: "Turkey Sausage (Lean Link)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-allprotein-34",
    name: "Turkey Scramble (Turkey Only)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-allprotein-35",
    name: "White Fish Omelet",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-allprotein-36",
    name: "Whole Eggs (2) + Extra Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-allprotein-37",
    name: "Whole Eggs Hard-Boiled (3)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "boiled",
  },
  {
    id: "breakfast-allprotein-38",
    name: "Whole Eggs Scrambled (With Extra Whites)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-allprotein-39",
    name: "Zero-Fat Ricotta Bowl",
    category: "all-protein",
    mealType: "breakfast",
  },
  {
    id: "breakfast-allprotein-40",
    name: "Zero-Sugar Protein Pudding",
    category: "all-protein",
    mealType: "breakfast",
  },

  // ✅ BREAKFAST – CATEGORY 2: PROTEIN + CARB (40 MEALS, A–Z)
  {
    id: "breakfast-proteincarb-01",
    name: "Bagel Thin & Egg Whites",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-02",
    name: "Banana & Protein Shake",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-03",
    name: "Breakfast Burrito (Egg Whites + Tortilla)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-04",
    name: "Chicken Breast & Oatmeal",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
  },
  {
    id: "breakfast-proteincarb-05",
    name: "Chicken Sausage & Roasted Potatoes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
  },
  {
    id: "breakfast-proteincarb-06",
    name: "Cottage Cheese & Pineapple",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-07",
    name: "Egg White Omelet & Toast",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-proteincarb-08",
    name: "Egg Whites & English Muffin",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-09",
    name: "Egg Whites & Sweet Potato Mash",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-10",
    name: "Egg Whites & White Rice",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-11",
    name: "Greek Yogurt & Banana",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-12",
    name: "Greek Yogurt & Berries",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-13",
    name: "Greek Yogurt & Granola (Light)",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-14",
    name: "Ham Slices & Toast",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-15",
    name: "Lean Ground Turkey & Hash Browns",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-proteincarb-16",
    name: "Over-Easy Eggs & Potatoes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-proteincarb-17",
    name: "Over-Hard Eggs & Whole Wheat Toast",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-proteincarb-18",
    name: "Oatmeal & Protein Scoop",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-19",
    name: "Protein Pancake (Oats + Egg Whites)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-proteincarb-20",
    name: "Protein Shake & Apple Slices",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-21",
    name: "Protein Shake & Rice Cake",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-22",
    name: "Ricotta Cheese & Berries",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-23",
    name: "Salmon Scramble & Potatoes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-24",
    name: "Scrambled Eggs & Bagel Thin",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-25",
    name: "Scrambled Eggs & Grits",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-26",
    name: "Scrambled Eggs & Oatmeal",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-27",
    name: "Scrambled Eggs & Potato Wedges",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-28",
    name: "Scrambled Eggs & Rice Cakes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-29",
    name: "Scrambled Eggs & Sweet Potato Cubes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
  {
    id: "breakfast-proteincarb-30",
    name: "Smoked Salmon & Whole Wheat Toast",
    category: "protein-carb",
    mealType: "breakfast",
  },
  {
    id: "breakfast-proteincarb-31",
    name: "Steak Bites & Potatoes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-proteincarb-32",
    name: "Tilapia & Rice (Breakfast Style)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-proteincarb-33",
    name: "Turkey Bacon & Pancake (Light)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-proteincarb-34",
    name: "Turkey Breast & Hash Browns",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
  },
  {
    id: "breakfast-proteincarb-35",
    name: "Turkey Sausage & Belgian Waffle (Light)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-proteincarb-36",
    name: "Turkey Sausage & Grits",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-proteincarb-37",
    name: "Turkey Sausage & Oatmeal",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-proteincarb-38",
    name: "Turkey Sausage & Potato Hash",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
  },
  {
    id: "breakfast-proteincarb-39",
    name: "Whole Eggs & French Toast (Light)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
  },
  {
    id: "breakfast-proteincarb-40",
    name: "Whole Eggs & Whole Wheat Toast",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
  },
];

// Helper: filter by category
export function getBreakfastMealsByCategory(
  category: BreakfastCategory
): AiPremadeMeal[] {
  return AI_PREMADE_BREAKFAST_MEALS.filter((meal) => meal.category === category);
}
