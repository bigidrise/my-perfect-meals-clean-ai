
import { useState } from "react";

/**
 * ProCare Guided Tour
 *
 * Displays:
 *  - Flashing ? icon at the top (if coachMode = guided)
 *  - When clicked, opens an overlay explaining the ProCare hub features
 */

export default function ProCareGuidedTour() {
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

      {open && <ProCareOverlay onClose={() => setOpen(false)} />}
    </>
  );
}

function ProCareOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-black/50 border border-white/15 text-white rounded-3xl shadow-xl p-6 max-w-lg w-[92vw] relative">
        <h2 className="text-2xl font-bold mb-2">ProCare Hub</h2>
        <p className="text-white/80 text-sm mb-6">
          This area is built for professionals — trainers, coaches, and doctors — or users who want a more advanced, structured approach.
        </p>

        <div className="space-y-3 text-white/90 text-sm mb-6">
          <p><strong className="text-white">Client Boards</strong> let you build full plans for clients (or yourself).</p>
          <p><strong className="text-white">Pro Meal Builder</strong> gives you gram-by-gram control for precision planning.</p>
          <p><strong className="text-white">Guardrails</strong> add medical safety filters for conditions, medications, and goals.</p>
          <p><strong className="text-white">Tracking Tools</strong> help professionals monitor meals, macros, progress, and compliance.</p>
        </div>

        <p className="text-white/70 text-sm italic mb-6">
          Think of ProCare as the "advanced control panel" for serious coaching and medical guidance.
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
