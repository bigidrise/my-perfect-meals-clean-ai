import React from "react";
import { motion } from "framer-motion";
import { useCopilot } from "./CopilotContext";
import { ChefCapIcon } from "./ChefCapIcon";

export const CopilotButton: React.FC = () => {
  const { toggle, isOpen } = useCopilot();

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-16 right-4 z-[60] flex items-center justify-center w-17 h-17 rounded-full bg-black/70 border-2 border-white/15 backdrop-blur-xl shadow-lg shadow-orange-500/60 hover:shadow-orange-500/100 hover:border-orange-400/100 transition-all duration-300"
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -2, scale: 1.08 }}
      style={{
        boxShadow: '0 0 30px rgba(251,146,60,0.6), 0 0 50px rgba(251,146,60,0.4)'
      }}
    >
      <ChefCapIcon size={54} />
    </motion.button>
  );
};
