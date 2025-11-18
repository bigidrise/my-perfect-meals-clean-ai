
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

export interface BreakfastIngredient {
  item: string;
  quantity: number;
  unit: string;
}

export interface AiPremadeMeal {
  id: string;
  name: string;
  category: BreakfastCategory;
  mealType: MealType;
  ingredients: BreakfastIngredient[];
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
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
      { item: "Spinach", quantity: 0.5, unit: "cup" },
      { item: "Bell Peppers", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-allprotein-02",
    name: "Boiled Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "boiled",
    ingredients: [
      { item: "Egg Whites", quantity: 8, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-03",
    name: "Chicken Breast & Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 4, unit: "oz" },
      { item: "Egg Whites", quantity: 4, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-04",
    name: "Chicken Breast Strips",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-05",
    name: "Cottage Cheese Bowl (Plain)",
    category: "all-protein",
    mealType: "breakfast",
    ingredients: [
      { item: "Cottage Cheese", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-allprotein-06",
    name: "Egg White & Turkey Crumbles",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Egg Whites", quantity: 5, unit: "large" },
      { item: "Ground Turkey (99% lean)", quantity: 3, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-07",
    name: "Egg White Frittata (No Veggies)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
      { item: "Low-fat Cheese", quantity: 2, unit: "tbsp" },
    ],
  },
  {
    id: "breakfast-allprotein-08",
    name: "Egg White Patty Stack",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-09",
    name: "Egg White Scramble (Plain)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-10",
    name: "Egg Whites & Smoked Salmon",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Egg Whites", quantity: 5, unit: "large" },
      { item: "Smoked Salmon", quantity: 3, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-11",
    name: "Greek Yogurt (Plain, Nonfat)",
    category: "all-protein",
    mealType: "breakfast",
    ingredients: [
      { item: "Greek Yogurt (Nonfat)", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-allprotein-12",
    name: "Grilled Chicken Medallions",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-13",
    name: "Grilled Turkey Cutlets",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 6, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-14",
    name: "Lean Ground Beef Crumbles (96%)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Beef (96% lean)", quantity: 5, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-15",
    name: "Lean Ground Turkey Crumbles (99%)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-16",
    name: "Low-Fat Cheese Omelet (Cheese Only)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Low-fat Cheese", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-allprotein-17",
    name: "Plain Protein Shake",
    category: "all-protein",
    mealType: "breakfast",
    ingredients: [
      { item: "Protein Powder", quantity: 1, unit: "scoop" },
      { item: "Water", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-allprotein-18",
    name: "Protein Shake & Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    ingredients: [
      { item: "Protein Powder", quantity: 1, unit: "scoop" },
      { item: "Egg Whites", quantity: 4, unit: "large" },
      { item: "Water", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-allprotein-19",
    name: "Protein Soufflé (Plain)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
      { item: "Protein Powder", quantity: 0.5, unit: "scoop" },
    ],
  },
  {
    id: "breakfast-allprotein-20",
    name: "Salmon Patty",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Egg Whites", quantity: 1, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-21",
    name: "Scrambled Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-22",
    name: "Shrimp & Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 4, unit: "oz" },
      { item: "Egg Whites", quantity: 4, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-23",
    name: "Shrimp Omelet",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Shrimp", quantity: 3, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-24",
    name: "Smoked Turkey Slices",
    category: "all-protein",
    mealType: "breakfast",
    ingredients: [
      { item: "Smoked Turkey Breast", quantity: 5, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-25",
    name: "Smoked Salmon Roll-Ups",
    category: "all-protein",
    mealType: "breakfast",
    ingredients: [
      { item: "Smoked Salmon", quantity: 4, unit: "oz" },
      { item: "Cream Cheese (light)", quantity: 2, unit: "tbsp" },
    ],
  },
  {
    id: "breakfast-allprotein-26",
    name: "Soft-Scramble Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-27",
    name: "Steak Bites (Lean)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Steak (sirloin)", quantity: 5, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-28",
    name: "Steamed Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "steamed",
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-29",
    name: "Tilapia Breakfast Plate",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tilapia", quantity: 5, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-30",
    name: "Tuna & Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tuna (canned in water)", quantity: 4, unit: "oz" },
      { item: "Egg Whites", quantity: 4, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-31",
    name: "Turkey Breast Cutlets",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 6, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-32",
    name: "Turkey Burger Patty (No Bun)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-33",
    name: "Turkey Sausage (Lean Link)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Turkey Sausage", quantity: 3, unit: "links" },
    ],
  },
  {
    id: "breakfast-allprotein-34",
    name: "Turkey Scramble (Turkey Only)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 4, unit: "oz" },
      { item: "Eggs", quantity: 2, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-35",
    name: "White Fish Omelet",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Cod or Tilapia", quantity: 3, unit: "oz" },
    ],
  },
  {
    id: "breakfast-allprotein-36",
    name: "Whole Eggs (2) + Extra Egg Whites",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Egg Whites", quantity: 4, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-37",
    name: "Whole Eggs Hard-Boiled (3)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "boiled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-38",
    name: "Whole Eggs Scrambled (With Extra Whites)",
    category: "all-protein",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Egg Whites", quantity: 4, unit: "large" },
    ],
  },
  {
    id: "breakfast-allprotein-39",
    name: "Zero-Fat Ricotta Bowl",
    category: "all-protein",
    mealType: "breakfast",
    ingredients: [
      { item: "Ricotta Cheese (fat-free)", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-allprotein-40",
    name: "Zero-Sugar Protein Pudding",
    category: "all-protein",
    mealType: "breakfast",
    ingredients: [
      { item: "Protein Powder", quantity: 1, unit: "scoop" },
      { item: "Greek Yogurt (Nonfat)", quantity: 0.5, unit: "cup" },
    ],
  },

  // ✅ BREAKFAST – CATEGORY 2: PROTEIN + CARB (40 MEALS, A–Z)
  {
    id: "breakfast-proteincarb-01",
    name: "Bagel Thin & Egg Whites",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Bagel Thin", quantity: 1, unit: "piece" },
      { item: "Egg Whites", quantity: 5, unit: "large" },
    ],
  },
  {
    id: "breakfast-proteincarb-02",
    name: "Banana & Protein Shake",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Banana", quantity: 1, unit: "medium" },
      { item: "Protein Powder", quantity: 1, unit: "scoop" },
      { item: "Water", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-03",
    name: "Breakfast Burrito (Egg Whites + Tortilla)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Whole Wheat Tortilla", quantity: 1, unit: "large" },
      { item: "Egg Whites", quantity: 5, unit: "large" },
      { item: "Bell Peppers", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-04",
    name: "Chicken Breast & Oatmeal",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 4, unit: "oz" },
      { item: "Oatmeal (dry)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-05",
    name: "Chicken Sausage & Roasted Potatoes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Sausage", quantity: 2, unit: "links" },
      { item: "Potatoes", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-06",
    name: "Cottage Cheese & Pineapple",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Cottage Cheese", quantity: 1, unit: "cup" },
      { item: "Pineapple (fresh)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-07",
    name: "Egg White Omelet & Toast",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Egg Whites", quantity: 5, unit: "large" },
      { item: "Whole Wheat Bread", quantity: 1, unit: "slice" },
    ],
  },
  {
    id: "breakfast-proteincarb-08",
    name: "Egg Whites & English Muffin",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 5, unit: "large" },
      { item: "English Muffin (whole wheat)", quantity: 1, unit: "piece" },
    ],
  },
  {
    id: "breakfast-proteincarb-09",
    name: "Egg Whites & Sweet Potato Mash",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 5, unit: "large" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-10",
    name: "Egg Whites & White Rice",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 5, unit: "large" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-11",
    name: "Greek Yogurt & Banana",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Greek Yogurt (2%)", quantity: 1, unit: "cup" },
      { item: "Banana", quantity: 1, unit: "medium" },
    ],
  },
  {
    id: "breakfast-proteincarb-12",
    name: "Greek Yogurt & Berries",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Greek Yogurt (2%)", quantity: 1, unit: "cup" },
      { item: "Mixed Berries", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-13",
    name: "Greek Yogurt & Granola (Light)",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Greek Yogurt (2%)", quantity: 1, unit: "cup" },
      { item: "Granola", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-14",
    name: "Ham Slices & Toast",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Ham (lean)", quantity: 4, unit: "oz" },
      { item: "Whole Wheat Bread", quantity: 1, unit: "slice" },
    ],
  },
  {
    id: "breakfast-proteincarb-15",
    name: "Lean Ground Turkey & Hash Browns",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 4, unit: "oz" },
      { item: "Potatoes (hash brown style)", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-16",
    name: "Over-Easy Eggs & Potatoes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Potatoes", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-17",
    name: "Over-Hard Eggs & Whole Wheat Toast",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Whole Wheat Bread", quantity: 1, unit: "slice" },
    ],
  },
  {
    id: "breakfast-proteincarb-18",
    name: "Oatmeal & Protein Scoop",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Oatmeal (dry)", quantity: 0.5, unit: "cup" },
      { item: "Protein Powder", quantity: 1, unit: "scoop" },
    ],
  },
  {
    id: "breakfast-proteincarb-19",
    name: "Protein Pancake (Oats + Egg Whites)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Oatmeal (dry)", quantity: 0.5, unit: "cup" },
      { item: "Egg Whites", quantity: 4, unit: "large" },
    ],
  },
  {
    id: "breakfast-proteincarb-20",
    name: "Protein Shake & Apple Slices",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Protein Powder", quantity: 1, unit: "scoop" },
      { item: "Apple", quantity: 1, unit: "medium" },
      { item: "Water", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-21",
    name: "Protein Shake & Rice Cake",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Protein Powder", quantity: 1, unit: "scoop" },
      { item: "Rice Cakes", quantity: 2, unit: "pieces" },
      { item: "Water", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-22",
    name: "Ricotta Cheese & Berries",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Ricotta Cheese (part-skim)", quantity: 0.75, unit: "cup" },
      { item: "Mixed Berries", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-23",
    name: "Salmon Scramble & Potatoes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Salmon", quantity: 3, unit: "oz" },
      { item: "Potatoes", quantity: 3, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-24",
    name: "Scrambled Eggs & Bagel Thin",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Bagel Thin", quantity: 1, unit: "piece" },
    ],
  },
  {
    id: "breakfast-proteincarb-25",
    name: "Scrambled Eggs & Grits",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Grits (cooked)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-26",
    name: "Scrambled Eggs & Oatmeal",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Oatmeal (dry)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-27",
    name: "Scrambled Eggs & Potato Wedges",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Potatoes", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-28",
    name: "Scrambled Eggs & Rice Cakes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Rice Cakes", quantity: 2, unit: "pieces" },
    ],
  },
  {
    id: "breakfast-proteincarb-29",
    name: "Scrambled Eggs & Sweet Potato Cubes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-30",
    name: "Smoked Salmon & Whole Wheat Toast",
    category: "protein-carb",
    mealType: "breakfast",
    ingredients: [
      { item: "Smoked Salmon", quantity: 3, unit: "oz" },
      { item: "Whole Wheat Bread", quantity: 1, unit: "slice" },
    ],
  },
  {
    id: "breakfast-proteincarb-31",
    name: "Steak Bites & Potatoes",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Steak (sirloin)", quantity: 4, unit: "oz" },
      { item: "Potatoes", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-32",
    name: "Tilapia & Rice (Breakfast Style)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tilapia", quantity: 4, unit: "oz" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-33",
    name: "Turkey Bacon & Pancake (Light)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Turkey Bacon", quantity: 3, unit: "strips" },
      { item: "Pancake (whole wheat)", quantity: 1, unit: "medium" },
    ],
  },
  {
    id: "breakfast-proteincarb-34",
    name: "Turkey Breast & Hash Browns",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 4, unit: "oz" },
      { item: "Potatoes (hash brown style)", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-35",
    name: "Turkey Sausage & Belgian Waffle (Light)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Turkey Sausage", quantity: 2, unit: "links" },
      { item: "Belgian Waffle (whole grain)", quantity: 1, unit: "small" },
    ],
  },
  {
    id: "breakfast-proteincarb-36",
    name: "Turkey Sausage & Grits",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Turkey Sausage", quantity: 2, unit: "links" },
      { item: "Grits (cooked)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-37",
    name: "Turkey Sausage & Oatmeal",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Turkey Sausage", quantity: 2, unit: "links" },
      { item: "Oatmeal (dry)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-proteincarb-38",
    name: "Turkey Sausage & Potato Hash",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Turkey Sausage", quantity: 2, unit: "links" },
      { item: "Potatoes", quantity: 4, unit: "oz" },
    ],
  },
  {
    id: "breakfast-proteincarb-39",
    name: "Whole Eggs & French Toast (Light)",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Whole Wheat Bread", quantity: 1, unit: "slice" },
    ],
  },
  {
    id: "breakfast-proteincarb-40",
    name: "Whole Eggs & Whole Wheat Toast",
    category: "protein-carb",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Whole Wheat Bread", quantity: 1, unit: "slice" },
    ],
  },

  // ✅ BREAKFAST – CATEGORY 3: EGG-BASED MEALS (40 MEALS, A–Z)
  {
    id: "breakfast-eggbased-01",
    name: "Avocado Egg Toast (Light Portion)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Avocado", quantity: 0.25, unit: "medium" },
      { item: "Whole Wheat Bread", quantity: 1, unit: "slice" },
    ],
  },
  {
    id: "breakfast-eggbased-02",
    name: "Bacon & Egg Scramble (Lean Portion)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Turkey Bacon", quantity: 2, unit: "strips" },
    ],
  },
  {
    id: "breakfast-eggbased-03",
    name: "Breakfast Bowl (Eggs + Spinach)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Spinach", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-04",
    name: "Breakfast Burrito (Egg-Heavy)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Whole Wheat Tortilla", quantity: 1, unit: "large" },
      { item: "Bell Peppers", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-05",
    name: "Breakfast Egg Sandwich (Light Bread)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Whole Wheat Bread", quantity: 1, unit: "slice" },
      { item: "Low-fat Cheese", quantity: 1, unit: "slice" },
    ],
  },
  {
    id: "breakfast-eggbased-06",
    name: "Cheddar & Egg Omelet",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Cheddar Cheese", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-07",
    name: "Classic Deviled Eggs (Breakfast-Portioned)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "boiled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-08",
    name: "Egg & Turkey Sausage Muffins",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Turkey Sausage", quantity: 2, unit: "oz" },
    ],
  },
  {
    id: "breakfast-eggbased-09",
    name: "Egg Bake (Plain Egg Casserole)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Eggs", quantity: 4, unit: "large" },
      { item: "Low-fat Cheese", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-10",
    name: "Egg Drop Soup (Breakfast Edition)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "boiled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Chicken Broth", quantity: 1.5, unit: "cups" },
    ],
  },
  {
    id: "breakfast-eggbased-11",
    name: "Egg Frittata (Simple)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Bell Peppers", quantity: 0.25, unit: "cup" },
      { item: "Onions", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-12",
    name: "Egg Patty Breakfast Stack",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-13",
    name: "Egg Scramble with Spinach",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Spinach", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-14",
    name: "Eggs Benedict (Light Version)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "poached",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "English Muffin (whole wheat)", quantity: 1, unit: "piece" },
      { item: "Canadian Bacon", quantity: 2, unit: "slices" },
    ],
  },
  {
    id: "breakfast-eggbased-15",
    name: "Eggs Over Easy (2–3 Eggs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-16",
    name: "Eggs Over Hard (2–3 Eggs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-17",
    name: "Eggs Over Medium (2–3 Eggs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-18",
    name: "Eggs Sunny Side Up (2–3 Eggs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-19",
    name: "French Omelet (Butter Minimal)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-20",
    name: "Frittata Bites (Egg-Based)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Eggs", quantity: 4, unit: "large" },
      { item: "Vegetables (mixed)", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-21",
    name: "Hard-Boiled Eggs (2–3 Eggs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "boiled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-22",
    name: "Italian Egg Scramble (Egg + Herbs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Tomatoes", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-23",
    name: "Mediterranean Egg Plate (Egg + Herbs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Spinach", quantity: 0.5, unit: "cup" },
      { item: "Feta Cheese", quantity: 2, unit: "tbsp" },
    ],
  },
  {
    id: "breakfast-eggbased-24",
    name: "Mushroom & Egg Omelet",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Mushrooms", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-25",
    name: "Onion & Egg Scramble",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Onions", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-26",
    name: "Poached Eggs (2–3 Eggs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "poached",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-27",
    name: "Poached Eggs & Spinach",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "poached",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Spinach", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-28",
    name: "Scrambled Eggs (Classic)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-29",
    name: "Scrambled Eggs & Cheese (Light)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Low-fat Cheese", quantity: 2, unit: "tbsp" },
    ],
  },
  {
    id: "breakfast-eggbased-30",
    name: "Scrambled Eggs & Salsa",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Salsa", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-31",
    name: "Scrambled Eggs with Turkey Crumbles",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Ground Turkey (99% lean)", quantity: 2, unit: "oz" },
    ],
  },
  {
    id: "breakfast-eggbased-32",
    name: "Soft-Boiled Eggs (2–3 Eggs)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "boiled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-33",
    name: "Spinach & Egg Whites Omelet",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Egg Whites", quantity: 3, unit: "large" },
      { item: "Spinach", quantity: 1, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-34",
    name: "Three-Egg Omelet (Simple)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
    ],
  },
  {
    id: "breakfast-eggbased-35",
    name: "Tomato & Egg Scramble",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Tomatoes", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-36",
    name: "Turkey Bacon & Eggs",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Turkey Bacon", quantity: 2, unit: "strips" },
    ],
  },
  {
    id: "breakfast-eggbased-37",
    name: "Veggie Egg Muffins",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Bell Peppers", quantity: 0.25, unit: "cup" },
      { item: "Spinach", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-38",
    name: "Veggie Omelet",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Bell Peppers", quantity: 0.25, unit: "cup" },
      { item: "Mushrooms", quantity: 0.25, unit: "cup" },
      { item: "Onions", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-39",
    name: "Western Omelet (Egg-Focused)",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "fried",
    ingredients: [
      { item: "Eggs", quantity: 3, unit: "large" },
      { item: "Ham (lean)", quantity: 2, unit: "oz" },
      { item: "Bell Peppers", quantity: 0.25, unit: "cup" },
      { item: "Onions", quantity: 0.25, unit: "cup" },
    ],
  },
  {
    id: "breakfast-eggbased-40",
    name: "Whole Eggs & Egg Whites Combo",
    category: "egg-based",
    mealType: "breakfast",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Egg Whites", quantity: 4, unit: "large" },
    ],
  },
];

// Helper: filter by category
export function getBreakfastMealsByCategory(
  category: BreakfastCategory
): AiPremadeMeal[] {
  return AI_PREMADE_BREAKFAST_MEALS.filter((meal) => meal.category === category);
}
