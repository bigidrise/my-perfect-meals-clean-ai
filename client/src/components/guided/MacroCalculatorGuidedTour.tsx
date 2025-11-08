
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
  const [step, setStep] = useState<"goal" | "body" | "details" | "calc" | null>(
    coachMode ? "goal" : null
  );

  // Apply/remove orange flash to current step and add pointing finger
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
      
      // Add pointing finger next to the element
      const finger = document.createElement("div");
      finger.id = `tour-finger-${step}`;
      finger.innerHTML = "👉";
      finger.style.cssText = "position: fixed; font-size: 2.5rem; z-index: 60; animation: bounce 1s infinite; pointer-events: none;";
      const rect = el.getBoundingClientRect();
      finger.style.top = `${rect.top + window.scrollY + 10}px`;
      finger.style.left = `${rect.left + window.scrollX - 60}px`;
      document.body.appendChild(finger);
    }
    
    return () => {
      if (el) {
        el.classList.remove("flash-border");
        const existingFinger = document.getElementById(`tour-finger-${step}`);
        if (existingFinger) existingFinger.remove();
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
      else if (completedStep === "details") setStep("calc");
      else if (completedStep === "calc") setStep(null);
    };
    
    window.addEventListener("macro:nextStep", handleNext as EventListener);
    return () => window.removeEventListener("macro:nextStep", handleNext as EventListener);
  }, [coachMode]);

  if (!coachMode) return null;
  return null;
}
