import { CopilotAction, KnowledgeResponse } from "./CopilotContext";
import { boostProteinNextMeal, generateOnePanFridgeRescue } from "@/lib/copilotActions";
import { explainFeature } from "./commands/explainFeature";
import { startWalkthrough } from "./commands/startWalkthrough";
import { interpretFoodCommand } from "./NLEngine";

type CommandHandler = (payload?: any) => Promise<void>;
type NavigationHandler = (path: string) => void;
type ModalHandler = (modalId: string) => void;
type ResponseHandler = (response: KnowledgeResponse | null) => void;

let navigationCallback: NavigationHandler | null = null;
let modalCallback: ModalHandler | null = null;
let responseCallback: ResponseHandler | null = null;

export function setNavigationHandler(fn: NavigationHandler) {
  navigationCallback = fn;
}

export function setModalHandler(fn: ModalHandler) {
  modalCallback = fn;
}

export function setResponseHandler(fn: ResponseHandler) {
  responseCallback = fn;
}

const Commands: Record<string, CommandHandler> = {
  "macros.boostProteinNextMeal": async () => {
    if (!navigationCallback) {
      console.warn("⚠️ Navigation not available");
      return;
    }
    await boostProteinNextMeal(navigationCallback);
  },

  "macros.lightenDinner": async () => {
    console.log("➡️ Executing: macros.lightenDinner");
  },

  "diabetic.lowerCarb": async () => {
    console.log("➡️ Executing: diabetic.lowerCarb");
  },

  "diabetic.balanceDay": async () => {
    console.log("➡️ Executing: diabetic.balanceDay");
  },

  "diabetic.balanceNextMealCarbs": async () => {
    console.log("➡️ Executing: diabetic.balanceNextMealCarbs");
  },

  "glp1.volumeBoost": async () => {
    console.log("➡️ Executing: glp1.volumeBoost");
  },

  "glp1.comfort": async () => {
    console.log("➡️ Executing: glp1.comfort");
  },

  "glp1.makeComfortSwap": async () => {
    console.log("➡️ Executing: glp1.makeComfortSwap");
  },

  "cravings.sweetSafeOption": async () => {
    console.log("➡️ Executing: cravings.sweetSafeOption");
  },

  "cravings.savoryComfort": async () => {
    console.log("➡️ Executing: cravings.savoryComfort");
  },

  "night.buildGuardrailSnack": async () => {
    console.log("➡️ Executing: night.buildGuardrailSnack");
  },

  "board.fillEmpty": async () => {
    console.log("➡️ Executing: board.fillEmpty");
  },

  "board.batchPlan": async () => {
    console.log("➡️ Executing: board.batchPlan");
  },

  "onePan.rotation": async () => {
    console.log("➡️ Executing: onePan.rotation");
  },

  "fridge.onePanDinner": async () => {
    if (!navigationCallback) {
      console.warn("⚠️ Navigation not available");
      return;
    }
    
    const userId = localStorage.getItem("userId") || "1";
    const fridgeItems: string[] = [];
    
    await generateOnePanFridgeRescue(userId, fridgeItems, navigationCallback);
  },

  "fridge.suggestAdds": async () => {
    console.log("➡️ Executing: fridge.suggestAdds");
  },

  "shopping.addFromMeal": async () => {
    console.log("➡️ Executing: shopping.addFromMeal");
  },

  "emotion.simplifyTonight": async () => {
    console.log("➡️ Executing: emotion.simplifyTonight");
  },

  "meals.addHiddenVeggies": async () => {
    console.log("➡️ Executing: meals.addHiddenVeggies");
  },

  "explain.fridge-rescue": async () => {
    if (!responseCallback) {
      console.warn("⚠️ Response handler not available");
      return;
    }
    const response = await explainFeature("fridge-rescue");
    responseCallback(response);
  },

  "explain.weekly-board": async () => {
    if (!responseCallback) {
      console.warn("⚠️ Response handler not available");
      return;
    }
    const response = await explainFeature("weekly-board");
    responseCallback(response);
  },

  "explain.subscriptions": async () => {
    if (!responseCallback) {
      console.warn("⚠️ Response handler not available");
      return;
    }
    const response = await explainFeature("subscriptions");
    responseCallback(response);
  },

  "explain.ai-meal-builder": async () => {
    if (!responseCallback) {
      console.warn("⚠️ Response handler not available");
      return;
    }
    const response = await explainFeature("ai-meal-builder");
    responseCallback(response);
  },

  "explain.shopping-list": async () => {
    if (!responseCallback) {
      console.warn("⚠️ Response handler not available");
      return;
    }
    const response = await explainFeature("shopping-list");
    responseCallback(response);
  },

  "walkthrough.start.fridge-rescue": async () => {
    if (!responseCallback) {
      console.warn("⚠️ Response handler not available");
      return;
    }
    const response = startWalkthrough("fridge-rescue");
    responseCallback(response);
  },

  "walkthrough.start.weekly-board": async () => {
    if (!responseCallback) {
      console.warn("⚠️ Response handler not available");
      return;
    }
    const response = startWalkthrough("weekly-board");
    responseCallback(response);
  },

  // =========================================
  // FOOD COMMAND HANDLERS (NLEngine)
  // =========================================

  "meal.addIngredient": async (payload?: { ingredient: string }) => {
    if (!responseCallback) return;
    const ingredient = payload?.ingredient || "ingredient";
    responseCallback({
      title: "Ingredient Added",
      description: `${ingredient} added to your meal.`,
      spokenText: `${ingredient} added to your meal.`,
    });
  },

  "meal.swapIngredient": async (payload?: { from: string; to: string }) => {
    if (!responseCallback) return;
    const from = payload?.from || "ingredient";
    const to = payload?.to || "alternative";
    responseCallback({
      title: "Ingredient Swapped",
      description: `Replaced ${from} with ${to}.`,
      spokenText: `Replaced ${from} with ${to}.`,
    });
  },

  "meals.generateOnePan": async (payload?: { text: string }) => {
    if (!responseCallback) return;
    responseCallback({
      title: "One-Pan Dinner",
      description: "Generating a one-pan dinner idea based on your request...",
      spokenText: "Generating a one-pan dinner idea...",
    });
  },

  "macros.highProteinSuggestion": async () => {
    if (!responseCallback) return;
    responseCallback({
      title: "High Protein Meal",
      description: "Here's a high-protein meal idea tailored to your macros.",
      spokenText: "Here's a high protein meal idea.",
    });
  },

  "macros.lowerCarbSwap": async () => {
    if (!responseCallback) return;
    responseCallback({
      title: "Lower Carb Swap",
      description: "Creating a lower-carb version of this meal.",
      spokenText: "Creating a lower carb version.",
    });
  },

  "fridge.generate": async (payload?: { text: string }) => {
    if (!responseCallback) return;
    responseCallback({
      title: "Fridge Rescue",
      description: "Generating a Fridge Rescue recipe with what you have...",
      spokenText: "Generating a Fridge Rescue recipe.",
    });
  },

  "weekly.autofill": async () => {
    if (!responseCallback) return;
    responseCallback({
      title: "Weekly Board Autofill",
      description: "Planning your week with smart meal choices...",
      spokenText: "Planning your week now.",
    });
  },
};

