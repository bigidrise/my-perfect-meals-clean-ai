import React, { createContext, useContext, useState, useCallback } from "react";

interface SimpleStep {
  selector: string;
  text?: string;
  showArrow?: boolean;
}

interface SimpleScript {
  id: string;
  steps: SimpleStep[];
}

interface SimpleWalkthroughState {
  activeScript: string | null;
  currentStepIndex: number;
  currentStep: SimpleStep | null;
  isActive: boolean;
}

interface SimpleWalkthroughContextValue {
  state: SimpleWalkthroughState;
  startWalkthrough: (scriptId: string, steps: SimpleStep[]) => void;
  nextStep: () => void;
  skipWalkthrough: () => void;
  cancelWalkthrough: () => void;
}

const SimpleWalkthroughContext = createContext<SimpleWalkthroughContextValue | null>(null);

export function SimpleWalkthroughProvider({ children }: { children: React.ReactNode }) {
  const [activeScript, setActiveScript] = useState<string | null>(null);
  const [steps, setSteps] = useState<SimpleStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const state: SimpleWalkthroughState = {
    activeScript,
    currentStepIndex,
    currentStep: steps[currentStepIndex] || null,
    isActive: activeScript !== null && currentStepIndex < steps.length,
  };

  const startWalkthrough = useCallback((scriptId: string, scriptSteps: SimpleStep[]) => {
    console.log("[SimpleWalkthrough] Starting:", scriptId, "with", scriptSteps.length, "steps");
    setActiveScript(scriptId);
    setSteps(scriptSteps);
    setCurrentStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    console.log("[SimpleWalkthrough] Next step:", currentStepIndex + 1);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      console.log("[SimpleWalkthrough] Completed");
      setActiveScript(null);
      setSteps([]);
      setCurrentStepIndex(0);
    }
  }, [currentStepIndex, steps.length]);

  const skipWalkthrough = useCallback(() => {
    console.log("[SimpleWalkthrough] Skipped");
    setActiveScript(null);
    setSteps([]);
    setCurrentStepIndex(0);
  }, []);

  const cancelWalkthrough = useCallback(() => {
    console.log("[SimpleWalkthrough] Cancelled");
    setActiveScript(null);
    setSteps([]);
    setCurrentStepIndex(0);
  }, []);

  return (
    <SimpleWalkthroughContext.Provider
      value={{
        state,
        startWalkthrough,
        nextStep,
        skipWalkthrough,
        cancelWalkthrough,
      }}
    >
      {children}
    </SimpleWalkthroughContext.Provider>
  );
}

export function useSimpleWalkthrough() {
  const context = useContext(SimpleWalkthroughContext);
  if (!context) {
    throw new Error("useSimpleWalkthrough must be used within SimpleWalkthroughProvider");
  }
  return context;
}
