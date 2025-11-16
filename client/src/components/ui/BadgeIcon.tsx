
import React from "react";
import { Heart, Droplet, Activity, AlertCircle, Brain, Apple } from "lucide-react";

interface BadgeIconProps {
  type?: "heart" | "diabetes" | "kidney" | "alert" | "brain" | "nutrition";
  variant?: "default" | "critical" | "positive" | "info" | "warning";
  className?: string;
}

const ICON_MAP = {
  heart: Heart,
  diabetes: Activity,
  kidney: Droplet,
  alert: AlertCircle,
  brain: Brain,
  nutrition: Apple
};

const VARIANT_COLORS = {
  default: "text-white/70",
  critical: "text-red-400",
  positive: "text-emerald-400",
  info: "text-blue-400",
  warning: "text-amber-400"
};

export default function BadgeIcon({ 
  type = "heart", 
  variant = "default",
  className = "" 
}: BadgeIconProps) {
  const IconComponent = ICON_MAP[type];
  const colorClass = VARIANT_COLORS[variant];

  return (
    <div className={`flex-shrink-0 ${className}`}>
      <IconComponent className={`w-4 h-4 ${colorClass}`} />
    </div>
  );
}
