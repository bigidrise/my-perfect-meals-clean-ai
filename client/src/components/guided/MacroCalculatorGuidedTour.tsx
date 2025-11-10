
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
 * 
 * Uses localStorage polling since React RadioGroup doesn't emit DOM events.
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

  // Poll localStorage for changes (since React components don't emit DOM events)
  useEffect(() => {
    if (!coachMode || !step) return;

    const interval = setInterval(() => {
      try {
        const settings = JSON.parse(localStorage.getItem("macro-settings") || "{}");
        
        // Check if current step is complete and advance
        if (step === "goal" && settings.goal) {
          setStep("body");
        } else if (step === "body" && settings.bodyType) {
          setStep("activity");
        } else if (step === "activity" && settings.activity) {
          setStep("calc");
        }
      } catch (e) {
        // Ignore parse errors
      }
    }, 200); // Poll every 200ms

    return () => clearInterval(interval);
  }, [step, coachMode]);

  // Listen for calc button click
  useEffect(() => {
    if (!coachMode || step !== "calc") return;

    const calcButton = document.getElementById("calc-button");
    const handleCalc = () => {
      setStep(null);
    };
    
    if (calcButton) {
      calcButton.addEventListener("click", handleCalc);
      return () => calcButton.removeEventListener("click", handleCalc);
    }
  }, [step, coachMode]);

  if (!coachMode) return null;
  return null;
}
