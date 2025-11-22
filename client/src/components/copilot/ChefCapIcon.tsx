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
      {/* Bright white circular badge background with amber rim */}
      <div 
        className="absolute inset-0 rounded-full bg-white border-2 border-orange-400/80 shadow-lg"
        style={{
          boxShadow: glow 
            ? '0 0 12px rgba(251,146,60,0.4), inset 0 1px 2px rgba(251,146,60,0.2)'
            : '0 2px 8px rgba(0,0,0,0.2)'
        }}
      />
      
      {/* Bold, simplified chef hat silhouette - dark charcoal for max contrast */}
      <svg
        viewBox="0 0 48 48"
        style={{ width: size * 0.85, height: size * 0.85 }}
        className="relative z-10"
      >
        {/* Simplified puffy top - bold and clear */}
        <path
          d="M12 22c-1-2-1.5-4-1.5-6 0-4.5 3.5-8 8-8 1.5 0 3 .5 4.2 1.3C24 7.5 26 6.5 28.5 6.5c4.5 0 8 3.5 8 8 0 2-0.5 4-1.5 6H12z"
          fill="#2d3748"
          stroke="#1a202c"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* White band - thick and prominent */}
        <rect 
          x="13" 
          y="24" 
          width="22" 
          height="5" 
          fill="white"
          stroke="#1a202c"
          strokeWidth="2"
        />
        
        {/* Hat brim - bold bottom */}
        <path
          d="M14 35h20c1.5 0 2.5-1 2.5-2.5v-3.5H11.5v3.5c0 1.5 1 2.5 2.5 2.5z"
          fill="#2d3748"
          stroke="#1a202c"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      {/* Subtle glow effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0px rgba(251,146,60,0.0)",
              "0 0 16px rgba(251,146,60,0.5)",
              "0 0 0px rgba(251,146,60,0.0)",
            ],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
};
