export interface HubSubOption {
  id: string;
  label: string;
  route: string;
  aliases: string[];
}

export interface HubDefinition {
  id: string;
  route: string;
  label: string;
  options: HubSubOption[];
}

export const HUBS: Record<string, HubDefinition> = {
  CRAVING_HUB: {
    id: "CRAVING_HUB",
    route: "/craving-creator-landing",
    label: "Craving Creator Hub",
    options: [
      {
        id: "CRAVING_CREATOR",
        label: "Craving Creator",
        route: "/craving-creator",
        aliases: ["creator", "craving creator", "make a craving", "create"],
      },
      {
        id: "CRAVING_PREMADES",
        label: "Craving Premades",
        route: "/craving-presets",
        aliases: ["premades", "craving premade", "quick cravings", "presets"],
      },
    ],
  },

  SOCIAL_HUB: {
    id: "SOCIAL_HUB",
    route: "/social-hub",
    label: "Socializing Hub",
    options: [
      {
        id: "RESTAURANT_GUIDE",
        label: "Restaurant Guide",
        route: "/social-hub/restaurant-guide",
        aliases: ["restaurant", "restaurants", "guide", "restaurant guide", "dining"],
      },
      {
        id: "FIND_MEALS",
        label: "Find Meals Near Me",
        route: "/social-hub/find",
        aliases: ["find meals", "near me", "meals near me", "find", "search"],
      },
    ],
  },

  DIABETIC_HUB: {
    id: "DIABETIC_HUB",
    route: "/diabetic-hub",
    label: "Diabetic Hub",
    options: [
      {
        id: "DIABETIC_HUB_INFO",
        label: "Diabetic Hub Info",
        route: "/diabetic-hub",
        aliases: ["hub", "diabetic hub", "diabetes tools", "info"],
      },
      {
        id: "DIABETIC_BUILDER",
        label: "Diabetic Meal Builder",
        route: "/diabetic-menu-builder",
        aliases: ["builder", "diabetic builder", "meal builder", "menu builder"],
      },
    ],
  },

  GLP1_HUB: {
    id: "GLP1_HUB",
    route: "/glp1-hub",
    label: "GLP-1 Hub",
    options: [
      {
        id: "GLP1_HUB_INFO",
        label: "GLP-1 Hub Info",
        route: "/glp1-hub",
        aliases: ["hub", "glp hub", "ozempic hub", "wegovy hub", "info"],
      },
      {
        id: "GLP1_BUILDER",
        label: "GLP-1 Meal Builder",
        route: "/glp1-meal-builder",
        aliases: ["builder", "glp builder", "meal builder"],
      },
    ],
  },

  KIDS_MEALS_HUB: {
    id: "KIDS_MEALS_HUB",
    route: "/kids-meals",
    label: "Kids Meals Hub",
    options: [
      {
        id: "KIDS_MEALS",
        label: "Kids Meal Picker",
        route: "/kids-meals",
        aliases: ["kids meals", "kids picker", "children's meals", "picker"],
      },
      {
        id: "HEALTHY_KIDS_MEALS",
        label: "Healthy Kids Meals",
        route: "/healthy-kids-meals",
        aliases: ["healthy", "healthy kids meals", "healthy kids"],
      },
    ],
  },

  ALCOHOL_HUB: {
    id: "ALCOHOL_HUB",
    route: "/alcohol-hub",
    label: "Spirits & Lifestyle Hub",
    options: [
      {
        id: "LEAN_SOCIAL",
        label: "Alcohol Lean and Social",
        route: "/alcohol/lean-and-social",
        aliases: ["lean alcohol", "lean", "social", "lean and social"],
      },
      {
        id: "MOCKTAILS",
        label: "Mocktails",
        route: "/mocktails-low-cal-mixers",
        aliases: ["mocktails", "alcohol-free", "non-alcoholic", "mixers"],
      },
      {
        id: "MEAL_PAIRING",
        label: "Meal Pairing",
        route: "/meal-pairing-ai",
        aliases: ["meal pairing", "pairing", "pair meal"],
      },
      {
        id: "WINE_PAIRING",
        label: "Wine Pairing",
        route: "/wine-pairing",
        aliases: ["wine", "wine pairing", "wines"],
      },
      {
        id: "BEER_PAIRING",
        label: "Beer Pairing",
        route: "/beer-pairing",
        aliases: ["beer", "beer pairing", "beers"],
      },
      {
        id: "BOURBON_PAIRING",
        label: "Bourbon Pairing",
        route: "/bourbon-spirits",
        aliases: ["bourbon", "spirits", "whiskey"],
      },
      {
        id: "ALCOHOL_LOG",
        label: "Alcohol Log",
        route: "/alcohol-log",
        aliases: ["log", "track", "alcohol log"],
      },
      {
        id: "WEANING_OFF",
        label: "Weaning Off Tool",
        route: "/weaning-off-tool",
        aliases: ["weaning", "taper", "weaning off"],
      },
    ],
  },
};

export function findHubById(hubId: string): HubDefinition | null {
  return HUBS[hubId] || null;
}

export function findHubByRoute(route: string): HubDefinition | null {
  for (const hub of Object.values(HUBS)) {
    if (hub.route === route) {
      return hub;
    }
  }
  return null;
}

export function findSubOptionByAlias(
  hub: HubDefinition,
  query: string
): HubSubOption | null {
  const normalized = query.toLowerCase().trim();

  for (const option of hub.options) {
    for (const alias of option.aliases) {
      if (normalized.includes(alias.toLowerCase())) {
        return option;
      }
    }
  }

  return null;
}

export function getHubOptionsMessage(hub: HubDefinition): string {
  const optionLabels = hub.options.map((opt) => opt.label).join(" or ");
  return `You're on the ${hub.label}. You can choose: ${optionLabels}. Which one would you like?`;
}
