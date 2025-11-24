import type { WalkthroughScript } from "../WalkthroughTypes";

export const WeeklyMealBuilderScript: WalkthroughScript = {
  id: "weekly-meal-builder",
  title: "Weekly Meal Builder Walkthrough",
  steps: [
    {
      id: "empty-slot",
      target: '[data-testid="weekly-empty-slot"]',
      description: "Tap any empty slot to add a meal. You can fill in breakfast, lunch, dinner, or snacks for any day of the week.",
      speak: "Welcome to the Weekly Meal Builder! Tap any empty slot to add a meal.",
      waitForAction: "click",
    },
  ],
};
