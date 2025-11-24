import { walkthroughEngine } from "../walkthrough/WalkthroughScriptEngine";
import { getScript, hasScript } from "../walkthrough/ScriptRegistry";

/**
 * Phase C.1: Launch a guided walkthrough using the Script Engine
 * This is the new command that uses the WalkthroughScriptEngine
 */
export async function launchWalkthrough(scriptId: string): Promise<void> {
  console.log(`[launchWalkthrough] Attempting to start: ${scriptId}`);
  
  if (!hasScript(scriptId)) {
    console.error(`[launchWalkthrough] Script not found: ${scriptId}`);
    return;
  }

  const script = getScript(scriptId);
  if (!script) {
    console.error(`[launchWalkthrough] Failed to get script: ${scriptId}`);
    return;
  }

  // Cancel any active walkthrough before starting a new one
  const currentState = walkthroughEngine.getState();
  if (currentState.isActive) {
    console.log(`[launchWalkthrough] Canceling active walkthrough: ${currentState.scriptId}`);
    walkthroughEngine.cancel();
    
    // Wait for engine to reach idle state
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await walkthroughEngine.start(script);
  console.log(`[launchWalkthrough] Started: ${script.title}`);
}

/**
 * Export for use in CopilotCommandRegistry
 */
export default launchWalkthrough;
