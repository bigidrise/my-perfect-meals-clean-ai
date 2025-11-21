import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCopilot } from "./CopilotContext";
import { useMicRecorder } from "@/hooks/useMicRecorder";
import { ChefCapIcon } from "./ChefCapIcon";

export const CopilotSheet: React.FC = () => {
  const { isOpen, close, mode, setMode, lastResponse, suggestions, runAction, setLastResponse } = useCopilot();

  // =========================================
  // AUDIO (ElevenLabs)
  // =========================================
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!lastResponse?.spokenText) return;

    const speak = async () => {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: lastResponse.spokenText }),
        });

        const buf = await res.arrayBuffer();
        const blob = new Blob([buf], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } catch (err) {
        console.error("TTS error:", err);
      }
    };

    speak();
  }, [lastResponse]);

  // =========================================
  // VOICE INPUT (Whisper)
  // =========================================
  const { start, stop, recording } = useMicRecorder();
  const [listening, setListening] = useState(false);

  const handleVoiceStart = async () => {
    setListening(true);
    setMode("listening");
    const audioPromise = start();

    setTimeout(async () => {
      stop();
      const blob = await audioPromise;

      const fd = new FormData();
      fd.append("audio", blob, "audio.webm");

      try {
        const res = await fetch("/api/voice/transcribe", {
          method: "POST",
          body: fd,
        });

        const json = await res.json();
        const transcript = json.transcript;

        // Execute voice command
        runAction({ type: "custom", payload: { voiceQuery: transcript } });
      } catch (err) {
        console.error("Whisper error:", err);
      } finally {
        setListening(false);
        setMode("idle");
      }
    }, 4000); // 4 second voice window
  };

  // =========================================
  // WALKTHROUGH STATE
  // =========================================
  const isWalkthrough = lastResponse?.type === "walkthrough";
  const walkthroughSteps = isWalkthrough ? lastResponse.steps : [];
  const [wtIndex, setWtIndex] = useState(0);

  useEffect(() => {
    if (isWalkthrough) setWtIndex(0);
  }, [isWalkthrough]);

  const currentStep = isWalkthrough && walkthroughSteps ? walkthroughSteps[wtIndex] : null;

  const nextStep = () => {
    if (!isWalkthrough || !walkthroughSteps) return;

    const next = wtIndex + 1;
    if (next < walkthroughSteps.length) {
      setWtIndex(next);
    } else {
      setLastResponse(null);
      setWtIndex(0);
    }
  };

  // =========================================
  // RENDER
  // =========================================
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className="mx-auto mb-2 w-full max-w-xl px-3">
              <div className="rounded-3xl border border-white/12 bg-gradient-to-br from-slate-950/95 via-black/95 to-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-black/60">
                {/* Handle */}
                <div className="flex justify-center pt-3">
                  <div className="h-1 w-10 rounded-full bg-white/15" />
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 px-4 pt-3">
                  <ChefCapIcon size={32} />
                  <div className="flex flex-col flex-1">
                    <span className="text-xs uppercase tracking-[0.16em] text-orange-300/90">
                      My Perfect Meals Copilot
                    </span>
                    <span className="text-sm text-white/80">
                      {mode === "thinking"
                        ? "Tuning this to your lifestyle..."
                        : mode === "listening"
                        ? "Listening..."
                        : "Your chef-coach for every screen."}
                    </span>
                  </div>

                  {/* Voice Button */}
                  <button
                    onClick={handleVoiceStart}
                    disabled={listening}
                    className={`text-sm px-3 py-1 rounded-full transition-all ${
                      listening
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {listening ? "🎙 Listening..." : "🎙 Speak"}
                  </button>

                  <button
                    onClick={close}
                    className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>

                {/* Audio Player */}
                {audioUrl && <audio autoPlay src={audioUrl} />}

                {/* ============================
                    WALKTHROUGH MODE
                ============================= */}
                {isWalkthrough && currentStep && (
                  <div className="mt-3 px-4 pb-2">
                    <div className="rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-4">
                      <button
                        onClick={() => {
                          setLastResponse(null);
                          setWtIndex(0);
                        }}
                        className="float-right text-xs text-white/40 hover:text-white/70"
                      >
                        ✕
                      </button>
                      <h2 className="text-lg font-semibold mb-1 text-white">{lastResponse.title}</h2>
                      <p className="text-white/80 text-xs mb-4">Step {wtIndex + 1} of {walkthroughSteps?.length || 0}</p>

                      <p className="text-white/90 text-base mb-4">{currentStep.text}</p>

                      {currentStep.targetId && (
                        <p className="text-xs text-orange-400/80 mb-4 italic">
                          💡 Look for: {currentStep.targetId}
                        </p>
                      )}

                      <button
                        onClick={nextStep}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white shadow-md ${
                          wtIndex === (walkthroughSteps?.length || 0) - 1
                            ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                            : "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                        }`}
                      >
                        {wtIndex === (walkthroughSteps?.length || 0) - 1 ? "✓ Finish Walkthrough" : "Next Step →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ============================
                    FEATURE / KNOWLEDGE MODE
                ============================= */}
                {!isWalkthrough && lastResponse?.title && (
                  <div className="mt-3 px-4 pb-2">
                    <div className="rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-4">
                      <button
                        onClick={() => setLastResponse(null)}
                        className="float-right text-xs text-white/40 hover:text-white/70"
                      >
                        ✕
                      </button>
                      <h2 className="text-lg font-semibold mb-1 text-white">{lastResponse.title}</h2>
                      <p className="text-white/80 text-sm mb-3">{lastResponse.description}</p>

                      {lastResponse.howTo && lastResponse.howTo.length > 0 && (
                        <div className="mb-4">
                          <p className="text-white/90 font-semibold mb-1 text-sm">How to Use:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {lastResponse.howTo.map((step, i) => (
                              <li key={i} className="text-white/70 text-xs">{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {lastResponse.tips && lastResponse.tips.length > 0 && (
                        <div>
                          <p className="text-white/90 font-semibold mb-1 text-sm">Tips:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {lastResponse.tips.map((tip, i) => (
                              <li key={i} className="text-white/70 text-xs">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ============================
                    BASE SUGGESTIONS MODE
                ============================= */}
                {!lastResponse && (
                  <div className="mt-3 max-h-60 space-y-1 overflow-y-auto px-2 pb-2">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => runAction(s.action)}
                        className="group flex w-full items-start gap-3 rounded-2xl border border-white/8 bg-white/3 px-3 py-2 text-left hover:border-orange-400/50 hover:bg-orange-500/5"
                      >
                        <div className="mt-1 h-6 w-6 flex-shrink-0 rounded-full bg-black/60 text-[11px] font-semibold uppercase tracking-wide text-orange-300 flex items-center justify-center border border-orange-400/40">
                          {s.badge ? s.badge.charAt(0) : "AI"}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">
                              {s.label}
                            </span>
                            {s.badge && (
                              <span className="rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-orange-300">
                                {s.badge}
                              </span>
                            )}
                          </div>
                          {s.description && (
                            <span className="mt-0.5 text-[11px] text-white/60">
                              {s.description}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-[11px] text-white/40 group-hover:text-orange-300">
                          •••
                        </div>
                      </button>
                    ))}

                    {suggestions.length === 0 && (
                      <div className="px-3 py-4 text-center text-xs text-white/60">
                        I'm ready when you are. Tell me what you want to fix,
                        build, or simplify.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
