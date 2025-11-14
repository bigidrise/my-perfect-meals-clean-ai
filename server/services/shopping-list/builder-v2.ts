import { canonicalName } from './normalizer';
import { normalizeUnit, convertToPreferred, Qty } from './unit-converter';
import { categorize, AISLE_ORDER } from '../../data/ingredientCategories';

export type UniversalIngredient = {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
};

export type MealInput = {
  mealId: string;
  mealName: string;
  generator?: string;
  day?: string;
  slot?: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  ingredients: UniversalIngredient[];
};

export type MealSource = {
  mealId: string;
  mealName: string;
  generator?: string;
  day?: string;
  slot?: string;
  qty: string;
  unit?: string;
};

export type ShoppingListItemWithSources = {
  key: string;
  name: string;
  totalQty: number;
  unit?: string;
  category: string;
  sources: MealSource[];
};

function parseAmount(raw: string): Qty & { rest: string } {
  const s = (raw || '').trim();
  if (!s) return { amount: 0, unit: undefined, rest: '' };
  
  const parseFraction = (frac: string): number => {
    const parts = frac.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (den !== 0 && !isNaN(num) && !isNaN(den)) return num / den;
    }
    return NaN;
  };
  
  let m = s.match(/^(\d+)\s+(\d+\/\d+)\s*([a-zA-Z]+)?\b(.*)$/);
  if (m) {
    const whole = parseInt(m[1]);
    const fracValue = parseFraction(m[2]);
    if (!isNaN(whole) && !isNaN(fracValue)) {
      const amount = whole + fracValue;
      const unit = m[3] || undefined;
      const rest = (m[4] || '').trim();
      return { ...normalizeUnit(amount, unit), rest };
    }
  }
  
  m = s.match(/^(\d+\/\d+)\s*([a-zA-Z]+)?\b(.*)$/);
  if (m) {
    const fracValue = parseFraction(m[1]);
    if (!isNaN(fracValue)) {
      const amount = fracValue;
      const unit = m[2] || undefined;
      const rest = (m[3] || '').trim();
      return { ...normalizeUnit(amount, unit), rest };
    }
  }
  
  m = s.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\b(.*)$/);
  if (m) {
    const amount = parseFloat(m[1]);
    const unit = m[2] || undefined;
    const rest = (m[3] || '').trim();
    if (!isNaN(amount)) {
      return { ...normalizeUnit(amount, unit), rest };
    }
  }
  
  return { amount: 0, unit: undefined, rest: s };
}

export function buildShoppingListFromMeals(meals: MealInput[]): ShoppingListItemWithSources[] {
  const map = new Map<string, ShoppingListItemWithSources>();
  
  for (const meal of meals) {
    for (const ing of meal.ingredients || []) {
      // Validate universal ingredient schema
      if (!ing.name || typeof ing.quantity !== 'number' || !ing.unit) {
        console.warn('Invalid ingredient schema, skipping:', ing);
        continue;
      }

      if (isNaN(ing.quantity) || ing.quantity <= 0) {
        continue;
      }

      // Normalize the ingredient name (lowercase, trim, remove descriptors)
      const normalizedName = canonicalName(ing.name);

      // Convert to preferred unit system
      const qty = convertToPreferred({ amount: ing.quantity, unit: ing.unit });
      const unit = qty.unit || '';

      // Create grouping key: normalized name + unit (notes do NOT affect grouping)
      const key = `${normalizedName.toLowerCase()}|${unit}`;
      
      const source: MealSource = {
        mealId: meal.mealId,
        mealName: meal.mealName,
        generator: meal.generator,
        day: meal.day,
        slot: meal.slot,
        qty: qty.amount.toString(),
        unit: qty.unit,
      };
      
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: normalizedName,
          totalQty: qty.amount,
          unit: qty.unit,
          category: categorize(normalizedName),
          sources: [source],
        });
      } else {
        const existing = map.get(key)!;
        existing.totalQty += qty.amount;
        existing.sources.push(source);
      }
    }
  }
  
  const items = Array.from(map.values());
  
  // Sort by category (aisle order) then alphabetically by name
  items.sort((a, b) => {
    const categoryIndexA = AISLE_ORDER.indexOf(a.category);
    const categoryIndexB = AISLE_ORDER.indexOf(b.category);
    if (categoryIndexA !== categoryIndexB) {
      return categoryIndexA - categoryIndexB;
    }
    return a.name.localeCompare(b.name);
  });
  
  return items;
}

export function formatItemDisplay(item: ShoppingListItemWithSources): string {
  const qty = Math.round(item.totalQty * 100) / 100;
  const qtyStr = item.unit ? `${qty} ${item.unit}` : qty.toString();
  
  let sourceSummary = '';
  if (item.sources.length > 1) {
    sourceSummary = `from ${item.sources.length} meals`;
  } else if (item.sources.length === 1) {
    const src = item.sources[0];
    let srcStr = `for ${src.mealName}`;
    if (src.generator) srcStr += ` (${src.generator})`;
    if (src.day && src.slot) srcStr += ` — ${src.day} ${src.slot}`;
    sourceSummary = srcStr;
  }
  
  return `${item.name} — ${qtyStr} • ${item.category}${sourceSummary ? ' • ' + sourceSummary : ''}`;
}