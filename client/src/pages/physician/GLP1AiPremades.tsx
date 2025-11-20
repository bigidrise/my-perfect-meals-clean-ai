
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import PreparationModal from "@/components/PreparationModal";
import MealIngredientPicker from "@/components/MealIngredientPicker";

// Import GLP-1 premade data
import { AI_PREMADE_BREAKFAST_MEALS } from "@/data/glp1AiPremades.breakfast";
import { AI_PREMADE_LUNCH_MEALS } from "@/data/glp1AiPremades.lunch";
import { AI_PREMADE_DINNER_MEALS } from "@/data/glp1AiPremades.dinner";

type MealType = "breakfast" | "lunch" | "dinner";

interface AiPremadeMeal {
  id: string;
  name: string;
  description: string;
  category: string;
  cuisine: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  ingredients: Array<{ name: string; amount: string; notes?: string }>;
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  dietaryTags: string[];
  imageUrl?: string;
}

const BREAKFAST_CATEGORIES = [
  { id: "all", label: "All Protein" },
  { id: "proteincarb", label: "Protein + Carb" },
  { id: "eggbased", label: "Egg-Based" },
];

const LUNCH_CATEGORIES = [
  { id: "lean", label: "Lean Plates" },
  { id: "proteincarb", label: "Protein & Carb Bowls" },
  { id: "highprotein", label: "High-Protein Plates" },
  { id: "proteinveggie", label: "Protein & Veggie Plates" },
  { id: "onepan", label: "One-Pan Meals" },
  { id: "smartplate", label: "Smart Plate Lunches" },
];

const DINNER_CATEGORIES = [
  { id: "lean", label: "Lean Plates" },
  { id: "proteincarb", label: "Protein & Carb Bowls" },
  { id: "highprotein", label: "High-Protein Plates" },
  { id: "proteinveggie", label: "Protein & Veggie Plates" },
  { id: "onepan", label: "One-Pan Meals" },
  { id: "smartplate", label: "Smart Plate Dinners" },
];

