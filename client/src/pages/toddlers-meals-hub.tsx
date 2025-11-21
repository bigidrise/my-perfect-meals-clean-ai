// client/src/pages/toddlers-meals-hub.tsx
import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, ChefHat, ArrowLeft } from "lucide-react";
import { toddlersMeals, type ToddlersMeal } from "@/data/toddlersMealsData";
import HealthBadgesPopover from "@/components/badges/HealthBadgesPopover";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";
import CopyRecipeButton from "@/components/CopyRecipeButton";

const SERVING_OPTIONS = [1, 2, 3, 4] as const;

type RoundingMode = "tenth" | "half" | "whole";

function roundQty(value: number, mode: RoundingMode = "tenth"): number {
  if (!isFinite(value)) return 0;
  switch (mode) {
    case "half":
      return Math.round(value * 2) / 2;
    case "whole":
      return Math.round(value);
    default:
      return Math.round(value * 10) / 10;
  }
}

function scaleQty(
  qty: number,
  fromServings: number,
  toServings: number,
): number {
  if (!fromServings || fromServings <= 0) return qty;
  return qty * (toServings / fromServings);
}

function formatQty(qty: number): string {
  const s = qty.toFixed(2);
  return parseFloat(s).toString();
}

function pluralize(unit: string | undefined, qty: number): string | undefined {
  if (!unit) return unit;
  const u = unit.trim();
  if (qty === 1) return u.replace(/s$/i, "");
  if (!/s$/i.test(u) && !/(oz|ml|g|kg|lb)$/i.test(u)) return `${u}s`;
  return u;
}

type Ingredient = {
  item: string;
  quantity: number;
  unit: string;
};

function scaledIngredient(
  ing: Ingredient,
  baseServings: number,
  toServings: number,
  rounding: RoundingMode,
): Ingredient {
  const scaled = scaleQty(ing.quantity, baseServings, toServings);
  const rounded = roundQty(scaled, rounding);
  return { ...ing, quantity: rounded };
}

function scaleIngredients(
  ings: Ingredient[],
  baseServings: number,
  toServings: number,
  rounding: RoundingMode,
): Ingredient[] {
  return ings.map((ing) =>
    scaledIngredient(ing, baseServings, toServings, rounding),
  );
}

