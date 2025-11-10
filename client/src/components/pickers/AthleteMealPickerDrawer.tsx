
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Meal } from "@/components/MealCard";
import {
  getAthleteMealsByCategory,
  type AthleteMeal,
} from "@/data/athleteMeals";

// 🔄 Convert AthleteMeal to standard Meal
function convertAthleteMealToMeal(athleteMeal: AthleteMeal): Meal {
  const ingredients = [
    {
      item: athleteMeal.protein_source,
      amount: `${athleteMeal.protein_oz} oz`,
    },
    ...(athleteMeal.carb_source
      ? [{ item: athleteMeal.carb_source, amount: `${athleteMeal.carb_g}g` }]
      : []),
    ...athleteMeal.fibrous_source.map((veg: string) => ({
      item: veg,
      amount: "1 cup",
    })),
  ];

  const instructions = [
    `Grill or bake ${athleteMeal.protein_source} (${athleteMeal.protein_oz}oz)`,
    ...(athleteMeal.carb_source
      ? [`Prepare ${athleteMeal.carb_source} (${athleteMeal.carb_g}g)`]
      : []),
    ...(athleteMeal.fibrous_source.length
      ? [`Steam or grill ${athleteMeal.fibrous_source.join(", ")}`]
      : []),
    "Season to taste with low-sodium options",
  ];

  const uniqueId = `${athleteMeal.id}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  const totalCarbs = athleteMeal.macros.starchyCarbs + athleteMeal.macros.fibrousCarbs;

  return {
    id: uniqueId,
    title: athleteMeal.title,
    servings: 1,
    ingredients,
    instructions,
    nutrition: {
      calories: athleteMeal.macros.kcal,
      protein: athleteMeal.macros.protein,
      carbs: totalCarbs,
      fat: athleteMeal.macros.fat,
    },
    badges: athleteMeal.tags,
  };
}

const DEFAULT_CATEGORY = "poultry";

const CATEGORY_OPTIONS = [
  { value: "poultry", label: "🐔 Chicken & Turkey" },
  { value: "redmeat", label: "🥩 Red Meat" },
  { value: "fish", label: "🐟 Fillet Fish" },
  { value: "eggs_shakes", label: "🥚 Eggs & Shakes" },
] as const;

export function AthleteMealPickerDrawer({
  open,
  list,
  onClose,
  onPick,
}: {
  open: boolean;
  list: "breakfast" | "lunch" | "dinner" | "snacks" | null;
  onClose: () => void;
  onPick: (meal: Meal) => void;
}) {
  const [category, setCategory] =
    React.useState<AthleteMeal["category"]>(DEFAULT_CATEGORY);

  // Reset category when drawer opens
  React.useEffect(() => {
    if (open) {
      setCategory(DEFAULT_CATEGORY);
    }
  }, [open]);

  // Filter meals by selected category
  const filteredMeals = React.useMemo(() => {
    return getAthleteMealsByCategory(category);
  }, [category]);

  if (!open || !list) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-gradient-to-b from-lime-950/95 via-zinc-900/95 to-black/95 border-lime-500/30 text-white max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            🏆 Competition Prep Meals - Add to {list}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Selector */}
          <div className="bg-black/30 p-4 rounded-lg border border-lime-500/20">
            <label className="text-white/80 text-sm mb-2 block">Select Protein Category:</label>
            <Select
              value={category}
              onValueChange={(val) =>
                setCategory(val as AthleteMeal["category"])
              }
            >
              <SelectTrigger className="w-full bg-lime-900/60 border-lime-500/50 text-white h-10 text-sm flash-border">
                <SelectValue>
                  {CATEGORY_OPTIONS.find((opt) => opt.value === category)
                    ?.label ?? "Select Category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900/95 border-lime-500/30 text-white">
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-lime-500/20 focus:bg-lime-500/30 cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredMeals.map((am: AthleteMeal) => (
              <button
                key={am.id}
                onClick={() => {
                  const mealToAdd = convertAthleteMealToMeal(am);
                  onPick(mealToAdd);
                }}
                className="w-full text-left rounded-xl border border-lime-500/30 bg-black/50 hover:bg-lime-900/30 p-4 transition-all hover:border-lime-400/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-white/90 font-medium text-sm flex-1 leading-tight">
                    {am.title.includes('(') ? (
                      <>
                        {am.title.split('(')[0].trim()}
                        <br />
                        <span className="text-xs text-white/70">({am.title.split('(')[1]}</span>
                      </>
                    ) : (
                      am.title
                    )}
                  </div>
                  {am.includeCarbs ? (
                    <Badge className="bg-lime-600/80 text-white text-[10px] ml-2 px-2 py-0.5 shrink-0">
                      Carbs
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-600/80 text-white text-[10px] ml-2 px-2 py-0.5 shrink-0">
                      P+V
                    </Badge>
                  )}
                </div>

                <div className="text-white/70 text-xs mb-1 leading-tight">
                  {am.protein_source} ({am.protein_oz}oz)
                  {am.carb_source && ` • ${am.carb_source} (${am.carb_g}g)`}
                </div>

                <div className="text-lime-300/80 text-xs font-semibold leading-tight">
                  {am.macros.kcal} kcal · P{am.macros.protein} · C
                  {am.macros.starchyCarbs + am.macros.fibrousCarbs} · F{am.macros.fat}
                </div>

                {am.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {am.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[9px] bg-lime-600/20 text-lime-300 px-1.5 py-0.5 rounded-full leading-none"
                      >
                        {tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            ))}
          </div>

          {/* Info Note */}
          <div className="bg-lime-900/20 border border-lime-500/30 rounded-lg p-3 text-xs text-white/70">
            <p className="mb-1"><span className="font-semibold text-lime-300">Competition Prep Meals:</span> Pre-designed athlete meals optimized for lean muscle building and performance.</p>
            <p className="text-white/60">Click any meal to add it to your board. Macros are calculated and ready to track.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
