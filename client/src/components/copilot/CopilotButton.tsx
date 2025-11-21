import React from "react";
import { motion } from "framer-motion";
import { useCopilot } from "./CopilotContext";
import { ChefCapIcon } from "./ChefCapIcon";

export const CopilotButton: React.FC = () => {
  const { toggle, isOpen } = useCopilot();

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-16 right-4 z-[60] flex items-center justify-center w-12 h-12 rounded-full bg-black/70 border border-white/15 backdrop-blur-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/80 hover:border-orange-400/80 transition-all duration-300"
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -2, scale: 1.08 }}
    >
      <ChefCapIcon size={26} />
    </motion.button>
  );
};
