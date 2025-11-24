import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCopilot } from "./CopilotContext";
import { useMicRecorder } from "@/hooks/useMicRecorder";
import { ChefCapIcon } from "./ChefCapIcon";
import { useToast } from "@/hooks/use-toast";
import { FEATURES } from "@/featureFlags";
import { SpotlightOverlay, SpotlightStep } from "./SpotlightOverlay";
import { convertToSpotlightStep } from "./WalkthroughEngine";
import { CopilotInputBar } from "./CopilotInputBar";
import { isLikelyMisheard } from "./query/QueryProcessor";
import { startCopilotIntro } from "./CopilotCommandRegistry";

export const CopilotSheet: React.FC = () => {
  const { isOpen, close, mode, setMode, lastResponse, suggestions, runAction, setLastResponse, needsRetry, setNeedsRetry } = useCopilot();
  const { toast } = useToast();

  // =========================================
  // AUDIO (ElevenLabs) - with lifecycle management + mobile handling
  // =========================================
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!lastResponse?.spokenText) return;

    const speak = async () => {
      try {
        // Abort any in-flight TTS requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: lastResponse.spokenText }),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) throw new Error("TTS failed");

        const buf = await res.arrayBuffer();
        const blob = new Blob([buf], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        
        // Revoke previous URL when setting new one
        setAudioUrl(prevUrl => {
          if (prevUrl) {
            URL.revokeObjectURL(prevUrl);
          }
          return url;
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("TTS error:", err);
        }
      }
    };

    speak();

    // Cleanup on unmount or response change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [lastResponse]);

  // =========================================
  // AUTOPLAY HANDLING - Retry with manual play if autoPlay blocked
  // Browsers often block autoPlay, so we manually trigger play() as fallback
  // =========================================
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;

    // Wait for element to be ready, then try manual play as fallback for autoPlay blocking
    requestAnimationFrame(async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        await audio.play();
        setAudioBlocked(false); // Successfully playing
      } catch (err: any) {
        // autoPlay blocked - show tap-to-play prompt
        if (err.name === "NotAllowedError") {
          console.log("🔇 Autoplay blocked, showing tap-to-play prompt");
          setAudioBlocked(true);
        } else {
          console.error("Audio playback error:", err);
        }
      }
    });
  }, [audioUrl]);

  // Manual play handler for tap-to-play fallback
  const handleTapToPlay = async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setAudioBlocked(false); // Hide prompt after successful play
    } catch (err: any) {
      console.error("Manual audio play failed:", err);
    }
  };

  // Cleanup audio and state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setAudioUrl(prevUrl => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
      // Clear voice fallback state on close
      setNeedsRetry(false);
      setAudioBlocked(false);
    }
  }, [isOpen, setNeedsRetry]);

  // =========================================
  // COPILOT INTRO - Trigger when user chooses "My Perfect Copilot"
  // =========================================
  useEffect(() => {
    if (isOpen) {
      const triggerFlag = localStorage.getItem("trigger-copilot-intro");
      
      if (triggerFlag === "true") {
        // Remove trigger flag
        localStorage.removeItem("trigger-copilot-intro");
        
        // Play intro (force=true to ignore "already seen" flag)
        setTimeout(() => {
          startCopilotIntro(true);
        }, 500); // Small delay to ensure sheet is fully open
      }
    }
  }, [isOpen]);

  // =========================================
  // VOICE INPUT (Whisper) - with error handling
  // =========================================
  const { start, stop, recording } = useMicRecorder();
  const [listening, setListening] = useState(false);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleVoiceStart = async () => {
    // Prevent concurrent recordings
    if (listening || recording) {
      return;
    }

    try {
      setListening(true);
      setMode("listening");

      const audioPromise = start();

      // Set timeout to stop recording
      recordingTimeoutRef.current = setTimeout(async () => {
        stop();
        
        try {
          const result = await audioPromise;

          // Guard against null/undefined blob
          if (!result || !result.blob || result.blob.size === 0) {
            throw new Error("No audio recorded");
          }

          const fd = new FormData();
          // Use detected extension from the recorder
          fd.append("audio", result.blob, `audio.${result.extension}`);

          const res = await fetch("/api/voice/transcribe", {
            method: "POST",
            body: fd,
          });

          if (!res.ok) {
            throw new Error("Transcription failed");
          }

          const json = await res.json();
          const transcript = json.transcript?.trim();
          const confidence = json.confidence;

          // Guard against empty or mis-heard transcripts
          if (!transcript || isLikelyMisheard(transcript, confidence)) {
            setNeedsRetry(true);
            setLastResponse({
              title: "Didn't catch that",
              description: "I may have misheard you. Try saying it again or type it below.",
              spokenText: "I didn't catch that. Try saying it again or type your command below.",
            });
            return;
          }

          // Process voice command via existing Phase B pipeline
          runAction({ type: "custom", payload: { voiceQuery: transcript } });
        } catch (err: any) {
          console.error("Voice processing error:", err);
          toast({
            title: "Voice command failed",
            description: err.message || "Please try again.",
            variant: "destructive",
          });
        } finally {
          setListening(false);
          setMode("idle");
        }
      }, 4000); // 4 second voice window

    } catch (err: any) {
      console.error("Microphone error:", err);
      
      // Show helpful error message for unsupported browsers
      const errorMessage = err.message?.includes("not supported") 
        ? err.message 
        : "Could not access microphone. Please check permissions.";
      
      setNeedsRetry(true);
      setLastResponse({
        title: "Voice unavailable",
        description: errorMessage,
        spokenText: "Voice commands are not available. Please use the text input below.",
      });
      
      setListening(false);
      setMode("idle");
    }
  };

  // Cleanup recording timeout on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);

  // =========================================
  // TEXT COMMAND HANDLER - Dual Input System
  // Routes through existing Phase B pipeline (runAction)
  // =========================================
  const handleTextCommand = async (query: string) => {
    try {
      setMode("thinking");
      setNeedsRetry(false); // Clear voice fallback banner
      
      // Validate query (empty check, etc)
      const trimmed = query.trim();
      if (!trimmed) {
        setNeedsRetry(true);
        setLastResponse({
          title: "Empty Command",
          description: "Please type a command.",
          spokenText: "Please type a command.",
        });
        setMode("idle");
        return;
      }
      
      // Route through existing Phase B pipeline (same as voice)
      // This preserves all locked logic: Spotlight, NL engine, hub routing, etc.
      runAction({ type: "custom", payload: { voiceQuery: trimmed } });
      
    } catch (err: any) {
      console.error("Text command error:", err);
      toast({
        title: "Command failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      // Always reset mode to idle after processing (success or error)
      setMode("idle");
    }
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
  // SPOTLIGHT INTEGRATION
  // =========================================
  const spotlightActive = FEATURES.copilotSpotlight && isWalkthrough && currentStep;
  const spotlightStep = spotlightActive && currentStep ? convertToSpotlightStep(currentStep) : null;
  
  const handleExitSpotlight = () => {
    setLastResponse(null);
    setWtIndex(0);
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

                {/* Mobile Tap-to-Play Audio Fallback */}
                {audioBlocked && (
                  <div className="px-4 pt-2">
                    <button
                      onClick={handleTapToPlay}
                      className="w-full rounded-xl bg-orange-500/20 border border-orange-400/40 px-4 py-3 text-center hover:bg-orange-500/30 transition-colors"
                    >
                      <p className="text-sm font-semibold text-orange-300">
                        🔊 Tap to hear Copilot
                      </p>
                      <p className="text-xs text-orange-300/70 mt-1">
                        Your browser needs permission to play audio
                      </p>
                    </button>
                  </div>
                )}

                {/* Audio Player */}
                {audioUrl && (
                  <audio 
                    ref={audioRef}
                    autoPlay
                    src={audioUrl}
                    onEnded={() => {
                      setAudioUrl(prevUrl => {
                        if (prevUrl) {
                          URL.revokeObjectURL(prevUrl);
                        }
                        return null;
                      });
                    }}
                  />
                )}

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

                {/* ============================
                    VOICE FALLBACK BANNER
                ============================= */}
                {needsRetry && (
                  <div className="mt-2 px-4">
                    <div className="rounded-xl bg-orange-500/10 border border-orange-400/30 px-3 py-2">
                      <p className="text-xs text-orange-300/90">
                        💡 Didn't catch that? Type your command below or try speaking again.
                      </p>
                    </div>
                  </div>
                )}

                {/* ============================
                    TEXT COMMAND INPUT
                ============================= */}
                <div className="mt-3 px-4 pb-4">
                  <CopilotInputBar
                    onSubmit={handleTextCommand}
                    placeholder="Type a command…"
                    autoFocus={needsRetry}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
      {/* =========================================
          SPOTLIGHT OVERLAY (Portal-mounted, outside AnimatePresence)
          ========================================= */}
      {spotlightActive && spotlightStep && (
        <SpotlightOverlay
          currentStep={spotlightStep}
          onAdvance={nextStep}
          onExit={handleExitSpotlight}
        />
      )}
    </AnimatePresence>
  );
};
