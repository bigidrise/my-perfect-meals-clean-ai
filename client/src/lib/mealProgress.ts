export type MealId = "breakfast" | "lunch" | "dinner" | "snack1" | "snack2";

export function getProgress(): Record<MealId, boolean> {
  const today = new Date().toISOString().split("T")[0];
  const key = `meal-progress-${today}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    return {
      breakfast: false,
      lunch: false,
      dinner: false,
      snack1: false,
      snack2: false,
    };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return {
      breakfast: false,
      lunch: false,
      dinner: false,
      snack1: false,
      snack2: false,
    };
  }
}

export function markMealComplete(mealId: MealId): void {
  const today = new Date().toISOString().split("T")[0];
  const key = `meal-progress-${today}`;
  const progress = getProgress();
  progress[mealId] = true;
  localStorage.setItem(key, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("meal:saved"));
}
