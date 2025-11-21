import { useEffect } from "react";
import {
  useCopilot,
  CopilotPersona,
  CopilotSuggestion,
  CopilotContextInfo,
} from "./CopilotContext";
import { buildBaseSuggestions } from "./packs/basePacks";

export type DayPhase = "morning" | "afternoon" | "evening" | "late-night";

export interface MacroSnapshot {
  calories?: number;
  targetCalories?: number;
  protein?: number;
  targetProtein?: number;
  carbs?: number;
  targetCarbs?: number;
  fats?: number;
  targetFats?: number;
}

export interface MealSignal {
  id: string;
  name: string;
  when?: "breakfast" | "lunch" | "dinner" | "snack";
  tags?: string[]; // e.g. ["high-carb", "fried", "no-veggies"]
  isDiabeticSafe?: boolean;
  isGlp1Friendly?: boolean;
}

export interface CopilotBrainProps {
  screenId: string;
  persona: CopilotPersona;
  tags?: string[];

  macroSnapshot?: MacroSnapshot;
  recentMeals?: MealSignal[];
  timeOfDay?: DayPhase;
  emotionFlags?: string[]; // e.g. ["stressed", "tired", "craving-sweet"]
}

const mergeSuggestions = (
  base: CopilotSuggestion[],
  dynamic: CopilotSuggestion[]
): CopilotSuggestion[] => {
  const seen = new Set<string>();
  const all: CopilotSuggestion[] = [];

  for (const s of [...dynamic, ...base]) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    all.push(s);
  }

  return all;
};

export const useCopilotBrain = (props: CopilotBrainProps) => {
  const { setContextInfo, setSuggestions } = useCopilot();

  const {
    screenId,
    persona,
    tags = [],
    macroSnapshot,
    recentMeals = [],
    timeOfDay,
    emotionFlags = [],
  } = props;

  // 1) Keep copilot context in sync with where the user is
  useEffect(() => {
    const next: Partial<CopilotContextInfo> = {
      screenId,
      persona,
      tags,
    };
    setContextInfo(next);
  }, [screenId, persona, JSON.stringify(tags), setContextInfo]);

  // 2) Build suggestions based on context + data
  useEffect(() => {
    const ctx: CopilotContextInfo = {
      screenId,
      persona,
      tags,
    };

    // Base, context-aware packs
    const base = buildBaseSuggestions(ctx);
    const dynamic: CopilotSuggestion[] = [];

    // === MACRO INTELLIGENCE ===
    if (macroSnapshot && macroSnapshot.targetProtein && macroSnapshot.protein !== undefined) {
      const ratio = macroSnapshot.protein / macroSnapshot.targetProtein;
      if (ratio < 0.75) {
        dynamic.push({
          id: "brain-protein-boost",
          label: "Boost protein in your next meal",
          description:
            "You’re running low on protein versus your target. Let’s add lean protein to your next meal.",
          badge: "Macros",
          emphasis: "high",
          action: { type: "run-command", id: "macros.boostProteinNextMeal" },
        });
      }
    }

    if (
      macroSnapshot &&
      macroSnapshot.targetCalories &&
      macroSnapshot.calories !== undefined
    ) {
      const calRatio = macroSnapshot.calories / macroSnapshot.targetCalories;
      if (calRatio > 1.1 && (timeOfDay === "evening" || timeOfDay === "late-night")) {
        dynamic.push({
          id: "brain-calorie-throttle",
          label: "Throttle dinner calories a bit",
          description:
            "You’re already above your daily calorie target. Let’s lighten dinner without feeling deprived.",
          badge: "Macros",
          emphasis: "medium",
          action: { type: "run-command", id: "macros.lightenDinner" },
        });
      }
    }

    // === RECENT MEAL PATTERNS ===
    const lastThree = recentMeals.slice(-3);
    const highCarbCount = lastThree.filter((m) =>
      (m.tags ?? []).some((t) => t === "high-carb" || t === "refined-carb")
    ).length;
    const noVegCount = lastThree.filter((m) =>
      (m.tags ?? []).includes("no-veggies")
    ).length;
    const heavyFatCount = lastThree.filter((m) =>
      (m.tags ?? []).some((t) => t === "fried" || t === "heavy-fat")
    ).length;

    if (highCarbCount >= 2 && persona === "diabetic") {
      dynamic.push({
        id: "brain-diabetic-carb-balance",
        label: "Balance carbs for better blood sugar",
        description:
          "Your last few meals were carb heavy. Let’s build a lower-carb, fiber-rich option next.",
        badge: "Diabetic",
        emphasis: "high",
        action: { type: "run-command", id: "diabetic.balanceNextMealCarbs" },
      });
    }

    if (noVegCount >= 2) {
      dynamic.push({
        id: "brain-add-veggies",
        label: "Add veggies without changing flavor",
        description:
          "You’ve had a few veggie-light meals. I can layer in vegetables without ruining your favorite flavors.",
        badge: "Fiber",
        emphasis: "medium",
        action: { type: "run-command", id: "meals.addHiddenVeggies" },
      });
    }

    if (persona === "glp1" && heavyFatCount >= 1) {
      dynamic.push({
        id: "brain-glp1-comfort",
        label: "GLP-1 friendly comfort swap",
        description:
          "You picked some heavier fats. I can swap to a nausea-friendly version of this same vibe.",
        badge: "GLP-1",
        emphasis: "high",
        action: { type: "run-command", id: "glp1.makeComfortSwap" },
      });
    }

    // === EMOTION / CRAVING SIGNALS ===
    const isStressed = emotionFlags.includes("stressed");
    const isTired = emotionFlags.includes("tired");
    const cravingSweet = emotionFlags.includes("craving-sweet");
    const cravingSavory = emotionFlags.includes("craving-savory");

    if (isStressed || isTired) {
      dynamic.push({
        id: "brain-stress-simplify",
        label: "Simplify tonight with a low-effort plan",
        description:
          "You flagged stress or fatigue. I’ll keep this to one-pan, low-dish, low-decision meals.",
        badge: "Emotion AI",
        emphasis: "high",
        action: { type: "run-command", id: "emotion.simplifyTonight" },
      });
    }

    if (cravingSweet) {
      dynamic.push({
        id: "brain-craving-sweet",
        label: "Give me a sweet-but-safe option",
        description:
          "You’re craving sweet. I’ll keep it macro-friendly and aligned with your plan.",
        badge: "Cravings",
        emphasis: "medium",
        action: { type: "run-command", id: "cravings.sweetSafeOption" },
      });
    }

    if (cravingSavory) {
      dynamic.push({
        id:
