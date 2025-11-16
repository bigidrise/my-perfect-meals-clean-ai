
import React from "react";

interface BadgeGroupProps {
  children: React.ReactNode;
  sortCriticalFirst?: boolean;
  className?: string;
}

export default function BadgeGroup({ 
  children, 
  sortCriticalFirst = false,
  className = "" 
}: BadgeGroupProps) {
  const childArray = React.Children.toArray(children);

  // If sorting is enabled, reorder critical badges to top
  const orderedChildren = sortCriticalFirst
    ? [...childArray].sort((a: any, b: any) => {
        const aIsCritical = a?.props?.type === "critical";
        const bIsCritical = b?.props?.type === "critical";
        if (aIsCritical && !bIsCritical) return -1;
        if (!aIsCritical && bIsCritical) return 1;
        return 0;
      })
    : childArray;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {orderedChildren}
    </div>
  );
}
