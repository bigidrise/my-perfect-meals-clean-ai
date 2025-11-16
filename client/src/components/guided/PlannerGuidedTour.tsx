import { useState } from "react";

/**
 * Planner Guided Tour
 *
 * Displays:
 *  - Flashing ? icon at the top (if coachMode = guided)
 *  - When clicked, opens an overlay explaining each planner/hub
 *  - All hub buttons pulse together
 */

export default function PlannerGuidedTour() {
  const coachMode = localStorage.getItem("coachMode") === "guided";
  const [open, setOpen] = useState(false);

  if (!coachMode) return null;

  return (
    <>
      {/* Flashing info icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-[60] bg-lime-700 hover:bg-lime-800 border-2 border-lime-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold flash-border"
        title="Open guided overview"
      >
        I
      </button>

      {open && <PlannerOverlay onClose={() => setOpen(false)} />}
    </>
  );
}

function PlannerOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-black/50 border border-white/15 text-white rounded-3xl shadow-xl p-6 max-w-lg w-[92vw] relative">
        <h2 className="text-2xl font-bold mb-2">Planner Hub</h2>
        <p className="text-white/80 text-sm mb-6">
          This is where you pick the meal-planning style that fits your life. Everyone eats differently, so choose the board that matches your goals:
        </p>

        <div className="space-y-3 text-white/90 text-sm mb-6">
          <p><strong className="text-white">Weekly Meal Board</strong> – For everyday eating and regular diets.</p>
          <p><strong className="text-white">Diabetic Board</strong> – For people managing blood sugar or insulin sensitivity.</p>
          <p><strong className="text-white">GLP-1 Board</strong> – For people on GLP-1 medications who need small, nutrient-dense meals.</p>
          <p><strong className="text-white">Anti-Inflammatory Board</strong> – For reducing joint pain, inflammation, and improving recovery.</p>
          <p><strong className="text-white">Athlete/Competition Board</strong> – For strict, goal-driven athletes who need precision and structure.</p>
        </div>

        <p className="text-white/70 text-sm italic mb-6">
          Pick the board that matches your lifestyle — the app does the rest.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Got it!
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
