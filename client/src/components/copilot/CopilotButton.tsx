import React from "react";
import { motion } from "framer-motion";
import { useCopilot } from "./CopilotContext";
import { ChefCapIcon } from "./ChefCapIcon";

export const CopilotButton: React.FC = () => {
  const { toggle, isOpen } = useCopilot();

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-16 right-4 z-[60] flex items-center gap-2 rounded-full bg-black/70 border border-white/15 px-2.5 py-1.5 backdrop-blur-xl shadow-lg shadow-black/50 hover:shadow-orange-500/30 hover:border-orange-400/40 transition-all duration-300"
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2, scale: 1.02 }}
    >
      <ChefCapIcon size={24} />
      <div className="flex flex-col items-start">
        <span className="text-[10px] uppercase tracking-[0.14em] text-orange-300/80">
          Copilot
        </span>
        <span className="text-[11px] font-medium text-white">
          {isOpen ? "Help?" : "Chef-coach"}
        </span>
      </div>
    </motion.button>
  );
};
