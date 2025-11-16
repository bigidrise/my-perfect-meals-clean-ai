
import React from "react";

interface BadgeRowProps {
  badges: Array<{
    label: string;
    variant?: "safe" | "warning" | "alert" | "info" | "neutral";
    description?: string;
  }>;
  className?: string;
}

const VARIANT_STYLES = {
  safe: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300",
  alert: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300",
  info: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300",
  neutral: "bg-white/10 text-white/80 border-white/20"
};

export default function BadgeRow({ badges, className = "" }: BadgeRowProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge, index) => {
        const variant = badge.variant || "neutral";
        const styles = VARIANT_STYLES[variant];

        return (
          <span
            key={index}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${styles}`}
            title={badge.description || badge.label}
          >
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
