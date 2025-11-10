
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
  const [step, setStep] = useState<"goal" | "body" | "details" | "sync-weight" | "calc" | null>(
    coachMode ? "goal" : null
  );

  // Apply/remove lime flash to current step
  useEffect(() => {
    if (!coachMode || !step) return;
    
    const map = {
      goal: "goal-card",
      body: "bodytype-card",
      details: "details-card",
      "sync-weight": "sync-weight-button",
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
      else if (completedStep === "details") setStep("sync-weight");
      else if (completedStep === "sync-weight") setStep("calc");
      else if (completedStep === "calc") setStep(null);
    };
    
    window.addEventListener("macro:nextStep", handleNext as EventListener);
    return () => window.removeEventListener("macro:nextStep", handleNext as EventListener);
  }, [coachMode]);

  if (!coachMode) return null;
  return null;
}
