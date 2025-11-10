
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
      {/* Flashing question mark icon with pointing finger */}
      <div className="fixed top-4 right-4 z-[60] flex items-center gap-2">
        <span className="text-3xl animate-bounce">👉</span>
        <button
          onClick={() => setOpen(true)}
          className="bg-lime-500/20 hover:bg-lime-500/30 text-white rounded-full w-10 h-10 flex items-center justify-center border border-lime-500/40 backdrop-blur-sm flash-orange"
          title="Open guided overview"
        >
          ?
        </button>
      </div>

      {open && <PlannerOverlay onClose={() => setOpen(false)} />}
    </>
  );
}

function PlannerOverlay({ onClose }: { onClose: () => void }) {
  const hubs = [
    { name: "Weekly Meal Board", desc: "Everyday balanced meal planning.", route: "/weekly-meal-board" },
    { name: "Diabetic Hub", desc: "Plans that stabilize blood sugar.", route: "/diabetic-hub" },
    { name: "GLP-1 Hub", desc: "Small, high-nutrient meals for GLP-1 users.", route: "/glp1-hub" },
    { name: "Competition Hub", desc: "Advanced meal building for athletes.", route: "/athlete-board" },
  ];

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center">
      <div className="bg-black/50 border border-white/15 text-white rounded-3xl shadow-xl p-6 max-w-lg w-[92vw] relative">
        <h2 className="text-2xl font-bold mb-2">Choose Your Planner</h2>
        <p className="text-white/80 text-sm mb-6">
          This is your meal-planning center. Pick the type of plan that fits you.
        </p>

        <div className="space-y-4">
          {hubs.map((h) => (
            <div key={h.name} className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">👉</span>
              <button
                onClick={() => {
                  onClose();
                  // Simulate click of the real hub button
                  const el = document.querySelector(
                    `[data-testid="card-${h.name.toLowerCase().replace(/\s+/g, "-")}"]`
                  ) as HTMLElement | null;
                  el?.click();
                }}
                className="w-full p-4 text-left rounded-xl border border-lime-500/30 bg-lime-500/10 hover:bg-lime-500/20 transition-all flash-orange"
              >
                <p className="font-semibold">{h.name}</p>
                <p className="text-white/70 text-sm">{h.desc}</p>
              </button>
            </div>
          ))}
        </div>

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
