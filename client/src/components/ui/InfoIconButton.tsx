import { Info } from "lucide-react";
import { forwardRef } from "react";
import { motion } from "framer-motion";

interface InfoIconButtonProps {
  size?: number;
  glow?: boolean;
  className?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const InfoIconButton = forwardRef<HTMLButtonElement, InfoIconButtonProps>(
  ({ size = 17, glow = true, className = "", title = "More information", onClick, disabled }, ref) => {
    return (
      <motion.button
        ref={ref}
        title={title}
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        className={`relative flex items-center justify-center ${className}`}
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

        {/* INFO ICON */}
        <Info
          className="relative z-10 text-gray-200"
          style={{ width: size * 0.6, height: size * 0.6 }}
          strokeWidth={2.5}
        />
      </motion.button>
    );
  }
);

InfoIconButton.displayName = "InfoIconButton";

export default InfoIconButton;