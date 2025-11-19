import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, RefreshCw } from "lucide-react";
import TrashButton from "@/components/ui/TrashButton";
import { SNACK_CATEGORIES } from "@/data/snackIngredients";
import { normalizeUnifiedMealOutput } from "@/lib/mealEngineApi";
import PreparationModal from "./PreparationModal"; // Assuming PreparationModal is in the same directory

interface AIMealCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealGenerated: (meal: any) => void;
  mealSlot: "breakfast" | "lunch" | "dinner" | "snacks";
}

export default function AIMealCreatorModal({
  open,
  onOpenChange,
  onMealGenerated,
  mealSlot,
}: AIMealCreatorModalProps) {
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const tickerRef = useRef<number | null>(null);

  // State for Preparation Modal
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [prepStyles, setPrepStyles] = useState({}); // Stores preparation styles for ingredients

  const startProgressTicker = () => {
    if (tickerRef.current) return;
    setProgress(0);
    tickerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p < 90) {
          const next = p + Math.max(1, Math.floor((90 - p) * 0.07));
          return Math.min(next, 90);
        }
        return p;
      });
    }, 150);
  };

  const stopProgressTicker = () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    setProgress(100);
  };

  const handleGenerateMeal = async () => {
    if (!ingredients.trim()) {
      alert("Please enter some ingredients first!");
      return;
    }

    // For AI Meal Creator, we need to open the preparation modal first.
    // For AI Premades, generation should start immediately if no prep is needed,
    // or after prep styles are selected.
    // This logic needs to be refined based on the specific meal generation flow.

    // For now, let's assume AI Meal Creator always opens the prep modal.
    // If this were AI Premades, we'd check if prep is needed and potentially open it.
    if (mealSlot !== "snacks") { // Assuming AI Meal Creator is used for non-snack slots
      const ingredientList = ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);

      // Check if any ingredient requires preparation style selection
      const needsPreparation = ingredientList.some(
        (ingredient) =>
          ["eggs", "red meat", "rice", "vegetables"].includes(ingredient.toLowerCase())
      );

      if (needsPreparation) {
        setCurrentIngredient(ingredientList[0]); // Set the first ingredient that needs prep
        setPrepModalOpen(true);
        return; // Stop here, wait for prep modal to resolve
      }
    }

    // If no preparation is needed or if it's AI Premades and it's ready to go
    setIsLoading(true);
    startProgressTicker();
    try {
      const response = await fetch("/api/meals/fridge-rescue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fridgeItems: ingredients
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i),
          userId: 1,
          // Pass preparation styles if available
          prepStyles: Object.keys(prepStyles).length > 0 ? prepStyles : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate meal");
      }

      const data = await response.json();
      console.log("🍳 AI Meal Creator received data:", data);

      // Standardized single meal format
      if (!data.meal) {
        console.error("❌ Invalid data structure:", data);
        throw new Error("No meal found in response");
      }

      // Normalize UnifiedMeal response to frontend format
      const meal = normalizeUnifiedMealOutput(data.meal);

      // Ensure meal has required fields
      if (!meal.imageUrl) {
        meal.imageUrl = "/assets/meals/default-breakfast.jpg";
      }
      if (!meal.id) {
        meal.id = `ai-meal-${Date.now()}`;
      }

      console.log("✅ Generated meal:", meal.name);
      stopProgressTicker();

      // Pass meal to parent and close modal
      onMealGenerated(meal);
      setIngredients("");
      setPrepStyles({}); // Reset prep styles
      onOpenChange(false);
    } catch (error) {
      console.error("Error generating meal:", error);
      stopProgressTicker();
      alert("Failed to generate meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for when a preparation style is selected in the modal
  const handlePrepSelect = (ingredient: string, style: string) => {
    setPrepStyles((prev) => ({ ...prev, [ingredient]: style }));
    setPrepModalOpen(false);
    // After selecting a style, we might want to automatically proceed to generation
    // or allow the user to select styles for other ingredients.
    // For now, let's assume we proceed if all needed ingredients have styles.

    const ingredientList = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i);

    const remainingIngredientsNeedingPrep = ingredientList.filter(
      (ing) =>
        ["eggs", "red meat", "rice", "vegetables"].includes(ing.toLowerCase()) &&
        !prepStyles[ing.toLowerCase()] && // Check if style is already selected
        ing.toLowerCase() !== ingredient.toLowerCase() // Exclude the one just selected
    );

    if (remainingIngredientsNeedingPrep.length === 0) {
      // All necessary preparations are done, trigger meal generation
      handleGenerateMeal();
    } else {
      // Set the next ingredient that needs preparation
      setCurrentIngredient(remainingIngredientsNeedingPrep[0]);
      setPrepModalOpen(true);
    }
  };


  // Cleanup ticker on unmount
  useEffect(() => {
    return () => {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-purple-900/95 via-pink-800/95 to-purple-900/95 backdrop-blur-xl border border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-400" />
            Create Meal with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="text-center">
            <p className="text-white/90 mb-4">
              Tell us what ingredients you have, and we'll create a delicious{" "}
              <span className="font-semibold text-pink-300">{mealSlot}</span> recipe
              for you!
            </p>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="ai-ingredients"
              className="block text-sm font-medium text-white/90"
            >
              Available Ingredients (separated by commas):
            </label>

            {/* Snack Category Suggestions */}
            {mealSlot === "snacks" && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-2">
                {SNACK_CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => {
                      const categoryItems = category.items.slice(0, 5).join(", ");
                      setIngredients((prev) =>
                        prev ? `${prev}, ${categoryItems}` : categoryItems
                      );
                    }}
                    className="px-3 py-1 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-400/30 rounded-lg text-xs text-white/90 transition-colors"
                  >
                    {category.emoji} {category.name}
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <textarea
                id="ai-ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder={
                  mealSlot === "snacks"
                    ? "e.g., greek yogurt, berries, almonds, dark chocolate"
                    : "e.g., eggs, spinach, cheese, tomatoes, bread"
                }
                className="w-full p-4 pr-10 border border-white/30 bg-black/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 text-white placeholder:text-white/50"
                rows={4}
                disabled={isLoading}
              />
              {ingredients.trim() && !isLoading && (
                <TrashButton
                  onClick={() => setIngredients("")}
                  size="sm"
                  ariaLabel="Clear ingredients"
                  title="Clear ingredients"
                  className="absolute top-2 right-2"
                />
              )}
            </div>
          </div>

          {/* Loading State with Progress Bar */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 text-pink-300 mb-4">
                <Sparkles className="h-6 w-6 animate-spin" />
                <span className="text-lg font-medium">
                  Creating your AI meal...
                </span>
              </div>

              <div className="max-w-md mx-auto mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">AI Analysis Progress</span>
                  <span className="text-sm text-white/80">{Math.round(progress)}%</span>
                </div>
                <Progress
                  value={progress}
                  className="h-3 bg-black/40 border border-white/30"
                />
              </div>

              <p className="text-white/70 text-sm">
                This may take 30-60 seconds
              </p>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerateMeal}
            disabled={isLoading || !ingredients.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-6 px-6 rounded-xl transition-all text-lg flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Creating... (~30 seconds)
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate AI Meal
              </>
            )}
          </Button>
        </div>
      </DialogContent>

      {/* Preparation Style Modal */}
      <PreparationModal
        open={prepModalOpen}
        ingredientName={currentIngredient}
        onClose={() => setPrepModalOpen(false)}
        onSelect={handlePrepSelect}
      />
    </Dialog>
  );
}