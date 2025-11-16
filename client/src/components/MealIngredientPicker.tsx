import { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { mealIngredients } from "@/data/mealIngredients";
import { snackIngredients } from "@/data/snackIngredients";

interface MealIngredientPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealGenerated: (meal: any) => void;
  mealSlot: string;
  dietConfig?: any;
  dietType?: string;
}

export default function MealIngredientPicker({ 
  open, 
  onOpenChange, 
  onMealGenerated,
  mealSlot,
  dietConfig,
  dietType
}: MealIngredientPickerProps) {

  // 🔥🔥🔥 ADDED: Cooking style state (Option A)
  const [cookingStyles, setCookingStyles] = useState<Record<string, string>>({});

  // 🔥🔥🔥 ADDED: Ingredients that support cooking styles
  const COOKING_STYLE_ENABLED: Record<string, string[]> = {
    // Eggs
    "Eggs": ["Scrambled", "Sunny Side Up", "Omelet", "Poached", "Hard Boiled"],

    // Generic steak label
    "Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],

    // Common steak cuts
    "Sirloin Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Top Sirloin": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Ribeye": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Ribeye Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "New York Strip": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "NY Strip": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Strip Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Filet Mignon": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Tenderloin Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Porterhouse": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Porterhouse Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "T-Bone": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "T-Bone Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "TBone Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Skirt Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Flank Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Flat Iron Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Tri-Tip": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Tri-Tip Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Hanger Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],

    // Premium / branded beef
    "Kobe Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Kobe Beef": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Wagyu Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Wagyu Beef": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
  };


  // Ingredient source based on meal type and diet config
  const ingredientSource = (() => {
    if (dietConfig) {
      if (mealSlot === "snacks") {
        if (Array.isArray(dietConfig.snacks)) {
          return { "Snacks": dietConfig.snacks };
        }
        return dietConfig.snacks || snackIngredients;
      }
      return dietConfig;
    }
    return mealSlot === "snacks" 
      ? snackIngredients
      : mealIngredients;
  })();

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [customIngredients, setCustomIngredients] = useState('');
  const [generating, setGenerating] = useState(false);

  // Guided Tour state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hasSeenInfo, setHasSeenInfo] = useState(() => {
    try {
      return localStorage.getItem('meal-picker-info-seen') === 'true';
    } catch {
      return false;
    }
  });

  // 🎯 Macro Targeting State
  const MACRO_TARGETS_CACHE_KEY = `macro-targets-${mealSlot}`;

  const [macroTargetingEnabled, setMacroTargetingEnabled] = useState(() => {
    try {
      const cached = localStorage.getItem(MACRO_TARGETS_CACHE_KEY);
      return cached ? JSON.parse(cached).enabled : false;
    } catch {
      return false;
    }
  });

  const [targetProtein, setTargetProtein] = useState<number | ''>(() => {
    try {
      const cached = localStorage.getItem(MACRO_TARGETS_CACHE_KEY);
      return cached ? (JSON.parse(cached).protein || '') : '';
    } catch {
      return '';
    }
  });

  const [targetCarbs, setTargetCarbs] = useState<number | ''>(() => {
    try {
      const cached = localStorage.getItem(MACRO_TARGETS_CACHE_KEY);
      return cached ? (JSON.parse(cached).carbs || '') : '';
    } catch {
      return '';
    }
  });

  const [targetFat, setTargetFat] = useState<number | ''>(() => {
    try {
      const cached = localStorage.getItem(MACRO_TARGETS_CACHE_KEY);
      return cached ? (JSON.parse(cached).fat || '') : '';
    } catch {
      return '';
    }
  });

  const { toast } = useToast();

  const handleInfoModalClose = useCallback(() => {
    setShowInfoModal(false);
    if (!hasSeenInfo) {
      setHasSeenInfo(true);
      localStorage.setItem('meal-picker-info-seen', 'true');
    }
  }, [hasSeenInfo]);

  useEffect(() => {
    if (open && !hasSeenInfo) {
      setShowInfoModal(true);
    }
  }, [open, hasSeenInfo]);

  useEffect(() => {
    if (open && !activeCategory) {
      const firstCategory = Object.keys(ingredientSource)[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
      }
    }
  }, [open, ingredientSource, activeCategory]);

  const saveMacroTargetsCache = (enabled: boolean, protein: number | '', carbs: number | '', fat: number | '') => {
    try {
      localStorage.setItem(MACRO_TARGETS_CACHE_KEY, JSON.stringify({
        enabled,
        protein,
        carbs,
        fat
      }));
    } catch {}
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const validateMacroTargets = (): { valid: boolean; error?: string } => {
    if (!macroTargetingEnabled) return { valid: true };

    if (targetProtein === '' || targetCarbs === '' || targetFat === '') {
      return { valid: false, error: "All macro fields (protein, carbs, fat) must be filled when macro targeting is enabled" };
    }

    const protein = Number(targetProtein);
    const carbs = Number(targetCarbs);
    const fat = Number(targetFat);

    if (protein < 0 || protein > 200) {
      return { valid: false, error: "Protein must be between 0-200g" };
    }
    if (carbs < 0 || carbs > 200) {
      return { valid: false, error: "Carbs must be between 0-200g" };
    }
    if (fat < 0 || fat > 200) {
      return { valid: false, error: "Fat must be between 0-200g" };
    }

    return { valid: true };
  };

  const handleGenerateMeal = async () => {
    if (selectedIngredients.length < 1 && !customIngredients.trim()) {
      toast({
        title: "Ingredient Required",
        description: "Please select at least one ingredient",
        variant: "destructive"
      });
      return;
    }

    if (mealSlot !== "snacks") {
      const macroValidation = validateMacroTargets();
      if (!macroValidation.valid) {
        toast({
          title: "Invalid Macro Targets",
          description: macroValidation.error,
          variant: "destructive"
        });
        return;
      }
    }

    setGenerating(true);

    try {
      // STEP 1 — Start with selected ingredients
      let allIngredients = [...selectedIngredients];

      // STEP 2 — Include custom ingredients (comma-separated)
      if (customIngredients.trim()) {
        allIngredients.push(
          ...customIngredients.split(',').map(i => i.trim()).filter(Boolean)
        );
      }

      // STEP 3 — Apply cooking styles
      const allIngredientsWithStyles = allIngredients.map((name) => {
        const style = cookingStyles[name];
        if (!style) return name;

        // Eggs formatting
        if (name.toLowerCase().includes("egg")) {
          return `${style} ${name.toLowerCase() === "eggs" ? "eggs" : name}`;
        }

        // Steaks formatting
        return `${name} (${style})`;
      });

      // STEP 4 — Macro targets if enabled
      let macroTargets = null;
      if (
        macroTargetingEnabled &&
        targetProtein !== '' &&
        targetCarbs !== '' &&
        targetFat !== ''
      ) {
        macroTargets = {
          protein: Number(targetProtein),
          carbs: Number(targetCarbs),
          fat: Number(targetFat)
        };
      }

      // STEP 5 — Build payload including rewritten ingredients
      const requestPayload = {
        fridgeItems: allIngredientsWithStyles,
        userId: 1,
        mealSlot: mealSlot,
        ...(mealSlot !== "snacks" && macroTargets && { macroTargets }),
        ...(dietType && { dietType })
      };

      // STEP 6 — API call
      const data = await apiRequest('/api/meals/fridge-rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const generatedMeal = data.meals?.[0];

      if (!generatedMeal) {
        throw new Error('No meal generated');
      }

      // STEP 7 — Add default image
      const mealWithImage = {
        ...generatedMeal,
        imageUrl: generatedMeal.imageUrl || '/assets/meals/default-breakfast.jpg',
        ...(macroTargets && {
          macroTargets: {
            protein: macroTargets.protein,
            carbs: macroTargets.carbs,
            fat: macroTargets.fat
          }
        })
      };

      // STEP 8 — Send result back up
      onMealGenerated(mealWithImage);

      // STEP 9 — Reset UI state
      setSelectedIngredients([]);
      setCustomIngredients('');
      setActiveCategory('');
      setMacroTargetingEnabled(false);
      setTargetProtein('');
      setTargetCarbs('');
      setTargetFat('');
      saveMacroTargetsCache(false, '', '', '');
      onOpenChange(false);

      // STEP 10 — Macro accuracy toast
      if (macroTargets) {
        const proteinDiff = Math.abs(generatedMeal.protein - macroTargets.protein);
        const carbsDiff = Math.abs(generatedMeal.carbs - macroTargets.carbs);
        const fatDiff = Math.abs(generatedMeal.fat - macroTargets.fat);
        const withinTolerance = proteinDiff <= 5 && carbsDiff <= 5 && fatDiff <= 5;

        const missedMacros = [];
        if (proteinDiff > 5) missedMacros.push(`Protein off by ${proteinDiff.toFixed(1)}g`);
        if (carbsDiff > 5) missedMacros.push(`Carbs off by ${carbsDiff.toFixed(1)}g`);
        if (fatDiff > 5) missedMacros.push(`Fat off by ${fatDiff.toFixed(1)}g`);

        toast({
          title: withinTolerance ? "🎯 Perfect Macro Hit!" : "⚠️ Close to Target",
          description: withinTolerance 
            ? `${generatedMeal.name}\nActual: ${generatedMeal.protein}p / ${generatedMeal.carbs}c / ${generatedMeal.fat}f\nTarget: ${macroTargets.protein}p / ${macroTargets.carbs}c / ${macroTargets.fat}f ✓`
            : `${generatedMeal.name}\nActual: ${generatedMeal.protein}p / ${generatedMeal.carbs}c / ${generatedMeal.fat}f\nTarget: ${macroTargets.protein}p / ${macroTargets.carbs}c / ${macroTargets.fat}f\n${missedMacros.join(', ')}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Meal Generated!",
          description: `${generatedMeal.name} is ready to add`,
        });
      }

    } catch (error) {
      console.error('Failed to generate meal:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again with different ingredients",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category as any);
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'proteins': return '🥩 Proteins';
      case 'starchyCarbs': return '🍞 Starchy Carbs';
      case 'fibrousCarbs': return '🥦 Fibrous Carbs';
      case 'fats': return '🥑 Fats';
      case 'fruit': return '🍎 Fruit';
      case 'snacks': return '🥨 Snacks';
      default: return category;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl h-[90vh] sm:h-auto sm:max-h-[80vh] bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] border border-white/10 p-4 flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-white flex items-center gap-2 text-xl">
              <button
                onClick={() => setShowInfoModal(true)}
                className="w-8 h-8 bg-lime-700 hover:bg-lime-800 border-2 border-lime-600 text-white rounded-xl flex items-center justify-center text-sm font-bold flash-border"
                aria-label="How to use AI Meal Creator"
              >
                ?
              </button>
              AI Meal Creator - Pick Your Ingredients
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-nowrap gap-2 mb-3 overflow-x-auto w-full min-w-0 pb-2 overscroll-x-contain touch-pan-x">
            {Object.keys(ingredientSource).map((category) => {
              const categoryKey = category as keyof typeof ingredientSource;
              const items = ingredientSource[categoryKey];
              return (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-purple-600/40 border-2 border-purple-400 text-white shadow-md'
                      : 'bg-black/40 border border-white/20 text-white/70 hover:bg-white/10'
                  } ${!hasSeenInfo ? 'flash-border' : ''}`}
                >
                  {getCategoryLabel(category)} ({Array.isArray(items) ? items.length : 0})
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto mb-3 min-h-0">

            {mealSlot !== "snacks" && (
            <div className="mb-3 p-3 bg-black/30 border border-orange-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white text-sm font-semibold flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={macroTargetingEnabled}
                    onCheckedChange={(checked) => {
                      const newEnabled = checked as boolean;
                      setMacroTargetingEnabled(newEnabled);
                      saveMacroTargetsCache(newEnabled, targetProtein, targetCarbs, targetFat);
                    }}
                    className="h-4 w-4 border-orange-400/50 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-500"
                  />
                  🎯 Set Macro Targets
                </label>
              </div>

              {macroTargetingEnabled && (
                <div className="space-y-2 mt-3 animate-in fade-in duration-200">
                  <p className="text-white/60 text-xs mb-2">
                    AI will generate a meal hitting these exact macros (±5g tolerance)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-white/80 text-xs font-medium block mb-1">
                        Protein grams
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="200"
                        value={targetProtein}
                        onChange={(e) => {
                          const newValue = e.target.value === '' ? '' : Number(e.target.value);
                          setTargetProtein(newValue);
                          saveMacroTargetsCache(macroTargetingEnabled, newValue, targetCarbs, targetFat);
                        }}
                        placeholder="50"
                        className="bg-black/40 border-orange-500/30 text-white placeholder:text-white/30 text-sm h-9 text-center font-semibold"
                        data-testid="input-target-protein"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-xs font-medium block mb-1">
                        Carb grams
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="200"
                        value={targetCarbs}
                        onChange={(e) => {
                          const newValue = e.target.value === '' ? '' : Number(e.target.value);
                          setTargetCarbs(newValue);
                          saveMacroTargetsCache(macroTargetingEnabled, targetProtein, newValue, targetFat);
                        }}
                        placeholder="30"
                        className="bg-black/40 border-orange-500/30 text-white placeholder:text-white/30 text-sm h-9 text-center font-semibold"
                        data-testid="input-target-carbs"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-xs font-medium block mb-1">
                        Fat grams
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="200"
                        value={targetFat}
                        onChange={(e) => {
                          const newValue = e.target.value === '' ? '' : Number(e.target.value);
                          setTargetFat(newValue);
                          saveMacroTargetsCache(macroTargetingEnabled, targetProtein, targetCarbs, newValue);
                        }}
                        placeholder="20"
                        className="bg-black/40 border-orange-500/30 text-white placeholder:text-white/30 text-sm h-9 text-center font-semibold"
                        data-testid="input-target-fat"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setTargetProtein(50);
                        setTargetCarbs(30);
                        setTargetFat(20);
                        saveMacroTargetsCache(macroTargetingEnabled, 50, 30, 20);
                      }}
                      className="flex-1 px-2 py-1 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded text-white/80 text-xs transition-all"
                    >
                      50p / 30c / 20f
                    </button>
                    <button
                      onClick={() => {
                        setTargetProtein(40);
                        setTargetCarbs(40);
                        setTargetFat(15);
                        saveMacroTargetsCache(macroTargetingEnabled, 40, 40, 15);
                      }}
                      className="flex-1 px-2 py-1 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded text-white/80 text-xs transition-all"
                    >
                      40p / 40c / 15f
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Ingredient Grid */}
            <div className="mb-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-2 gap-y-1">
                {activeCategory && (() => {
                  const categoryItems = ingredientSource[activeCategory as keyof typeof ingredientSource];
                  if (!Array.isArray(categoryItems)) return null;
                  const sortedItems = categoryItems.slice().sort((a, b) => {
                    const nameA = typeof a === "string" ? a : a.name;
                    const nameB = typeof b === "string" ? b : b.name;
                    return nameA.localeCompare(nameB);
                  });
                  return sortedItems.map((ingredient: string | any, index: number) => {
                    const ingredientName = typeof ingredient === "string" ? ingredient : ingredient.name;
                    const isSelected = selectedIngredients.includes(ingredientName);
                    return (
                      <div
                        key={`${activeCategory}-${ingredientName}-${index}`}
                        onClick={() => toggleIngredient(ingredientName)}
                        className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white group p-1 min-h-[44px] cursor-pointer"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleIngredient(ingredientName)}
                          className="h-1.5 w-1.5 border-white/30 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-500 pointer-events-none"
                        />
                        <span 
                          className="text-[11px] group-hover:text-emerald-300 transition-colors text-center"
                        >
                          {ingredientName}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="mb-3 pb-3 border-b border-white/10">
              <label className="text-white text-xs font-semibold mb-1.5 block">
                Add Custom Ingredients
              </label>
              <Input
                value={customIngredients}
                onChange={(e) => setCustomIngredients(e.target.value)}
                placeholder="e.g., turkey bacon, almond milk, cauliflower rice"
                className="bg-black/40 border-white/20 text-white placeholder:text-white/40 text-xs h-8"
                data-testid="input-custom-ingredients"
              />
              <p className="text-white/40 text-[10px] mt-1">
                Separate multiple ingredients with commas
              </p>
            </div>

            {selectedIngredients.length > 0 && (
              <div className="mb-3 p-2 bg-emerald-600/10 border border-emerald-500/30 rounded-lg">
                <p className="text-emerald-300 text-xs">
                  ✓ {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* 🔥🔥🔥 ADDED: Cooking Styles UI */}
            {selectedIngredients.length > 0 && (
              <div className="space-y-3 mb-4">
                {selectedIngredients.map((ingredient) => {
                  const options = COOKING_STYLE_ENABLED[ingredient];
                  if (!options) return null;

                  return (
                    <div 
                      key={ingredient}
                      className="p-3 bg-black/30 border border-white/10 rounded-lg"
                    >
                      <p className="text-white text-xs font-semibold mb-1">
                        {ingredient}
                      </p>

                      <select
                        value={cookingStyles[ingredient] || ""}
                        onChange={(e) =>
                          setCookingStyles((prev) => ({
                            ...prev,
                            [ingredient]: e.target.value
                          }))
                        }
                        className="w-full bg-black/50 text-white text-xs border border-white/20 rounded-md px-2 py-1"
                      >
                        <option value="">Select cooking style</option>
                        {options.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          <div className="flex-shrink-0 space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={handleGenerateMeal}
                disabled={
                  generating || 
                  (selectedIngredients.length === 0 && !customIngredients.trim())
                }
                className={`flex-1 min-h-[48px] text-base font-semibold transition-all ${
                  generating || 
                  (selectedIngredients.length === 0 && !customIngredients.trim())
                    ? 'bg-gray-600/40 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30'
                }`}
                data-testid="button-generate-meal"
              >
                {generating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Meal...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate My Meal
                  </>
                )}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="bg-black/40 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>

            {generating && (
              <div>
                <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" style={{ width: '100%' }} />
                </div>
                <p className="text-white/60 text-xs text-center mt-2">
                  AI is crafting your perfect {mealSlot}...
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showInfoModal} onOpenChange={(isOpen) => !isOpen && handleInfoModalClose()}>
        <DialogContent className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md">
          <DialogDescription className="sr-only">
            Instructions for using the AI Meal Creator feature
          </DialogDescription>
          <h3 className="text-xl font-bold text-white mb-4">How to Use AI Meal Creator</h3>

          <div className="space-y-4 text-white/90 text-sm">
            <div>
              <strong className="text-lime-400">1. Pick any ingredients you want</strong>
              <p className="mt-1 text-white/70 text-xs">
                Select one or more ingredients from any category - proteins, carbs, vegetables, or fats
              </p>
            </div>

            <div>
              <strong className="text-lime-400">2. Mix and match freely</strong>
              <p className="mt-1 text-white/70 text-xs">
                Choose from the category tabs to customize your meal however you like
              </p>
            </div>

            <div>
              <strong className="text-lime-400">3. Generate your meal</strong>
              <p className="mt-1 text-white/70 text-xs">
                AI will create a delicious recipe with your selected ingredients
              </p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-lg p-3">
              <p className="font-semibold text-white mb-1">💡 Tip:</p>
              <p className="text-white/70">
                {mealSlot === "snacks" 
                  ? "You can pick just one ingredient (like 'apple' or 'protein bar') for ultra-quick snack ideas!"
                  : "Use 'Set Macro Targets' for precise meal portion sizes"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInfoModalClose}
            className="mt-6 w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
            data-testid="button-info-modal-close"
          >
            Got it!
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
