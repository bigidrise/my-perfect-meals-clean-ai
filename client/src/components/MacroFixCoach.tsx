
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell, Leaf, Wheat } from "lucide-react";

export type MacroKind = "protein" | "fibrous" | "starchy";

export default function MacroFixCoach({
  totals,
  targets,
  onFix,
  onHelp,
}: {
  totals: { protein:number; carbs:number; fat:number; calories:number; fibrous?:number; starchy?:number };
  targets: { protein:number; fibrous:number; starchy:number };
  onFix: (kind: MacroKind) => void;
  onHelp: () => void;
}) {
  const deficit = useMemo(() => ({
    protein: Math.max((targets?.protein ?? 0) - (totals?.protein ?? 0), 0),
    starchy: Math.max((targets?.starchy ?? 0) - (totals?.starchy ?? 0), 0),
    fibrous: Math.max((targets?.fibrous ?? 0) - (totals?.fibrous ?? 0), 0),
  }), [totals, targets]);

  const show = deficit.protein > 0 || deficit.starchy > 0 || deficit.fibrous > 0;
  if (!show) return null;

  return (
    <div className="mt-8 border border-lime-500/30 bg-black/40 backdrop-blur p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-lg font-semibold">Macro Fix Coach</h3>
        <button
          aria-label="Help"
          className="w-7 h-7 rounded-lg border border-white/20 text-white/90 hover:bg-white/10"
          onClick={onHelp}
        >?</button>
      </div>

      {deficit.protein > 0 && (
        <p className="text-lime-300 text-sm mb-1">You're short <b>{deficit.protein} g</b> of protein.</p>
      )}
      {deficit.starchy > 0 && (
        <p className="text-lime-300 text-sm mb-1">You're short <b>{deficit.starchy} g</b> of starchy carbs.</p>
      )}
      {deficit.fibrous > 0 && (
        <p className="text-lime-300 text-sm mb-1">You're short <b>{deficit.fibrous} g</b> of fibrous carbs.</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {deficit.protein > 0 && (
          <Button variant="outline" onClick={() => onFix("protein")} className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" /> Add Protein
          </Button>
        )}
        {deficit.fibrous > 0 && (
          <Button variant="outline" onClick={() => onFix("fibrous")} className="flex items-center gap-2">
            <Leaf className="h-4 w-4" /> Add Fibrous Carb
          </Button>
        )}
        {deficit.starchy > 0 && (
          <Button variant="outline" onClick={() => onFix("starchy")} className="flex items-center gap-2">
            <Wheat className="h-4 w-4" /> Add Starchy Carb
          </Button>
        )}
      </div>
    </div>
  );
}
