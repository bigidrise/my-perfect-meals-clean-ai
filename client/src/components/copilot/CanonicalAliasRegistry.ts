/**
 * CanonicalAliasRegistry.ts
 * 
 * Phase B - Hub & Feature Routing Registry
 * 
 * This registry provides a single source of truth for:
 * - Feature keywords and aliases
 * - Hub vs direct-page routing
 * - Hub size (small vs large) for prompt behavior
 * - Sub-option navigation within hubs
 */

export interface SubOption {
  id: string;
  label: string;
  route: string;
  aliases: string[];
}

export interface FeatureDefinition {
  id: string;
  legacyId?: string; // For backward compatibility with Spotlight/legacy systems
  primaryRoute: string;
  isHub: boolean;
  hubSize?: "small" | "large";
  keywords: string[];
  subOptions?: SubOption[];
}

/**
 * HUBS (Hub-First Routing)
 * When user says any keyword, navigate to hub first, then prompt for sub-option
 */
export const HUBS: Record<string, FeatureDefinition> = {
  CRAVING_HUB: {
    id: "CRAVING_HUB",
    legacyId: "craving-hub",
    primaryRoute: "/craving-creator-landing",
    isHub: true,
    hubSize: "small",
    keywords: ["cravings", "craving creator", "craving hub", "satisfy cravings", "craving ideas", "i have a craving", "craving center", "cravings hub"],
    subOptions: [
      {
        id: "CRAVING_CREATOR",
        label: "Craving Creator",
        route: "/craving-creator",
        aliases: ["creator", "create", "custom craving", "make a craving", "craving creator", "create craving", "make my craving"]
      },
      {
        id: "CRAVING_PREMADES",
        label: "Craving Premades",
        route: "/craving-presets",
        aliases: ["premades", "presets", "premade cravings", "premade", "craving premades", "pre-mades", "pre made", "pre maid", "pro maids", "maids"]
      }
    ]
  },

  ALCOHOL_HUB: {
    id: "ALCOHOL_HUB",
    legacyId: "alcohol-hub",
    primaryRoute: "/alcohol-hub",
    isHub: true,
    hubSize: "large",
    keywords: ["alcohol", "spirits", "drinks", "cocktails", "lean cocktails", "smart sips", "mixed drinks", "mocktails", "mocktail ideas", "spirits hub", "alcohol hub", "drinks hub", "lifestyle drinks", "bar hub", "booze", "hard drinks"],
    subOptions: [
      {
        id: "LEAN_SOCIAL",
        label: "Alcohol Lean and Social",
        route: "/alcohol/lean-and-social",
        aliases: ["lean", "social", "lean and social", "lean alcohol", "lean drinks", "lean social", "low cal drinks", "diet drinks"]
      },
      {
        id: "MOCKTAILS",
        label: "Mocktails",
        route: "/mocktails-low-cal-mixers",
        aliases: ["mocktails", "alcohol-free", "non-alcoholic", "mocktail", "low cal mixers", "no alcohol drinks", "zero proof", "virgin drinks"]
      },
      {
        id: "MEAL_PAIRING",
        label: "Meal Pairing",
        route: "/meal-pairing-ai",
        aliases: ["meal pairing", "pairing", "pair meal", "pair my meal", "food pairing", "what to drink with", "pairing guide"]
      },
      {
        id: "WINE_PAIRING",
        label: "Wine Pairing",
        route: "/wine-pairing",
        aliases: ["wine", "wine pairing", "wines", "pair wine", "wine guide", "wine with dinner"]
      },
      {
        id: "BEER_PAIRING",
        label: "Beer Pairing",
        route: "/beer-pairing",
        aliases: ["beer", "beer pairing", "beers", "pair beer", "beer guide", "beer with dinner"]
      },
      {
        id: "BOURBON_PAIRING",
        label: "Bourbon Pairing",
        route: "/bourbon-spirits",
        aliases: ["bourbon", "spirits", "whiskey", "bourbon pairing", "bourbon guide", "whiskey pairing"]
      },
      {
        id: "ALCOHOL_LOG",
        label: "Alcohol Log",
        route: "/alcohol-log",
        aliases: ["log", "track alcohol", "alcohol log", "alcohol tracker", "alog", "drink log", "drinking log", "booze log"]
      },
      {
        id: "WEANING_OFF",
        label: "Weaning Off Tool",
        route: "/weaning-off-tool",
        aliases: ["weaning", "taper", "weaning off", "taper off", "wean", "cutting back", "quit drinking", "reduce alcohol"]
      }
    ]
  },

  SOCIAL_HUB: {
    id: "SOCIAL_HUB",
    legacyId: "social-hub",
    primaryRoute: "/social-hub",
    isHub: true,
    hubSize: "small",
    keywords: ["restaurant", "socializing", "eating out", "social meals", "restaurants", "out to eat", "social hub", "socializing hub", "going out", "night out", "social plans"],
    subOptions: [
      {
        id: "RESTAURANT_GUIDE",
        label: "Restaurant Guide",
        route: "/social-hub/restaurant-guide",
        aliases: ["restaurant guide", "guide", "restaurant", "eat out guide", "restaurant helper", "eat out", "ordering out", "restaurant menu help"]
      },
      {
        id: "FIND_MEALS",
        label: "Find Meals Near Me",
        route: "/social-hub/find",
        aliases: ["find meals", "near me", "find", "meals near me", "nearby food", "nearby meals", "nearby", "local meals"]
      }
    ]
  },

  KIDS_HUB: {
    id: "KIDS_HUB",
    legacyId: "kids-hub",
    primaryRoute: "/healthy-kids-meals",
    isHub: true,
    hubSize: "small",
    keywords: ["kids", "kids meals", "children", "healthy kids", "kids food", "children meals", "kids hub", "kids meals hub", "children hub", "kids section"],
    subOptions: [
      {
        id: "KIDS_MEALS",
        label: "Kids Meals",
        route: "/kids-meals",
        aliases: ["kids meals", "children meals", "kids", "meal picker", "big kids meals", "older kids", "school lunch"]
      },
      {
        id: "TODDLER_MEALS",
        label: "Toddler Meals",
        route: "/toddler-meals",
        aliases: ["toddler", "toddler meals", "toddlers", "little kids", "baby meals"]
      }
    ]
  },

  DIABETIC_HUB: {
    id: "DIABETIC_HUB",
    legacyId: "diabetic-hub",
    primaryRoute: "/diabetic-hub",
    isHub: true,
    hubSize: "small",
    keywords: ["diabetic", "diabetes", "blood sugar", "glucose", "sugar control", "diabetic meals", "diabetic hub", "diabetes hub", "diabetes support"],
    subOptions: [
      {
        id: "DIABETES_SUPPORT",
        label: "Diabetes Support",
        route: "/diabetic-hub",
        aliases: ["support", "diabetes support", "diabetic support", "hub"]
      },
      {
        id: "DIABETIC_BUILDER",
        label: "Diabetic Menu Builder",
        route: "/diabetic-menu-builder",
        aliases: ["builder", "menu builder", "diabetic builder", "meal builder", "diabetic meals", "diabetes meals", "d-build"]
      }
    ]
  },

  GLP1_HUB: {
    id: "GLP1_HUB",
    legacyId: "glp1-hub",
    primaryRoute: "/glp1-hub",
    isHub: true,
    hubSize: "small",
    keywords: ["glp", "glp-1", "glp1", "ozempic", "wegovy", "semaglutide", "injection", "glp one", "g l p one", "glp hub", "glp-1 hub", "weight loss meds"],
    subOptions: [
      {
        id: "GLP1_BUILDER",
        label: "GLP-1 Meal Builder",
        route: "/glp1-menu-builder",
        aliases: ["builder", "meal builder", "glp1 builder", "glp-1 builder", "menu builder", "glp one builder", "glp meal builder", "glp menu", "glp-1 meals", "glp-build"]
      }
    ]
  },

  SUPPLEMENT_HUB: {
    id: "SUPPLEMENT_HUB",
    legacyId: "supplement-hub",
    primaryRoute: "/supplement-hub", // Changed from /supplement-hub-landing (landing page hidden)
    isHub: true,
    hubSize: "small",
    keywords: ["supplements", "supplement hub", "vitamins", "nutrition supplements", "supplement"],
    subOptions: [
      {
        id: "SUPPLEMENT_BROWSE",
        label: "Supplement Hub",
        route: "/supplement-hub",
        aliases: ["browse", "hub", "products", "supplement hub", "supplements"]
      }
    ]
  }
};

