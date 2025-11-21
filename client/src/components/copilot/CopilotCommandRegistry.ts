import { CopilotAction } from "./CopilotContext";
import { boostProteinNextMeal, generateOnePanFridgeRescue } from "@/lib/copilotActions";

type CommandHandler = () => Promise<void>;
type NavigationHandler = (path: string) => void;
type ModalHandler = (modalId: string) => void;

let navigationCallback: NavigationHandler | null = null;
let modalCallback: ModalHandler | null = null;

export function setNavigationHandler(fn: NavigationHandler) {
  navigationCallback = fn;
}

export function setModalHandler(fn: ModalHandler) {
  modalCallback = fn;
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
};

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
        console.log("🤖 AI Query:", action.payload);
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
