
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
 * Required IDs in MacroCounter.tsx:
 *   - id="goal-card"
 *   - id="bodytype-card"
 *   - id="details-card"
 *   - id="calc-button"
 */

export default function MacroCalculatorGuidedTour() {
  const coachMode = localStorage.getItem("coachMode") === "guided";
  const [step, setStep] = useState<"goal" | "body" | "details" | "calc" | null>(
    coachMode ? "goal" : null
  );

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

  useEffect(() => {
    if (!coachMode) return;

    const next = (e: Event) => {
      const { step: finished } = (e as CustomEvent).detail;
      if (finished === "goal") setStep("body");
      if (finished === "body") setStep("details");
      if (finished === "details") setStep("calc");
      if (finished === "calc") setStep(null);
    };
    
    window.addEventListener("macro:nextStep", next as EventListener);
    return () => window.removeEventListener("macro:nextStep", next as EventListener);
  }, [coachMode]);

  if (!coachMode) return null;
  return null;
}
