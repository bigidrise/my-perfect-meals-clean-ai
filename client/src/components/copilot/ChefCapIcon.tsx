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
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* OUTLINED ORANGE CHEF HAT - BLACK CENTER */}
      <svg
        viewBox="0 0 64 64"
        style={{ width: size, height: size }}
        className="relative z-10"
      >
        {/* Hat bottom (brim) - OUTLINE ONLY */}
        <path
          d="M20 48h24c1.7 0 3-1.3 3-3v-4H17v4c0 1.7 1.3 3 3 3z"
          fill="transparent"
          stroke="rgb(251,146,60)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Hat top (puffy part) - OUTLINE ONLY */}
        <path
          d="M16 28c-1.1-1.5-2-3.6-2-6 0-5.5 4.5-10 10-10 2 0 3.9.6 5.5 1.6C31 11.4 33.4 10 36 10c5.5 0 10 4.5 10 10 0 2.4-.9 4.5-2 6H16z"
          fill="transparent"
          stroke="rgb(251,146,60)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Middle band - OUTLINE ONLY */}
        <path 
          d="M18 32h28v5H18z" 
          fill="transparent"
          stroke="rgb(251,146,60)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* MAX BRIGHTNESS GLOW EFFECT */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px rgba(251,146,60,0.8), 0 0 40px rgba(251,146,60,0.6)",
              "0 0 35px rgba(251,146,60,1), 0 0 60px rgba(251,146,60,0.9), 0 0 80px rgba(251,146,60,0.7)",
              "0 0 20px rgba(251,146,60,0.8), 0 0 40px rgba(251,146,60,0.6)",
            ],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
};
