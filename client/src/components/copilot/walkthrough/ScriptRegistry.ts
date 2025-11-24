import type { WalkthroughScript } from "./WalkthroughTypes";
import WeeklyMealBuilderScript from "./scripts/WeeklyMealBuilderScript";
import DiabeticMealBuilderScript from "./scripts/DiabeticMealBuilderScript";
import GLP1MealBuilderScript from "./scripts/GLP1MealBuilderScript";
import AntiInflammatoryMealBuilderScript from "./scripts/AntiInflammatoryMealBuilderScript";
import BeachBodyMealBuilderScript from "./scripts/BeachBodyMealBuilderScript";
import MacroCalculatorScript from "./scripts/MacroCalculatorScript";

/**
 * Central registry for all walkthrough scripts
 * Add new scripts here as they are created
 */
export const ScriptRegistry: Record<string, WalkthroughScript> = {
  // Weekly Meal Builder
  "weekly-meal-builder": WeeklyMealBuilderScript,
  "weekly-board": WeeklyMealBuilderScript,
  "meal-board": WeeklyMealBuilderScript,
  
  // Diabetic Meal Builder
  "diabetic-meal-builder": DiabeticMealBuilderScript,
  "diabetic-board": DiabeticMealBuilderScript,
  
  // GLP-1 Meal Builder
  "glp1-meal-builder": GLP1MealBuilderScript,
  "glp-1-board": GLP1MealBuilderScript,
  
  // Anti-Inflammatory Meal Builder
  "anti-inflammatory-meal-builder": AntiInflammatoryMealBuilderScript,
  "anti-inflammatory-board": AntiInflammatoryMealBuilderScript,
  
  // Beach Body / Hard Body Builder
  "beach-body-meal-builder": BeachBodyMealBuilderScript,
  "beach-body-board": BeachBodyMealBuilderScript,
  "hard-body-board": BeachBodyMealBuilderScript,
  
  // Macro Calculator
  "macro-calculator-walkthrough": MacroCalculatorScript,
  "macro-calculator": MacroCalculatorScript,
};

/**
 * Get a script by ID or alias
 */
export function getScript(id: string): WalkthroughScript | null {
  return ScriptRegistry[id] || null;
}

/**
 * Check if a script exists
 */
export function hasScript(id: string): boolean {
  return id in ScriptRegistry;
}
