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
};
