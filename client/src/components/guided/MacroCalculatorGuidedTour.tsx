
import { useEffect, useState } from "react";

/**
 * Macro Calculator Guided Tour
 * 
 * Guides users through the macro calculator workflow in sequence:
 * 1. Choose Goal
 * 2. Select Body Type
 * 3. Fill in Details (Activity Level)
 * 4. Calculate Macros
 * 
 * Each step automatically highlights and advances when completed.
 */

export default function MacroCalculatorGuidedTour() {
  const coachMode = localStorage.getItem("coachMode") === "guided";
  const [step, setStep] = useState<"goal" | "body" | "activity" | "calc" | null>(() => {
    if (!coachMode) return null;
    return "goal";
  });

  // Apply lime green flash to current step
  useEffect(() => {
    if (!coachMode || !step) return;
    
    const map = {
      goal: "goal-card",
      body: "bodytype-card",
      activity: "details-card",
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

  // Watch for user interactions to advance steps
  useEffect(() => {
    if (!coachMode || !step) return;

    // Goal selection - watch for radio change
    if (step === "goal") {
      const goalRadios = document.querySelectorAll('[name="goal"]');
      const handleGoalSelect = () => {
        setTimeout(() => setStep("body"), 500);
      };
      goalRadios.forEach(radio => radio.addEventListener("change", handleGoalSelect));
      return () => {
        goalRadios.forEach(radio => radio.removeEventListener("change", handleGoalSelect));
      };
    }

    // Body type selection
    if (step === "body") {
      const bodyRadios = document.querySelectorAll('[name="bodyType"]');
      const handleBodySelect = () => {
        setTimeout(() => setStep("activity"), 500);
      };
      bodyRadios.forEach(radio => radio.addEventListener("change", handleBodySelect));
      return () => {
        bodyRadios.forEach(radio => radio.removeEventListener("change", handleBodySelect));
      };
    }

    // Activity level selection
    if (step === "activity") {
      const activityRadios = document.querySelectorAll('[name="activity"]');
      const handleActivitySelect = () => {
        setTimeout(() => setStep("calc"), 500);
      };
      activityRadios.forEach(radio => radio.addEventListener("change", handleActivitySelect));
      return () => {
        activityRadios.forEach(radio => radio.removeEventListener("change", handleActivitySelect));
      };
    }

    // Calculate button
    if (step === "calc") {
      const calcButton = document.getElementById("calc-button");
      const handleCalc = () => {
        setStep(null);
        localStorage.removeItem("macro:currentStep");
      };
      if (calcButton) {
        calcButton.addEventListener("click", handleCalc);
        return () => calcButton.removeEventListener("click", handleCalc);
      }
    }
  }, [step, coachMode]);

  if (!coachMode) return null;
  return null;
}