/**
 * DIRECT PAGES (No Hub Routing)
 * Navigate directly to page when user says any keyword
 */
export const DIRECT_PAGES: Record<string, FeatureDefinition> = {
  FRIDGE_RESCUE: {
    id: "FRIDGE_RESCUE",
    legacyId: "fridge-rescue",
    primaryRoute: "/fridge-rescue",
    isHub: false,
    keywords: ["fridge rescue", "rescue", "use my fridge", "ingredients", "what can i make", "fridge", "pantry rescue", "pantry", "leftover helper", "use ingredients", "rescue mode"]
  },

  MACRO_CALCULATOR: {
    id: "MACRO_CALCULATOR",
    legacyId: "macro-calculator",
    primaryRoute: "/macro-counter",
    isHub: false,
    keywords: ["macros", "macro calculator", "protein calculator", "calorie calculator", "macro counter", "calculator", "macro setup", "macro goals", "macro tool", "calculate macros", "macro math", "macro calc"]
  },

  MY_BIOMETRICS: {
    id: "MY_BIOMETRICS",
    legacyId: "biometrics",
    primaryRoute: "/my-biometrics",
    isHub: false,
    keywords: ["biometrics", "diet numbers", "profile numbers", "my macros profile", "tracking", "weight", "my biometrics", "bio metrics", "body metrics", "weight tracking", "body data", "my stats", "track weight"]
  },

  SHOPPING_LIST: {
    id: "SHOPPING_LIST",
    legacyId: "shopping-list",
    primaryRoute: "/shopping-list-v2",
    isHub: false,
    keywords: ["shopping list", "groceries", "master list", "shopping planner", "grocery", "shopping", "master shopping", "master shopping list", "grocery list", "list master", "grocery planner", "shop list", "food list"]
  },

  WEEKLY_MEAL_BUILDER: {
    id: "WEEKLY_MEAL_BUILDER",
    legacyId: "weekly-meal-board",
    primaryRoute: "/weekly-meal-board",
    isHub: false,
    keywords: ["weekly board", "meal board", "weekly planner", "meal builder", "meal board builder", "weekly", "plan my week", "weekly meal board", "weekly meal builder", "week planner", "meal week", "weekly meals", "weekly plan"]
  },

  GET_INSPIRATION: {
    id: "GET_INSPIRATION",
    legacyId: "get-inspiration",
    primaryRoute: "/get-inspiration",
    isHub: false,
    keywords: ["inspiration", "ideas", "meal ideas", "meal inspiration", "get ideas", "inspire me", "food ideas", "recipe ideas", "cooking ideas", "browse meals"]
  },

  ANTI_INFLAMMATORY: {
    id: "ANTI_INFLAMMATORY",
    legacyId: "anti-inflammatory",
    primaryRoute: "/anti-inflammatory-menu-builder",
    isHub: false,
    keywords: ["anti-inflammatory", "inflammation", "healing meals", "anti inflammatory builder", "anti", "reduce inflammation", "inflammatory diet", "healing diet", "anti inflam"]
  },

  BEACH_BODY: {
    id: "BEACH_BODY",
    legacyId: "beach-body",
    primaryRoute: "/beach-body-meal-board",
    isHub: false,
    keywords: ["beach body", "hard body", "summer shred", "lean out", "competition", "shred", "get lean", "cut", "cutting", "beach prep", "physique", "stage prep"]
  },

  PLANNER: {
    id: "PLANNER",
    legacyId: "planner",
    primaryRoute: "/planner",
    isHub: false,
    keywords: ["planner", "meal planner", "planning board", "planner page", "main planner", "planner hub", "nutrition planner"]
  },

  LIFESTYLE: {
    id: "LIFESTYLE",
    legacyId: "lifestyle",
    primaryRoute: "/lifestyle",
    isHub: false,
    keywords: ["lifestyle", "main lifestyle page", "nutrition lifestyle", "lifestyle hub", "lifestyle page"]
  },

  PRO_CARE: {
    id: "PRO_CARE",
    legacyId: "pro-care",
    primaryRoute: "/procare-cover",
    isHub: false,
    keywords: ["pro care", "professional care", "doctor care", "procare", "medical care", "professional help", "doctor"]
  }
};

