
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MealPremadePickerProps {
  open: boolean;
  onClose: () => void;
  onMealSelect?: (meal: any) => void;
  mealType?: 'breakfast' | 'lunch' | 'dinner';
}

// Breakfast premade meals organized by category
const breakfastPremades = {
  'All Protein': [
    {
      id: 'egg-whites-turkey-bacon',
      name: 'Egg Whites + Turkey Bacon',
      ingredients: [
        { item: 'Egg Whites', amount: '4 egg whites', preparation: 'pan-cooked, fluffy, lightly seasoned' },
        { item: 'Turkey Bacon', amount: '3 slices', preparation: 'crispy, oven-baked' }
      ]
    },
    {
      id: 'chicken-breast-egg-whites',
      name: 'Chicken Breast + Egg Whites',
      ingredients: [
        { item: 'Chicken Breast', amount: '4 oz', preparation: 'grilled, sliced' },
        { item: 'Egg Whites', amount: '3 egg whites', preparation: 'scrambled, soft' }
      ]
    },
    {
      id: 'protein-shake-egg-whites',
      name: 'Protein Shake + Egg Whites',
      ingredients: [
        { item: 'Protein Shake', amount: '1 scoop', preparation: 'blended, vanilla flavor' },
        { item: 'Egg Whites', amount: '4 egg whites', preparation: 'cooked in pan, lightly browned' }
      ]
    }
  ],
  'Protein + Carb': [
    {
      id: 'scrambled-eggs-toast',
      name: 'Scrambled Eggs + Toast',
      ingredients: [
        { item: 'Eggs', amount: '3 eggs', preparation: 'scrambled, fluffy' },
        { item: 'Toast', amount: '2 slices', preparation: 'whole grain, lightly toasted' }
      ]
    },
    {
      id: 'protein-shake-banana',
      name: 'Protein Shake + Banana',
      ingredients: [
        { item: 'Protein Shake', amount: '1 scoop', preparation: 'chocolate or vanilla, blended' },
        { item: 'Banana', amount: '1 medium', preparation: 'sliced' }
      ]
    },
    {
      id: 'eggs-potatoes',
      name: 'Eggs + Potatoes',
      ingredients: [
        { item: 'Eggs', amount: '2 eggs', preparation: 'over-medium' },
        { item: 'Potatoes', amount: '1 cup', preparation: 'pan-fried, diced' }
      ]
    }
  ],
  'Egg-Based Meals': [
    {
      id: 'omelette-veggies',
      name: 'Omelette + Veggies',
      ingredients: [
        { item: 'Omelette', amount: '3 eggs', preparation: 'folded, golden edges' },
        { item: 'Veggies', amount: '1/2 cup', preparation: 'sautéed peppers + onions' }
      ]
    },
    {
      id: 'scrambled-eggs-turkey-sausage',
      name: 'Scrambled Eggs + Turkey Sausage',
      ingredients: [
        { item: 'Eggs', amount: '3 eggs', preparation: 'scrambled soft' },
        { item: 'Turkey Sausage', amount: '2 links', preparation: 'pan-seared' }
      ]
    },
    {
      id: 'egg-muffins',
      name: 'Egg Muffins',
      ingredients: [
        { item: 'Egg Muffins', amount: '3 muffins', preparation: 'baked, mixed vegetables' }
      ]
    }
  ]
};

export default function MealPremadePicker({
  open,
  onClose,
  onMealSelect,
  mealType = 'breakfast'
}: MealPremadePickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All Protein');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

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
        description: `${meal.name} has been added to your breakfast`,
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

  const categories = Object.keys(breakfastPremades);
  const currentMeals = breakfastPremades[activeCategory] || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border border-white/20 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            Breakfast Premades
          </DialogTitle>
        </DialogHeader>

        {/* Category Tabs - Purple Style (Matching Snack Picker) */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Meal Cards - Purple Style (Matching Snack Picker) */}
        <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
          {currentMeals.map((meal) => (
            <button
              key={meal.id}
              onClick={() => handleSelectPremade(meal, activeCategory)}
              disabled={generating}
              className="w-full text-left p-4 bg-zinc-800/50 hover:bg-zinc-700/50 border border-white/10 hover:border-purple-500/50 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <h4 className="font-semibold text-white text-base mb-2">
                {meal.name}
              </h4>
              <div className="space-y-1">
                {meal.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>
                      <span className="text-white/90">{ing.item}</span>
                      <span className="text-white/50"> - {ing.preparation}</span>
                    </span>
                  </div>
                ))}
              </div>
            </button>
          ))}
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
