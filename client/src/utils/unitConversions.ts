// Utility for converting common cooking measurements to grams for clarity
// Helps users with grocery shopping and meal prep accuracy

const ozToGrams = (oz: number) => Math.round(oz * 28.35);
const lbToGrams = (lb: number) => Math.round(lb * 453.59);
const cupToGrams = (cups: number, ingredient: string = '') => {
  // Rough estimates for common ingredients
  const lowerIngredient = ingredient.toLowerCase();
  if (lowerIngredient.includes('flour')) return Math.round(cups * 120);
  if (lowerIngredient.includes('sugar')) return Math.round(cups * 200);
  if (lowerIngredient.includes('rice')) return Math.round(cups * 185);
  if (lowerIngredient.includes('oats')) return Math.round(cups * 80);
  return Math.round(cups * 240); // default for liquids
};

/**
 * Format ingredient measurement with gram equivalent for clarity
 * Examples:
 * - "4 oz chicken" → "4 oz. (113g) chicken"
 * - "1 lb beef" → "1 lb. (454g) beef"
 * - "2 cups rice" → "2 cups (370g) rice"
 */
export function formatIngredientWithGrams(
  amount: string | number,
  unit: string,
  item: string
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const unitLower = unit?.toLowerCase() || '';
  
  // Skip if no amount/unit or already in grams
  if (!amount || !unit || isNaN(numAmount)) {
    return `${amount || ''} ${unit || ''} ${item}`.trim();
  }
  
  if (unitLower === 'g' || unitLower === 'grams' || unitLower === 'gram') {
    return `${amount}g ${item}`;
  }

  let grams: number | null = null;
  let formattedUnit = unit;

  // Convert common units to grams
  if (unitLower === 'oz' || unitLower === 'ounce' || unitLower === 'ounces') {
    grams = ozToGrams(numAmount);
    formattedUnit = 'oz.';
  } else if (unitLower === 'lb' || unitLower === 'lbs' || unitLower === 'pound' || unitLower === 'pounds') {
    grams = lbToGrams(numAmount);
    formattedUnit = 'lb.';
  } else if (unitLower === 'cup' || unitLower === 'cups') {
    grams = cupToGrams(numAmount, item);
    formattedUnit = unitLower;
  }

  // Format with gram conversion if available
  if (grams !== null) {
    return `${amount} ${formattedUnit} (${grams}g) ${item}`;
  }

  // Otherwise return as-is
  return `${amount} ${unit} ${item}`;
}
