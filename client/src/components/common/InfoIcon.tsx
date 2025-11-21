import React from "react";
import { motion } from "framer-motion";

interface InfoIconProps {
  size?: number;
  glow?: boolean;
  onClick?: () => void;
}

export const InfoIcon: React.FC<InfoIconProps> = ({
  size = 17,
  glow = true,
  onClick,
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.08 }}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* BACKGROUND CIRCLE */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gray-400/20 border border-white/15 backdrop-blur-sm"
        animate={
          glow
            ? {
                boxShadow: [
                  "0 0 0px rgba(251,146,60,0.0)",
                  "0 0 8px rgba(251,146,60,0.45)",
                  "0 0 0px rgba(251,146,60,0.0)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* INFO CHARACTER */}
      <span
        className="relative z-10 text-[11px] font-bold text-gray-200"
        style={{ lineHeight: 1 }}
      >
        i
      </span>
    </motion.button>
  );
};
