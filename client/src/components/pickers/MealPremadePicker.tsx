
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import PreparationModal from '@/components/PreparationModal';
import { 
  getBreakfastMealsByCategory,
  type BreakfastCategory,
  categoryDisplayNames as breakfastDisplayNames
} from '@/data/aiPremadeBreakfast';
import {
  getLunchMealsByCategory,
  type LunchCategory,
  lunchCategoryDisplayNames
} from '@/data/aiPremadeLunch';
import {
  getDinnerMealsByCategory,
  type DinnerCategory,
  dinnerCategoryDisplayNames
} from '@/data/aiPremadeDinner';
import { normalizeUnifiedMealOutput } from '@/lib/mealEngineApi';

interface MealPremadePickerProps {
  open: boolean;
  onClose: () => void;
  onMealSelect?: (meal: any) => void;
  mealType?: 'breakfast' | 'lunch' | 'dinner';
}

// Helper to transform meals to picker format
const transformMeals = (meals: any[]) => meals.map(meal => ({
  id: meal.id,
  name: meal.name,
  defaultCookingMethod: meal.defaultCookingMethod,
  actualIngredients: meal.ingredients,
  ingredients: meal.ingredients.map((ing: any) => ({
    item: ing.item,
    amount: `${ing.quantity} ${ing.unit}`,
    preparation: meal.defaultCookingMethod || 'as preferred'
  }))
}));

// Build breakfast premades
const breakfastPremades = {
  'All Protein': transformMeals(getBreakfastMealsByCategory('all-protein')),
  'Protein + Carb': transformMeals(getBreakfastMealsByCategory('protein-carb')),
  'Egg-Based Meals': transformMeals(getBreakfastMealsByCategory('egg-based'))
};

// Build lunch premades
const lunchPremades = {
  'Lean Protein Plates': transformMeals(getLunchMealsByCategory('lean-plates')),
  'Protein + Carb Bowls': transformMeals(getLunchMealsByCategory('protein-carb-bowls')),
  'Wraps, Sandwiches & Melts': transformMeals(getLunchMealsByCategory('wraps-sandwiches')),
  'High-Protein Salads': transformMeals(getLunchMealsByCategory('high-protein-salads'))
};

// Build dinner premades
const dinnerPremades = {
  'Lean Protein Plates': transformMeals(getDinnerMealsByCategory('lean-plates')),
  'Protein + Carb Bowls': transformMeals(getDinnerMealsByCategory('protein-carb-bowls')),
  'High-Protein Pastas': transformMeals(getDinnerMealsByCategory('high-protein-pastas')),
  'Veggie + Lean Protein Bowls': transformMeals(getDinnerMealsByCategory('veggie-lean-bowls'))
};

