
import { useState } from "react";

/**
 * Lifestyle Guided Tour
 *
 * Displays:
 *  - Flashing ? icon at the top (if coachMode = guided)
 *  - When clicked, opens an overlay explaining the Lifestyle hub features
 */

export default function LifestyleGuidedTour() {
  const coachMode = localStorage.getItem("coachMode") === "guided";
  const [open, setOpen] = useState(false);

  if (!coachMode) return null;

  return (
    <>
      {/* Flashing info icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-[60] bg-lime-700 hover:bg-lime-800 border-2 border-lime-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold flash-border"
        title="Open guided overview"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white/60 text-xl">I</span>
      </button>

      {open && <LifestyleOverlay onClose={() => setOpen(false)} />}
    </>
  );
}

function LifestyleOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-black/50 border border-white/15 text-white rounded-3xl shadow-xl p-6 max-w-lg w-[92vw] relative">
        <h2 className="text-2xl font-bold mb-2">Lifestyle Hub</h2>
        <p className="text-white/80 text-sm mb-6">
          This hub is built for your everyday life — cravings, real-world eating, nights out, kids' meals, leftovers, and anything life throws at you.
        </p>

        <div className="space-y-3 text-white/90 text-sm mb-6">
          <p><strong className="text-white">Craving Creator</strong> helps you enjoy the foods you love without destroying your goals.</p>
          <p><strong className="text-white">Fridge Rescue</strong> saves your night by turning what's already in your kitchen into a meal.</p>
          <p><strong className="text-white">Restaurant Guide</strong> helps you eat smart anywhere — by restaurant or by food category.</p>
          <p><strong className="text-white">Kids & Toddler Meals</strong> make feeding young ones fast, simple, and healthy.</p>
          <p><strong className="text-white">Spirits & Lifestyle</strong> covers drinks, date nights, and social living without derailing progress.</p>
        </div>

        <p className="text-white/70 text-sm italic mb-6">
          This page is your everyday toolbox — use it whenever life happens.
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
