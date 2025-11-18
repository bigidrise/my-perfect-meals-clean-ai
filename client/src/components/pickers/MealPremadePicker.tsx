
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  AI_PREMADE_BREAKFAST_MEALS, 
  getBreakfastMealsByCategory,
  type BreakfastCategory 
} from '@/data/aiPremadeBreakfast';

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

// Build breakfast premades from AI data
const breakfastPremades = {
  'All Protein': getBreakfastMealsByCategory('all-protein').map(meal => ({
    id: meal.id,
    name: meal.name,
    defaultCookingMethod: meal.defaultCookingMethod,
    ingredients: [
      { 
        item: meal.name, 
        amount: '1 serving', 
        preparation: meal.defaultCookingMethod || 'prepared as preferred' 
      }
    ]
  })),
  'Protein + Carb': [], // Will be populated in Phase 2
  'Egg-Based Meals': [] // Will be populated in Phase 2
};

// Lunch premade meals organized by category
const lunchPremades = {
  'Category 1': [],
  'Category 2': [],
  'Category 3': []
};

// Dinner premade meals organized by category
const dinnerPremades = {
  'Category 1': [],
  'Category 2': [],
  'Category 3': []
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
  const { toast } = useToast();

  // Set initial category when modal opens or meal type changes
  React.useEffect(() => {
    if (open) {
      const firstCategory = Object.keys(premadeData)[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
      }
    }
  }, [open, mealType]);

  const handleSelectPremade = async (meal: any, category: string) => {
    setGenerating(true);
    
    try {
      // Generate DALL·E prompt from ingredients with preparation details
      const ingredientList = meal.ingredients
        .map((ing: any) => `- ${ing.item} (${ing.preparation})`)
        .join('\n');
      
      const dallePrompt = `Generate a clean, realistic overhead food photo of:\n${ingredientList}\n\nMake the food look fresh, well-lit, and placed on a single plate or bowl.`;
      
      // Call DALL·E API to generate image
      const imageResponse = await fetch('/api/meal-images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: dallePrompt })
      });
      
      if (!imageResponse.ok) {
        throw new Error('Failed to generate meal image');
      }
      
      const { imageUrl } = await imageResponse.json();
      
      // Create meal object for the board
      const premadeMeal = {
        id: `premade-${meal.id}-${Date.now()}`,
        title: meal.name,
        name: meal.name,
        servings: 1,
        ingredients: meal.ingredients.map((ing: any) => ({
          item: ing.item,
          amount: ing.amount
        })),
        instructions: meal.ingredients.map((ing: any) => 
          `Prepare ${ing.item}: ${ing.preparation}`
        ),
        imageUrl: imageUrl,
        nutrition: {
          calories: 350, // Default values - could be calculated
          protein: 30,
          carbs: 20,
          fat: 15
        },
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
    </Dialog>
  );
}
