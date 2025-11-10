
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

/**
 * Biometrics Guided Tour
 *
 * How it works:
 * - Renders a floating flashing green CTA at the top of the page when coachMode === "guided".
 * - On click: scrolls to weight section, shows a small "Persistent" info card,
 *   and flashes the Save button.
 * - When the Save button is clicked, auto-navigates to /planner.
 *
 * Requirements on the Biometrics page:
 *   - Add id="weight-section" to the container that holds the weight input.
 *   - Add id="save-weight-btn" to the Save Weight button.
 *   - (Optional) Add id="persistent-info-anchor" near the weight section title/label
 *     to anchor the info card; if missing, the info card will still render below.
 */

const isGuided = () => localStorage.getItem("coachMode") === "guided";

export default function BiometricsGuidedTour() {
  const [, setLocation] = useLocation();
  const [active, setActive] = useState(isGuided());
  const [showPersistentInfo, setShowPersistentInfo] = useState(false);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!active) return;

    const saveBtn = document.getElementById("save-weight-btn");

    const onSave = () => {
      setTimeout(() => setLocation("/planner"), 350);
    };

    if (saveBtn) {
      saveBtn.addEventListener("click", onSave, { once: true });
    }

    cleanupRef.current = () => {
      if (saveBtn) saveBtn.removeEventListener("click", onSave);
    };

    return () => cleanupRef.current();
  }, [active, setLocation]);

  if (!active) return null;

  const handleStart = () => {
    const weightSection = document.getElementById("weight-section");
    if (weightSection) {
      weightSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setShowPersistentInfo(true);

    const saveBtn = document.getElementById("save-weight-btn");
    if (saveBtn) {
      saveBtn.classList.add("flash-green-strong");
      setTimeout(() => saveBtn.classList.remove("flash-green-strong"), 10000);
    }
  };

  return (
    <>
      <div className="fixed left-1/2 -translate-x-1/2 top-4 z-[60]">
        <button
          onClick={handleStart}
          className="px-4 py-2 rounded-xl text-white font-medium bg-emerald-600/90 border border-emerald-300/40 backdrop-blur flash-green"
        >
          Click to add your weight & start making meals
        </button>
      </div>

      {showPersistentInfo && (
        <PersistentInfoCard onClose={() => setShowPersistentInfo(false)} />
      )}
    </>
  );
}

function PersistentInfoCard({ onClose }: { onClose: () => void }) {
  const anchor = typeof window !== "undefined"
    ? document.getElementById("persistent-info-anchor")
    : null;

  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    const top = Math.max(rect.bottom + window.scrollY + 8, 0);
    const left = Math.max(rect.left + window.scrollX, 16);

    return (
      <div
        style={{ position: "absolute", top, left }}
        className="z-[55] max-w-md"
      >
        <InfoCard onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[55] max-w-md w-[92vw] sm:w-auto">
      <InfoCard onClose={onClose} />
    </div>
  );
}

function InfoCard({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/60 text-white backdrop-blur p-4 shadow-lg">
      <p className="text-sm leading-relaxed">
        <span className="font-semibold">Heads up:</span> your current macros and
        biometrics are <span className="font-semibold">persistent</span> — they
        stay saved until you change them. You can tap the{" "}
        <span className="font-semibold">Persistent</span> label anytime to read
        what it means.
      </p>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 text-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
