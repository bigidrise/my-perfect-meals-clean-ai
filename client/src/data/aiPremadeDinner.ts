
// client/src/data/aiPremadeDinner.ts

import type { AiPremadeMeal, MealType, CookingMethod } from './aiPremadeBreakfast';

// Dinner category types
export type DinnerCategory = "lean-plates" | "protein-carb-bowls" | "high-protein-pastas" | "veggie-lean-bowls";

// DINNER CATEGORY 1: LEAN PLATES (30 meals, d1-01 to d1-30)
export const AI_PREMADE_DINNER_LEAN_PLATES: AiPremadeMeal[] = [
  {
    id: "d1-01",
    name: "Baked Chicken Breast & Asparagus",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Asparagus", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-02",
    name: "Baked Cod & Green Beans",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Cod", quantity: 6, unit: "oz" },
      { item: "Green Beans", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-03",
    name: "Baked Tilapia & Steamed Broccoli",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Tilapia", quantity: 6, unit: "oz" },
      { item: "Broccoli", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-04",
    name: "Blackened Chicken & Zucchini",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Zucchini", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-05",
    name: "Cajun Shrimp & Sautéed Spinach",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Spinach", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-06",
    name: "Citrus Chicken & Brussels Sprouts",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Brussels Sprouts", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-07",
    name: "Garlic Chicken & Cauliflower",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Cauliflower", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-08",
    name: "Garlic Herb Turkey Cutlets & Green Beans",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Turkey Breast", quantity: 6, unit: "oz" },
      { item: "Green Beans", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-09",
    name: "Grilled Chicken & Broccolini",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Broccolini", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-10",
    name: "Grilled Salmon & Mixed Vegetables",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Salmon", quantity: 6, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-11",
    name: "Grilled Tilapia & Sautéed Cabbage",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Tilapia", quantity: 6, unit: "oz" },
      { item: "Cabbage", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-12",
    name: "Herb Chicken Breast & Roasted Carrots",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Carrots", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-13",
    name: "Lemon Chicken & Garlic Spinach",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Spinach", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-14",
    name: "Lemon Herb Cod & Roasted Veggies",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Cod", quantity: 6, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-15",
    name: "Mediterranean Chicken & Peppers",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Bell Peppers", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-16",
    name: "Pan-Seared Chicken & Garlic Green Beans",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Green Beans", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-17",
    name: "Pan-Seared Salmon & Sautéed Kale",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Salmon", quantity: 6, unit: "oz" },
      { item: "Kale", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-18",
    name: "Pan-Seared Tilapia & Roasted Zucchini",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tilapia", quantity: 6, unit: "oz" },
      { item: "Zucchini", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-19",
    name: "Rosemary Chicken & Brussels Sprouts",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Brussels Sprouts", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-20",
    name: "Sautéed Shrimp & Mixed Vegetables",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-21",
    name: "Sautéed Turkey Strips & Veggies",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Turkey Breast", quantity: 6, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-22",
    name: "Sesame Chicken & Steamed Broccoli",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Broccoli", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-23",
    name: "Simple Grilled Chicken & Cauliflower Mash",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Cauliflower", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-24",
    name: "Simple Shrimp Plate & Green Beans",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Green Beans", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-25",
    name: "Spicy Chicken & Grilled Vegetables",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Grilled Vegetables", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-26",
    name: "Spicy Shrimp & Sautéed Broccoli",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Broccoli", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-27",
    name: "Turkey Medallions & Steamed Vegetables",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Turkey Breast", quantity: 6, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-28",
    name: "Turkey Strips & Roasted Cauliflower",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 6, unit: "oz" },
      { item: "Cauliflower", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-29",
    name: "White Fish & Garlic Spinach",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "White Fish", quantity: 6, unit: "oz" },
      { item: "Spinach", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "d1-30",
    name: "Zesty Chicken & Sautéed Peppers",
    category: "lean-plates",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Bell Peppers", quantity: 150, unit: "g" }
    ]
  }
];

// DINNER CATEGORY 2: PROTEIN + CARB BOWLS (30 meals, d2-01 to d2-30)
export const AI_PREMADE_DINNER_PROTEIN_CARB_BOWLS: AiPremadeMeal[] = [
  {
    id: "d2-01",
    name: "BBQ Chicken & Brown Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Brown Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-02",
    name: "Buffalo Chicken & Sweet Potato Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "d2-03",
    name: "Chicken & Farro Grain Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Farro (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-04",
    name: "Chicken & Lentil Protein Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Lentils (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-05",
    name: "Chicken & Quinoa Power Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Quinoa (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-06",
    name: "Chicken Fajita Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" },
      { item: "Bell Peppers", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-07",
    name: "Chicken Sausage & Potato Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Sausage", quantity: 4, unit: "oz" },
      { item: "Potatoes", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "d2-08",
    name: "Egg White & Potato Protein Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 6, unit: "large" },
      { item: "Potatoes", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "d2-09",
    name: "Garlic Shrimp & Brown Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Brown Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-10",
    name: "Greek Chicken & Orzo Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Orzo (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-11",
    name: "Grilled Chicken & Jasmine Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Jasmine Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-12",
    name: "Grilled Salmon & Quinoa Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Salmon", quantity: 6, unit: "oz" },
      { item: "Quinoa (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-13",
    name: "Ground Turkey & Brown Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "Brown Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-14",
    name: "Lean Beef & Jasmine Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Beef (96% lean)", quantity: 5, unit: "oz" },
      { item: "Jasmine Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-15",
    name: "Lean Beef & Potato Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Beef (96% lean)", quantity: 5, unit: "oz" },
      { item: "Potatoes", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "d2-16",
    name: "Lemon Herb Chicken & Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-17",
    name: "Mediterranean Chicken & Couscous Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Couscous (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-18",
    name: "Mexican Turkey & Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-19",
    name: "Salmon & Sweet Potato Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 6, unit: "oz" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "d2-20",
    name: "Shrimp & Quinoa Veggie Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Quinoa (cooked)", quantity: 0.5, unit: "cup" },
      { item: "Mixed Vegetables", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-21",
    name: "Shrimp & Rice Noodle Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "boiled",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Rice Noodles (cooked)", quantity: 0.75, unit: "cup" }
    ]
  },
  {
    id: "d2-22",
    name: "Spicy Chicken & Brown Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "Brown Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-23",
    name: "Steak & Jasmine Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Steak (sirloin)", quantity: 5, unit: "oz" },
      { item: "Jasmine Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-24",
    name: "Teriyaki Chicken & Vegetable Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" },
      { item: "Mixed Vegetables", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-25",
    name: "Teriyaki Salmon & Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Salmon", quantity: 6, unit: "oz" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-26",
    name: "Turkey & Brown Rice Veggie Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "Brown Rice (cooked)", quantity: 0.5, unit: "cup" },
      { item: "Mixed Vegetables", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-27",
    name: "Turkey & Sweet Potato Mash Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "d2-28",
    name: "Turkey Meatball & Pasta Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Meatballs (lean)", quantity: 5, unit: "oz" },
      { item: "Whole Wheat Pasta (cooked)", quantity: 0.75, unit: "cup" }
    ]
  },
  {
    id: "d2-29",
    name: "Turkey Taco Rice Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "d2-30",
    name: "White Fish & Potato Bowl",
    category: "protein-carb-bowls",
    mealType: "dinner",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "White Fish", quantity: 6, unit: "oz" },
      { item: "Potatoes", quantity: 4, unit: "oz" }
    ]
  }
];

// DINNER CATEGORY 3: HIGH-PROTEIN PASTAS (30 meals, d3-01 to d3-30)
export const AI_PREMADE_DINNER_HIGH_PROTEIN_PASTAS: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// DINNER CATEGORY 4: VEGGIE + LEAN PROTEIN BOWLS (30 meals, d4-01 to d4-30)
export const AI_PREMADE_DINNER_VEGGIE_LEAN_BOWLS: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// Combined dinner meals array (120 total)
export const AI_PREMADE_DINNER_MEALS: AiPremadeMeal[] = [
  ...AI_PREMADE_DINNER_LEAN_PLATES,
  ...AI_PREMADE_DINNER_PROTEIN_CARB_BOWLS,
  ...AI_PREMADE_DINNER_HIGH_PROTEIN_PASTAS,
  ...AI_PREMADE_DINNER_VEGGIE_LEAN_BOWLS,
];

// Helper function to get dinner meals by category
export function getDinnerMealsByCategory(category: DinnerCategory): AiPremadeMeal[] {
  switch (category) {
    case 'lean-plates':
      return AI_PREMADE_DINNER_LEAN_PLATES;
    case 'protein-carb-bowls':
      return AI_PREMADE_DINNER_PROTEIN_CARB_BOWLS;
    case 'high-protein-pastas':
      return AI_PREMADE_DINNER_HIGH_PROTEIN_PASTAS;
    case 'veggie-lean-bowls':
      return AI_PREMADE_DINNER_VEGGIE_LEAN_BOWLS;
    default:
      return [];
  }
}

// Category display names
export const dinnerCategoryDisplayNames: Record<DinnerCategory, string> = {
  'lean-plates': 'Lean Protein Plates',
  'protein-carb-bowls': 'Protein + Carb Bowls',
  'high-protein-pastas': 'High-Protein Pastas',
  'veggie-lean-bowls': 'Veggie + Lean Protein Bowls'
};
