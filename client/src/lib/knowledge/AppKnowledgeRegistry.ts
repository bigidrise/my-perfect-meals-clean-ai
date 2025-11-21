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
  // 🔥 WEEKLY BOARD
  // ============================
  "weekly-board": {
    id: "weekly-board",
    title: "Weekly Meal Board",
    description:
      "Plan your entire week visually by placing meals into each day. Perfect for saving time and staying on track.",
    howTo: [
      "Tap any empty slot to add a meal.",
      "Use AI to fill your week automatically.",
      "Drag and drop meals to rearrange your week.",
    ],
    tips: [
      "Try combining Fridge Rescue meals with One-Pan dinners for quick weeks.",
      "Tap Copilot for suggestions when you’re stuck.",
    ],
    relatedCommands: ["board.fillEmpty", "board.batchPlan"],
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
