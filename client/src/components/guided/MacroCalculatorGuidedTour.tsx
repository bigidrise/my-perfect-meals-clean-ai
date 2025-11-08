
import { useEffect, useState } from "react";

/**
 * Macro Calculator Guided Tour
 * 
 * Guides users through the macro calculator workflow in sequence:
 * 1. Choose Goal
 * 2. Select Body Type
 * 3. Fill in Details
 * 4. Calculate Macros
 * 
 * Each step automatically advances to the next when completed.
 */

export default function MacroCalculatorGuidedTour() {
  const coachMode = localStorage.getItem("coachMode") === "guided";
  const [step, setStep] = useState<"goal" | "body" | "details" | "calc" | null>(() => {
    if (!coachMode) return null;
    // Hydrate from localStorage to maintain state across reloads
    const saved = localStorage.getItem("macro:currentStep") as "goal" | "body" | "details" | "calc" | null;
    return saved || "goal";
  });

  // Share current step via localStorage so MacroCounter can show fingers
  useEffect(() => {
    if (coachMode && step) {
      localStorage.setItem("macro:currentStep", step);
    } else {
      localStorage.removeItem("macro:currentStep");
    }
  }, [step, coachMode]);

  // Apply/remove orange flash to current step
  useEffect(() => {
    if (!coachMode || !step) return;
    
    const map = {
      goal: "goal-card",
      body: "bodytype-card",
      details: "details-card",
      calc: "calc-button",
    } as const;

    const el = document.getElementById(map[step]);
    if (el) {
      el.classList.add("flash-border");
    }
    
    return () => {
      if (el) {
        el.classList.remove("flash-border");
      }
    };
  }, [step, coachMode]);

  // Listen for completion events and advance to next step
  useEffect(() => {
    if (!coachMode) return;

    const handleNext = (e: Event) => {
      const { step: completedStep } = (e as CustomEvent).detail;
      
      if (completedStep === "goal") setStep("body");
      else if (completedStep === "body-type") setStep("details");
      else if (completedStep === "activity") setStep("calc");
      else if (completedStep === "calc") setStep(null);
    };
    
    window.addEventListener("macro:nextStep", handleNext as EventListener);
    return () => window.removeEventListener("macro:nextStep", handleNext as EventListener);
  }, [coachMode]);

  if (!coachMode) return null;
  return null;
}
