import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCopilot } from "./CopilotContext";
import { ChefCapIcon } from "./ChefCapIcon";

export const CopilotSheet: React.FC = () => {
  const {
    isOpen,
    close,
    mode,
    setMode,
    contextInfo,
    suggestions,
    runAction,
    lastQuery,
    setLastQuery,
  } = useCopilot();

  const handleSuggestionClick = (id: string) => {
    const s = suggestions.find((s) => s.id === id);
    if (!s) return;
    setMode("thinking");
    runAction(s.action);
    setTimeout(() => setMode("idle"), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastQuery.trim()) return;
    setMode("thinking");
    runAction({ type: "custom", payload: { query: lastQuery } });
    setLastQuery("");
    setTimeout(() => setMode("idle"), 600);
  };

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

          {/* Bottom sheet */}
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
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-[0.16em] text-orange-300/90">
                      My Perfect Meals Copilot
                    </span>
                    <span className="text-sm text-white/80">
                      {mode === "thinking"
                        ? "Tuning this to your lifestyle..."
                        : "Your chef-coach for every screen."}
                    </span>
                  </div>
                  <button
                    onClick={close}
                    className="ml-auto rounded-full bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>

                {/* Context chips */}
                <div className="flex flex-wrap gap-2 px-4 pt-3">
                  {contextInfo.persona && (
                    <span className="rounded-full border border-orange-400/40 bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-orange-300">
                      {contextInfo.persona === "default"
                        ? "Food Lover"
                        : contextInfo.persona.toUpperCase()}
                    </span>
                  )}
                  {contextInfo.screenId && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                      {contextInfo.screenId}
                    </span>
                  )}
                  {(contextInfo.tags ?? []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/8 bg-white/5 px-2 py-0.5 text-[11px] text-white/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Suggestions */}
                <div className="mt-3 max-h-60 space-y-1 overflow-y-auto px-2 pb-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSuggestionClick(s.id)}
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
                      I’m ready when you are. Tell me what you want to fix,
                      build, or simplify.
                    </div>
                  )}
                </div>

                {/* Input row */}
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 border-t border-white/10 px-3 py-2"
                >
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/70 text-[11px] text-white/70 hover:border-orange-400/60 hover:text-orange-300"
                    onClick={() =>
                      setMode(mode === "listening" ? "idle" : "listening")
                    }
                  >
                    {mode === "listening" ? "••" : "🎙"}
                  </button>
                  <input
                    className="flex-1 rounded-2xl border border-white/12 bg-black/60 px-3 py-1.5 text-xs text-white placeholder:text-white/35 focus:border-orange-400/70 focus:outline-none"
                    placeholder="Ask your copilot: 'Fix this meal for GLP-1'..."
                    value={lastQuery}
                    onChange={(e) => setLastQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-orange-500/90 to-amber-400/90 px-3 py-1.5 text-xs font-semibold text-black shadow-md shadow-orange-900/50 hover:from-orange-400 hover:to-amber-300"
                  >
                    {mode === "thinking" ? "Thinking…" : "Send"}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
