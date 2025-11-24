import type { WalkthroughScript } from "./WalkthroughTypes";
import { WeeklyMealBuilderScript } from "./scripts/WeeklyMealBuilderScript";

/**
 * Central registry for all walkthrough scripts
 * Add new scripts here as they are created
 */
export const ScriptRegistry: Record<string, WalkthroughScript> = {
  "weekly-meal-builder": WeeklyMealBuilderScript,
  "weekly-board": WeeklyMealBuilderScript, // Alias
  "meal-board": WeeklyMealBuilderScript, // Alias
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
