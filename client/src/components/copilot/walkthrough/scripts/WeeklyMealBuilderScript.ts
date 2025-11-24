import type { WalkthroughScript } from "../WalkthroughTypes";

export const WeeklyMealBuilderScript: WalkthroughScript = {
  id: "weekly-meal-builder",
  title: "Weekly Meal Builder Walkthrough",
  steps: [
    {
      id: "intro",
      description: "Welcome to the Weekly Meal Builder! Plan your entire week of meals with AI assistance and macro tracking.",
      speak: "Welcome to the Weekly Meal Builder! Let me show you how to plan your entire week.",
      waitForAction: "none",
    },
    {
      id: "empty-slot",
      target: '[data-testid="weekly-board-slot-empty"]',
      description: "Tap any empty slot to add a meal. You can fill in breakfast, lunch, dinner, or snacks for any day of the week.",
      speak: "Tap any empty slot to add a meal for that day and time.",
      waitForAction: "click",
    },
    {
      id: "action-toolbar",
      target: '[data-testid="weekly-board-action-toolbar"]',
      description: "Choose from AI-generated meals, your saved recipes, or create a custom meal. Your macros are tracked automatically.",
      speak: "You can choose from AI-generated meals, your saved recipes, or create a custom meal.",
      waitForAction: "click",
    },
    {
      id: "save-week",
      target: '[data-testid="weekly-board-save-week"]',
      description: "Once you've planned your week, save it here. You'll get notifications and can track your progress throughout the week.",
      speak: "When you're done planning, save your week here to get notifications and track your progress.",
      waitForAction: "click",
    },
  ],
};
