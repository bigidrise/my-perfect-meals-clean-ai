import type { WalkthroughScript } from "../WalkthroughTypes";

export const WeeklyMealBuilderScript: WalkthroughScript = {
  id: "weekly-meal-builder",
  title: "Weekly Meal Builder Walkthrough",
  steps: [
    {
      id: "welcome",
      description: "Welcome to the Weekly Meal Builder! This is where you plan and organize your entire week of meals. Let me show you how it works.",
      speak: "Welcome to the Weekly Meal Builder! This is where you plan and organize your entire week of meals. Let me show you how it works.",
      waitForAction: "none",
    },
    {
      id: "empty-slot",
      target: '[data-testid="weekly-empty-slot"]',
      description: "Tap any empty slot to add a meal. You can fill in breakfast, lunch, dinner, or snacks for any day of the week.",
      speak: "Tap any empty slot to add a meal. You can fill in breakfast, lunch, dinner, or snacks for any day of the week.",
      waitForAction: "click",
    },
    {
      id: "meal-options",
      description: "You'll see meal options appear. You can choose from AI-generated meals, your saved recipes, or create a custom meal.",
      speak: "You'll see meal options appear. You can choose from AI-generated meals, your saved recipes, or create a custom meal.",
      waitForAction: "none",
    },
    {
      id: "drag-drop",
      target: '[data-testid="meal-card"]',
      description: "Once you've added meals, you can drag and drop them to rearrange your week. This makes meal planning flexible and easy.",
      speak: "Once you've added meals, you can drag and drop them to rearrange your week. This makes meal planning flexible and easy.",
      waitForAction: "none",
    },
    {
      id: "macro-tracking",
      description: "Your macros are automatically calculated for each day. This helps you stay on track with your nutrition goals.",
      speak: "Your macros are automatically calculated for each day. This helps you stay on track with your nutrition goals.",
      waitForAction: "none",
    },
    {
      id: "shopping-list",
      target: '[data-testid="button-shopping-list"]',
      description: "All ingredients from your weekly meals automatically go to your Master Shopping List. Tap here to view it anytime.",
      speak: "All ingredients from your weekly meals automatically go to your Master Shopping List. Tap here to view it anytime.",
      waitForAction: "click",
    },
    {
      id: "complete",
      description: "That's it! You're ready to plan your week. Ask me anytime if you need help with meal planning.",
      speak: "That's it! You're ready to plan your week. Ask me anytime if you need help with meal planning.",
      waitForAction: "none",
    },
  ],
};
