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
      "Turn whatever ingredients you have at home into real meals. Speak or type what’s in your fridge and get three AI-generated meal options.",
    howTo: [
      "Tap 'Enter Your Ingredients' to begin.",
      "Speak or type the foods in your fridge or pantry.",
      "List proteins, carbs, veggies, sauces, or anything usable.",
      "Tap 'Generate' to build three AI meal options using your ingredients.",
      "Review each meal card, macros, ingredients, instructions, and badges.",
      "Save or send meals to your Weekly Meal Board, Shopping List, or Macros.",
    ],
    tips: [
      "Use voice input for fast ingredient entry.",
      "You can list your ingredients in any order. The AI understands categories.",
      "You don’t need to itemize everything — major foods are enough.",
      "Fridge Rescue works best when you list at least one protein, carb, and veggie.",
    ],
    relatedCommands: [
      "fridge.start",
      "fridge.generate",
      "fridge.addVoiceIngredient",
      "fridge.addTypedIngredient",
      "fridge.clear",
      "fridge.saveMeal",
      "fridge.sendToBoard",
      "fridge.sendToShopping",
    ],
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

  // ============================
  // 🔥 MASTER SHOPPING LIST
  // ============================
  "shopping-master": {
    id: "shopping-master",
    title: "Master Shopping List",
    description:
      "A central hub that gathers all grocery items from your meals and lets you add extra items by voice or barcode scanning.",
    howTo: [
      "Use the voice button to quickly add items without typing.",
      "Use the barcode scanner to instantly add packaged foods.",
      "All ingredients from your meal cards automatically appear here.",
      "Tap an item to mark it as purchased — it moves to the bottom of the list.",
      "Use the trash can to remove items you don't need.",
      "Use Bulk Add to rapidly enter multiple items at once using text or voice.",
    ],
    tips: [
      "Use voice add when you're moving around the kitchen.",
      "Use Bulk Add when restocking pantry items.",
      "Scan barcodes for fast shopping trips.",
    ],
    relatedCommands: [
      "shopping.addItem",
      "shopping.bulkAdd",
      "shopping.scanBarcode",
      "shopping.markPurchased",
      "shopping.removeItem",
      "shopping.orderDelivery",
    ],
  },

  // ============================
  // 🔥 BIOMETRICS & DAILY MACROS
  // ============================
  "biometrics": {
    id: "biometrics",
    title: "Biometrics & Daily Macros",
    description:
      "Track your daily macros, log food from photos, view calorie trends, track weight progress, and monitor water intake.",
    howTo: [
      "Tap 'Log from Photos' to upload a food label and auto-extract macros.",
      "Enter protein, carbs, fat, or calories manually if you know your exact numbers.",
      "Press the Add button to add manual entries to your daily total.",
      "Your macro totals update automatically based on your macro calculator settings.",
      "Switch between Today, 7-day, and 30-day views on the calorie graph to see trends over time.",
      "Enter your weight and press Save to record your progress.",
      "Use the water tracker to log 8oz or 16oz increments throughout the day.",
      "Reset water anytime if you want to start over.",
    ],
    tips: [
      "Use 'Log from Photos' when scanning packaging like chips or drinks.",
      "Manual entry is great when you know exact macros from restaurant nutrition guides.",
      "Use weight logs weekly for reliable trends.",
      "Use the water tracker throughout the day to prevent underhydration.",
    ],
    relatedCommands: [
      "biometrics.scanLabel",
      "biometrics.addMacros",
      "biometrics.addManual",
      "biometrics.updateWeight",
      "biometrics.logWater",
      "biometrics.resetWater",
    ],
  },

  // ============================
  // 🔥 MACRO CALCULATOR
  // ============================
  "macro-calculator": {
    id: "macro-calculator",
    title: "Macro Calculator",
    description:
      "Use this page to calculate your ideal calories and macro targets based on your goal, body type, and personal stats.",
    howTo: [
      "Choose your goal: Cut for fat loss, Maintain for stable weight, or Gain for muscle growth.",
      "Select your body type — Ectomorph, Mesomorph, or Endomorph — each description explains how your body responds to food.",
      "Choose your units: US Standard or Metric.",
      "Select your sex: Male or Female.",
      "Enter your age, height, and weight.",
      "Choose your activity level from sedentary to extra active.",
      "Tap Sync Your Weight to pull your latest weight from the Biometrics page.",
      "Scroll to see your calculated macro targets — calories, proteins, starchy carbs, fibrous carbs, and fats.",
      "Tap Set Macro Targets to send these to your Biometrics page so you always know your daily goals.",
    ],
    tips: [
      "Update your weight weekly and sync it here for more accurate calories.",
      "If you're between two body types, choose the one that best matches your metabolism.",
      "Activity level has a big impact — choose the one that realistically matches your weekly movement.",
    ],
    relatedCommands: [
      "macro.setGoal",
      "macro.setBodyType",
      "macro.syncWeight",
      "macro.calculate",
      "macro.setTargets",
    ],
  },

  // ============================
  // 🔥 GET INSPIRATION
  // ============================
  "get-inspiration": {
    id: "get-inspiration",
    title: "Daily Inspiration",
    description:
      "Get quick motivation through rotating daily quotes. Tap the button to refresh a new quote from the collection.",
    howTo: [
      "Tap the Get Inspiration button to load a new quote.",
      "Scroll if needed to read longer quotes.",
      "Use this page anytime you need a quick mindset reset or motivation boost.",
    ],
    tips: [
      "Use this feature before workouts or during stressful moments.",
      "Tap until you find a quote that motivates you for the day.",
    ],
    relatedCommands: [
      "inspiration.getQuote",
    ],
  },

  // ============================
  // 🔥 DAILY HEALTH JOURNAL
  // ============================
  "daily-journal": {
    id: "daily-journal",
    title: "Daily Health Journal",
    description:
      "Speak or type your reflections for the day. Capture stress, goals, observations, frustrations, or anything on your mind.",
    howTo: [
      "Tap the voice button to record your thoughts using speech.",
      "Speak freely — talk about stress, your day, frustrations, wins, anything.",
      "Tap Save Entry to store today's journal entry.",
      "Your past entries appear below so you can review your history.",
    ],
    tips: [
      "Use this feature at night to decompress.",
      "Speaking your thoughts is often faster and more honest than typing.",
      "Review older entries to see growth, patterns, and progress.",
    ],
    relatedCommands: [
      "journal.newEntry",
      "journal.save",
    ],
  },
};
