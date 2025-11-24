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

  await walkthroughEngine.start(script);
  console.log(`[launchWalkthrough] Started: ${script.title}`);
}

/**
 * Export for use in CopilotCommandRegistry
 */
export default launchWalkthrough;
