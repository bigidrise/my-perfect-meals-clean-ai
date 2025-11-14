
// server/services/shopping-list/normalizer.ts

/**
 * List of descriptors to strip from ingredient names
 * These will be moved to notes in the universal schema
 */
const DESCRIPTORS = [
  'grilled', 'baked', 'steamed', 'raw', 'cooked', 'lean', 'boneless', 
  'skinless', 'fresh', 'frozen', 'organic', 'free-range', 'grass-fed',
  'wild-caught', 'canned', 'dried', 'sliced', 'diced', 'chopped',
  'shredded', 'ground', 'whole', 'low-fat', 'fat-free', 'unsalted',
  'salted', 'sweetened', 'unsweetened', 'roasted', 'toasted'
];

/**
 * Common ingredient name normalizations
 * Maps variations to canonical names
 */
const NAME_MAPPINGS: Record<string, string> = {
  // Proteins
  'chicken breast': 'Chicken breast',
  'chicken breasts': 'Chicken breast',
  'chicken thigh': 'Chicken thigh',
  'chicken thighs': 'Chicken thigh',
  'ground beef': 'Ground beef',
  'beef ground': 'Ground beef',
  'ground turkey': 'Ground turkey',
  'turkey ground': 'Ground turkey',
  'salmon fillet': 'Salmon',
  'salmon fillets': 'Salmon',
  
  // Dairy
  'greek yogurt': 'Greek yogurt',
  'yogurt greek': 'Greek yogurt',
  'cottage cheese': 'Cottage cheese',
  'cheddar cheese': 'Cheddar cheese',
  'mozzarella cheese': 'Mozzarella cheese',
  
  // Grains
  'brown rice': 'Brown rice',
  'white rice': 'White rice',
  'jasmine rice': 'Jasmine rice',
  'basmati rice': 'Basmati rice',
  'quinoa': 'Quinoa',
  'oats': 'Oats',
  'oatmeal': 'Oats',
  
  // Vegetables
  'broccoli': 'Broccoli',
  'broccoli florets': 'Broccoli',
  'bell pepper': 'Bell pepper',
  'bell peppers': 'Bell pepper',
  'sweet potato': 'Sweet potato',
  'sweet potatoes': 'Sweet potato',
  'spinach': 'Spinach',
  'spinach leaves': 'Spinach',
  
  // Condiments
  'olive oil': 'Olive oil',
  'extra virgin olive oil': 'Olive oil',
  'coconut oil': 'Coconut oil',
  'salt': 'Salt',
  'sea salt': 'Salt',
  'black pepper': 'Black pepper',
  'pepper': 'Black pepper',
  'soy sauce': 'Soy sauce',
  'low sodium soy sauce': 'Soy sauce',
};

/**
 * Normalize an ingredient name for grouping
 * Removes descriptors, punctuation, and applies canonical mappings
 */
export function canonicalName(raw: string): string {
  if (!raw) return '';
  
  // Start with lowercase and trim
  let name = raw.toLowerCase().trim();
  
  // Remove parentheses and their contents
  name = name.replace(/\([^)]*\)/g, '').trim();
  
  // Remove punctuation except hyphens
  name = name.replace(/[^\w\s-]/g, '').trim();
  
  // Remove descriptor words
  const words = name.split(/\s+/);
  const cleanWords = words.filter(word => !DESCRIPTORS.includes(word));
  name = cleanWords.join(' ');
  
  // Normalize plural to singular for common cases
  name = name.replace(/ies$/, 'y'); // berries -> berry
  name = name.replace(/ves$/, 'f'); // leaves -> leaf
  name = name.replace(/s$/, ''); // remove trailing s
  
  // Apply canonical mappings
  const mapped = NAME_MAPPINGS[name];
  if (mapped) {
    return mapped;
  }
  
  // Title case the result
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract descriptors from ingredient name
 * Returns the descriptors that were stripped during normalization
 */
export function extractDescriptors(raw: string): string[] {
  if (!raw) return [];
  
  const words = raw.toLowerCase().split(/\s+/);
  return words.filter(word => DESCRIPTORS.includes(word));
}
