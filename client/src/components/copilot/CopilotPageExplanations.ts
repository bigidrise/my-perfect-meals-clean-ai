export interface PageExplanation {
  pageId: string;
  title: string;
  description: string;
  spokenText: string;
  autoClose: boolean;
}

export const PAGE_EXPLANATIONS: Record<string, PageExplanation> = {
  '/craving-creator': {
    pageId: 'craving-creator',
    title: 'Craving Creator',
    description: 'Describe what you\'re craving and get a personalized meal. Try saying: "I want something sweet and crunchy" or "a creamy shake" or "something tangy and refreshing."',
    spokenText: 'Craving Creator. Describe what you\'re craving. For example, say I want something sweet and crunchy, or I want a creamy shake, or something tangy and refreshing. Select your servings, press Create, and enjoy your personalized meal. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/dessert-creator': {
    pageId: 'dessert-creator',
    title: 'Dessert Creator',
    description: 'Create healthy desserts that satisfy your cravings. Describe what you want, choose a dessert type (pie, cake, cookie, etc.), add flavor preferences, and set your servings. The AI will generate a complete recipe with nutrition info.',
    spokenText: 'Dessert Creator. Describe what dessert you\'re craving, like warm apple pie or fudge brownies. Choose what type of dessert you want from the dropdown, like pie, cake, cookie, brownie, cheesecake, smoothie, frozen treat, pudding, no-bake dessert, bars, muffins, cupcakes, pastry, or surprise me. Add any flavor preferences, like rich and gooey or light and fluffy. Select your servings and dietary needs if you have any, then press Create My Dessert. The AI will generate a complete recipe with ingredients, instructions, and nutrition information. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/craving-creator-landing': {
    pageId: 'craving-creator-landing',
    title: 'Craving Creator Hub',
    description: 'Choose from three options: Creator for custom AI-generated cravings, Premades for ready-made craving recipes, or Dessert Creator for healthy desserts like pies, cakes, cookies, and more.',
    spokenText: 'Craving Creator Hub. You have three options here. Say Creator to build a custom craving with AI. Say Premades to browse ready-made craving recipes. Or say Dessert Creator to make healthy desserts like pies, cakes, cookies, brownies, and more. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/craving-presets': {
    pageId: 'craving-presets',
    title: 'Craving Premades',
    description: 'Browse our collection of ready-made craving meals. Tap any picture to see ingredients and nutrition info.',
    spokenText: 'Craving Premades. Browse our ready-made options. Tap any picture to see the ingredients, nutrition info, and cooking instructions. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/fridge-rescue': {
    pageId: 'fridge-rescue',
    title: 'Fridge Rescue',
    description: 'Type in the foods you have in your fridge. Press Generate to get 3 meal ideas using what you\'ve got.',
    spokenText: 'Fridge Rescue. Type in the foods you have in your refrigerator. Press Generate, and I\'ll give you 3 delicious meal ideas using what you\'ve got. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/healthy-kids-meals': {
    pageId: 'healthy-kids-meals',
    title: 'Kids Meals Hub',
    description: 'Choose Kids Meals for older children or Toddler Meals for little ones.',
    spokenText: 'Kids Meals Hub. Say Kids Meals for older children, or say Toddler Meals for the little ones. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/kids-meals': {
    pageId: 'kids-meals',
    title: 'Kids Meals',
    description: 'Find your favorite kids meal. Select servings and tap the picture to see ingredients and cooking instructions.',
    spokenText: 'Kids Meals. Find your favorite meal, select how many servings, and tap the picture to see ingredients and cooking instructions. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/toddler-meals': {
    pageId: 'toddler-meals',
    title: 'Toddler Meals',
    description: 'Nutritious meals for toddlers. Select servings and tap the picture for ingredients and cooking instructions.',
    spokenText: 'Toddler Meals. Find a nutritious meal for your little one, select servings, and tap the picture to see ingredients and cooking instructions. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/social-hub': {
    pageId: 'social-hub',
    title: 'Socializing Hub',
    description: 'Navigate dining out and social eating. Choose Restaurant Guide or Lean Social.',
    spokenText: 'Socializing Hub. Say Restaurant Guide to find healthy options at restaurants, or say Lean Social for tips on eating well at social events. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/social-hub/restaurant-guide': {
    pageId: 'restaurant-guide',
    title: 'Restaurant Guide',
    description: 'Tell us what you\'re craving and the restaurant name. We\'ll find the best options for your macros.',
    spokenText: 'Restaurant Guide. Type what you\'re craving and the restaurant name. Press Search, and I\'ll find the best options that fit your macros. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/lean-social': {
    pageId: 'lean-social',
    title: 'Lean Social',
    description: 'Smart tips for eating well at parties, BBQs, and social gatherings.',
    spokenText: 'Lean Social. Get smart tips for eating well at parties, barbecues, and social gatherings without feeling deprived. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/alcohol-hub': {
    pageId: 'alcohol-hub',
    title: 'Spirits & Lifestyle Hub',
    description: 'Choose from Wine Pairing, Beer Pairing, Bourbon Pairing, Mocktails, or Alcohol Log.',
    spokenText: 'Spirits and Lifestyle Hub. Say Wine, Beer, or Bourbon for drink pairings. Say Mocktails for alcohol-free options. Or say Alcohol Log to track your drinks. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/wine-pairing': {
    pageId: 'wine-pairing',
    title: 'Wine Pairing',
    description: 'Find the perfect wine to pair with your meal. Browse by wine type or meal style.',
    spokenText: 'Wine Pairing. Find the perfect wine to complement your meal. Browse by wine type or meal style, and I\'ll show you the best pairings. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/beer-pairing': {
    pageId: 'beer-pairing',
    title: 'Beer Pairing',
    description: 'Find the best beer to go with your food. Browse by beer style or meal type.',
    spokenText: 'Beer Pairing. Find the best beer to go with your meal. Browse by beer style or what you\'re eating, and I\'ll suggest the perfect match. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/bourbon-spirits': {
    pageId: 'bourbon-spirits',
    title: 'Bourbon & Spirits',
    description: 'Pair bourbon and spirits with your meal for a sophisticated dining experience.',
    spokenText: 'Bourbon and Spirits. Pair your favorite bourbon or spirit with your meal. Browse options and find sophisticated pairings. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/mocktails-low-cal-mixers': {
    pageId: 'mocktails',
    title: 'Mocktails',
    description: 'Delicious alcohol-free drinks with low calories. Perfect for any occasion.',
    spokenText: 'Mocktails. Browse delicious alcohol-free drinks with low calories. Perfect for any occasion when you want something refreshing without the alcohol. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/meal-pairing-ai': {
    pageId: 'meal-pairing',
    title: 'Meal Pairing',
    description: 'Get AI-powered suggestions for what goes well together.',
    spokenText: 'Meal Pairing. Get suggestions for what foods and drinks go well together. I\'ll help you create the perfect combination. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/find-meals': {
    pageId: 'find-meals',
    title: 'Find Meals',
    description: 'Search our database for meals that match your criteria.',
    spokenText: 'Find Meals. Search for meals that match what you\'re looking for. Filter by ingredients, cuisine, or nutrition to find the perfect option. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/lifestyle': {
    pageId: 'lifestyle-landing',
    title: 'Lifestyle',
    description: 'Navigate cravings, dining out, and social moments. Choose a category to get started.',
    spokenText: 'Lifestyle page. Here you\'ll find tools for cravings, dining out, kids meals, and social moments. Tap any card to explore, or tell me what you need. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },
};

export function getPageExplanation(pathname: string): PageExplanation | null {
  return PAGE_EXPLANATIONS[pathname] || null;
}

export function hasPageExplanation(pathname: string): boolean {
  return pathname in PAGE_EXPLANATIONS;
}
