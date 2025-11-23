// Keyword → Feature/Walkthrough Mapping
// Fuzzy matching: User says ANY keyword → Navigate to feature + Start walkthrough

export interface FeatureMapping {
  path: string; // Navigation path
  walkthroughId: string; // Walkthrough identifier
  keywords: string[]; // Trigger keywords (fuzzy matched)
}

export const KEYWORD_FEATURE_MAP: FeatureMapping[] = [
  {
    path: "/fridge-rescue",
    walkthroughId: "fridge-rescue",
    keywords: ["fridge", "rescue", "ingredients"],
  },
  {
    path: "/weekly-meal-board",
    walkthroughId: "weekly-board",
    keywords: ["weekly", "meal board", "board", "planner", "week"],
  },
  {
    path: "/beach-body-meal-board",
    walkthroughId: "beach-body",
    keywords: ["beach", "beach body", "hard body", "competition", "shred"],
  },
  {
    path: "/craving-creator-landing",
    walkthroughId: "craving-creator",
    keywords: ["craving", "creator", "crave"],
  },
  {
    path: "/alcohol-hub",
    walkthroughId: "alcohol-hub",
    keywords: ["alcohol", "drinks", "drinking", "smart sips"],
  },
  {
    path: "/social-hub/find",
    walkthroughId: "find-meals",
    keywords: ["find meals", "find", "search", "nearby", "restaurants"],
  },
  {
    path: "/social-hub/restaurant-guide",
    walkthroughId: "restaurant-guide",
    keywords: ["restaurant", "dining", "eating out"],
  },
  {
    path: "/diabetic-hub",
    walkthroughId: "diabetic-hub",
    keywords: ["diabetic", "diabetes", "blood sugar", "glucose"],
  },
  {
    path: "/glp1-hub",
    walkthroughId: "glp1-hub",
    keywords: ["glp", "glp1", "glp-1", "ozempic", "wegovy", "injection"],
  },
  {
    path: "/anti-inflammatory-menu-builder",
    walkthroughId: "anti-inflammatory",
    keywords: ["anti", "anti-inflammatory", "inflammation"],
  },
  {
    path: "/kids-meals",
    walkthroughId: "kids-meals",
    keywords: ["kids", "children", "toddler", "toddlers"],
  },
  {
    path: "/shopping-list-v2",
    walkthroughId: "shopping-master",
    keywords: ["shopping", "grocery", "groceries", "list"],
  },
  {
    path: "/macro-counter",
    walkthroughId: "macro-calculator",
    keywords: ["calculator", "macros", "calculate", "counter"],
  },
  {
    path: "/biometrics",
    walkthroughId: "biometrics",
    keywords: ["biometrics", "tracking", "weight"],
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
