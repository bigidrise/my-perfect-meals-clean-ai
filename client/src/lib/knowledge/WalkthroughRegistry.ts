export interface WalkthroughStep {
  id: string;
  text: string;
  targetId?: string; // unique ID for UI highlight
  waitForUser?: boolean;
}

export const WalkthroughRegistry: Record<string, WalkthroughStep[]> = {
  // ==============================
  // 🔥 FRIDGE RESCUE WALKTHROUGH
  // ==============================
  "fridge-rescue": [
    {
      id: "step-1",
      text: "Tap the + button to add items from your fridge.",
      targetId: "fridge-add-button",
      waitForUser: true,
    },
    {
      id: "step-2",
      text: "Enter your ingredients and then tap Save.",
      waitForUser: true,
    },
    {
      id: "step-3",
      text: "Great! Now choose your servings.",
      targetId: "fridge-servings-selector",
      waitForUser: true,
    },
    {
      id: "step-4",
      text: "Now tap Create Meal to get instant options.",
      targetId: "fridge-create-meal-button",
      waitForUser: true,
    },
    {
      id: "complete",
      text: "You're done! Let me know if you want quick meal ideas too.",
    },
  ],

  // ==============================
  // 🔥 WEEKLY BOARD WALKTHROUGH
  // ==============================
  "weekly-board": [
    {
      id: "step-1",
      text: "Tap any empty slot to add a meal.",
      targetId: "weekly-empty-slot",
      waitForUser: true,
    },
    {
      id: "step-2",
      text: "Choose a meal manually or ask AI to help.",
      waitForUser: true,
    },
    {
      id: "step-3",
      text: "Drag and drop meals to organize your week.",
      waitForUser: false,
    },
    {
      id: "complete",
      text: "Your weekly plan is ready!",
    },
  ],

  // ==============================
  // 🔥 MASTER SHOPPING LIST WALKTHROUGH
  // ==============================
  "shopping-master": [
    { id: "step-1", text: "Scan a barcode to instantly add packaged items.", targetId: "msl-barcode-button", waitForUser: false },
    { id: "step-2", text: "Use voice input to quickly add items without typing.", targetId: "msl-voice-add-button", waitForUser: false },
    { id: "step-3", text: "Use Bulk Add to enter multiple items at once.", targetId: "msl-bulk-add-button", waitForUser: false },
    { id: "step-4", text: "All items — from AI meals and your entries — show up here.", targetId: "msl-items-list", waitForUser: false },
    { id: "step-5", text: "Tap a card to see details or modify the item.", targetId: "msl-item-card", waitForUser: false },
    { id: "step-6", text: "Tap here to mark the item as purchased — it moves to the bottom.", targetId: "msl-item-checkoff", waitForUser: false },
    { id: "step-7", text: "Use this to delete an item you no longer need.", targetId: "msl-item-trash", waitForUser: false },
    { id: "complete", text: "You're all set with the Master Shopping List!" },
  ],

  // ==============================
  // 🔥 BIOMETRICS WALKTHROUGH
  // ==============================
  "biometrics": [
    { id: "step-1", text: "Tap here to log macros by taking a photo of a nutrition label.", targetId: "bio-scan-button", waitForUser: false },
    { id: "step-2", text: "Enter your own protein amount here if logging manually.", targetId: "bio-manual-protein", waitForUser: false },
    { id: "step-3", text: "Enter carbs manually here.", targetId: "bio-manual-carbs", waitForUser: false },
    { id: "step-4", text: "Enter fats here.", targetId: "bio-manual-fat", waitForUser: false },
    { id: "step-5", text: "Or enter calories directly if that's all you know.", targetId: "bio-manual-calories", waitForUser: false },
    { id: "step-6", text: "Tap Add to add your manual entry to today's macros.", targetId: "bio-manual-add-button", waitForUser: false },
    { id: "step-7", text: "Your totals update automatically using your Macro Calculator targets.", targetId: "bio-macro-total-display", waitForUser: false },
    { id: "step-8", text: "Your total calories consumed today appears here.", targetId: "bio-calories-today", waitForUser: false },
    { id: "step-9", text: "This graph shows your calorie trends over time.", targetId: "bio-graph", waitForUser: false },
    { id: "step-10", text: "Enter your current weight here.", targetId: "bio-weight-input", waitForUser: false },
    { id: "step-11", text: "Tap Save to log your weight into your history.", targetId: "bio-weight-save-button", waitForUser: false },
    { id: "step-12", text: "Track how much water you've had today.", targetId: "bio-water-counter", waitForUser: false },
    { id: "step-13", text: "Tap to add 8 ounces.", targetId: "bio-water-plus8", waitForUser: false },
    { id: "step-14", text: "Tap to add 16 ounces.", targetId: "bio-water-plus16", waitForUser: false },
    { id: "complete", text: "You now know how to track everything in Biometrics!" },
  ],

  // ==============================
  // 🔥 MACRO CALCULATOR WALKTHROUGH
  // ==============================
  "macro-calculator": [
    { id: "step-1", text: "Choose whether you're cutting, maintaining, or gaining.", targetId: "mc-goal-selector", waitForUser: false },
    { id: "step-2", text: "Select your body type: Ectomorph, Mesomorph, or Endomorph.", targetId: "mc-bodytype-selector", waitForUser: false },
    { id: "step-3", text: "Tap to read the descriptions and learn which body type fits you best.", targetId: "mc-bodytype-info", waitForUser: false },
    { id: "step-4", text: "Choose US Standard or Metric for your measurements.", targetId: "mc-units-selector", waitForUser: false },
    { id: "step-5", text: "Select your biological sex for accurate calculations.", targetId: "mc-gender-selector", waitForUser: false },
    { id: "step-6", text: "Enter your age.", targetId: "mc-age-input", waitForUser: false },
    { id: "step-7", text: "Enter your height (feet).", targetId: "mc-height-feet-input", waitForUser: false },
    { id: "step-8", text: "Enter inches here.", targetId: "mc-height-inches-input", waitForUser: false },
    { id: "step-9", text: "Enter your current weight.", targetId: "mc-weight-input", waitForUser: false },
    { id: "step-10", text: "Pick your weekly activity level — this affects your calorie needs.", targetId: "mc-activity-selector", waitForUser: false },
    { id: "step-11", text: "Tap to sync your latest weight from the Biometrics page.", targetId: "mc-sync-weight-button", waitForUser: false },
    { id: "step-12", text: "Here are your calculated daily macro targets.", targetId: "mc-targets-card", waitForUser: false },
    { id: "step-13", text: "This is your total daily calorie target.", targetId: "mc-targets-calories", waitForUser: false },
    { id: "step-14", text: "Your daily protein target in grams.", targetId: "mc-targets-protein", waitForUser: false },
    { id: "step-15", text: "Tap here to save your targets to the Biometrics page.", targetId: "mc-set-targets-button", waitForUser: false },
    { id: "complete", text: "Perfect! You're now ready to track your macros accurately." },
  ],

  // ==============================
  // 🔥 GET INSPIRATION WALKTHROUGH
  // ==============================
  "get-inspiration": [
    { id: "step-1", text: "Tap here to refresh your inspiration quote.", targetId: "insp-get-button", waitForUser: false },
    { id: "step-2", text: "Your motivational quote will appear here.", targetId: "insp-quote-display", waitForUser: false },
    { id: "complete", text: "That's all! Tap anytime you need motivation." },
  ],

  // ==============================
  // 🔥 DAILY HEALTH JOURNAL WALKTHROUGH
  // ==============================
  "daily-journal": [
    { id: "step-1", text: "Tap here to speak your journal entry using your voice.", targetId: "journal-voice-input", waitForUser: false },
    { id: "step-2", text: "Your spoken or typed thoughts will appear here.", targetId: "journal-textarea", waitForUser: false },
    { id: "step-3", text: "Tap Save Entry to record today's thoughts.", targetId: "journal-save-button", waitForUser: false },
    { id: "step-4", text: "Your saved entries show up here for future review.", targetId: "journal-entry-list", waitForUser: false },
    { id: "complete", text: "You're ready to journal! Keep tracking your thoughts." },
  ],
};
