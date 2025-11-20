
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import PreparationModal from '@/components/PreparationModal';
import { 
  AI_PREMADE_BREAKFAST_MEALS, 
  getBreakfastMealsByCategory,
  type BreakfastCategory 
} from '@/data/aiPremadeBreakfast';
import {
  AI_PREMADE_LUNCH_MEALS,
  getLunchMealsByCategory,
  LUNCH_CATEGORY_DISPLAY_NAMES,
  type LunchCategory
} from '@/data/aiPremadeLunch';
import {
  AI_PREMADE_DINNER_MEALS,
  getDinnerMealsByCategory,
  DINNER_CATEGORY_DISPLAY_NAMES,
  type DinnerCategory
} from '@/data/aiPremadeDinner';

interface MealPremadePickerProps {
  open: boolean;
  onClose: () => void;
  onMealSelect?: (meal: any) => void;
  mealType?: 'breakfast' | 'lunch' | 'dinner';
}

// Map category names to display names
const categoryDisplayNames: Record<BreakfastCategory, string> = {
  'all-protein': 'All Protein',
  'protein-carb': 'Protein + Carb',
  'egg-based': 'Egg-Based Meals'
};

// Build breakfast premades from AI data with actual ingredients
const breakfastPremades = {
  'All Protein': getBreakfastMealsByCategory('all-protein').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  })),
  'Protein + Carb': getBreakfastMealsByCategory('protein-carb').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  })),
  'Egg-Based Meals': getBreakfastMealsByCategory('egg-based').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  }))
};

// Lunch premade meals organized by category
const lunchPremades = {
  'Lean Plates': getLunchMealsByCategory('lean-plates').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  })),
  'Protein + Carb Bowls': getLunchMealsByCategory('satisfying-protein-carb-bowls').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  })),
  'High Protein Plates': getLunchMealsByCategory('high-protein-plates').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  })),
  'Protein + Veggie Plates': getLunchMealsByCategory('simple-protein-veggie-plates').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  }))
};

