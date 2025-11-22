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

  // ============================
  // 🔥 PROACCESS CARE TEAM
  // ============================
  "proaccess-careteam": {
    id: "proaccess-careteam",
    title: "ProAccess Care Team",
    description:
      "Connect with trainers or physicians through ProAccess. Invite clients, link with access codes, manage macro targets, and direct clients to the proper nutrition builders.",
    howTo: [
      "Begin by inviting a client using the 'Invite by Email' button.",
      "Choose your professional role — trainer, doctor, dietitian, or health pro.",
      "The client receives an email with an access code.",
      "Enter that code in the 'Connect with Access Code' field and tap 'Link with Code.'",
      "You'll see your Active Care Team list appear with each linked client.",
      "Tap 'Open ProPortal' to access the client's dashboard.",
      "Enter or edit client name and email, then tap Add Client.",
      "Open the client card to access the dashboard.",
      "Set macro targets such as protein, starchy carbs, fibrous carbs, and fats.",
      "Use protocol toggles like High Protein, Carb Cycling, or Anti-Inflammatory.",
      "Tap Save Targets to save macros to the client's Meal Board.",
      "Tap 'Send Macros to Biometrics' to sync their macro targets to their Biometrics page.",
      "Use carbohydrate directives for starchy and fibrous carbs to set custom daily targets.",
      "Depending on your role, you can access the appropriate menu builders:",
      "Physicians: Diabetic, GLP-1, or Anti-Inflammatory builders.",
      "Trainers: Performance & Competitive, or General Nutrition builders.",
    ],
    tips: [
      "Use email invites for long-term coaching relationships.",
      "Use access codes if connecting quickly in person.",
      "Review macros weekly and update targets based on progress.",
      "Direct clients to specialty builders for highly tailored meal plans.",
    ],
    relatedCommands: [
      "pro.inviteClient",
      "pro.linkCode",
      "pro.openPortal",
      "pro.addClient",
      "pro.saveMacros",
      "pro.sendToBiometrics",
      "pro.saveDirectives",
      "pro.navigateMenuBuilder",
    ],
  },

  // ============================
  // 🔥 DIABETIC HUB
  // ============================
  "diabetic-hub": {
    id: "diabetic-hub",
    title: "Diabetic Hub",
    description:
      "Set doctor-approved guardrails and track your blood sugar so AI meals match your clinical needs.",
    howTo: [
      "Start by choosing a clinical preset such as Strict Control, Cardiac Diet, or Liberal for elderly users.",
      "Set your fasting glucose target range as instructed by your doctor.",
      "Set your post-meal glucose target for after eating.",
      "Enter your daily carbohydrate limit to help guide meal planning.",
      "Set your minimum daily fiber goal to help with blood sugar stability.",
      "Choose a glycemic index cap to keep meals within safe ranges.",
      "Tap Save Guardrails to activate clinical guardrails for meal creation.",
      "Use the Blood Sugar Tracker to log glucose readings.",
      "Choose whether the reading was fasting, pre-meal, or post-meal.",
      "Tap Log Reading to save and update your trends.",
      "View your 7-day glucose trend graph to monitor stability and progress.",
      "Tap the Diabetic Menu Builder to go create meals that automatically follow your glucose guardrails.",
    ],
    tips: [
      "Use guardrails exactly as your physician directs.",
      "Log readings consistently — AI becomes more accurate as your data grows.",
      "Review your 7-day trend graph weekly for better diabetes awareness.",
    ],
    relatedCommands: [
      "diabetes.setPreset",
      "diabetes.saveGuardrails",
      "diabetes.logReading",
      "diabetes.goToMenuBuilder",
    ],
  },

  // ============================
  // 🔥 GLP-1 HUB
  // ============================
  "glp1-hub": {
    id: "glp1-hub",
    title: "GLP-1 Hub",
    description:
      "Track your GLP-1 medication, save dosage history, and create meals based on GLP-1 clinical guardrails.",
    howTo: [
      "Tap Open Tracker to begin logging your dose.",
      "Enter your dose amount in the dose field.",
      "Your date and time will appear automatically, or you can adjust them manually.",
      "Tap Select Site and choose where you injected: abdomen, thigh, upper arm, or buttock.",
      "Tap Save to log the dose to your injection history.",
      "Scroll down to view your full GLP-1 injection history.",
      "Under GLP-1 Guardrails, choose a preset to match your doctor's guidance.",
      "Set your maximum meal volume to reduce nausea.",
      "Set your minimum daily protein target.",
      "Set your fat maximum to avoid gastric slowdown.",
      "Set your daily fiber minimum for gut stability.",
      "Set a hydration goal to manage GLP-1-related dehydration.",
      "Enter how many meals per day you're eating.",
      "Tap Save Guardrails to activate GLP-1-safe AI meal creation.",
      "Tap GLP-1 Menu Builder to generate meals based on your guardrails.",
    ],
    tips: [
      "Log each dose consistently so you always know when the next one is due.",
      "Use smaller meal volumes if you experience fullness or nausea.",
      "Aim for higher protein and consistent hydration.",
      "Guardrails automatically influence all GLP-1 menu builder meals.",
    ],
    relatedCommands: [
      "glp1.logDose",
      "glp1.saveGuardrails",
      "glp1.goToMenuBuilder",
    ],
  },
};
