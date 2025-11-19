// Measurement Normalizer - Phase 4B: Ounce Engine
// Converts ingredient measurements to standardized ounce-based format
// Rules:
// - Round ALL ounce values UP to nearest 0.5 oz
// - 1 cup = 8 oz, 1 lb = 16 oz
// - tsp/tbsp/"to taste" stay as-is (no conversion)
// - Backward compatible: only extends UnifiedIngredient with optional fields

import type { UnifiedIngredient } from '../types';

/**
 * Normalizes ingredient measurements to ounce-based format
 * Adds quantityOz, displayQuantity, and originalUnit to each ingredient
 */
export function normalizeIngredientMeasurements(
  ingredients: UnifiedIngredient[]
): UnifiedIngredient[] {
  return ingredients.map(applyOunceNormalization);
}

/**
 * Applies ounce-based normalization to a single ingredient
 */
function applyOunceNormalization(ing: UnifiedIngredient): UnifiedIngredient {
  const out: UnifiedIngredient = { ...ing };

  // Extract quantity and unit
  const rawAmount = ing.amount;
  const rawUnit = (ing.unit || '').toLowerCase().trim();

  // Bail early for non-convertible units (tsp, tbsp, pinch, dash, "to taste")
  if (
    !rawAmount ||
    rawAmount === 0 ||
    /tsp|teaspoon|tbsp|tablespoon|pinch|dash|to taste|clove|slice|leaf|sprig/i.test(rawUnit)
  ) {
    return out; // Return unchanged
  }

  // Convert to ounces
  const oz = toOunces(rawAmount, rawUnit);
  if (oz == null || isNaN(oz) || oz === 0) {
    return out; // Cannot convert, return unchanged
  }

  // Round UP to nearest 0.5 oz
  const roundedOz = roundUpToHalf(oz);

  // Calculate cup and pound equivalents
  const cups = roundedOz / 8;
  const pounds = roundedOz / 16;

  // Build display string
  let display = `${formatNumber(roundedOz)} oz`;

  // If original unit was cup-like, show cups
  if (/cup|cups|c\b/.test(rawUnit)) {
    const cupStr = formatHalfSteps(cups);
    display = `${formatNumber(roundedOz)} oz (${cupStr} cup${cupStr === '1' ? '' : 's'})`;
  } 
  // If >= 16 oz, show pounds
  else if (roundedOz >= 16) {
    const lbStr = formatHalfSteps(pounds);
    display = `${formatNumber(roundedOz)} oz (${lbStr} lb${lbStr === '1' ? '' : 's'})`;
  }

  // Populate new Phase 4B fields ONLY (do NOT mutate legacy fields)
  out.quantityOz = roundedOz;
  out.displayQuantity = display;
  out.originalUnit = ing.unit || rawUnit;
  
  // IMPORTANT: Do NOT mutate out.unit or out.amount - backward compatibility requirement

  return out;
}

/**
 * Converts a numeric value + unit to ounces
 * Returns null if conversion is not possible
 */
function toOunces(value: number, unit: string): number | null {
  if (!unit) return value; // Assume already oz if no unit specified

  const u = unit.toLowerCase();

  // Ounces (already in oz)
  if (/^oz$|^ounce/.test(u)) return value;

  // Pounds
  if (/^lb$|^lbs$|^pound/.test(u)) return value * 16;

  // Kilograms
  if (/^kg$|^kilogram/.test(u)) return value * 35.274;

  // Grams
  if (/^g$|^gram/.test(u)) return value / 28.3495;

  // Cups (1 cup = 8 oz)
  if (/^cup$|^cups$|^c$/.test(u)) return value * 8;

  // Pints (1 pint = 16 oz)
  if (/^pint$|^pints$|^pt$/.test(u)) return value * 16;

  // Quarts (1 quart = 32 oz)
  if (/^quart$|^quarts$|^qt$/.test(u)) return value * 32;

  // Gallons (1 gallon = 128 oz)
  if (/^gallon$|^gallons$|^gal$/.test(u)) return value * 128;

  // Unknown unit - cannot convert
  return null;
}

/**
 * Rounds a value UP to the nearest 0.5
 * Examples: 0.3 → 0.5, 1.2 → 1.5, 2.0 → 2.0, 2.6 → 3.0
 */
function roundUpToHalf(oz: number): number {
  return Math.ceil(oz * 2) / 2;
}

/**
 * Formats a number for display (removes unnecessary decimals)
 * Examples: 1.0 → "1", 1.5 → "1.5", 2.0 → "2"
 */
function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * Formats values in half-step increments for cups/pounds
 * Examples: 1.0 → "1", 1.5 → "1.5", 2.0 → "2"
 */
function formatHalfSteps(value: number): string {
  const rounded = Math.round(value * 2) / 2;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
