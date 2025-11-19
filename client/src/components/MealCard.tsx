// client/src/components/MealCard.tsx
import * as React from "react";
import { BarChart3 } from "lucide-react";
import { generateMedicalBadges, getUserMedicalProfile, type MedicalBadge } from "@/utils/medicalBadges";
import HealthBadgesPopover from "@/components/badges/HealthBadgesPopover";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import MacroBridgeButton from "@/components/biometrics/MacroBridgeButton";
import TrashButton from "@/components/ui/TrashButton";
import { formatIngredientWithGrams } from "@/utils/unitConversions";
import type { UnifiedMeal } from "@/types/unifiedMeal";
import { mapToViewMeal } from "@/utils/mealViewAdapter";

// Keep your Meal type colocated here (WeeklyMealBoard imports from this file)
export type Meal = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  servings?: number;
  ingredients?: any[];
  instructions?: any[];
  nutrition?: { calories: number; protein: number; carbs: number; fat: number };
  orderIndex?: number;
  entryType?: "quick" | "recipe";
  brand?: string;
  servingDesc?: string;
  includeInShoppingList?: boolean;
  badges?: string[];
  imageUrl?: string;
  cookingTime?: string;
  difficulty?: string;
  medicalBadges?: any[];
};

type Slot = "breakfast" | "lunch" | "dinner" | "snacks";

function MacroPill({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-black/30 px-2 py-1 text-center">
      <div className="text-[10px] uppercase tracking-wide text-white/60">{label}</div>
      <div className="text-white font-medium">{Math.round(value)}{suffix}</div>
    </div>
  );
}

