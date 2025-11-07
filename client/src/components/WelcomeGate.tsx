
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeGate({ onComplete }: { onComplete: () => void }) {
  const [fade, setFade] = useState(false);

  const chooseMode = (mode: "guided" | "self") => {
    localStorage.setItem("coachMode", mode);
    setFade(true);
    setTimeout(onComplete, 1000);
  };

  return (
    <AnimatePresence>
      {!fade && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fade ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
          data-testid="welcome-gate"
        >
          <div className="text-center space-y-6 px-6 max-w-md">
            <h1 className="text-3xl font-bold text-white">Welcome to My Perfect Meals</h1>
            <p className="text-lg text-white/80">Powered by Emotion AI</p>
            <p className="text-sm text-white/60">
              Choose how you'd like to begin your journey:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={() => chooseMode("guided")}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all"
                data-testid="button-coach-mode"
              >
                ✨ Intuitive Coach Mode
              </button>
              <button
                onClick={() => chooseMode("self")}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all"
                data-testid="button-self-mode"
              >
                🧭 Self-Guided Mode
              </button>
            </div>
            <p className="text-xs text-white/40 pt-4">
              You can change this anytime in Settings under "Coach Mode."
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