/**
 * Normalize query for keyword matching
 * Removes punctuation, extra whitespace, and lowercases
 */
function normalizeQuery(query: string): string {
  return query.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
}

/**
 * Find feature by keyword in canonical registry (fuzzy match)
 * Checks hubs first (hub-first routing), then direct pages
 * Uses bidirectional matching + token-level fallback for partial utterances
 */
export function findFeatureFromRegistry(query: string): FeatureDefinition | null {
  const normalized = normalizeQuery(query);
  const queryTokens = normalized.split(' ').filter(t => t.length > 2); // Tokens with 3+ chars

  // Helper: check if query matches keyword
  const matches = (keyword: string): boolean => {
    const normalizedKeyword = normalizeQuery(keyword);
    
    // Exact/substring match (bidirectional)
    if (normalized.includes(normalizedKeyword) || normalizedKeyword.includes(normalized)) {
      return true;
    }
    
    // Token-level matching for partial utterances
    const keywordTokens = normalizedKeyword.split(' ').filter(t => t.length > 2);
    return queryTokens.some(qToken => 
      keywordTokens.some(kToken => 
        qToken.includes(kToken) || kToken.includes(qToken)
      )
    );
  };

  // Check hubs first (hub-first routing)
  for (const hub of Object.values(HUBS)) {
    if (hub.keywords.some(matches)) {
      return hub;
    }
  }

  // Then check direct pages
  for (const page of Object.values(DIRECT_PAGES)) {
    if (page.keywords.some(matches)) {
      return page;
    }
  }

  return null;
}