export default function ToddlersMealsHub() {
  const [, setLocation] = useLocation();
  const [selectedServings, setSelectedServings] = useState<number>(2);
  const [rounding, setRounding] = useState<RoundingMode>("tenth");
  const [filterText, setFilterText] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Auto-open instructions on first visit in coach mode
  useEffect(() => {
    const coachMode = localStorage.getItem("coachMode");
    const hasSeenToddlersMealsInfo = localStorage.getItem("hasSeenToddlersMealsInfo");

    if (coachMode === "guided" && !hasSeenToddlersMealsInfo) {
      setTimeout(() => {
        setShowInfoModal(true);
      }, 300);
    }
  }, []);

  const handleInfoModalClose = () => {
    setShowInfoModal(false);
    localStorage.setItem("hasSeenToddlersMealsInfo", "true");
  };

  const meals = useMemo(() => {
    const q = filterText.trim().toLowerCase();

    const withFallback = toddlersMeals.map((m) => ({
      ...m,
      image: m.image ?? `/images/toddlers/${m.id}.jpg`,
    }));

    if (!q) return withFallback;

    return withFallback.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.healthBadges?.some((t) => t.toLowerCase().includes(q)) ?? false) ||
        m.description.toLowerCase().includes(q),
    );
  }, [filterText]);

  const selected = meals.find((m) => m.id === selectedMeal);
  const scaledIngs = selected
    ? scaleIngredients(
        selected.ingredients,
        selected.baseServings,
        selectedServings,
        rounding,
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-safe-nav">
      {/* Universal Safe-Area Header */}
      <div
        className="fixed left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10"
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="px-8 py-3 flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => setLocation("/healthy-kids-meals")}
            className="flex items-center gap-2 text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-bold text-white">Toddlers (1–3) Grazing</h1>

          {/* Info Button */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="ml-auto flex items-center justify-center w-8 h-8 rounded-xl bg-lime-700 hover:bg-lime-800 transition-all duration-200 text-white text-xl font-bold flash-border"
            aria-label="How to use Toddlers Meals Hub"
          >
            ?
          </button>
        </div>
      </div>

      <div
        className="max-w-6xl mx-auto px-4 sm:px-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 6rem)" }}
      >

        {/* Controls */}
        <Card className="mb-6 bg-black/50 backdrop-blur-sm border border-orange-400/70">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-white/80">Search meals</Label>
                <Input
                  placeholder="Search by name or tag…"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="bg-black/40 text-white border-white/20 placeholder:text-white/40"
                />
              </div>

              <div>
                <Label className="text-white/80">Servings</Label>
                <div className="flex gap-2 flex-wrap">
                  {SERVING_OPTIONS.map((n) => (
                    <Button
                      key={n}
                      size="sm"
                      onClick={() => setSelectedServings(n)}
                      className={
                        selectedServings === n
                          ? "bg-orange-600 text-white"
                          : "bg-black/60 border border-white/30 text-white hover:bg-black/80"
                      }
                    >
                      <Users className="w-4 h-4 mr-1" /> {n}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white/80">Rounding</Label>
                <div className="flex gap-2 flex-wrap">
                  {(["tenth", "half", "whole"] as RoundingMode[]).map((m) => (
                    <Button
                      key={m}
                      size="sm"
                      onClick={() => setRounding(m)}
                      className={
                        rounding === m
                          ? "bg-orange-600 text-white"
                          : "bg-black/60 border border-white/30 text-white hover:bg-black/80"
                      }
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {meals.map((meal) => (
            <Card
              key={meal.id}
              className="cursor-pointer transform hover:scale-105 transition-all duration-200 bg-black/50 backdrop-blur-sm border border-orange-400/70 shadow-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              onClick={() => setSelectedMeal(meal.id)}
            >
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={meal.image || `/images/toddlers/${meal.id}.jpg`}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/meal-placeholder.jpg";
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-white">
                  {meal.name}
                </h3>
                <p className="text-sm text-white/80 mb-3 line-clamp-2">
                  {meal.description}
                </p>
                <HealthBadgesPopover
                  badges={meal.healthBadges}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMeal(null)}
          >
            <Card
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-black/50 border border-orange-400/70 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <CardContent className="p-6 pb-32">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-bold text-white">
                    {selected.name}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMeal(null)}
                    className="text-orange-300 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <img
                  src={selected.image || `/images/toddlers/${selected.id}.jpg`}
                  alt={selected.name}
                  className="w-full h-64 object-cover rounded-lg mb-4 border border-orange-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/meal-placeholder.jpg";
                  }}
                />

                <p className="text-white/90 mb-4">{selected.description}</p>

                {/* Health Badges */}
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="font-bold text-lg text-white">
                      Health Benefits
                    </h3>
                    <CopyRecipeButton recipe={{
                      name: selected.name,
                      ingredients: scaledIngs.map(ing => ({
                        name: ing.item,
                        amount: formatQty(ing.quantity),
                        unit: pluralize(ing.unit, ing.quantity)
                      })),
                      instructions: selected.instructions
                    }} />
                  </div>
                  <HealthBadgesPopover
                    badges={selected.healthBadges}
                    className="mt-2"
                  />
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 text-white">
                    Ingredients (for {selectedServings}{" "}
                    {selectedServings === 1 ? "toddler" : "toddlers"})
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {scaledIngs.map((ing, idx) => {
                      const unit = pluralize(ing.unit, ing.quantity);
                      return (
                        <li key={idx} className="text-white/90">
                          {formatQty(ing.quantity)} {unit} {ing.item}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Instructions */}
                {selected.instructions && selected.instructions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2 text-white">
                      How to Make
                    </h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {selected.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-white/90">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Fun Fact */}
                {selected.funFact && (
                  <div className="mb-4 p-4 bg-orange-600/20 border border-orange-400/40 rounded-lg">
                    <h4 className="font-bold text-white mb-2">Fun Fact!</h4>
                    <p className="text-white/90 text-sm">{selected.funFact}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shopping Bar - Fixed at bottom when modal is open */}
        {selected && (
          <ShoppingAggregateBar
            ingredients={scaledIngs.map((ing) => ({
              name: ing.item,
              qty: ing.quantity,
              unit: ing.unit,
            }))}
            source={`${selected.name} (${selectedServings} servings)`}
            sourceSlug="toddler-meals"
            hideCopyButton={true}
          />
        )}

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">How to Use Toddlers Meals Hub</h2>
              <div className="space-y-3 text-white/90 text-sm mb-6">
                <p>Soft textures, low-salt, veggie-smart ideas for toddlers ages 1-3.</p>
                <p><strong>Steps:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Click any meal card to view details</li>
                  <li>Choose servings (1-4 toddlers)</li>
                  <li>Ingredients scale automatically</li>
                  <li>Add to shopping list at bottom</li>
                  <li>All meals designed for developing palates</li>
                </ul>
                <p className="text-lime-400 font-medium mt-4">
                  💡 Tip: Toddler meals focus on soft textures and low-sodium options perfect for growing kids!
                </p>
              </div>
              <button
                onClick={handleInfoModalClose}
                className="w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
