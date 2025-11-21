import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import PreparationModal, { normalizeIngredientName } from "@/components/PreparationModal";
import { SNACK_CATEGORIES } from "@/data/snackIngredients";
import { DIABETIC_SNACK_CATEGORIES } from "@/data/diabeticPremadeSnacks";
import { mealIngredients } from "@/data/mealIngredients";
import { useMacroTargeting } from "@/hooks/useMacroTargeting";
import { MacroTargetingControls } from "@/components/macro-targeting/MacroTargetingControls";

interface AIMealCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealGenerated: (meal: any) => void;
  mealSlot: "breakfast" | "lunch" | "dinner" | "snacks";
  showMacroTargeting?: boolean;
  dietType?: "weekly" | "diabetic";
}

export default function AIMealCreatorModal({
  open,
  onOpenChange,
  onMealGenerated,
  mealSlot,
  showMacroTargeting = false,
  dietType = "weekly",
}: AIMealCreatorModalProps) {
  const ACTIVE_SNACK_CATEGORIES = (dietType === "diabetic" && mealSlot === "snacks") 
    ? DIABETIC_SNACK_CATEGORIES 
    : SNACK_CATEGORIES;

  const [activeCategory, setActiveCategory] = useState<string>("proteins");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredients, setCustomIngredients] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [pendingIngredients, setPendingIngredients] = useState<string[]>([]);
  const [cookingStyles, setCookingStyles] = useState<Record<string, string>>({});
  const [needsPrepQueue, setNeedsPrepQueue] = useState<string[]>([]);
  const [currentPrepIndex, setCurrentPrepIndex] = useState(0);
  const tickerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  // Macro targeting for trainer features
  const macroTargetingState = useMacroTargeting('macroTargets::trainer::aiMealCreator');

  // List of ingredients that need cooking style selection (matching MealPremadePicker)
  const NEEDS_PREP = [
    'Eggs', 'Egg Whites', 'Whole Eggs',
    'Steak', 'Ribeye', 'Ribeye Steak', 'Sirloin Steak', 'Top Sirloin', 'Filet Mignon',
    'New York Strip', 'NY Strip', 'Strip Steak', 'Porterhouse', 'Porterhouse Steak',
    'T-Bone', 'T-Bone Steak', 'TBone Steak', 'Skirt Steak', 'Flank Steak',
    'Flat Iron Steak', 'Tri-Tip', 'Tri-Tip Steak', 'Hanger Steak',
    'Kobe Steak', 'Kobe Beef', 'Wagyu Steak', 'Wagyu Beef',
    'Chicken', 'Chicken Breast', 'Chicken Thighs', 'Chicken Sausage', 'Ground Chicken',
    'Turkey', 'Turkey Breast', 'Ground Turkey', 'Turkey Sausage',
    'Salmon', 'Tilapia', 'Cod', 'Tuna', 'Tuna Steak', 'Halibut', 'Mahi Mahi',
    'Trout', 'Sardines', 'Anchovies', 'Catfish', 'Sea Bass', 'Red Snapper',
    'Flounder', 'Orange Roughy', 'Sole',
    'Potatoes', 'Red Potatoes', 'Sweet Potatoes', 'Yams',
    'Rice', 'White Rice', 'Brown Rice', 'Jasmine Rice', 'Basmati Rice', 'Wild Rice',
    'Broccoli', 'Asparagus', 'Green Beans', 'Mixed Vegetables',
    'Cauliflower', 'Brussels Sprouts', 'Kale', 'Spinach',
    'Carrots', 'Celery', 'Cucumber',
    'Lettuce', 'Romaine Lettuce', 'Spring Mix'
  ];

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

  const cleanupGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    
    setGenerating(false);
    setProgress(0);
    setPendingIngredients([]);
    setCookingStyles({});
  };

  useEffect(() => {
    return () => {
      cleanupGeneration();
    };
  }, []);

  const toggleIngredient = (ingredientName: string) => {
    const isSelected = selectedIngredients.some((i) => i.toLowerCase() === ingredientName.toLowerCase());
    
    if (isSelected) {
      // Remove from selected
      setSelectedIngredients(prev => prev.filter((i) => i.toLowerCase() !== ingredientName.toLowerCase()));
      // Also remove its cooking style if it had one
      setCookingStyles(prev => {
        const updated = { ...prev };
        delete updated[ingredientName];
        return updated;
      });
    } else {
      // Check if this ingredient needs prep
      const normalizedIng = normalizeIngredientName(ingredientName);
      const needsPrep = NEEDS_PREP.some(prep => normalizeIngredientName(prep) === normalizedIng);
      
      if (needsPrep) {
        // Show prep modal IMMEDIATELY
        setCurrentIngredient(ingredientName);
        setPrepModalOpen(true);
      } else {
        // No prep needed, just add to selected list
        setSelectedIngredients(prev => [...prev, ingredientName]);
      }
    }
  };

  const handleGenerateMeal = () => {
    // Combine selected checkboxes + custom ingredients
    const customItems = customIngredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i);
    
    const allIngredients = [...selectedIngredients, ...customItems];
    
    if (allIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient or add custom ingredients",
        variant: "destructive"
      });
      return;
    }

    // All prep should already be done (happened when clicking ingredients)
    // Just generate the meal with selected ingredients and their styles
    generateMeal(allIngredients, cookingStyles);
  };

  const handlePrepSelect = (ingredient: string, style: string) => {
    // Save the cooking style
    setCookingStyles(prev => ({ ...prev, [ingredient]: style }));
    
    // Add ingredient to selected list
    setSelectedIngredients(prev => [...prev, ingredient]);
    
    // Close prep modal - user can continue selecting more ingredients
    setPrepModalOpen(false);
    setCurrentIngredient('');
  };

  const generateMeal = async (ingredients: string[], styles: Record<string, string>) => {
    setGenerating(true);
    startProgressTicker();
    
    abortControllerRef.current = new AbortController();
    
    try {
      // Apply cooking styles to ingredients that have them
      const ingredientsWithStyles = ingredients.map(ing => {
        const style = styles[ing];
        return style ? `${style} ${ing}` : ing;
      });

      // Get custom macro targets if enabled
      const customMacroTargets = macroTargetingState.serializeForRequest();

      const response = await fetch("/api/meals/fridge-rescue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fridgeItems: ingredientsWithStyles,
          userId: 1,
          mealType: mealSlot,
          ...(customMacroTargets && { macroTargets: customMacroTargets })
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error("Failed to generate meal");
      }

      const data = await response.json();
      console.log("🍳 AI Meal Creator received data:", data);

      let meal;
      if (data.meals && Array.isArray(data.meals) && data.meals.length > 0) {
        meal = data.meals[0];
      } else if (data.meal) {
        meal = data.meal;
      } else {
        console.error("❌ Invalid data structure:", data);
        throw new Error("No meal found in response");
      }

      if (!meal.imageUrl) {
        meal.imageUrl = `/assets/meals/default-${mealSlot}.jpg` || "/assets/meals/default-meal.jpg";
      }
      if (!meal.id) {
        meal.id = `ai-meal-${Date.now()}`;
      }

      console.log("✅ Generated meal:", meal.name);
      stopProgressTicker();

      onMealGenerated(meal);
      
      toast({
        title: "Meal Created!",
        description: `${meal.name} has been added`,
      });

      // Clean up and close
      cleanupGeneration();
      setSelectedIngredients([]);
      setSearchQuery("");
      onOpenChange(false);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Meal generation cancelled by user');
        return;
      }
      
      console.error("Error generating meal:", error);
      stopProgressTicker();
      toast({
        title: "Error",
        description: "Failed to generate meal. Please try again.",
        variant: "destructive"
      });
      
      cleanupGeneration();
    }
  };

  const handleCancel = () => {
    cleanupGeneration();
    setSelectedIngredients([]);
    setCustomIngredients("");
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      cleanupGeneration();
      setSelectedIngredients([]);
      setSearchQuery("");
      onOpenChange(false);
    }
  };

  // Get ingredients for current category
  const categoryIngredients = mealSlot !== "snacks" 
    ? (mealIngredients[activeCategory as keyof typeof mealIngredients] || [])
    : [];

  const filteredIngredients = searchQuery.trim()
    ? categoryIngredients.filter((item: any) => {
        const itemName = typeof item === 'string' ? item : item.name;
        return itemName.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : categoryIngredients;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border border-white/20 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            Create with AI
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-4">
          <p className="text-white/90 text-sm">
            Select ingredients and we'll create a delicious{" "}
            <span className="font-semibold text-white">{mealSlot}</span> recipe for you!
          </p>
        </div>

        {/* Macro Targeting Controls - Trainer Features Only */}
        {showMacroTargeting && (
          <MacroTargetingControls state={macroTargetingState} />
        )}

        {/* Category Tabs - Purple Style (Matching MealPremadePicker) */}
        {!generating && mealSlot !== "snacks" && (
          <div className="flex flex-nowrap gap-2 mb-3 overflow-x-auto w-full min-w-0 pb-2 overscroll-x-contain touch-pan-x">
            {Object.keys(mealIngredients).map((category) => {
              const displayName = category === 'proteins' ? 'Proteins' 
                : category === 'starchyCarbs' ? 'Starchy Carbs'
                : category === 'fibrousCarbs' ? 'Fibrous Carbs'
                : category === 'fats' ? 'Fats'
                : category === 'fruits' ? 'Fruits'
                : category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-purple-600/40 border-2 border-purple-400 text-white shadow-md'
                      : 'bg-black/40 border border-white/20 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        )}

        {/* Snack Category Suggestions */}
        {mealSlot === "snacks" && !generating && (
          <div className="flex flex-wrap gap-2 mb-3">
            {ACTIVE_SNACK_CATEGORIES.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => {
                  const categoryItems = category.items.slice(0, 5);
                  setSelectedIngredients((prev) => [...new Set([...prev, ...categoryItems])]);
                }}
                className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 rounded-lg text-xs text-white/90 transition-colors"
              >
                {category.emoji} {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Input */}
        <div className="mb-3">
          <Input
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/40 text-white border-white/20 placeholder:text-white/50"
          />
        </div>

        {/* Ingredient Checkboxes - Matching MealPremadePicker style */}
        {!generating && mealSlot !== "snacks" && (
          <div className="overflow-y-auto max-h-[50vh] mb-3 min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-2 gap-y-1">
              {filteredIngredients.map((item: any) => {
                const itemName = typeof item === 'string' ? item : item.name;
                return (
                  <div
                    key={itemName}
                    onClick={() => toggleIngredient(itemName)}
                    className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white group p-1 min-h-[44px] cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedIngredients.includes(itemName)}
                      className="h-1.5 w-1.5 border-white/30 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-500 pointer-events-none"
                    />
                    <span className="text-[11px] group-hover:text-emerald-300 transition-colors text-center">
                      {itemName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Ingredients Display Section */}
        {!generating && selectedIngredients.length > 0 && (
          <div className="mb-3 p-3 bg-black/30 border border-white/20 rounded-xl">
            <p className="text-white/70 text-xs mb-2 font-medium">Selected Ingredients:</p>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ing) => (
                <div
                  key={ing}
                  className="px-2 py-1 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-xs text-white/90 flex items-center gap-1"
                >
                  <span>{cookingStyles[ing] ? `${cookingStyles[ing]} ${ing}` : ing}</span>
                  <button
                    onClick={() => toggleIngredient(ing)}
                    className="text-white/50 hover:text-white/90 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Ingredient Input */}
        {!generating && (
          <div className="mb-3">
            <label className="text-white/70 text-xs mb-1 block font-medium">
              Add Custom Ingredients (comma-separated):
            </label>
            <Input
              placeholder="e.g., tomatoes, garlic, olive oil"
              value={customIngredients}
              onChange={(e) => setCustomIngredients(e.target.value)}
              className="bg-black/40 text-white border-white/20 placeholder:text-white/50"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-3">
          <Button
            onClick={handleGenerateMeal}
            disabled={generating || (selectedIngredients.length === 0 && !customIngredients.trim())}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          >
            Generate AI Meal
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="bg-black/40 border-white/20 text-white hover:bg-white/10"
            disabled={generating}
          >
            Cancel
          </Button>
        </div>

        {/* Progress Bar */}
        {generating && (
          <div className="w-full mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">AI Analysis Progress</span>
              <span className="text-sm text-white/80">{Math.round(progress)}%</span>
            </div>
            <Progress
              value={progress}
              className="h-3 bg-black/30 border border-white/20"
            />
          </div>
        )}
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
