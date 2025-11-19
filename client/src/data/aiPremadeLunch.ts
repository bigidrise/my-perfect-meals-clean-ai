
// client/src/data/aiPremadeLunch.ts

import type { AiPremadeMeal, MealType, CookingMethod } from './aiPremadeBreakfast';

// Lunch category types
export type LunchCategory = "lean-plates" | "protein-carb-bowls" | "wraps-sandwiches" | "high-protein-salads";

// LUNCH CATEGORY 1: LEAN PLATES (30 meals, l1-01 to l1-30)
export const AI_PREMADE_LUNCH_LEAN_PLATES: AiPremadeMeal[] = [
  {
    id: "l1-01",
    name: "Asian Ginger Chicken & Broccoli Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-02",
    name: "Balsamic Chicken & Roasted Brussels Sprouts",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Brussels Sprouts", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-03",
    name: "Blackened Tilapia & Green Beans",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tilapia", quantity: 5, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-04",
    name: "Cajun Turkey Cutlets & Veggie Medley",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-05",
    name: "Chipotle Chicken & Peppers Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Bell Peppers", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-06",
    name: "Citrus Herb Salmon & Asparagus",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-07",
    name: "Garlic Herb Chicken & Zucchini",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Zucchini", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-08",
    name: "Garlic Lime Shrimp & Broccoli",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-09",
    name: "Greek Chicken & Cucumber Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cucumber", quantity: 1, unit: "cup" },
      { item: "Cherry Tomatoes", quantity: 0.5, unit: "cup" },
    ],
  },
  {
    id: "l1-10",
    name: "Grilled Chicken & Asparagus Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-11",
    name: "Grilled Chicken & Mixed Veggie Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-12",
    name: "Grilled Flank Steak & Broccoli",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Flank Steak (lean)", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-13",
    name: "Grilled Turkey Medallions & Green Beans",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-14",
    name: "Herb Crusted Cod & Broccoli",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Cod", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-15",
    name: "Honey Dijon Chicken & Green Beans",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-16",
    name: "Lemon Garlic Chicken & Broccoli",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-17",
    name: "Lemon Pepper Tilapia & Asparagus",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Tilapia", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-18",
    name: "Mediterranean Chicken & Veggies",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Zucchini", quantity: 0.75, unit: "cup" },
      { item: "Bell Peppers", quantity: 0.75, unit: "cup" },
    ],
  },
  {
    id: "l1-19",
    name: "Orange Glazed Salmon & Green Beans",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-20",
    name: "Roasted Chicken & Cauliflower Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cauliflower", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-21",
    name: "Roasted Turkey Breast & Veggie Medley",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-22",
    name: "Sesame Ginger Chicken & Veggies",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-23",
    name: "Simple Chicken & Broccoli Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-24",
    name: "Simple Salmon & Asparagus",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-25",
    name: "Sirloin Steak & Asparagus Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Sirloin Steak (lean)", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-26",
    name: "Teriyaki Chicken & Stir-Fry Veggies",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Stir-Fry Vegetables", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-27",
    name: "Turkey Burger Patty & Veggies",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-28",
    name: "Turkey Meatballs & Green Beans",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Meatballs (lean)", quantity: 4, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-29",
    name: "White Fish & Steamed Veggies Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "steamed",
    ingredients: [
      { item: "White Fish (cod or tilapia)", quantity: 5, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" },
    ],
  },
  {
    id: "l1-30",
    name: "Zesty Lime Shrimp & Veggie Plate",
    category: "lean-plates" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 5, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" },
    ],
  },
];

