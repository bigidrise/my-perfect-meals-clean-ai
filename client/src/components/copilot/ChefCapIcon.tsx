import React from "react";
import { motion } from "framer-motion";

interface ChefCapIconProps {
  size?: number;
  glow?: boolean;
}

export const ChefCapIcon: React.FC<ChefCapIconProps> = ({
  size = 32,
  glow = true,
}) => {
  return (
    <motion.div
      className="relative flex items-center justify-center rounded-full bg-black/90 border border-orange-500/20 backdrop-blur-md"
      style={{ width: size, height: size }}
      animate={{
        boxShadow: glow
          ? [
              "0 0 0px rgba(251,146,60,0.0)",
              "0 0 18px rgba(251,146,60,0.65)",
              "0 0 0px rgba(251,146,60,0.0)",
            ]
          : "none",
      }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Chef cap SVG */}
      <svg
        viewBox="0 0 64 64"
        className="text-orange-400"
        style={{ width: size * 0.7, height: size * 0.7 }}
      >
        <defs>
          <linearGradient id="chefCapGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(251,191,36,1)" />
            <stop offset="50%" stopColor="rgba(251,146,60,1)" />
            <stop offset="100%" stopColor="rgba(249,115,22,1)" />
          </linearGradient>
        </defs>
        <path
          d="M20 48h24c1.7 0 3-1.3 3-3v-4H17v4c0 1.7 1.3 3 3 3z"
          fill="url(#chefCapGradient)"
        />
        <path
          d="M16 28c-1.1-1.5-2-3.6-2-6 0-5.5 4.5-10 10-10 2 0 3.9.6 5.5 1.6C31 11.4 33.4 10 36 10c5.5 0 10 4.5 10 10 0 2.4-.9 4.5-2 6H16z"
          fill="url(#chefCapGradient)"
        />
        <path d="M18 32h28v5H18z" fill="rgba(0,0,0,0.9)" />
        <path
          d="M22 48v3m8-3v3m8-3v3"
          stroke="rgba(251,146,60,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* tiny highlight */}
      <div className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full bg-orange-300/60 opacity-70" />
    </motion.div>
  );
};