// Dinner premade meals organized by category
const dinnerPremades = {
  'Lean Protein Plates': getDinnerMealsByCategory('lean-protein-plates').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  })),
  'Protein + Carb Bowls': getDinnerMealsByCategory('protein-carb-bowls').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  })),
  'High Protein Plates': getDinnerMealsByCategory('high-protein-plates').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  })),
  'Protein + Veggie Plates': getDinnerMealsByCategory('simple-protein-veggie').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    actualIngredients: meal.ingredients,
    ingredients: meal.ingredients.map(ing => ({
      item: ing.item,
      amount: `${ing.quantity} ${ing.unit}`,
      preparation: meal.defaultCookingMethod || 'as preferred'
    }))
  }))
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
  const [progress, setProgress] = useState(0);
  const tickerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

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

  // Shared cleanup routine for all cancellation paths
  const cleanupGeneration = () => {
    // Abort ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Stop and reset progress ticker
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    
    // Reset all state
    setGenerating(false);
    setProgress(0);
    setPendingMeal(null);
    setPendingCategory('');
    setCookingStyles({});
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupGeneration();
    };
  }, []);

  // List of ingredients that need cooking style selection (FULL LIST from MealIngredientPicker)
  const NEEDS_PREP = [
    // Eggs
    'Eggs', 'Egg Whites', 'Whole Eggs',
    
    // Steaks
    'Steak', 'Ribeye', 'Ribeye Steak', 'Sirloin Steak', 'Top Sirloin', 'Filet Mignon',
    'New York Strip', 'NY Strip', 'Strip Steak', 'Porterhouse', 'Porterhouse Steak',
    'T-Bone', 'T-Bone Steak', 'TBone Steak', 'Skirt Steak', 'Flank Steak',
    'Flat Iron Steak', 'Tri-Tip', 'Tri-Tip Steak', 'Hanger Steak',
    'Kobe Steak', 'Kobe Beef', 'Wagyu Steak', 'Wagyu Beef',
    
    // Chicken
    'Chicken Breast', 'Chicken Thighs', 'Chicken Sausage', 'Ground Chicken',
    
    // Turkey
    'Turkey Breast', 'Ground Turkey', 'Turkey Sausage',
    
    // Fish
    'Salmon', 'Tilapia', 'Cod', 'Tuna', 'Tuna Steak', 'Halibut', 'Mahi Mahi',
    'Trout', 'Sardines', 'Anchovies', 'Catfish', 'Sea Bass', 'Red Snapper',
    'Flounder', 'Orange Roughy', 'Sole',
    
    // Potatoes (ALL PLURAL)
    'Potatoes', 'Red Potatoes', 'Sweet Potatoes', 'Yams',
    
    // Rice
    'Rice', 'White Rice', 'Brown Rice', 'Jasmine Rice', 'Basmati Rice', 'Wild Rice',
    
    // Vegetables
    'Broccoli', 'Asparagus', 'Green Beans', 'Mixed Vegetables',
    'Cauliflower', 'Brussels Sprouts', 'Kale', 'Spinach',
    'Carrots', 'Celery', 'Cucumber',
    
    // Salads
    'Lettuce', 'Romaine Lettuce', 'Spring Mix'
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
    // Check meal ingredients for items that need prep selection
    let needsPrepIngredient: string | undefined;
    
    // First check the actual ingredients array if it exists
    if (meal.actualIngredients && Array.isArray(meal.actualIngredients)) {
      for (const ing of meal.actualIngredients) {
        const ingredientName = ing.item || '';
        const match = NEEDS_PREP.find(prep => 
          ingredientName.toLowerCase().includes(prep.toLowerCase()) ||
          prep.toLowerCase().includes(ingredientName.toLowerCase())
        );
        if (match) {
          needsPrepIngredient = ingredientName;
          break;
        }
      }
    }
    
    // Fallback: check meal name if no ingredients array
    if (!needsPrepIngredient) {
      const mealNameLower = meal.name.toLowerCase();
      needsPrepIngredient = NEEDS_PREP.find(ing => 
        mealNameLower.includes(ing.toLowerCase())
      );
    }

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
    startProgressTicker();
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
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
      
      console.log(`🎨 Generating ${mealType} meal with ingredients:`, ingredientsList);
      
      // Use the SAME endpoint as the working AI Meal Creator
      const response = await fetch('/api/meals/fridge-rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fridgeItems: ingredientsList,
          userId: 1,
          mealType: mealType // Pass meal type to help with image generation
        }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate premade meal');
      }
      
      const data = await response.json();
      
      // Handle both response formats
      let generatedMeal;
      if (data.meals && Array.isArray(data.meals) && data.meals.length > 0) {
        generatedMeal = data.meals[0];
      } else if (data.meal) {
        generatedMeal = data.meal;
      } else {
        throw new Error('No meal found in response');
      }
      
      // Transform to match board format
      const defaultImage = mealType === 'breakfast' 
        ? '/assets/meals/default-breakfast.jpg'
        : mealType === 'lunch'
        ? '/assets/meals/default-lunch.jpg'
        : '/assets/meals/default-dinner.jpg';
        
      const premadeMeal = {
        id: `premade-${meal.id}-${Date.now()}`,
        title: generatedMeal.name || meal.name,
        name: generatedMeal.name || meal.name,
        description: generatedMeal.description,
        servings: 1,
        ingredients: generatedMeal.ingredients || meal.ingredients,
        instructions: generatedMeal.instructions || [],
        imageUrl: generatedMeal.imageUrl || defaultImage,
        nutrition: generatedMeal.nutrition || {
          calories: generatedMeal.calories || 350,
          protein: generatedMeal.protein || 30,
          carbs: generatedMeal.carbs || 20,
          fat: generatedMeal.fat || 15
        },
        medicalBadges: generatedMeal.medicalBadges || [],
        source: 'premade',
        category: category
      };
      
      console.log(`✅ Generated ${mealType} meal with image:`, premadeMeal.imageUrl);
      
      // Call the parent's onMealSelect handler
      if (onMealSelect) {
        onMealSelect(premadeMeal);
      }
      
      toast({
        title: 'Meal Added!',
        description: `${meal.name} has been added to your ${mealType}`,
      });
      
      // Clean up and close on success
      cleanupGeneration();
      onClose();
    } catch (error: any) {
      // Don't show error if request was cancelled
      if (error.name === 'AbortError') {
        console.log('Meal generation cancelled by user');
        return;
      }
      
      console.error('Error generating premade meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate meal image. Please try again.',
        variant: 'destructive'
      });
      
      // Clean up on error
      cleanupGeneration();
    }
  };

  const handleCancel = () => {
    // Use shared cleanup routine
    cleanupGeneration();
    
    // Close modal
    onClose();
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Cancel generation if modal is being closed
      cleanupGeneration();
      onClose();
    }
  };

  const categories = Object.keys(premadeData);
  const currentMeals = (premadeData[activeCategory as keyof typeof premadeData] || []) as any[];

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
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
            {currentMeals.map((meal: any) => (
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

        {/* Cancel Button */}
        <div className="flex justify-end gap-3 mb-3">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="bg-black/40 border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>

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
