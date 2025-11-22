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
      {/* Light warm ivory/peach badge background with amber rim */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-orange-400/90 shadow-lg"
        style={{
          background: 'radial-gradient(circle, #FFF9F2 0%, #FEEAD7 100%)',
          boxShadow: glow 
            ? '0 0 12px rgba(251,146,60,0.5), inset 0 1px 3px rgba(251,146,60,0.15)'
            : '0 2px 8px rgba(0,0,0,0.15)'
        }}
      />
      
      {/* Orange gradient chef hat - slightly darker for contrast on light background */}
      <svg
        viewBox="0 0 64 64"
        style={{ width: size * 0.75, height: size * 0.75 }}
        className="relative z-10"
      >
        <defs>
          <linearGradient id="chefCapGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(251,191,36,1)" />
            <stop offset="50%" stopColor="rgba(251,146,60,1)" />
            <stop offset="100%" stopColor="rgba(249,115,22,1)" />
          </linearGradient>
        </defs>
        {/* Hat bottom (brim) with white outline */}
        <path
          d="M20 48h24c1.7 0 3-1.3 3-3v-4H17v4c0 1.7 1.3 3 3 3z"
          fill="url(#chefCapGradient)"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="1.8"
        />
        {/* Hat top (puffy part) with white outline */}
        <path
          d="M16 28c-1.1-1.5-2-3.6-2-6 0-5.5 4.5-10 10-10 2 0 3.9.6 5.5 1.6C31 11.4 33.4 10 36 10c5.5 0 10 4.5 10 10 0 2.4-.9 4.5-2 6H16z"
          fill="url(#chefCapGradient)"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="1.8"
        />
        {/* White band (traditional chef hat look) */}
        <path 
          d="M18 32h28v5H18z" 
          fill="rgba(255,255,255,0.98)" 
          stroke="rgba(255,255,255,1)"
          strokeWidth="1.2"
        />
        {/* Pleats on the brim */}
        <path
          d="M22 48v3m8-3v3m8-3v3"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2.2"
          strokeLinecap="round"
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
