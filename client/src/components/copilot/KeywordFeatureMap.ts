// Keyword → Feature/Walkthrough Mapping
// Fuzzy matching: User says ANY keyword → Navigate to feature + Start walkthrough

export interface FeatureMapping {
  path: string; // Navigation path
  walkthroughId: string; // Walkthrough identifier
  keywords: string[]; // Trigger keywords (fuzzy matched)
}

export const KEYWORD_FEATURE_MAP: FeatureMapping[] = [
  // Fridge Rescue
  {
    path: "/fridge-rescue",
    walkthroughId: "fridge-rescue",
    keywords: ["fridge rescue", "rescue", "use my fridge", "ingredients", "what can I make"],
  },
  
  // Weekly Meal Builder
  {
    path: "/weekly-meal-board",
    walkthroughId: "weekly-board",
    keywords: ["weekly board", "meal board", "weekly planner", "meal builder", "week"],
  },
  
  // Beach Body Meal Builder
  {
    path: "/beach-body-meal-board",
    walkthroughId: "beach-body",
    keywords: ["beach body", "hard body", "summer shred", "lean out", "competition", "shred"],
  },
  
  // Craving Creator Hub
  {
    path: "/craving-creator-landing",
    walkthroughId: "craving-creator",
    keywords: ["cravings", "craving creator", "craving hub", "I have a craving", "make a craving meal", "crave"],
  },
  
  // Alcohol Hub
  {
    path: "/alcohol-hub",
    walkthroughId: "alcohol-hub",
    keywords: ["alcohol", "drinks", "cocktails", "spirits", "low calorie alcohol", "lean cocktails", "smart sips"],
  },
  
  // Socializing Hub (main hub)
  {
    path: "/social-hub",
    walkthroughId: "social-hub",
    keywords: ["socializing", "social meals", "out to eat"],
  },
  
  // Find Meals (Social sub-feature)
  {
    path: "/social-hub/find",
    walkthroughId: "find-meals",
    keywords: ["find meals", "find", "search", "nearby"],
  },
  
  // Restaurant Guide (Social sub-feature)
  {
    path: "/social-hub/restaurant-guide",
    walkthroughId: "restaurant-guide",
    keywords: ["restaurant", "dining", "eating out", "restaurant guide"],
  },
  
  // Diabetic Hub
  {
    path: "/diabetic-hub",
    walkthroughId: "diabetic-hub",
    keywords: ["diabetic", "diabetes", "sugar control", "diabetic meals", "blood sugar", "glucose"],
  },
  
  // GLP-1 Hub
  {
    path: "/glp1-hub",
    walkthroughId: "glp1-hub",
    keywords: ["glp", "glp one", "glp-1", "ozempic", "wegovy", "semaglutide", "injection"],
  },
  
  // Anti-Inflammatory Meal Builder
  {
    path: "/anti-inflammatory-menu-builder",
    walkthroughId: "anti-inflammatory",
    keywords: ["anti-inflammatory", "inflammation", "healing meals", "anti inflammatory builder", "anti"],
  },
  
  // Kids Meals Hub
  {
    path: "/kids-meals",
    walkthroughId: "kids-meals",
    keywords: ["kids meals", "children meals", "kids hub", "meals for kids", "healthy kids meals", "children", "toddler"],
  },
  
  // Master Shopping List
  {
    path: "/shopping-list-v2",
    walkthroughId: "shopping-master",
    keywords: ["shopping list", "groceries", "master list", "shopping planner", "grocery", "shopping"],
  },
  
  // Macro Calculator
  {
    path: "/macro-counter",
    walkthroughId: "macro-calculator",
    keywords: ["macros", "macro calculator", "protein calculator", "calorie calculator", "macro counter", "calculator", "calculate"],
  },
  
  // My Diet Biometrics
  {
    path: "/biometrics",
    walkthroughId: "biometrics",
    keywords: ["biometrics", "diet numbers", "profile numbers", "my macros profile", "tracking", "weight"],
  },
  
  // Get Inspiration
  {
    path: "/get-inspiration",
    walkthroughId: "inspiration",
    keywords: ["inspiration", "ideas", "meal ideas", "meal inspiration"],
  },
  
  // Supplement Hub
  {
    path: "/supplement-hub-landing",
    walkthroughId: "supplement-hub",
    keywords: ["supplements", "supplement hub", "vitamins", "nutrition supplements"],
  },
  
  // Lifestyle Page
  {
    path: "/lifestyle",
    walkthroughId: "lifestyle",
    keywords: ["lifestyle", "main lifestyle page", "nutrition lifestyle"],
  },
  
  // Pro Care Page
  {
    path: "/procare-cover",
    walkthroughId: "procare",
    keywords: ["pro care", "professional care", "doctor care"],
  },
  
  // Planner Page
  {
    path: "/planner",
    walkthroughId: "planner",
    keywords: ["planner", "meal planner", "planning board"],
  },
];

/**
 * Find feature by fuzzy keyword matching
 * Normalizes query and checks if any keyword is contained
 */
export function findFeatureFromKeywords(
  query: string
): FeatureMapping | null {
  const normalized = query.toLowerCase().trim();

  for (const mapping of KEYWORD_FEATURE_MAP) {
    for (const keyword of mapping.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        return mapping;
      }
    }
  }

  return null;
}
