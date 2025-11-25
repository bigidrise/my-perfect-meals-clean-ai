import { useEffect } from "react";
import { useSimpleWalkthrough } from "./SimpleWalkthroughContext";
import { SimpleStepOverlay } from "./SimpleStepOverlay";
import { registerSimpleWalkthroughStarter } from "./simpleWalkthroughHelper";

/**
 * SimpleWalkthroughManager
 * 
 * Manages the simple walkthrough overlay lifecycle.
 * Renders the overlay when a walkthrough is active.
 * Completely independent of voice/TTS systems.
 */
export function SimpleWalkthroughManager() {
  const { state, startWalkthrough, nextStep } = useSimpleWalkthrough();

  useEffect(() => {
    registerSimpleWalkthroughStarter(startWalkthrough);
  }, [startWalkthrough]);

  if (!state.isActive || !state.currentStep) {
    return null;
  }

  return (
    <SimpleStepOverlay
      selector={state.currentStep.selector}
      text={state.currentStep.text}
      showArrow={state.currentStep.showArrow}
      onTap={nextStep}
    />
  );
}
