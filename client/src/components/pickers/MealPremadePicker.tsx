
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
  const [activeTab, setActiveTab] = useState(mealType);
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            <span>AI Premades - Quick Meal Options</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/30">
            <TabsTrigger value="breakfast" className="text-white data-[state=active]:bg-orange-600">
              Breakfast
            </TabsTrigger>
            <TabsTrigger value="lunch" className="text-white data-[state=active]:bg-orange-600">
              Lunch
            </TabsTrigger>
            <TabsTrigger value="dinner" className="text-white data-[state=active]:bg-orange-600">
              Dinner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakfast" className="mt-4">
            <div className="space-y-6">
              {Object.entries(breakfastPremades).map(([category, meals]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {meals.map((meal) => (
                      <button
                        key={meal.id}
                        onClick={() => handleSelectPremade(meal, category)}
                        disabled={generating}
                        className="text-left p-4 bg-black/20 hover:bg-black/30 border border-white/10 hover:border-orange-500/50 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <h4 className="font-medium text-white group-hover:text-orange-400 mb-2">
                          {meal.name}
                        </h4>
                        <ul className="space-y-1 text-sm text-white/60">
                          {meal.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span>
                                {ing.item} ({ing.preparation})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {generating && (
                <div className="flex items-center justify-center py-8 text-white/60">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Generating meal image...</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lunch" className="mt-4">
            <div className="text-center py-12 text-white/60 bg-black/20 rounded-xl border border-white/10">
              <p className="text-lg">Lunch premade options will appear here</p>
              <p className="text-sm mt-2 text-white/40">Phase 4 will add actual meal options</p>
            </div>
          </TabsContent>

          <TabsContent value="dinner" className="mt-4">
            <div className="text-center py-12 text-white/60 bg-black/20 rounded-xl border border-white/10">
              <p className="text-lg">Dinner premade options will appear here</p>
              <p className="text-sm mt-2 text-white/40">Phase 5 will add actual meal options</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