// LUNCH CATEGORY 2: PROTEIN + CARB BOWLS (30 meals, l2-01 to l2-30)
export const AI_PREMADE_LUNCH_PROTEIN_CARB_BOWLS: AiPremadeMeal[] = [
  {
    id: "l2-01",
    name: "BBQ Chicken & Brown Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-02",
    name: "Beef Strips & Sweet Potato Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Beef (lean)", quantity: 5, unit: "oz" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-03",
    name: "Buffalo Chicken & Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "White Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-04",
    name: "Chicken Breast & Couscous Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Couscous", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-05",
    name: "Chicken Breast & Jasmine Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Jasmine Rice (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-06",
    name: "Chicken Breast & Pasta Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Whole Wheat Pasta", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-07",
    name: "Chicken Breast & Potatoes Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Potatoes", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-08",
    name: "Chicken Breast & Quinoa Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Quinoa (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-09",
    name: "Chicken Sausage & Gnocchi Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Sausage", quantity: 4, unit: "oz" },
      { item: "Gnocchi", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-10",
    name: "Chicken Sausage & Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Sausage", quantity: 4, unit: "oz" },
      { item: "White Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-11",
    name: "Egg Whites & Bagel Thin Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 8, unit: "large" },
      { item: "Bagel Thin", quantity: 1, unit: "piece" }
    ]
  },
  {
    id: "l2-12",
    name: "Egg Whites & Grits Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 8, unit: "large" },
      { item: "Grits (cooked)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-13",
    name: "Egg Whites & Oatmeal Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 8, unit: "large" },
      { item: "Oatmeal (dry)", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-14",
    name: "Egg Whites & Sweet Potato Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "scrambled",
    ingredients: [
      { item: "Egg Whites", quantity: 8, unit: "large" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-15",
    name: "Ground Beef & Brown Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Beef (96% lean)", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-16",
    name: "Ground Beef & Pasta Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Beef (96% lean)", quantity: 5, unit: "oz" },
      { item: "Whole Wheat Pasta", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-17",
    name: "Ground Beef & Potatoes Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Beef (96% lean)", quantity: 5, unit: "oz" },
      { item: "Potatoes", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-18",
    name: "Ground Beef & Quinoa Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Beef (96% lean)", quantity: 5, unit: "oz" },
      { item: "Quinoa", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-19",
    name: "Ground Turkey & Brown Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-20",
    name: "Ground Turkey & Couscous Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "Couscous", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-21",
    name: "Ground Turkey & Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "White Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-22",
    name: "Ground Turkey & Sweet Potato Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Ground Turkey (99% lean)", quantity: 5, unit: "oz" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-23",
    name: "Salmon & Brown Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-24",
    name: "Salmon & Quinoa Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Quinoa", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-25",
    name: "Shrimp & Brown Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-26",
    name: "Shrimp & Couscous Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 5, unit: "oz" },
      { item: "Couscous", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-27",
    name: "Shrimp & Jasmine Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 5, unit: "oz" },
      { item: "Jasmine Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-28",
    name: "Shrimp & Orzo Pasta Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 5, unit: "oz" },
      { item: "Orzo Pasta", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-29",
    name: "Tilapia & Brown Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Tilapia", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-30",
    name: "Turkey Cutlets & Rice Bowl",
    category: "protein-carb-bowls" as any,
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "White Rice", quantity: 0.5, unit: "cup" }
    ]
  }
];

// LUNCH CATEGORY 3: WRAPS, SANDWICHES & MELTS (30 meals, l3-01 to l3-30)
export const AI_PREMADE_LUNCH_WRAPS_SANDWICHES: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// LUNCH CATEGORY 4: HIGH-PROTEIN SALADS (30 meals, l4-01 to l4-30)
export const AI_PREMADE_LUNCH_HIGH_PROTEIN_SALADS: AiPremadeMeal[] = [
  // Ready for your 30 alphabetized meals
];

// Combined lunch meals array (120 total)
export const AI_PREMADE_LUNCH_MEALS: AiPremadeMeal[] = [
  ...AI_PREMADE_LUNCH_LEAN_PLATES,
  ...AI_PREMADE_LUNCH_PROTEIN_CARB_BOWLS,
  ...AI_PREMADE_LUNCH_WRAPS_SANDWICHES,
  ...AI_PREMADE_LUNCH_HIGH_PROTEIN_SALADS,
];

// Helper function to get lunch meals by category
export function getLunchMealsByCategory(category: LunchCategory): AiPremadeMeal[] {
  switch (category) {
    case 'lean-plates':
      return AI_PREMADE_LUNCH_LEAN_PLATES;
    case 'protein-carb-bowls':
      return AI_PREMADE_LUNCH_PROTEIN_CARB_BOWLS;
    case 'wraps-sandwiches':
      return AI_PREMADE_LUNCH_WRAPS_SANDWICHES;
    case 'high-protein-salads':
      return AI_PREMADE_LUNCH_HIGH_PROTEIN_SALADS;
    default:
      return [];
  }
}

// Category display names
export const lunchCategoryDisplayNames: Record<LunchCategory, string> = {
  'lean-plates': 'Lean Protein Plates',
  'protein-carb-bowls': 'Protein + Carb Bowls',
  'wraps-sandwiches': 'Wraps, Sandwiches & Melts',
  'high-protein-salads': 'High-Protein Salads'
};
