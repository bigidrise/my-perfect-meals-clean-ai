import React from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useCopilot } from "./CopilotContext";
import { ChefCapIcon } from "./ChefCapIcon";

export const CopilotButton: React.FC = () => {
  const { toggle, isOpen } = useCopilot();

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-16 right-4 z-[60] flex items-center justify-center w-12 h-12 rounded-full bg-black/70 border border-white/15 backdrop-blur-xl shadow-lg shadow-orange-500/60 hover:shadow-orange-500/100 hover:border-orange-400/100 transition-all duration-300"
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -2, scale: 1.08 }}
      style={{
        boxShadow: '0 0 30px rgba(251,146,60,0.6), 0 0 50px rgba(251,146,60,0.4)'
      }}
    >
      <ChefCapIcon size={26} />
      
      {/* Microphone badge in top-right corner */}
      <motion.div
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center shadow-lg"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Mic className="w-2.5 h-2.5 text-white" strokeWidth={3} />
      </motion.div>
    </motion.button>
  );
};
