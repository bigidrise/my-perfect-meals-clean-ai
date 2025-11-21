import { CopilotAction, KnowledgeResponse } from "./CopilotContext";
import { boostProteinNextMeal, generateOnePanFridgeRescue } from "@/lib/copilotActions";
import { explainFeature } from "./commands/explainFeature";
import { startWalkthrough } from "./commands/startWalkthrough";

type CommandHandler = () => Promise<void>;
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
};

// Voice command interpreter - maps spoken text to Copilot commands
function interpretVoiceCommand(text: string): string | null {
  const lower = text.toLowerCase();

  // Walkthrough intents
  if (lower.includes("how do i use fridge rescue") || 
      lower.includes("teach me fridge rescue") ||
      lower.includes("show me fridge rescue")) {
    return "walkthrough.start.fridge-rescue";
  }

  if (lower.includes("how do i use weekly") || 
      lower.includes("teach me weekly") ||
      lower.includes("plan my week") ||
      lower.includes("show me weekly board")) {
    return "walkthrough.start.weekly-board";
  }

  // Feature explanations
  if (lower.includes("what is fridge rescue") || 
      lower.includes("explain fridge rescue")) {
    return "explain.fridge-rescue";
  }

  if (lower.includes("what is weekly board") || 
      lower.includes("what is the weekly board") ||
      lower.includes("explain weekly board")) {
    return "explain.weekly-board";
  }

  if (lower.includes("what is the meal builder") ||
      lower.includes("what is meal builder") ||
      lower.includes("explain meal builder")) {
    return "explain.ai-meal-builder";
  }

  if (lower.includes("what is shopping list") ||
      lower.includes("explain shopping list")) {
    return "explain.shopping-list";
  }

  if (lower.includes("what are subscriptions") ||
      lower.includes("explain subscriptions")) {
    return "explain.subscriptions";
  }

  // Actions
  if (lower.includes("boost my protein") ||
      lower.includes("increase protein") ||
      lower.includes("more protein")) {
    return "macros.boostProteinNextMeal";
  }

  if (lower.includes("fridge dinner") ||
      lower.includes("one pan dinner") ||
      lower.includes("make dinner from fridge")) {
    return "fridge.onePanDinner";
  }

  return null;
}

// Voice query handler - processes voice transcripts
async function handleVoiceQuery(transcript: string) {
  console.log(`🎤 Processing voice query: "${transcript}"`);

  const commandId = interpretVoiceCommand(transcript);

  if (commandId && Commands[commandId]) {
    console.log(`🎯 Mapped to command: ${commandId}`);
    await Commands[commandId]();
  } else {
    // Fallback response for unrecognized commands
    if (responseCallback) {
      responseCallback({
        title: "I heard you",
        description: `You said: "${transcript}". I'm still learning how to respond to this command.`,
        spokenText: `You said "${transcript}". I'm still learning this command.`,
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
