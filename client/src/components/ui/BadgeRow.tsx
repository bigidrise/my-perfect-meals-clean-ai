import React from "react";
import BadgeDot from "./BadgeDot";
import BadgeTitle from "./BadgeTitle";
import BadgeDescription from "./BadgeDescription";

interface BadgeRowProps {
  label: string;
  desc?: string;
  type?: "default" | "critical" | "positive" | "info" | "warning";
  icon?: React.ReactNode;
  showDot?: boolean;
  className?: string;
}

export default function BadgeRow({
  label,
  desc,
  type = "default",
  icon,
  showDot = true,
  className = ""
}: BadgeRowProps) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {icon ? icon : showDot && <BadgeDot type={type} />}

      <div className="flex-1">
        <BadgeTitle>{label}</BadgeTitle>
        {desc && <BadgeDescription>{desc}</BadgeDescription>}
      </div>
    </div>
  );
}