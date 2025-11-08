
import { useEffect, useState } from "react";

/**
 * Meal Builder Guided Tour
 *
 * Adds flashing highlight to the first "Create AI Meal" button.
 * When the picker drawer opens, shows an overlay explaining how to use it.
 * Sequentially flashes Protein → Carbs → Fats → Done buttons.
 */

export default function MealBuilderGuidedTour() {
  const coachMode = localStorage.getItem("coachMode") === "guided";
  const [pickerOpen, setPickerOpen] = useState(false);
  const [step, setStep] = useState<"ai" | "protein" | "carb" | "fat" | "done" | null>(
    coachMode ? "ai" : null
  );
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!coachMode) return;

    // Detect if picker drawer is opened
    const observer = new MutationObserver(() => {
      const picker = document.getElementById("meal-picker-drawer");
      if (picker && picker.classList.contains("open")) {
        setPickerOpen(true);
        setStep("protein");
      } else {
        setPickerOpen(false);
      }
    });

    observer.observe(document.body, { subtree: true, attributes: true });
    return () => observer.disconnect();
  }, [coachMode]);

  // advance steps manually from UI
  const nextStep = () => {
    if (step === "protein") return setStep("carb");
    if (step === "carb") return setStep("fat");
    if (step === "fat") return setStep("done");
    if (step === "done") return setStep(null);
  };

  if (!coachMode) return null;

  return (
    <>
      {/* Flashing Create AI Meal (when board first opens) */}
      {step === "ai" && (
        <div className="absolute top-2 left-2 z-[40] flex items-center gap-2">
          <span className="text-3xl animate-bounce">👉</span>
          <button
            onClick={() => setStep("protein")}
            className="bg-emerald-600/90 border border-emerald-300/40 text-white rounded-lg px-4 py-2 flash-green"
          >
            Create AI Meal →
          </button>
        </div>
      )}

      {/* When picker is open, show question mark help */}
      {pickerOpen && (
        <>
          <div className="fixed top-4 right-4 z-[80] flex items-center gap-2">
            <span className="text-2xl animate-bounce">👉</span>
            <button
              onClick={() => setShowHelp(true)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center border border-white/20 backdrop-blur-sm flash-white"
              title="How it works"
            >
              ?
            </button>
          </div>

          {showHelp && <PickerHelpOverlay onClose={() => setShowHelp(false)} />}
        </>
      )}

      {/* Highlight sequence inside picker */}
      {pickerOpen && step && step !== "ai" && <PickerHighlights step={step} nextStep={nextStep} />}
    </>
  );
}

function PickerHelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur flex items-center justify-center">
      <div className="bg-black/60 border border-white/15 text-white rounded-3xl shadow-lg p-6 max-w-lg w-[92vw] relative">
        <h2 className="text-xl font-semibold mb-2">Building Your Perfect Meal</h2>
        <p className="text-sm text-white/80 leading-relaxed">
          Pick your <span className="font-semibold text-emerald-300">protein</span> first — it's
          required. Then choose your favorite carbs and fats if you want. You can
          also type custom foods at the bottom. When finished, press{" "}
          <span className="font-semibold text-emerald-300">Done</span>.
        </p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function PickerHighlights({
  step,
  nextStep,
}: {
  step: "protein" | "carb" | "fat" | "done";
  nextStep: () => void;
}) {
  useEffect(() => {
    const idMap = {
      protein: "picker-protein-section",
      carb: "picker-carb-section",
      fat: "picker-fat-section",
      done: "picker-done-btn",
    } as const;

    const el = document.getElementById(idMap[step]);
    if (el) {
      el.classList.add("flash-green-strong");
      
      // Add pointing finger next to the element
      const finger = document.createElement("div");
      finger.id = `tour-finger-${step}`;
      finger.innerHTML = "👉";
      finger.style.cssText = "position: fixed; font-size: 2.5rem; z-index: 90; animation: bounce 1s infinite; pointer-events: none;";
      const rect = el.getBoundingClientRect();
      finger.style.top = `${rect.top + window.scrollY + 10}px`;
      finger.style.left = `${rect.left + window.scrollX - 60}px`;
      document.body.appendChild(finger);
      
      return () => {
        el.classList.remove("flash-green-strong");
        const existingFinger = document.getElementById(`tour-finger-${step}`);
        if (existingFinger) existingFinger.remove();
      };
    }
  }, [step]);

  // automatically progress after 8s if user doesn't click
  useEffect(() => {
    const timer = setTimeout(nextStep, 8000);
    return () => clearTimeout(timer);
  }, [step, nextStep]);

  return null;
}