export default function GLP1AiPremades() {
  const [, setLocation] = useLocation();
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<AiPremadeMeal | null>(null);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    document.title = "GLP-1 AI Premades | My Perfect Meals";
  }, []);

  // Get current categories based on meal type
  const currentCategories = useMemo(() => {
    if (mealType === "breakfast") return BREAKFAST_CATEGORIES;
    if (mealType === "lunch") return LUNCH_CATEGORIES;
    return DINNER_CATEGORIES;
  }, [mealType]);

  // Get current meals based on meal type
  const currentMeals = useMemo(() => {
    if (mealType === "breakfast") return AI_PREMADE_BREAKFAST_MEALS;
    if (mealType === "lunch") return AI_PREMADE_LUNCH_MEALS;
    return AI_PREMADE_DINNER_MEALS;
  }, [mealType]);

  // Filter meals by category and search
  const filteredMeals = useMemo(() => {
    let meals = currentMeals;

    // Filter by category
    if (selectedCategory !== "all") {
      meals = meals.filter((meal) => meal.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      meals = meals.filter(
        (meal) =>
          meal.name.toLowerCase().includes(query) ||
          meal.description.toLowerCase().includes(query) ||
          meal.cuisine.toLowerCase().includes(query)
      );
    }

    return meals;
  }, [currentMeals, selectedCategory, searchQuery]);

  const handleMealClick = useCallback((meal: AiPremadeMeal) => {
    setSelectedMeal(meal);
    setPrepModalOpen(true);
  }, []);

  const handleAddToBoard = useCallback((meal: AiPremadeMeal, prepChoice: string) => {
    // Store meal data for weekly board to pick up
    localStorage.setItem(
      "weeklyPlanMealToAdd",
      JSON.stringify({
        meal: {
          id: `glp1-premade-${Date.now()}`,
          name: meal.name,
          title: meal.name,
          description: meal.description,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          servings: meal.servings,
          nutrition: meal.nutrition,
          imageUrl: meal.imageUrl,
          cookingTime: meal.cookTime,
          difficulty: meal.difficulty,
          prepChoice,
        },
        targetSlot: mealType,
      })
    );

    setPrepModalOpen(false);
    setLocation("/glp1-meal-builder");
  }, [mealType, setLocation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pt-20 pb-32"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocation("/glp1-hub")}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-black/60 backdrop-blur-none rounded-2xl border border-white/20 text-white hover:bg-black/80 px-3 sm:px-4 py-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        GLP-1 Hub
      </Button>

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 mt-2 border border-zinc-800 bg-zinc-900/60 backdrop-blur rounded-2xl p-6">
          <h1 className="text-center text-2xl font-semibold text-white mb-2">
            GLP-1 AI Premade Meals
          </h1>
          <p className="text-center text-white/80 text-sm">
            Small portions • Calorie-dense • Medical-grade nutrition
          </p>
        </div>

        {/* Meal Type Selector */}
        <div className="mb-6 flex gap-3 justify-center">
          <Button
            onClick={() => {
              setMealType("breakfast");
              setSelectedCategory("all");
            }}
            className={`${
              mealType === "breakfast"
                ? "bg-orange-600 text-white"
                : "bg-black/30 text-white/70 hover:bg-black/50"
            } rounded-xl px-6 py-2`}
          >
            Breakfast
          </Button>
          <Button
            onClick={() => {
              setMealType("lunch");
              setSelectedCategory("all");
            }}
            className={`${
              mealType === "lunch"
                ? "bg-orange-600 text-white"
                : "bg-black/30 text-white/70 hover:bg-black/50"
            } rounded-xl px-6 py-2`}
          >
            Lunch
          </Button>
          <Button
            onClick={() => {
              setMealType("dinner");
              setSelectedCategory("all");
            }}
            className={`${
              mealType === "dinner"
                ? "bg-orange-600 text-white"
                : "bg-black/30 text-white/70 hover:bg-black/50"
            } rounded-xl px-6 py-2`}
          >
            Dinner
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {currentCategories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`${
                selectedCategory === cat.id
                  ? "bg-purple-600 text-white"
                  : "bg-black/30 text-white/70 hover:bg-black/50"
              } rounded-xl px-4 py-2 text-sm`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <Input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-black/30 border-white/20 text-white placeholder:text-white/50 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5 text-white/50 hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* AI Meal Generator Button */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setAiModalOpen(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 py-3 flash-border"
          >
            <Plus className="h-5 w-5 mr-2" />
            Generate Custom AI Meal
          </Button>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeals.map((meal) => (
            <motion.div
              key={meal.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black/30 backdrop-blur border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-orange-500/50 transition-all"
              onClick={() => handleMealClick(meal)}
            >
              {meal.imageUrl && (
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}
              <h3 className="text-white font-semibold text-lg mb-2">
                {meal.name}
              </h3>
              <p className="text-white/70 text-sm mb-3">
                {meal.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {meal.dietaryTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-purple-600/30 text-purple-200 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div>
                  <div className="text-white font-semibold">
                    {meal.nutrition.calories}
                  </div>
                  <div className="text-white/50 text-xs">cal</div>
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {meal.nutrition.protein}g
                  </div>
                  <div className="text-white/50 text-xs">pro</div>
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {meal.nutrition.carbs}g
                  </div>
                  <div className="text-white/50 text-xs">carb</div>
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {meal.nutrition.fat}g
                  </div>
                  <div className="text-white/50 text-xs">fat</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">
              No meals found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Preparation Modal */}
      {selectedMeal && (
        <PreparationModal
          isOpen={prepModalOpen}
          onClose={() => setPrepModalOpen(false)}
          meal={selectedMeal}
          onSelect={(prepChoice) => handleAddToBoard(selectedMeal, prepChoice)}
        />
      )}

      {/* AI Meal Creator Modal */}
      <MealIngredientPicker
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        onMealGenerated={(meal) => {
          localStorage.setItem(
            "weeklyPlanMealToAdd",
            JSON.stringify({
              meal: {
                id: `glp1-ai-${Date.now()}`,
                name: meal.name,
                title: meal.name,
                description: meal.description,
                ingredients: meal.ingredients,
                instructions: meal.instructions,
                servings: 1,
                nutrition: {
                  calories: meal.calories || 0,
                  protein: meal.protein || 0,
                  carbs: meal.carbs || 0,
                  fat: meal.fat || 0,
                },
                imageUrl: meal.imageUrl,
              },
              targetSlot: mealType,
            })
          );
          setAiModalOpen(false);
          setLocation("/glp1-meal-builder");
        }}
        mealSlot={mealType}
        showMacroTargeting={false}
      />
    </motion.div>
  );
}