export default function MealPremadePicker({
  open,
  onClose,
  onMealSelect,
  mealType = 'breakfast'
}: MealPremadePickerProps) {
  // Determine which premade set to use based on meal type
  const premadeData = mealType === 'breakfast' 
    ? breakfastPremades 
    : mealType === 'lunch' 
    ? lunchPremades 
    : dinnerPremades;

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [pendingMeal, setPendingMeal] = useState<any>(null);
  const [pendingCategory, setPendingCategory] = useState<string>('');
  const [cookingStyles, setCookingStyles] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // List of ingredients that need cooking style selection
  const NEEDS_PREP = [
    'Eggs', 'Egg Whites', 'Whole Eggs',
    'Steak', 'Ribeye', 'Sirloin Steak', 'Filet Mignon',
    'Chicken Breast', 'Chicken Thighs',
    'Broccoli', 'Spinach', 'Asparagus', 'Brussels Sprouts',
    'Potato', 'Sweet Potato', 'Yam',
    'Lettuce', 'Spring Mix'
  ];

  // Set initial category when modal opens or meal type changes
  React.useEffect(() => {
    if (open) {
      const firstCategory = Object.keys(premadeData)[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
      }
    }
  }, [open, mealType]);

  const handleSelectPremade = (meal: any, category: string) => {
    // Detect if meal name contains ingredients that need prep selection
    const mealNameLower = meal.name.toLowerCase();
    const needsPrepIngredient = NEEDS_PREP.find(ing => 
      mealNameLower.includes(ing.toLowerCase())
    );

    if (needsPrepIngredient) {
      // Show prep modal first
      setPendingMeal(meal);
      setPendingCategory(category);
      setCurrentIngredient(needsPrepIngredient);
      setPrepModalOpen(true);
    } else {
      // No prep needed, generate immediately
      generateMealImage(meal, category, {});
    }
  };

  const handlePrepSelect = (ingredient: string, style: string) => {
    const updatedStyles = { ...cookingStyles, [ingredient]: style };
    setCookingStyles(updatedStyles);
    
    // Generate meal with selected style
    if (pendingMeal) {
      generateMealImage(pendingMeal, pendingCategory, updatedStyles);
      setPendingMeal(null);
      setPendingCategory('');
    }
  };

  const generateMealImage = async (meal: any, category: string, styles: Record<string, string>) => {
    setGenerating(true);
    
    try {
      // Build ingredient list with cooking methods applied
      let ingredientsList: string[] = [];
      
      if (meal.actualIngredients && meal.actualIngredients.length > 0) {
        ingredientsList = meal.actualIngredients.map((ing: any) => {
          const styleForIng = styles[ing.item] || meal.defaultCookingMethod;
          const fullName = styleForIng ? `${styleForIng} ${ing.item}` : ing.item;
          return `${ing.quantity} ${ing.unit} ${fullName}`;
        });
      } else {
        ingredientsList = [meal.name];
      }
      
      // Use the SAME endpoint as the working AI Meal Creator
      const response = await fetch('/api/meals/fridge-rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fridgeItems: ingredientsList,
          userId: 1
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate premade meal');
      }
      
      const data = await response.json();
      
      // Handle both response formats
      let rawMeal;
      if (data.meals && Array.isArray(data.meals) && data.meals.length > 0) {
        rawMeal = data.meals[0];
      } else if (data.meal) {
        rawMeal = data.meal;
      } else {
        throw new Error('No meal found in response');
      }
      
      // Normalize UnifiedMeal response to frontend format
      const normalized = normalizeUnifiedMealOutput(rawMeal);
      
      // Transform to match board format
      const premadeMeal = {
        ...normalized,
        id: `premade-${meal.id}-${Date.now()}`,
        title: normalized.name || meal.name,
        servings: 1,
        imageUrl: normalized.imageUrl || '/assets/meals/default-breakfast.jpg',
        source: 'premade',
        category: category
      };
      
      // Call the parent's onMealSelect handler
      if (onMealSelect) {
        onMealSelect(premadeMeal);
      }
      
      toast({
        title: 'Meal Added!',
        description: `${meal.name} has been added to your ${mealType}`,
      });
      
      onClose();
      setCookingStyles({});
    } catch (error) {
      console.error('Error generating premade meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate meal image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const categories = Object.keys(premadeData);
  const currentMeals = premadeData[activeCategory] || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border border-white/20 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Premades
          </DialogTitle>
        </DialogHeader>

        {/* Category Tabs - Purple Style (Matching Meal Ingredient Picker) */}
        <div className="flex flex-nowrap gap-2 mb-3 overflow-x-auto w-full min-w-0 pb-2 overscroll-x-contain touch-pan-x">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-purple-600/40 border-2 border-purple-400 text-white shadow-md'
                  : 'bg-black/40 border border-white/20 text-white/70 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Meal Grid - Checkbox Style (Matching Meal Ingredient Picker) */}
        <div className="overflow-y-auto max-h-[50vh] mb-3 min-h-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-2 gap-y-1">
            {currentMeals.map((meal) => (
              <div
                key={meal.id}
                onClick={() => handleSelectPremade(meal, activeCategory)}
                className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white group p-1 min-h-[44px] cursor-pointer"
              >
                <Checkbox
                  checked={false}
                  className="h-1.5 w-1.5 border-white/30 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-500 pointer-events-none"
                />
                <span className="text-[11px] group-hover:text-emerald-300 transition-colors text-center">
                  {meal.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {generating && (
          <div className="flex items-center justify-center py-6 text-white/60">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Generating meal image...</span>
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