export function MealCard({
  date, slot, meal, unifiedMeal, onUpdated,
}: {
  date: string; // "board" or "YYYY-MM-DD"
  slot: Slot;
  meal: Meal;
  unifiedMeal?: UnifiedMeal | null;
  onUpdated: (m: Meal | null) => void; // null = delete
}) {
  const { toast } = useToast();
  const [macrosLogged, setMacrosLogged] = React.useState(false);
  
  const viewMeal = mapToViewMeal({ legacyMeal: meal, unifiedMeal });
  
  const title = viewMeal.name;
  const kcal = viewMeal.calories ?? 0;
  const protein = viewMeal.protein ?? 0;
  const carbs = viewMeal.carbs ?? 0;
  const fat = viewMeal.fat ?? 0;

  const onDelete = () => { if (confirm("Remove this meal from the board?")) onUpdated(null); };

  const handleLogMacros = async () => {
    try {
      const { post } = await import("@/lib/api");
      const logEntry = {
        mealName: title,
        calories: kcal,
        protein,
        carbs,
        fat,
        servings: meal.servings || 1,
        source: "weekly-meal-board"
      };

      await post("/api/macros/log", logEntry);

      queryClient.invalidateQueries({ queryKey: ["macros"] });
      window.dispatchEvent(new Event("macros:updated"));

      setMacrosLogged(true);
      toast({
        title: "Logged Successfully",
        description: `${title} has been logged to your macros.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log macros. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl overflow-hidden hover:bg-white/10 transition-colors">
      {/* Image at top if available (EXACT COPY FROM FRIDGE RESCUE) */}
      {viewMeal.imageUrl && (
        <div className="relative">
          <img
            src={viewMeal.imageUrl}
            alt={title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&auto=format`;
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="absolute top-2 right-2 z-50" onClick={(e) => e.stopPropagation()}>
          <TrashButton
            size="sm"
            onClick={() => onUpdated(null)}
            ariaLabel="Delete meal"
            title="Delete meal"
            confirm={true}
            confirmMessage="Remove this meal from the board?"
            className="touch-manipulation"
          />
        </div>

        <div className="pr-12">
          <h3 className="text-white font-semibold leading-snug text-lg">
            {title.includes('(') ? (
              <>
                {title.split('(')[0].trim()}
                <br />
                ({title.split('(')[1]}
              </>
            ) : (
              title
            )}
          </h3>
          
          {/* Description (EXACT COPY FROM FRIDGE RESCUE) */}
          {viewMeal.description && (
            <p className="text-sm text-white/80 mt-1">{viewMeal.description}</p>
          )}

          {/* Medical Badges - Use viewMeal badges if available, otherwise generate */}
          {(() => {
            if (viewMeal.medicalBadges && viewMeal.medicalBadges.length > 0) {
              const badgeIds = viewMeal.medicalBadges.map(b => b.label);
              return (
                <div className="mt-2">
                  <HealthBadgesPopover badges={badgeIds} />
                </div>
              );
            }
            
            const userProfile = getUserMedicalProfile(1);
            const mealForBadges = {
              name: title,
              nutrition: { calories: kcal, protein, carbs, fat },
              ingredients: viewMeal.ingredients || [],
              description: viewMeal.description || ''
            };
            const medicalBadges = generateMedicalBadges(mealForBadges, userProfile);
            const badgeIds = medicalBadges.map(b => b.badge);
            
            return medicalBadges && medicalBadges.length > 0 && (
              <div className="mt-2">
                <HealthBadgesPopover badges={badgeIds} />
              </div>
            );
          })()}
          
          {/* Nutrition Grid (EXACT COPY FROM FRIDGE RESCUE) */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-md">
              <div className="text-sm font-bold text-green-400">{Math.round(kcal)}</div>
              <div className="text-xs text-white/70">Cal</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-md">
              <div className="text-sm font-bold text-blue-400">{Math.round(protein)}g</div>
              <div className="text-xs text-white/70">Protein</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-md">
              <div className="text-sm font-bold text-orange-400">{Math.round(carbs)}g</div>
              <div className="text-xs text-white/70">Carbs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-md">
              <div className="text-sm font-bold text-purple-400">{Math.round(fat)}g</div>
              <div className="text-xs text-white/70">Fat</div>
            </div>
          </div>
        
        {viewMeal.servingSize && (
          <div className="mt-2 text-[11px] text-white/60">
            <span>• {viewMeal.servingSize}</span>
          </div>
        )}

        {/* Ingredients */}
        {Array.isArray(viewMeal.ingredients) && viewMeal.ingredients.length > 0 && (
          <div className="mt-3 space-y-2">
            <h4 className="text-sm font-semibold text-white">Ingredients:</h4>
            <ul className="text-xs text-white/80 space-y-1">
              {viewMeal.ingredients.slice(0, 4).map((ing, i: number) => {
                const displayText = ing.displayQuantity
                  ? `${ing.displayQuantity} ${ing.name}`
                  : ing.amount && ing.unit
                  ? formatIngredientWithGrams(ing.amount, ing.unit, ing.name)
                  : ing.name;
                
                return (
                  <li key={i} className="flex items-start">
                    <span className="text-green-400 mr-1">•</span>
                    <span>{displayText}</span>
                  </li>
                );
              })}
              {viewMeal.ingredients.length > 4 && (
                <li className="text-xs text-white/60">
                  + {viewMeal.ingredients.length - 4} more...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Cooking Instructions */}
        {viewMeal.instructions && viewMeal.instructions.length > 0 && (
          <div className="mt-3 space-y-2">
            <h4 className="text-sm font-semibold text-white">Instructions:</h4>
            <div className="text-xs text-white/80">
              {viewMeal.instructions.map((step, i) => (
                <p key={i}>{step}</p>
              ))}
            </div>
          </div>
        )}

        {/* Add to Macros Button - Only show when we have a valid date (day mode) */}
        {date !== "board" && (
          <div className="mt-3">
            <MacroBridgeButton
              meal={{
                protein: protein || 0,
                carbs: carbs || 0,
                fat: fat || 0,
                calories: kcal || 0,
                dateISO: date,
                mealSlot: slot === "snacks" ? "snack" : slot,
                servings: viewMeal.servings || 1,
              }}
              label="Add to Macros"
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
