
// Snack-specific ingredient categories for AI meal generation
// Used when mealType === "snack" in AIMealCreatorModal

export interface SnackCategory {
  name: string;
  emoji: string;
  items: string[];
}

export const SNACK_CATEGORIES: SnackCategory[] = [
  {
    name: "Sweet Snacks",
    emoji: "🍫",
    items: [
      "Dark Chocolate",
      "Fresh Berries",
      "Greek Yogurt",
      "Protein Balls",
      "Apple Slices",
      "Banana",
      "Honey",
      "Almond Butter",
      "Peanut Butter",
      "Dates",
      "Dried Fruit",
      "Granola",
    ],
  },
  {
    name: "Savory Snacks",
    emoji: "🧀",
    items: [
      "Almonds",
      "Cashews",
      "Walnuts",
      "String Cheese",
      "Cheddar Cheese Cubes",
      "Air-Popped Popcorn",
      "Hummus",
      "Carrot Sticks",
      "Celery Sticks",
      "Cherry Tomatoes",
      "Cucumber Slices",
      "Hard-Boiled Eggs",
      "Turkey Slices",
      "Edamame",
    ],
  },
  {
    name: "Light Snacks",
    emoji: "🥤",
    items: [
      "Protein Shake",
      "Smoothie (Berries)",
      "Smoothie (Green)",
      "Cottage Cheese",
      "Chia Pudding",
      "Overnight Oats",
      "Rice Cakes",
      "Seaweed Snacks",
      "Pickles",
    ],
  },
  {
    name: "Dessert Bites",
    emoji: "🍪",
    items: [
      "Protein Cookie",
      "Energy Balls",
      "Frozen Yogurt",
      "Fruit Parfait",
      "Trail Mix",
      "Chocolate Protein Bar",
      "Coconut Chips",
      "Mini Muffin (Oat)",
      "Brownie Bites (Protein)",
    ],
  },
];

// Flattened list for easy iteration
export const ALL_SNACK_INGREDIENTS = SNACK_CATEGORIES.flatMap(
  (cat) => cat.items
);
