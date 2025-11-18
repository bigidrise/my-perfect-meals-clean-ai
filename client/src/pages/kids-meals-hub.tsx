// client/src/pages/kids-meals-hub.tsx
import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, ChefHat, ArrowLeft } from "lucide-react";
import { kidsMeals, type KidsMeal } from "@/data/kidsMealsData";
import HealthBadgesPopover from "@/components/badges/HealthBadgesPopover";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";
import CopyRecipeButton from "@/components/CopyRecipeButton";

const SERVING_OPTIONS = [1, 2, 4, 6, 8] as const;

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

function scaleQty(qty: number, fromServings: number, toServings: number): number {
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
  rounding: RoundingMode
): Ingredient {
  const scaled = scaleQty(ing.quantity, baseServings, toServings);
  const rounded = roundQty(scaled, rounding);
  return { ...ing, quantity: rounded };
}

function scaleIngredients(
  ings: Ingredient[],
  baseServings: number,
  toServings: number,
  rounding: RoundingMode
): Ingredient[] {
  return ings.map((ing) => scaledIngredient(ing, baseServings, toServings, rounding));
}

export default function KidsMealsHub() {
  const [, setLocation] = useLocation();
  const [selectedServings, setSelectedServings] = useState<number>(2);
  const [rounding, setRounding] = useState<RoundingMode>("tenth");
  const [filterText, setFilterText] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Auto-open instructions on first visit in coach mode
  useEffect(() => {
    const coachMode = localStorage.getItem("coachMode");
    const hasSeenKidsMealsInfo = localStorage.getItem("hasSeenKidsMealsInfo");

    if (coachMode === "guided" && !hasSeenKidsMealsInfo) {
      const timer = setTimeout(() => {
        setShowInfoModal(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInfoModalClose = () => {
    setShowInfoModal(false);
    localStorage.setItem("hasSeenKidsMealsInfo", "true");
  };

  const meals = useMemo(() => {
    const q = filterText.trim().toLowerCase();

    const withFallback = kidsMeals.map((m) => ({
      ...m,
      image: m.image ?? `/images/kids-meals/${m.id}.jpg`,
    }));

    if (!q) return withFallback;

    return withFallback.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.healthBadges?.some((t) => t.toLowerCase().includes(q)) ?? false) ||
        m.description.toLowerCase().includes(q)
    );
  }, [filterText]);

  const selected = meals.find(m => m.id === selectedMeal);
  const scaledIngs = selected ? scaleIngredients(selected.ingredients, selected.baseServings, selectedServings, rounding) : [];

  // Preparing the selectedRecipe object for CopyRecipeButton
  const selectedRecipe = selected ? {
    name: selected.name,
    ingredients: scaledIngs.map(ing => `${formatQty(ing.quantity)} ${pluralize(ing.unit, ing.quantity) || ''} ${ing.item}`.trim()).filter(Boolean),
    instructions: selected.instructions || [],
    funFact: selected.funFact,
    description: selected.description,
    prepTime: selected.prepTime,
    cookTime: selected.cookTime,
    totalTime: selected.totalTime,
    servings: selectedServings,
    healthBadges: selected.healthBadges
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-4 sm:p-6">
      {/* Back Button */}
      <Button
        onClick={() => setLocation("/healthy-kids-meals")}
        variant="ghost"
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-orange-900/40 backdrop-blur-none border border-orange-400/60 hover:bg-orange-800/50 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="max-w-6xl mx-auto pt-16 pb-32">
        {/* Header */}
        <div className="text-center mb-8 bg-black/20 backdrop-blur-lg border border-orange-400/70 rounded-2xl p-8 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="h-5 w-5 text-orange-300" />
            <h1 className="text-2xl font-bold text-white">Kids Meals Hub</h1>
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-lime-700 hover:bg-lime-800 transition-all duration-200 text-white font-bold flash-border"
              aria-label="How to use Kids Meals Hub"
            >
              ?
            </button>
          </div>
          <p className="text-sm text-white/90 max-w-2xl mx-auto">
            Pick a meal, choose servings (1–8), and we'll scale ingredients automatically
          </p>
        </div>

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
                  src={meal.image ?? `/images/kids-meals/${meal.id}.jpg`}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/meal-placeholder.jpg';
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-white">{meal.name}</h3>
                <p className="text-sm text-white/80 mb-3 line-clamp-2">{meal.description}</p>
                <HealthBadgesPopover badges={meal.healthBadges} className="mt-2" />
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
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-bold text-white">{selected.name}</h2>
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
                  src={selected.image ?? `/images/kids-meals/${selected.id}.jpg`}
                  alt={selected.name}
                  className="w-full h-64 object-cover rounded-lg mb-4 border border-orange-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/meal-placeholder.jpg';
                  }}
                />

                <p className="text-white/90 mb-4">{selected.description}</p>

                {/* Health Badges */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 text-white">Health Benefits</h3>
                  <HealthBadgesPopover badges={selected.healthBadges} className="mt-2" />
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 text-white">
                    Ingredients (for {selectedServings} {selectedServings === 1 ? "child" : "children"})
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
                    <h3 className="font-bold text-lg mb-2 text-white">Cooking Instructions</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {selected.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-white/90">{instruction}</li>
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

                {/* Copy Recipe Button */}
                {selectedRecipe && (
                  <div className="mt-4">
                    <CopyRecipeButton recipe={selectedRecipe} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shopping Bar - Fixed at bottom when modal is open */}
        {selected && (
          <ShoppingAggregateBar
            ingredients={scaledIngs.map(ing => ({
              name: ing.item,
              qty: ing.quantity,
              unit: ing.unit
            }))}
            source={`${selected.name} (${selectedServings} servings)`}
            sourceSlug="kids-meals"
          />
        )}

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">How to Use Kids Meals Hub</h2>
              <div className="space-y-3 text-white/90 text-sm mb-6">
                <p>20+ kid-friendly meals designed for ages 4-12 with fun presentations and balanced nutrition.</p>
                <p><strong>Steps:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Click any meal card to view details</li>
                  <li>Choose servings (1-8 kids)</li>
                  <li>Ingredients scale automatically</li>
                  <li>Add to shopping list at bottom</li>
                  <li>Filter by name or health badges</li>
                </ul>
                <p className="text-lime-400 font-medium mt-4">
                  💡 Tip: The more servings you choose, the easier meal prep becomes!
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