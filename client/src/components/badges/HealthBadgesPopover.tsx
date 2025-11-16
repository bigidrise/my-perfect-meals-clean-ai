import { useMemo } from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { normalizeBadges } from "./healthBadges";

const CRITICAL_BADGE_KEYS = [
  "cardiac",
  "heart-healthy",
  "heart",
  "renal",
  "kidney",
  "glp1",
  "diabetes",
  "diabetic",
];

export default function HealthBadgesPopover({
  badges,
  label = "Medical badges",
  className = "",
  align = "center",
  side = "top",
}: {
  badges?: string[];
  label?: string;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
}) {
  const items = useMemo(() => normalizeBadges(badges), [badges]);
  const count = items.length;
  const hasCritical = items.some(item =>
    CRITICAL_BADGE_KEYS.includes(item.key)
  );

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`relative w-5 h-5 flex items-center justify-center text-sm font-bold rounded-xl 
              ${
                hasCritical
                  ? "bg-red-600 hover:bg-red-700 border-2 border-red-500 shadow-glow-red"
                  : "bg-lime-700 hover:bg-lime-800 border-2 border-lime-600 text-white"
              }`}
            data-testid="button-medical-badges"
            title={label}
          >
            ?
            {hasCritical && (
              <span className="absolute inset-0 rounded-xl border-2 border-red-500 shadow-glow-red animate-ping" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          side={side}
          sideOffset={8}
          className="rounded-2xl bg-black/90 text-white border border-white/10 shadow-lg max-w-xs p-4 space-y-2 text-sm z-50"
        >
          <div className="font-semibold mb-2 text-white/90">
            {count === 0 ? "Medical Badges" : `Medical Badges (${count})`}
          </div>
          {count === 0 ? (
            <div className="text-white/60 text-xs" data-testid="text-no-badges">
              No health badges for this meal.
            </div>
          ) : (
            items.map(item => (
              <div key={item.key} className="flex items-start gap-2" data-testid={`badge-row-${item.key}`}>
                <span className={`inline-flex h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                  CRITICAL_BADGE_KEYS.includes(item.key) ? "bg-red-500" : "bg-white/70"
                }`} />
                <div>
                  <div className="font-medium" data-testid={`text-badge-label-${item.key}`}>{item.label}</div>
                  {item.desc && <div className="text-white/80 text-xs" data-testid={`text-badge-desc-${item.key}`}>{item.desc}</div>}
                </div>
              </div>
            ))
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}