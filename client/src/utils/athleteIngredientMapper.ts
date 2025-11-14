
import type { AthleteMeal } from '../data/athleteMeals';

export interface UniversalIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

/**
 * Extracts descriptors from ingredient name and returns clean name + notes
 */
function extractNotesFromName(name: string): { cleanName: string; notes?: string } {
  // Common descriptors to extract
  const descriptors = ['grilled', 'baked', 'steamed', 'raw', 'cooked', 'lean', 'boneless', 'skinless', 'fresh', 'frozen'];
  
  const words = name.toLowerCase().split(/\s+/);
  const foundDescriptors: string[] = [];
  const remainingWords: string[] = [];
  
  words.forEach(word => {
    if (descriptors.includes(word)) {
      foundDescriptors.push(word);
    } else {
      remainingWords.push(word);
    }
  });
  
  return {
    cleanName: remainingWords.join(' '),
    notes: foundDescriptors.length > 0 ? foundDescriptors.join(', ') : undefined
  };
}

/**
 * Converts an Athlete Meal to universal ingredient schema
 */
export function mapAthleteMealToUniversalIngredients(meal: AthleteMeal): UniversalIngredient[] {
  const ingredients: UniversalIngredient[] = [];
  
  // 1. Convert protein source
  if (meal.protein_source) {
    const { cleanName, notes } = extractNotesFromName(meal.protein_source);
    
    ingredients.push({
      name: cleanName,
      quantity: meal.protein_oz || meal.protein_g || 0,
      unit: meal.protein_oz ? 'oz' : 'g',
      notes
    });
  }
  
  // 2. Convert carb source
  if (meal.carb_source && meal.carb_g) {
    const { cleanName, notes } = extractNotesFromName(meal.carb_source);
    
    ingredients.push({
      name: cleanName,
      quantity: meal.carb_g,
      unit: 'g',
      notes
    });
  }
  
  // 3. Convert fibrous vegetables
  if (meal.fibrous_source && Array.isArray(meal.fibrous_source) && meal.fibrous_source.length > 0) {
    const fibrousCount = meal.fibrous_source.length;
    const quantityPerItem = meal.fibrous_g ? meal.fibrous_g / fibrousCount : 0;
    
    meal.fibrous_source.forEach(fibrousItem => {
      const { cleanName, notes } = extractNotesFromName(fibrousItem);
      
      ingredients.push({
        name: cleanName,
        quantity: quantityPerItem,
        unit: 'g',
        notes
      });
    });
  } else if (meal.fibrous_source && typeof meal.fibrous_source === 'string' && meal.fibrous_g) {
    // Handle single fibrous source as string
    const { cleanName, notes } = extractNotesFromName(meal.fibrous_source);
    
    ingredients.push({
      name: cleanName,
      quantity: meal.fibrous_g,
      unit: 'g',
      notes
    });
  }
  
  // 4. Convert fats (if present in the dataset)
  if (meal.fat_source && meal.fat_g) {
    const { cleanName, notes } = extractNotesFromName(meal.fat_source);
    
    ingredients.push({
      name: cleanName,
      quantity: meal.fat_g,
      unit: 'g',
      notes
    });
  }
  
  return ingredients;
}

/**
 * Batch convert multiple athlete meals
 */
export function mapAthleteMealsToUniversal(meals: AthleteMeal[]): Record<string, UniversalIngredient[]> {
  const result: Record<string, UniversalIngredient[]> = {};
  
  meals.forEach(meal => {
    result[meal.id] = mapAthleteMealToUniversalIngredients(meal);
  });
  
  return result;
}