// Voice query handler - processes voice transcripts using NLEngine
async function handleVoiceQuery(transcript: string) {
  console.log(`🎤 Processing voice query: "${transcript}"`);

  const lower = transcript.toLowerCase();

  // ===================================
  // WALKTHROUGHS (keyword-based)
  // ===================================
  if (lower.includes("how do i use fridge rescue") || 
      lower.includes("teach me fridge rescue") ||
      lower.includes("show me fridge rescue")) {
    await Commands["walkthrough.start.fridge-rescue"]();
    return;
  }

  if (lower.includes("how do i use weekly") || 
      lower.includes("teach me weekly") ||
      lower.includes("show me weekly board")) {
    await Commands["walkthrough.start.weekly-board"]();
    return;
  }

  // ===================================
  // FEATURE EXPLANATIONS (keyword-based)
  // ===================================
  if (lower.includes("what is fridge rescue") || 
      lower.includes("explain fridge rescue")) {
    await Commands["explain.fridge-rescue"]();
    return;
  }

  if (lower.includes("what is weekly board") || 
      lower.includes("what is the weekly board") ||
      lower.includes("explain weekly board")) {
    await Commands["explain.weekly-board"]();
    return;
  }

  if (lower.includes("what is the meal builder") ||
      lower.includes("what is meal builder") ||
      lower.includes("explain meal builder")) {
    await Commands["explain.ai-meal-builder"]();
    return;
  }

  if (lower.includes("what is shopping list") ||
      lower.includes("explain shopping list")) {
    await Commands["explain.shopping-list"]();
    return;
  }

  if (lower.includes("what are subscriptions") ||
      lower.includes("explain subscriptions")) {
    await Commands["explain.subscriptions"]();
    return;
  }

  // ===================================
  // FOOD COMMANDS (NLEngine-based)
  // ===================================
  const nlResult = interpretFoodCommand(transcript);

  if (nlResult.action !== "unknown" && Commands[nlResult.action]) {
    console.log(`🎯 NLEngine mapped to: ${nlResult.action}`);
    await Commands[nlResult.action](nlResult.payload);
  } else {
    // Fallback response for unrecognized commands
    if (responseCallback) {
      responseCallback({
        title: "I heard you",
        description: nlResult.spokenText,
        spokenText: nlResult.spokenText,
      });
    }
  }
}

export async function executeCommand(action: CopilotAction) {
  try {
    switch (action.type) {
      case "run-command": {
        const fn = Commands[action.id];
        if (!fn) {
          console.error(`❌ Unknown copilot command: ${action.id}`);
          throw new Error(`Unknown command: ${action.id}`);
        }
        console.log(`🔥 Executing command: ${action.id}`);
        await fn();
        console.log(`✅ Command completed: ${action.id}`);
        break;
      }

      case "navigate": {
        if (!action.to) {
          throw new Error("Navigate action missing 'to' property");
        }
        if (navigationCallback) {
          console.log(`🧭 Navigating to: ${action.to}`);
          navigationCallback(action.to);
        } else {
          console.warn("⚠️ Navigation handler not set. Call setNavigationHandler()");
        }
        break;
      }

      case "open-modal": {
        if (!action.id) {
          throw new Error("Modal action missing 'id' property");
        }
        if (modalCallback) {
          console.log(`🪟 Opening modal: ${action.id}`);
          modalCallback(action.id);
        } else {
          console.warn("⚠️ Modal handler not set. Call setModalHandler()");
        }
        break;
      }

      case "custom": {
        const payload = action.payload as any;
        if (payload?.voiceQuery) {
          await handleVoiceQuery(payload.voiceQuery);
        } else {
          console.log("🤖 AI Query:", action.payload);
        }
        break;
      }

      default: {
        const _exhaustive: never = action;
        throw new Error(`Unhandled action type: ${JSON.stringify(_exhaustive)}`);
      }
    }
  } catch (error) {
    console.error("❌ Command execution failed:", error);
    throw error;
  }
}
