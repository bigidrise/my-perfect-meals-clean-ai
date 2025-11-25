import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SimpleStepOverlayProps {
  selector: string;
  text?: string;
  showArrow?: boolean;
  onTap: () => void;
}

export function SimpleStepOverlay({ selector, text, showArrow = false, onTap }: SimpleStepOverlayProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateTargetRect = () => {
      const element = document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };

    updateTargetRect();

    const observer = new MutationObserver(updateTargetRect);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };
  }, [selector]);

  if (!targetRect) return null;

  const arrowPosition = {
    top: targetRect.top - 60,
    left: targetRect.left + targetRect.width / 2 - 15,
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        {/* Dim overlay - tap anywhere to advance */}
        <div
          className="absolute inset-0 bg-black/40 pointer-events-auto cursor-pointer"
          onClick={onTap}
        />

        {/* Highlight cutout - allows interaction with target */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.4), 0 0 20px 4px rgba(59, 130, 246, 0.5)",
            borderRadius: "12px",
            border: "2px solid rgba(59, 130, 246, 0.8)",
          }}
        />

        {/* Optional animated arrow */}
        {showArrow && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: arrowPosition.top,
              left: arrowPosition.left,
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path
                d="M15 5 L15 25 M15 5 L10 10 M15 5 L20 10"
                stroke="rgba(59, 130, 246, 0.9)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}

        {/* Optional step text */}
        {text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute pointer-events-none bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-xs"
            style={{
              top: targetRect.bottom + 12,
              left: Math.max(12, Math.min(targetRect.left, window.innerWidth - 300)),
            }}
          >
            {text}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
