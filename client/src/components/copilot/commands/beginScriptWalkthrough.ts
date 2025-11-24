import { walkthroughEngine } from "../walkthrough/WalkthroughScriptEngine";
import { getScript, hasScript } from "../walkthrough/ScriptRegistry";
import type { KnowledgeResponse } from "../CopilotContext";

/**
 * Phase C.1: Begin a script-based walkthrough
 * Returns both engine start status AND a KnowledgeResponse for CopilotContext
 */
export async function beginScriptWalkthrough(
  scriptId: string
): Promise<{ success: boolean; response: KnowledgeResponse }> {
  console.log(`[beginScriptWalkthrough] Starting: ${scriptId}`);

  // Check if script exists
  if (!hasScript(scriptId)) {
    console.error(`[beginScriptWalkthrough] Script not found: ${scriptId}`);
    return {
      success: false,
      response: {
        title: "Walkthrough Not Available",
        description: "This feature doesn't have a guided walkthrough yet.",
        type: "knowledge",
      },
    };
  }

  const script = getScript(scriptId);
  if (!script) {
    console.error(`[beginScriptWalkthrough] Failed to get script: ${scriptId}`);
    return {
      success: false,
      response: {
        title: "Error",
        description: "Could not load walkthrough script.",
        type: "knowledge",
      },
    };
  }

  // Cancel any active walkthrough and wait for idle state
  const currentState = walkthroughEngine.getState();
  if (currentState.isActive) {
    console.log(
      `[beginScriptWalkthrough] Canceling active walkthrough: ${currentState.scriptId}`
    );
    walkthroughEngine.cancel();

    // Wait for engine to reach idle state
    let attempts = 0;
    while (walkthroughEngine.getState().isActive && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      attempts++;
    }

    if (walkthroughEngine.getState().isActive) {
      console.error(
        "[beginScriptWalkthrough] Engine failed to reach idle state"
      );
      return {
        success: false,
        response: {
          title: "Error",
          description: "Could not start walkthrough. Please try again.",
          type: "knowledge",
        },
      };
    }
  }

  // Start the walkthrough engine
  try {
    await walkthroughEngine.start(script);

    // Build KnowledgeResponse from script metadata
    const response: KnowledgeResponse = {
      title: script.title,
      description: "Follow these steps to learn this feature.",
      type: "walkthrough",
      steps: script.steps.map((step) => ({
        text: step.description,
        targetId: step.target,
      })),
      spokenText: script.steps[0]?.speak || script.steps[0]?.description,
    };

    console.log(`[beginScriptWalkthrough] Started successfully: ${script.title}`);
    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("[beginScriptWalkthrough] Failed to start engine:", error);
    return {
      success: false,
      response: {
        title: "Error",
        description: "Failed to start walkthrough. Please try again.",
        type: "knowledge",
      },
    };
  }
}

export default beginScriptWalkthrough;
