
// client/src/data/aiPremadeLunch.ts

// Types
export type MealType = "breakfast" | "lunch" | "dinner";
export type LunchCategory = 
  | "lean-plates" 
  | "satisfying-protein-carb-bowls" 
  | "high-protein-plates" 
  | "simple-protein-veggie-plates"
  | "one-pan-meals"
  | "smart-plate-dinners";

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

export interface LunchIngredient {
  item: string;
  quantity: number;
  unit: string;
}

export interface AiPremadeMeal {
  id: string;
  name: string;
  category: LunchCategory;
  mealType: MealType;
  ingredients: LunchIngredient[];
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

// ✅ LUNCH – ALL CATEGORIES (120 MEALS, ALPHABETIZED BY CATEGORY)
export const AI_PREMADE_LUNCH_MEALS: AiPremadeMeal[] = [
  // CATEGORY 1: LEAN PLATES (30 meals, l1-01 to l1-30)
  {
    id: "l1-01",
    name: "Asian Ginger Chicken & Broccoli Plate",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-02",
    name: "Balsamic Chicken & Roasted Brussels Sprouts",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Brussels Sprouts", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-03",
    name: "Blackened Tilapia & Green Beans",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tilapia", quantity: 6, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-04",
    name: "Cajun Shrimp & Zucchini Noodles",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Zucchini", quantity: 2, unit: "medium" }
    ]
  },
  {
    id: "l1-05",
    name: "Citrus Grilled Cod & Asparagus",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Cod", quantity: 6, unit: "oz" },
      { item: "Asparagus", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-06",
    name: "Curry Turkey Breast & Roasted Cauliflower",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Cauliflower", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-07",
    name: "Garlic Herb Chicken & Sautéed Spinach",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Spinach", quantity: 2, unit: "cup" }
    ]
  },
  {
    id: "l1-08",
    name: "Grilled Chicken & Veggie Medley",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-09",
    name: "Grilled Salmon & Steamed Broccoli",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-10",
    name: "Grilled Shrimp & Bell Pepper Stir-Fry",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Bell Peppers", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-11",
    name: "Herb Baked Chicken & Roasted Zucchini",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Zucchini", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-12",
    name: "Herb Crusted Tilapia & Steamed Green Beans",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Tilapia", quantity: 6, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-13",
    name: "Italian Turkey Breast & Grilled Eggplant",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Eggplant", quantity: 1, unit: "medium" }
    ]
  },
  {
    id: "l1-14",
    name: "Lemon Pepper Chicken & Sautéed Kale",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Kale", quantity: 2, unit: "cup" }
    ]
  },
  {
    id: "l1-15",
    name: "Lemon Pepper Tilapia & Roasted Broccoli",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Tilapia", quantity: 6, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-16",
    name: "Lemon Rosemary Chicken & Green Beans",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-17",
    name: "Mediterranean Chicken & Cucumber Salad",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cucumber", quantity: 1, unit: "large" },
      { item: "Tomatoes", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l1-18",
    name: "Mustard Glazed Salmon & Roasted Asparagus",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-19",
    name: "Paprika Chicken & Roasted Cauliflower",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cauliflower", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-20",
    name: "Pesto Chicken & Roasted Tomatoes",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cherry Tomatoes", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-21",
    name: "Rosemary Baked Cod & Steamed Broccoli",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Cod", quantity: 6, unit: "oz" },
      { item: "Broccoli", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-22",
    name: "Sesame Ginger Shrimp & Bok Choy",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Bok Choy", quantity: 2, unit: "cup" }
    ]
  },
  {
    id: "l1-23",
    name: "Spicy Grilled Chicken & Sautéed Peppers",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Bell Peppers", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-24",
    name: "Teriyaki Salmon & Steamed Asparagus",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-25",
    name: "Thai Basil Chicken & Sautéed Cabbage",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cabbage", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-26",
    name: "Turkey Breast & Roasted Brussels Sprouts",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Brussels Sprouts", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-27",
    name: "Turkey Breast & Steamed Green Beans",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Green Beans", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-28",
    name: "White Fish & Roasted Veggie Mix",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "White Fish", quantity: 6, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 1.5, unit: "cup" }
    ]
  },
  {
    id: "l1-29",
    name: "Za'atar Chicken & Roasted Eggplant",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Eggplant", quantity: 1, unit: "medium" }
    ]
  },
  {
    id: "l1-30",
    name: "Zesty Lime Shrimp & Mixed Greens Salad",
    category: "lean-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Mixed Greens", quantity: 2, unit: "cup" }
    ]
  },

  // CATEGORY 2: SATISFYING PROTEIN-CARB BOWLS (30 meals, l2-01 to l2-30)
  {
    id: "l2-01",
    name: "BBQ Chicken & Brown Rice Bowl",
    category: "satisfying-protein-carb-bowls",
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
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Beef Strips", quantity: 5, unit: "oz" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-03",
    name: "Chicken & Quinoa Power Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Quinoa", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-04",
    name: "Chicken Burrito Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" },
      { item: "Black Beans", quantity: 0.25, unit: "cup" }
    ]
  },
  {
    id: "l2-05",
    name: "Chicken Fajita Rice Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "White Rice", quantity: 0.5, unit: "cup" },
      { item: "Bell Peppers", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-06",
    name: "Chicken Teriyaki & Jasmine Rice",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Jasmine Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-07",
    name: "Citrus Salmon & Wild Rice Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Wild Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-08",
    name: "Garlic Shrimp & Couscous Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Couscous", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-09",
    name: "Greek Chicken & Pita Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Pita Bread", quantity: 1, unit: "small" }
    ]
  },
  {
    id: "l2-10",
    name: "Grilled Chicken & Roasted Potato Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Potatoes", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-11",
    name: "Grilled Steak & Potato Wedges Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Steak", quantity: 5, unit: "oz" },
      { item: "Potatoes", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-12",
    name: "Honey Mustard Chicken & Brown Rice",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-13",
    name: "Italian Sausage & Pasta Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Italian Sausage", quantity: 4, unit: "oz" },
      { item: "Whole Wheat Pasta", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-14",
    name: "Lemon Herb Tilapia & Rice Pilaf",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Tilapia", quantity: 6, unit: "oz" },
      { item: "Rice Pilaf", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-15",
    name: "Mediterranean Turkey & Orzo Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Orzo", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-16",
    name: "Miso Glazed Salmon & Sushi Rice",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Sushi Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-17",
    name: "Pesto Chicken & Bow Tie Pasta Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Bow Tie Pasta", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-18",
    name: "Pulled Chicken & Sweet Potato Mash Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Sweet Potato", quantity: 4, unit: "oz" }
    ]
  },
  {
    id: "l2-19",
    name: "Salmon & Quinoa Buddha Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Quinoa", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-20",
    name: "Sesame Beef & Fried Rice Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Beef Strips", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-21",
    name: "Shrimp Scampi & Linguine Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Whole Wheat Linguine", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-22",
    name: "Spicy Chicken & Cauliflower Rice Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cauliflower Rice", quantity: 1, unit: "cup" }
    ]
  },
  {
    id: "l2-23",
    name: "Steak & Roasted Butternut Squash Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Steak", quantity: 5, unit: "oz" },
      { item: "Butternut Squash", quantity: 0.75, unit: "cup" }
    ]
  },
  {
    id: "l2-24",
    name: "Teriyaki Tofu & Brown Rice Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tofu", quantity: 6, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-25",
    name: "Thai Peanut Chicken & Rice Noodle Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Rice Noodles", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-26",
    name: "Tuna Poke Bowl with Rice",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Tuna", quantity: 5, unit: "oz" },
      { item: "Sushi Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-27",
    name: "Turkey & Wild Rice Harvest Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Wild Rice", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-28",
    name: "Turkey Meatball & Marinara Pasta Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Ground Turkey", quantity: 5, unit: "oz" },
      { item: "Whole Wheat Pasta", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-29",
    name: "White Fish & Couscous Plate",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "White Fish", quantity: 6, unit: "oz" },
      { item: "Couscous", quantity: 0.5, unit: "cup" }
    ]
  },
  {
    id: "l2-30",
    name: "Zesty Lime Chicken & Black Bean Rice Bowl",
    category: "satisfying-protein-carb-bowls",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Brown Rice", quantity: 0.5, unit: "cup" },
      { item: "Black Beans", quantity: 0.25, unit: "cup" }
    ]
  },

  // CATEGORY 3: HIGH-PROTEIN PLATES (30 meals, l3-01 to l3-30)
  {
    id: "l3-01",
    name: "Baked Cod Protein Plate",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Cod", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-02",
    name: "Baked Turkey Breast Strips",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-03",
    name: "BBQ Grilled Chicken Breast",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-04",
    name: "Blackened Tilapia Fillet",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tilapia", quantity: 7, unit: "oz" }
    ]
  },
  {
    id: "l3-05",
    name: "Cajun Grilled Shrimp",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 7, unit: "oz" }
    ]
  },
  {
    id: "l3-06",
    name: "Citrus Herb Salmon Fillet",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-07",
    name: "Garlic Butter Shrimp Plate",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 7, unit: "oz" }
    ]
  },
  {
    id: "l3-08",
    name: "Garlic Herb Chicken Breast",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-09",
    name: "Grilled Chicken Thighs",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Thighs", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-10",
    name: "Grilled Flank Steak",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Flank Steak", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-11",
    name: "Grilled Mahi Mahi",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Mahi Mahi", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-12",
    name: "Grilled Pork Tenderloin",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Pork Tenderloin", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-13",
    name: "Grilled Sirloin Steak",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Sirloin Steak", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-14",
    name: "Grilled Swordfish Steak",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Swordfish", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-15",
    name: "Herb Crusted Baked Cod",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Cod", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-16",
    name: "Honey Mustard Chicken Breast",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-17",
    name: "Italian Grilled Chicken",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-18",
    name: "Lemon Dill Baked Salmon",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-19",
    name: "Lemon Pepper Turkey Breast",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-20",
    name: "Pan-Seared Scallops",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Scallops", quantity: 7, unit: "oz" }
    ]
  },
  {
    id: "l3-21",
    name: "Pan-Seared Tuna Steak",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Tuna Steak", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-22",
    name: "Pesto Baked Chicken",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-23",
    name: "Rosemary Grilled Lamb Chops",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Lamb Chops", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-24",
    name: "Rosemary Grilled Turkey Cutlet",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Cutlet", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-25",
    name: "Sesame Ginger Grilled Tuna",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Tuna", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-26",
    name: "Spicy Grilled Chicken Breast",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-27",
    name: "Teriyaki Glazed Salmon",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-28",
    name: "Thai Basil Chicken",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-29",
    name: "Turkey Meatballs (Plain)",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Ground Turkey", quantity: 6, unit: "oz" }
    ]
  },
  {
    id: "l3-30",
    name: "Za'atar Grilled Chicken",
    category: "high-protein-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 6, unit: "oz" }
    ]
  },

  // CATEGORY 4: SIMPLE PROTEIN-VEGGIE PLATES (30 meals, l4-01 to l4-30)
  {
    id: "l4-01",
    name: "Baked Cod with Green Beans",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Cod", quantity: 6, unit: "oz" },
      { item: "Green Beans", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-02",
    name: "Baked Tilapia with Asparagus",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Tilapia", quantity: 6, unit: "oz" },
      { item: "Asparagus", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-03",
    name: "Balsamic Chicken with Zucchini",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Zucchini", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-04",
    name: "BBQ Chicken with Brussels Sprouts",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Brussels Sprouts", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-05",
    name: "Blackened Shrimp with Broccoli",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Broccoli", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-06",
    name: "Citrus Salmon with Steamed Broccoli",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-07",
    name: "Garlic Herb Turkey with Cauliflower",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Cauliflower", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-08",
    name: "Grilled Chicken with Bell Peppers",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Bell Peppers", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-09",
    name: "Grilled Chicken with Steamed Spinach",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Spinach", quantity: 200, unit: "g" }
    ]
  },
  {
    id: "l4-10",
    name: "Grilled Steak with Roasted Peppers",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Steak", quantity: 5, unit: "oz" },
      { item: "Bell Peppers", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-11",
    name: "Herb Baked Chicken with Kale",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Kale", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-12",
    name: "Honey Mustard Chicken with Green Beans",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Green Beans", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-13",
    name: "Italian Turkey with Roasted Tomatoes",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Cherry Tomatoes", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-14",
    name: "Lemon Herb Salmon with Asparagus",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-15",
    name: "Lemon Pepper Chicken with Broccoli",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-16",
    name: "Mediterranean Chicken with Cucumber",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cucumber", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-17",
    name: "Pan-Seared Scallops with Spinach",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Scallops", quantity: 6, unit: "oz" },
      { item: "Spinach", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-18",
    name: "Paprika Chicken with Cauliflower",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cauliflower", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-19",
    name: "Pesto Chicken with Cherry Tomatoes",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cherry Tomatoes", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-20",
    name: "Rosemary Salmon with Green Beans",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Green Beans", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-21",
    name: "Sesame Ginger Chicken with Bok Choy",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Bok Choy", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-22",
    name: "Spicy Grilled Shrimp with Zucchini",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Zucchini", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-23",
    name: "Teriyaki Salmon with Brussels Sprouts",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Salmon", quantity: 5, unit: "oz" },
      { item: "Brussels Sprouts", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-24",
    name: "Thai Basil Chicken with Bell Peppers",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "pan-seared",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Bell Peppers", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-25",
    name: "Turkey Breast with Roasted Broccoli",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Broccoli", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-26",
    name: "Turkey Breast with Steamed Asparagus",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "Turkey Breast", quantity: 5, unit: "oz" },
      { item: "Asparagus", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-27",
    name: "White Fish with Roasted Vegetables",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "baked",
    ingredients: [
      { item: "White Fish", quantity: 6, unit: "oz" },
      { item: "Mixed Vegetables", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-28",
    name: "Za'atar Chicken with Eggplant",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Eggplant", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-29",
    name: "Zesty Lime Chicken with Cabbage",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Chicken Breast", quantity: 5, unit: "oz" },
      { item: "Cabbage", quantity: 150, unit: "g" }
    ]
  },
  {
    id: "l4-30",
    name: "Zesty Shrimp with Mixed Greens",
    category: "simple-protein-veggie-plates",
    mealType: "lunch",
    defaultCookingMethod: "grilled",
    ingredients: [
      { item: "Shrimp", quantity: 6, unit: "oz" },
      { item: "Mixed Greens", quantity: 150, unit: "g" }
    ]
  }
];

// Helper: filter by category
export function getLunchMealsByCategory(
  category: LunchCategory
): AiPremadeMeal[] {
  return AI_PREMADE_LUNCH_MEALS.filter((meal) => meal.category === category);
}

// Category display names mapping
export const LUNCH_CATEGORY_DISPLAY_NAMES: Record<LunchCategory, string> = {
  'lean-plates': 'Lean Plates',
  'satisfying-protein-carb-bowls': 'Protein + Carb Bowls',
  'high-protein-plates': 'High Protein Plates',
  'simple-protein-veggie-plates': 'Protein + Veggie Plates',
  'one-pan-meals': 'One-Pan Meals',
  'smart-plate-dinners': 'Smart Plate Dinners'
};
