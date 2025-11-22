// client/src/lib/knowledge/AppKnowledgeRegistry.ts

export interface FeatureKnowledge {
  id: string;
  title: string;
  description: string;
  howTo?: string[];
  tips?: string[];
  relatedCommands?: string[];
}

export const AppKnowledge: Record<string, FeatureKnowledge> = {
  // ============================
  // 🔥 FRIDGE RESCUE
  // ============================
  "fridge-rescue": {
    id: "fridge-rescue",
    title: "Fridge Rescue",
    description:
      "Turn the items you already have at home into complete meals using Emotion AI. Great for saving money and avoiding waste.",
    howTo: [
      "Tap the + button to add items from your fridge or pantry.",
      "Select how many servings you want.",
      "Tap 'Create Meal' and Copilot will generate meal ideas you can cook now.",
    ],
    tips: [
      "Add 3–5 ingredients for the best results.",
      "You can tap the Copilot anytime to get more meal ideas.",
    ],
    relatedCommands: ["fridge.onePanDinner", "fridge.suggestAdds"],
  },

  // ============================
  // 🔥 WEEKLY MEAL BOARD
  // ============================
  "weekly-meal-board": {
    id: "weekly-meal-board",
    title: "Weekly Meal Board",
    description:
      "Build your perfect day of meals using AI. Choose proteins, carbs, veggies, fats, and fruits, pick preparation styles, generate complete meals, and send your day to macros or your shopping list.",
    howTo: [
      "Tap the Day button to begin building your meals.",
      "Tap 'Create with AI' to open the meal builder.",
      "Select foods from ingredient categories like Proteins, Starchy Carbs, Fibrous Carbs, Fats, and Fruits.",
      "Use the search bar to jump directly to foods alphabetically.",
      "Tap a food to open its preparation style card. Select a cooking style and tap 'Use This Style'.",
      "Add optional custom ingredients like garlic or seasoning.",
      "Tap 'Generate AI Meal' to create a full meal with ingredients, macros, badges, and instructions.",
      "Repeat for breakfast, lunch, dinner, and snacks.",
      "Tap 'Send Entire Day to Macros' to move your meals into the Biometrics/Macros tracker.",
      "Send a single meal or your full day to the Shopping List for groceries.",
    ],
    tips: [
      "Preparation styles (like mashed, baked, medium-well, etc.) change macros and flavor.",
      "Search by typing the first letter or spelling part of a food.",
      "Custom ingredients add flavor without drastically changing macros.",
      "Use the AI generator for fast, balanced meals when you're short on time.",
    ],
    relatedCommands: [
      "weekly-mealboard.start",
      "meal.generate",
      "meal.addIngredient",
      "meal.swapPreparation",
      "day.sendToMacros",
      "day.sendToShopping",
      "week.sendToShopping"
    ],
  },


  // ============================
  // 🔥 SUBSCRIPTIONS
  // ============================
  subscriptions: {
    id: "subscriptions",
    title: "Subscription Management",
    description:
      "Upgrade or manage your plan, view your billing status, and unlock Emotion AI features.",
    howTo: [
      "Choose your plan tier.",
      "Tap 'Upgrade' or 'Manage Subscription'.",
      "Stripe will handle your billing securely.",
    ],
    tips: [
      "Your plan determines AI features.",
      "Basic plan limits advanced AI.",
    ],
    relatedCommands: [],
  },

  // ============================
  // 🔥 AI MEAL BUILDER
  // ============================
  "ai-meal-builder": {
    id: "ai-meal-builder",
    title: "AI Meal Builder",
    description:
      "Build any meal your way. Add ingredients, adjust servings, calculate macros, and save it to your week.",
    howTo: [
      "Add ingredients manually or with voice.",
      "Set your servings.",
      "Tap 'Calculate Macros'.",
      "Save to Weekly Board.",
    ],
    tips: [
      "Copilot can recommend improvements.",
      "Use voice for faster entry.",
    ],
    relatedCommands: ["macros.boostProteinNextMeal"],
  },

  // ============================
  // 🔥 SHOPPING LIST
  // ============================
  "shopping-list": {
    id: "shopping-list",
    title: "Shopping List",
    description:
      "Build a smart shopping list based on your meals. Stay organized and never miss ingredients.",
    howTo: [
      "Tap items to mark them as purchased.",
      "Swipe left to delete.",
      "Add ingredients directly from meals.",
    ],
    tips: ["Use the list every time you shop.", "Long-press for bulk editing."],
    relatedCommands: [],
  },
};