/**
 * Find hub by ID
 */
export function findHubById(hubId: string): FeatureDefinition | null {
  return HUBS[hubId] || null;
}

/**
 * Find sub-option within a hub by alias
 */
export function findSubOptionByAlias(hub: FeatureDefinition, query: string): SubOption | null {
  if (!hub.subOptions) return null;

  const normalized = query.toLowerCase().trim();

  for (const option of hub.subOptions) {
    if (option.aliases.some(alias => normalized.includes(alias) || alias.includes(normalized))) {
      return option;
    }
  }

  return null;
}

/**
 * Get hub prompt message based on hub size
 */
export function getHubPromptMessage(hub: FeatureDefinition): string {
  if (!hub.isHub || !hub.subOptions) return "";

  if (hub.hubSize === "large") {
    // Large hubs: generic prompt
    return "Choose your page.";
  }

  // Small hubs: announce options
  if (hub.subOptions.length === 1) {
    return `Would you like to open the ${hub.subOptions[0].label}?`;
  }

  if (hub.subOptions.length === 2) {
    return `Do you want ${hub.subOptions[0].label} or ${hub.subOptions[1].label}?`;
  }

  // Fallback for 3+ options in small hub
  const optionNames = hub.subOptions.map(o => o.label).join(", ");
  return `Which option would you like? ${optionNames}`;
}
