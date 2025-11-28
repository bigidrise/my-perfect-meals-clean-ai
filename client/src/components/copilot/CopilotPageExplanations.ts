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
    description: 'Describe your dessert, pick what type like pie or cake, choose flavor and texture, select servings and dietary requirements, then create your dessert.',
    spokenText: 'Dessert Creator. Describe your dessert. Pick what type of dessert, whether it\'s a pie, cake, or whatever. Pick your flavor texture if you need to. Pick your servings. Pick your dietary requirements if you have any. Then create your dessert. Close Copilot anytime if you don\'t need help.',
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

  '/macro-counter': {
    pageId: 'macro-counter',
    title: 'Macro Calculator',
    description: 'Enter your stats and goals to calculate your daily protein, carbs, and fat.',
    spokenText: 'Macro Calculator. Enter your stats and your goals, and I\'ll calculate your daily macros. When you\'re done, press Calculate. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/shopping-list': {
    pageId: 'shopping-list',
    title: 'Shopping List',
    description: 'Add items, check them off, or create a list for your next grocery run.',
    spokenText: 'Shopping List. Add items manually or by using voice commands. You can check items off as you shop, or remove them anytime. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/get-inspiration': {
    pageId: 'get-inspiration',
    title: 'Get Inspiration',
    description: 'Daily motivation and journaling to keep you on track with your health goals.',
    spokenText: 'Get Inspiration. Here you\'ll find daily motivation quotes and a journal to record your thoughts. Use this space to reflect on your journey. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/my-biometrics': {
    pageId: 'my-biometrics',
    title: 'My Biometrics',
    description: 'Track your macros, weight, body stats, and health metrics all in one place.',
    spokenText: 'My Biometrics. Track your daily macros, log your weight, and monitor your health metrics. Tap any section to add or view your data. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/weekly-meal-board': {
    pageId: 'weekly-meal-board',
    title: 'Weekly Meal Board',
    description: 'Plan your meals for the week. Add breakfast, lunch, dinner, and snacks for each day.',
    spokenText: 'Weekly Meal Board. Plan your meals for the entire week. Tap the plus button to add meals for breakfast, lunch, dinner, or snacks. Switch between days using the tabs at the top. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },

  '/diabetic-hub': {
    pageId: 'diabetic-hub',
    title: 'Diabetic Hub',
    description: 'Manage your diabetes with glucose tracking, guardrails, and diabetic-friendly meal suggestions.',
    spokenText: 'Diabetic Hub. Track your glucose readings, set your guardrails for blood sugar targets, and browse diabetic-friendly meals. Everything here is designed to help you manage diabetes. Close Copilot anytime if you don\'t need help.',
    autoClose: true,
  },
};

export function getPageExplanation(pathname: string): PageExplanation | null {
  return PAGE_EXPLANATIONS[pathname] || null;
}

export function hasPageExplanation(pathname: string): boolean {
  return pathname in PAGE_EXPLANATIONS;
}
