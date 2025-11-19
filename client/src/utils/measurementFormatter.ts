// Frontend Measurement Formatter - Phase 4B.2
// Mirrors backend measurementNormalizer.ts for frontend-only static data
// Rules:
// - Round ALL ounce values UP to nearest 0.5 oz
// - 1 cup = 8 oz, 1 lb = 16 oz, 1 pint = 16 oz, 1 quart = 32 oz, 1 gallon = 128 oz
// - tsp/tbsp/"to taste"/clove/slice/leaf/sprig/each/piece/links stay as-is (no conversion)
// - Display format: "4 oz (0.5 cups)" for cup-based, "16 oz (1 lb)" for >= 16oz

export interface FormattedMeasurement {
  displayQuantity: string;    // "4 oz (0.5 cups)" or "2 tbsp" if not converted
  quantityOz: number | null;  // 4 (null if not converted)
  originalQuantity: number;   // 0.5
  originalUnit: string;       // "cup"
}

/**
 * Primary function - formats an ingredient measurement with ounce normalization
 * Use this in all premade hubs and shopping list displays
 */
export function formatIngredientMeasurement(
  quantity: number,
  unit: string,
  name: string
): FormattedMeasurement {
  const rawUnit = (unit || '').toLowerCase().trim();

  // Bail early for non-convertible units (tsp, tbsp, pinch, dash, "to taste", counts)
  if (
    !quantity ||
    quantity === 0 ||
    shouldSkipConversion(rawUnit)
  ) {
    // Return legacy format
    return {
      displayQuantity: formatLegacyDisplay(quantity, unit),
      quantityOz: null,
      originalQuantity: quantity,
      originalUnit: unit
    };
  }

  // Convert to ounces
  const oz = toOunces(quantity, rawUnit);
  if (oz == null || isNaN(oz) || oz === 0) {
    // Cannot convert, return legacy format
    return {
      displayQuantity: formatLegacyDisplay(quantity, unit),
      quantityOz: null,
      originalQuantity: quantity,
      originalUnit: unit
    };
  }

  // Round UP to nearest 0.5 oz
  const roundedOz = roundUpToHalf(oz);

  // Calculate cup and pound equivalents
  const cups = roundedOz / 8;
  const pounds = roundedOz / 16;

  // Build display string
  let display = `${formatNumber(roundedOz)} oz`;

  // If original unit was cup-like, show cups in parentheses
  if (/cup|cups|c\b/.test(rawUnit)) {
    const cupStr = formatHalfSteps(cups);
    display = `${formatNumber(roundedOz)} oz (${cupStr} cup${cupStr === '1' ? '' : 's'})`;
  } 
  // If >= 16 oz, show pounds in parentheses
  else if (roundedOz >= 16) {
    const lbStr = formatHalfSteps(pounds);
    display = `${formatNumber(roundedOz)} oz (${lbStr} lb${lbStr === '1' ? '' : 's'})`;
  }

  return {
    displayQuantity: display,
    quantityOz: roundedOz,
    originalQuantity: quantity,
    originalUnit: unit
  };
}

/**
 * Helper - formats display quantity for shopping list items that already have quantityOz
 */
export function formatDisplayQuantity(
  quantityOz: number,
  originalQuantity: number,
  originalUnit: string
): string {
  const rawUnit = (originalUnit || '').toLowerCase().trim();
  const cups = quantityOz / 8;
  const pounds = quantityOz / 16;

  let display = `${formatNumber(quantityOz)} oz`;

  if (/cup|cups|c\b/.test(rawUnit)) {
    const cupStr = formatHalfSteps(cups);
    display = `${formatNumber(quantityOz)} oz (${cupStr} cup${cupStr === '1' ? '' : 's'})`;
  } else if (quantityOz >= 16) {
    const lbStr = formatHalfSteps(pounds);
    display = `${formatNumber(quantityOz)} oz (${lbStr} lb${lbStr === '1' ? '' : 's'})`;
  }

  return display;
}

/**
 * Check if unit should skip ounce conversion
 */
function shouldSkipConversion(unit: string): boolean {
  return /tsp|teaspoon|tbsp|tablespoon|pinch|dash|to taste|clove|slice|leaf|sprig|each|piece|links|large|medium|small/i.test(unit);
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

/**
 * Formats legacy display for non-converted units
 * Examples: "2 tbsp", "1 pinch", "3 cloves"
 */
function formatLegacyDisplay(quantity: number, unit: string): string {
  if (!quantity || quantity === 0) return unit || '';
  
  const formattedQty = formatNumber(quantity);
  
  // Handle pluralization for common units
  const u = unit.toLowerCase();
  let displayUnit = unit;
  
  if (quantity !== 1) {
    if (u === 'clove') displayUnit = 'cloves';
    else if (u === 'slice') displayUnit = 'slices';
    else if (u === 'leaf') displayUnit = 'leaves';
    else if (u === 'each') displayUnit = 'each';
    else if (u === 'piece') displayUnit = 'pieces';
    else if (u === 'link') displayUnit = 'links';
  }
  
  return `${formattedQty} ${displayUnit}`;
}
