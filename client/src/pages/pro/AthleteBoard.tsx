import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation, useRoute } from "wouter";
import { MealCard, Meal } from "@/components/MealCard";
import {
  type WeekBoard,
  weekDates,
  getDayLists,
  setDayLists,
  cloneDayLists,
  putWeekBoard,
  getWeekBoardByDate,
} from "@/lib/boardApi";
import { ManualMealModal } from "@/components/pickers/ManualMealModal";
import { AthleteMealPickerDrawer } from "@/components/pickers/AthleteMealPickerDrawer";
import { AddSnackModal } from "@/components/AddSnackModal";
import MealIngredientPicker from "@/components/MealIngredientPicker";
import { MacroBridgeFooter } from "@/components/biometrics/MacroBridgeFooter";
import WeeklyOverviewModal from "@/components/WeeklyOverviewModal";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";
import { normalizeIngredients } from "@/utils/ingredientParser";
import { useShoppingListStore } from "@/stores/shoppingListStore";
import { useToast } from "@/hooks/use-toast";
import ShoppingListPreviewModal from "@/components/ShoppingListPreviewModal";
import { useWeeklyBoard } from "@/hooks/useWeeklyBoard";
import { getMondayISO } from "@/../../shared/schema/weeklyBoard";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  Check,
  Sparkles,
  BarChart3,
  ShoppingCart,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Target,
  Home,
  Info,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FEATURES } from "@/utils/features";
import { DayWeekToggle } from "@/components/DayWeekToggle";
import { DayChips } from "@/components/DayChips";
import { DuplicateDayModal } from "@/components/DuplicateDayModal";
import { DuplicateWeekModal } from "@/components/DuplicateWeekModal";
import { setMacroTargets } from "@/lib/dailyLimits";
import { proStore } from "@/lib/proData";
import { linkUserToClient } from "@/lib/macroResolver";
import { saveLastAthleteClientId } from "@/lib/macroSourcesConfig";
import MealBuilderGuidedTour from "@/components/guided/MealBuilderGuidedTour";
import MealProgressCoach from "@/components/guided/MealProgressCoach";
import DailyMealProgressBar from "@/components/guided/DailyMealProgressBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Helper function to create new snacks
function makeNewSnack(nextIndex: number): Meal {
  return {
    id: `snk-${Date.now()}`,
    title: "Snack",
    servings: 1,
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };
}

// Week navigation utilities
function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function nextWeekISO(weekStartISO: string) {
  return addDaysISO(weekStartISO, 7);
}

function prevWeekISO(weekStartISO: string) {
  return addDaysISO(weekStartISO, -7);
}

function formatWeekLabel(weekStartISO: string): string {
  const start = new Date(weekStartISO + "T00:00:00Z");
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(start)}–${fmt(end)}`;
}

// Pro Care Meal Slots - 5 meals for competition prep (fixed)
const lists: Array<["breakfast"|"lunch"|"dinner"|"snacks", string]> = [
  ["breakfast","Meal 1"],
  ["lunch","Meal 2"],
  ["dinner","Meal 3"],
  ["snacks","Meal 4"]
];

// Meal 5 will be rendered separately using the snacks slot
// Dynamic meals (6+) will be stored in board.days[date].snacks array with special prefix

interface AthleteBoardProps {
  mode?: "athlete" | "procare";
}

export default function AthleteBoard({ mode = "athlete" }: AthleteBoardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Route params
  const [, athleteParams] = useRoute("/athlete-meal-board/:clientId");
  const [, proParams] = useRoute("/pro/clients/:id/athlete-board");
  const routeClientId = athleteParams?.clientId || proParams?.id;

  // Get current user ID for standalone mode
  const getCurrentUserId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch {
        return null;
      }
    }
    return null;
  };

  // In standalone mode, use current user's ID; in procare mode, use route clientId
  const clientId = mode === "procare" ? routeClientId : (routeClientId || getCurrentUserId());

  // Safety check: redirect only if procare mode without clientId
  useEffect(() => {
    if (mode === "procare" && !clientId) {
      setLocation("/dashboard");
    } else if (clientId) {
      // Save clientId for "Came From" dropdown routing (procare mode only)
      if (mode === "procare") {
        saveLastAthleteClientId(clientId);
      }
    }
  }, [clientId, setLocation, mode]);

  if (mode === "procare" && !clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Missing client ID. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // 🎯 BULLETPROOF BOARD LOADING
  const [weekStartISO, setWeekStartISO] =
    React.useState<string>(getMondayISO());
  const {
    board: hookBoard,
    loading: hookLoading,
    error,
    save: saveToHook,
    source,
  } = useWeeklyBoard(clientId, weekStartISO);

  // Local mutable board state for optimistic updates
  const [board, setBoard] = React.useState<WeekBoard | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);

  // Sync hook board to local state
  React.useEffect(() => {
    if (hookBoard) {
      setBoard(hookBoard);
      setLoading(hookLoading);
    }
  }, [hookBoard, hookLoading]);

  // Wrapper to save with idempotent IDs
  const saveBoard = React.useCallback(
    async (updatedBoard: WeekBoard) => {
      setSaving(true);
      try {
        await saveToHook(updatedBoard as any, uuidv4());
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      } catch (err) {
        console.error("Failed to save board:", err);
        toast({
          title: "Save failed",
          description: "Changes will retry when you're online",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    },
    [saveToHook, toast],
  );

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickerList, setPickerList] = React.useState<
    "breakfast" | "lunch" | "dinner" | "snacks" | null
  >(null);
  const [manualModalOpen, setManualModalOpen] = React.useState(false);
  const [manualModalList, setManualModalList] = React.useState<
    "breakfast" | "lunch" | "dinner" | "snacks" | null
  >(null);
  const [showSnackModal, setShowSnackModal] = React.useState(false);
  const [showOverview, setShowOverview] = React.useState(false);

  // AI Meal Creator modal state
  const [aiMealModalOpen, setAiMealModalOpen] = useState(false);
  const [aiMealSlot, setAiMealSlot] = useState<"breakfast" | "lunch" | "dinner" | "snacks">("breakfast");

  // Guided Tour state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hasSeenInfo, setHasSeenInfo] = useState(false);
  const [tourStep, setTourStep] = useState<"breakfast" | "lunch" | "dinner" | "snacks" | "complete">("breakfast");

  // Daily Totals Info state (appears after first meal is created)
  const [showDailyTotalsInfo, setShowDailyTotalsInfo] = useState(false);
  const [hasSeenDailyTotalsInfo, setHasSeenDailyTotalsInfo] = useState(false);

  // Day/Week planning state
  const [planningMode, setPlanningMode] = React.useState<"day" | "week">("day");
  const [activeDayISO, setActiveDayISO] = React.useState<string>("");

  const [showDuplicateDayModal, setShowDuplicateDayModal] =
    React.useState(false);
  const [showDuplicateWeekModal, setShowDuplicateWeekModal] =
    React.useState(false);

  // Shopping list modal state
  const [shoppingListModal, setShoppingListModal] = useState<{
    isOpen: boolean;
    meal: any | null;
  }>({ isOpen: false, meal: null });

  // Dynamic meal tracking (Meal 6+)
  const [dynamicMealCount, setDynamicMealCount] = useState(0);

  // 🔋 AI Meal Creator localStorage persistence (copy Weekly Meal Board pattern)
  const AI_MEALS_CACHE_KEY = "ai-athlete-meal-creator-cached-meals";

  interface CachedAIMeals {
    meals: Meal[];
    dayISO: string;
    slot: "breakfast" | "lunch" | "dinner" | "snacks";
    generatedAtISO: string;
  }

  // Save AI meals to localStorage
  function saveAIMealsCache(meals: Meal[], dayISO: string, slot: "breakfast" | "lunch" | "dinner" | "snacks") {
    try {
      const state: CachedAIMeals = {
        meals,
        dayISO,
        slot,
        generatedAtISO: new Date().toISOString(),
      };
      localStorage.setItem(AI_MEALS_CACHE_KEY, JSON.stringify(state));
    } catch {}
  }

  // Load AI meals from localStorage
  function loadAIMealsCache(): CachedAIMeals | null {
    try {
      const raw = localStorage.getItem(AI_MEALS_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.meals?.length) return null;
      return parsed as CachedAIMeals;
    } catch {
      return null;
    }
  }

  // Clear AI meals cache
  function clearAIMealsCache() {
    try {
      localStorage.removeItem(AI_MEALS_CACHE_KEY);
    } catch {}
  }

  // Generate week dates
  const weekDatesList = useMemo(() => {
    return weekStartISO ? weekDates(weekStartISO) : [];
  }, [weekStartISO]);

  // Set initial active day when week loads
  useEffect(() => {
    if (weekDatesList.length > 0 && !activeDayISO) {
      setActiveDayISO(weekDatesList[0]); // Default to Monday
    }
  }, [weekDatesList, activeDayISO]);

  // 🔋 Load AI meals from localStorage on mount or day change
  useEffect(() => {
    if (!board || !activeDayISO) return;

    const cached = loadAIMealsCache();
    if (cached && cached.dayISO === activeDayISO && cached.meals.length > 0) {
      console.log("🔋 Loading AI meals from localStorage:", cached.meals.length, "meals for", activeDayISO, "into slot:", cached.slot);

      // Merge cached AI meals into the correct slot
      const dayLists = getDayLists(board, activeDayISO);
      const targetSlot = cached.slot || "breakfast";
      const existingSlotMeals = dayLists[targetSlot].filter(m => !m.id.startsWith('ai-meal-'));
      const updatedSlotMeals = [...existingSlotMeals, ...cached.meals];
      const updatedDayLists = { ...dayLists, [targetSlot]: updatedSlotMeals };
      const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);

      setBoard(updatedBoard);
    }
  }, [board, activeDayISO]);

  // Load/save tour progress from localStorage
  useEffect(() => {
    const infoSeen = localStorage.getItem("athlete-board-info-seen");
    if (infoSeen === "true") {
      setHasSeenInfo(true);
    }

    const dailyTotalsInfoSeen = localStorage.getItem("athlete-board-daily-totals-info-seen");
    if (dailyTotalsInfoSeen === "true") {
      setHasSeenDailyTotalsInfo(true);
    }

    const savedStep = localStorage.getItem("athlete-board-tour-step");
    if (savedStep === "breakfast" || savedStep === "lunch" || savedStep === "dinner" || savedStep === "snacks" || savedStep === "complete") {
      setTourStep(savedStep);
    }
  }, []);

  // Handle info modal close - start the guided tour
  const handleInfoModalClose = () => {
    setShowInfoModal(false);
    setHasSeenInfo(true);
    localStorage.setItem("athlete-board-info-seen", "true");
  };

  // Update tour step when meals are created
  useEffect(() => {
    if (!board) return;

    const lists = planningMode === 'day' && activeDayISO
      ? getDayLists(board, activeDayISO)
      : board.lists;

    // Check meal completion and advance tour
    if (tourStep === "breakfast" && lists.breakfast.length > 0) {
      setTourStep("lunch");
      localStorage.setItem("athlete-board-tour-step", "lunch");

      // Show Daily Totals info after first meal
      if (!hasSeenDailyTotalsInfo) {
        setShowDailyTotalsInfo(true);
      }
    } else if (tourStep === "lunch" && lists.lunch.length > 0) {
      setTourStep("dinner");
      localStorage.setItem("athlete-board-tour-step", "dinner");
    } else if (tourStep === "dinner" && lists.dinner.length > 0) {
      setTourStep("snacks");
      localStorage.setItem("athlete-board-tour-step", "snacks");
    } else if (tourStep === "snacks" && lists.snacks.length > 0) {
      setTourStep("complete");
      localStorage.setItem("athlete-board-tour-step", "complete");
    }
  }, [board, tourStep, planningMode, activeDayISO, hasSeenDailyTotalsInfo]);

  // Duplicate day handler
  const handleDuplicateDay = useCallback(
    async (targetDates: string[]) => {
      if (!board || !activeDayISO) return;

      const sourceLists = getDayLists(board, activeDayISO);
      const clonedLists = cloneDayLists(sourceLists);

      let updatedBoard = board;
      targetDates.forEach((dateISO) => {
        updatedBoard = setDayLists(updatedBoard, dateISO, clonedLists);
      });

      try {
        await saveBoard(updatedBoard);
        toast({
          title: "Day duplicated",
          description: `Copied to ${targetDates.length} day(s)`,
        });
      } catch (error) {
        console.error("Failed to duplicate day:", error);
        toast({
          title: "Failed to duplicate",
          description: "Please try again",
          variant: "destructive",
        });
      }
    },
    [board, activeDayISO, saveBoard, toast],
  );

  // Duplicate week handler
  const handleDuplicateWeek = useCallback(
    async (targetWeekStartISO: string) => {
      if (!board) return;

      const clonedBoard = {
        ...board,
        id: `week-${targetWeekStartISO}`,
        days: board.days
          ? Object.fromEntries(
              Object.entries(board.days).map(([oldDateISO, lists]) => {
                const dayIndex = weekDatesList.indexOf(oldDateISO);
                const targetWeekDates = weekDates(targetWeekStartISO);
                const newDateISO = targetWeekDates[dayIndex] || oldDateISO;
                return [newDateISO, cloneDayLists(lists)];
              }),
            )
          : undefined,
      };

      try {
        await putWeekBoard(targetWeekStartISO, clonedBoard);
        setWeekStartISO(targetWeekStartISO);
        toast({
          title: "Week duplicated",
          description: `Copied to week of ${targetWeekStartISO}`,
        });
      } catch (error) {
        console.error("Failed to duplicate week:", error);
        toast({
          title: "Failed to duplicate",
          description: "Please try again",
          variant: "destructive",
        });
      }
    },
    [board, weekDatesList, toast],
  );

  // Shopping list handler - Single day
  const handleAddToShoppingList = useCallback(() => {
    if (!board) {
      toast({
        title: "No meals found",
        description: "Add meals to your board before creating a shopping list.",
        variant: "destructive",
      });
      return;
    }

    let allMeals: Meal[] = [];
    if (
      FEATURES.dayPlanning === "alpha" &&
      planningMode === "day" &&
      activeDayISO
    ) {
      const dayLists = getDayLists(board, activeDayISO);
      allMeals = [
        ...dayLists.breakfast,
        ...dayLists.lunch,
        ...dayLists.dinner,
        ...dayLists.snacks,
      ];
    } else {
      allMeals = [
        ...board.lists.breakfast,
        ...board.lists.lunch,
        ...board.lists.dinner,
        ...board.lists.snacks,
      ];
    }

    if (allMeals.length === 0) {
      toast({
        title: "No meals found",
        description: "Add meals to your board before creating a shopping list.",
        variant: "destructive",
      });
      return;
    }

    const ingredients = allMeals.flatMap((meal) =>
      normalizeIngredients(meal.ingredients || []),
    );

    const items = ingredients.map((i) => ({
      name: i.name,
      qty:
        typeof i.qty === "number"
          ? i.qty
          : i.qty
            ? parseFloat(String(i.qty))
            : undefined,
      unit: i.unit,
      note:
        planningMode === "day" && activeDayISO
          ? `${new Date(activeDayISO + "T00:00:00Z").toLocaleDateString(undefined, { weekday: "long" })} Athlete Plan`
          : `Athlete Meal Plan (${formatWeekLabel(weekStartISO)})`,
    }));

    useShoppingListStore.getState().addItems(items);

    toast({
      title: "Added to Shopping List",
      description: `${ingredients.length} items added to your master list`,
    });
  }, [board, planningMode, activeDayISO, weekStartISO, toast]);

  // Shopping list handler - Entire week
  const handleAddEntireWeekToShoppingList = useCallback(() => {
    if (!board) {
      toast({
        title: "No meals found",
        description: "Add meals to your board before creating a shopping list.",
        variant: "destructive",
      });
      return;
    }

    let allMeals: Meal[] = [];
    weekDatesList.forEach((dateISO) => {
      const dayLists = getDayLists(board, dateISO);
      allMeals.push(
        ...dayLists.breakfast,
        ...dayLists.lunch,
        ...dayLists.dinner,
        ...dayLists.snacks,
      );
    });

    if (allMeals.length === 0) {
      toast({
        title: "No meals found",
        description: "Add meals to your week before creating a shopping list.",
        variant: "destructive",
      });
      return;
    }

    const ingredients = allMeals.flatMap((meal) =>
      normalizeIngredients(meal.ingredients || []),
    );

    const items = ingredients.map((i) => ({
      name: i.name,
      qty:
        typeof i.qty === "number"
          ? i.qty
          : i.qty
            ? parseFloat(String(i.qty))
            : undefined,
      unit: i.unit,
      note: `Athlete Meal Plan (${formatWeekLabel(weekStartISO)}) - All 7 Days`,
    }));

    useShoppingListStore.getState().addItems(items);

    toast({
      title: "Added to Shopping List",
      description: `${ingredients.length} items from entire week added to your master list`,
    });
  }, [board, weekStartISO, weekDatesList, toast]);

  // AI Meal Creator handler - Save to localStorage (Weekly Meal Board pattern)
  const handleAIMealGenerated = useCallback(async (generatedMeal: any) => {
    if (!activeDayISO) return;

    console.log("🤖 AI Meal Generated - Replacing old meals with new one:", generatedMeal, "for slot:", aiMealSlot);

    // Transform API response to match Meal type structure
    const transformedMeal: Meal = {
      id: `ai-meal-${Date.now()}`,
      name: generatedMeal.name,
      title: generatedMeal.name,
      description: generatedMeal.description,
      ingredients: generatedMeal.ingredients || [],
      instructions: generatedMeal.instructions || '',
      servings: 1,
      imageUrl: generatedMeal.imageUrl,
      cookingTime: generatedMeal.cookingTime,
      difficulty: generatedMeal.difficulty,
      medicalBadges: generatedMeal.medicalBadges || [],
      nutrition: {
        calories: generatedMeal.calories || 0,
        protein: generatedMeal.protein || 0,
        carbs: generatedMeal.carbs || 0,
        fat: generatedMeal.fat || 0,
      },
    };

    // 🔥 REPLACE old AI meals (don't append) - Like Fridge Rescue
    const newMeals = [transformedMeal];

    // Save to localStorage with slot info (persists until next generation)
    saveAIMealsCache(newMeals, activeDayISO, aiMealSlot);

    // Immediately add to board (optimistic update)
    if (board) {
      const dayLists = getDayLists(board, activeDayISO);
      const existingSlotMeals = dayLists[aiMealSlot].filter(m => !m.id.startsWith('ai-meal-'));
      const updatedSlotMeals = [...existingSlotMeals, ...newMeals];
      const updatedDayLists = { ...dayLists, [aiMealSlot]: updatedSlotMeals };
      const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);

      try {
        await saveBoard(updatedBoard);
        toast({
          title: "AI Meal Added!",
          description: `${generatedMeal.name} added to ${lists.find(l => l[0] === aiMealSlot)?.[1]}`,
        });
      } catch (error) {
        console.error("Failed to save AI meal:", error);
        toast({
          title: "Failed to save",
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
  }, [activeDayISO, aiMealSlot, board, saveBoard, toast]);

  // Add Snack handlers
  const onAddSnack = useCallback(() => setShowSnackModal(true), []);

  const onSaveSnack = useCallback(
    async (p: {
      title: string;
      brand?: string;
      servingDesc?: string;
      servings: number;
      calories: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      includeInShoppingList: boolean;
    }) => {
      if (!board) return;

      const currentSnacks =
        FEATURES.dayPlanning === "alpha" &&
        planningMode === "day" &&
        activeDayISO
          ? (getDayLists(board, activeDayISO).snacks ?? [])
          : (board.lists.snacks ?? []);

      const nextIndex =
        currentSnacks.length > 0
          ? Math.max(...currentSnacks.map((s: any) => s?.orderIndex ?? 0)) + 1
          : 0;

      const newSnack: Meal = {
        id: `snk-${Date.now()}`,
        title: p.title,
        name: `Snack ${nextIndex + 1}`,
        servings: p.servings,
        ingredients: [],
        instructions: [],
        nutrition: {
          calories: p.calories,
          protein: p.protein ?? 0,
          carbs: p.carbs ?? 0,
          fat: p.fat ?? 0,
        },
        orderIndex: nextIndex,
        entryType: "quick" as const,
        brand: p.brand,
        servingDesc: p.servingDesc,
        includeInShoppingList: p.includeInShoppingList === true,
      } as any;

      try {
        if (
          FEATURES.dayPlanning === "alpha" &&
          planningMode === "day" &&
          activeDayISO
        ) {
          const dayLists = getDayLists(board, activeDayISO);
          const updatedDay = {
            ...dayLists,
            snacks: [...(dayLists.snacks ?? []), newSnack],
          };
          const updatedBoard = setDayLists(board, activeDayISO, updatedDay);
          const { week } = await putWeekBoard(weekStartISO, updatedBoard);
          setBoard(week);
        } else {
          const snacks = board.lists.snacks ?? [];
          const updated: WeekBoard = {
            ...board,
            lists: { ...board.lists, snacks: [...snacks, newSnack] },
          };
          setBoard(updated);
          await putWeekBoard(weekStartISO, updated);
        }

        try {
          window.dispatchEvent(
            new CustomEvent("board:updated", { detail: { weekStartISO } }),
          );
          window.dispatchEvent(new Event("macros:updated"));
        } catch {}
      } catch (e) {
        console.error("Failed to save snack:", e);
        try {
          const { week } = await getWeekBoardByDate(weekStartISO);
          setBoard(week);
        } catch {}
      }
    },
    [board, weekStartISO, planningMode, activeDayISO],
  );

  // Week navigation
  const gotoWeek = useCallback(
    async (targetISO: string) => {
      setLoading(true);
      try {
        const { weekStartISO: ws, week } = await getWeekBoardByDate(targetISO);
        setWeekStartISO(ws);
        setBoard(week);
      } catch (error) {
        console.error("Failed to load week:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setWeekStartISO, setBoard],
  );

  const onPrevWeek = useCallback(() => {
    if (!weekStartISO) return;
    const d = new Date(weekStartISO + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - 7);
    const prevISO = d.toISOString().slice(0, 10);
    gotoWeek(prevISO);
  }, [weekStartISO, gotoWeek]);

  const onNextWeek = useCallback(() => {
    if (!weekStartISO) return;
    const d = new Date(weekStartISO + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + 7);
    const nextISO = d.toISOString().slice(0, 10);
    gotoWeek(nextISO);
  }, [weekStartISO, gotoWeek]);

  async function quickAdd(list: "breakfast"|"lunch"|"dinner"|"snacks", meal: Meal) {
    if (!board) return;

    try {
      // In Day mode, add to the specific day. In Week mode, use legacy behavior
      if (FEATURES.dayPlanning === 'alpha' && planningMode === 'day' && activeDayISO) {
        // Add to specific day
        const dayLists = getDayLists(board, activeDayISO);
        const updatedDayLists = {
          ...dayLists,
          [list]: [...dayLists[list as keyof typeof dayLists], meal]
        };
        const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
        await saveBoard(updatedBoard);
      } else {
        // Week mode: update local board and save
        const updatedBoard = {
          ...board,
          lists: {
            ...board.lists,
            [list]: [...board.lists[list], meal]
          },
          version: board.version + 1,
          meta: {
            ...board.meta,
            lastUpdatedAt: new Date().toISOString()
          }
        };
        setBoard(updatedBoard);
        await saveBoard(updatedBoard);
      }

      // Dispatch board update event for instant refresh
      try {
        window.dispatchEvent(new CustomEvent("board:updated", { detail: { weekStartISO } }));
        window.dispatchEvent(new Event("macros:updated"));
      } catch { /* no-op */ }

    } catch (error) {
      console.error("Failed to add meal:", error);
    }
  }

  function openPicker(list: "breakfast"|"lunch"|"dinner"|"snacks") {
    setPickerList(list);
    setPickerOpen(true);
  }

  function openManualModal(list: "breakfast"|"lunch"|"dinner"|"snacks") {
    setManualModalList(list);
    setManualModalOpen(true);
  }

  // Add a new dynamic meal slot
  const handleAddMealSlot = useCallback(() => {
    setDynamicMealCount(prev => prev + 1);
    toast({
      title: "Meal Slot Added",
      description: `Meal ${6 + dynamicMealCount} is ready to use`,
    });
  }, [dynamicMealCount, toast]);

  // Get coach-set macro targets from ProCare
  const coachMacroTargets = useMemo(() => {
    const targets = proStore.getTargets(clientId);
    return {
      calories: targets.kcal || 0,
      protein: targets.protein || 0,
      carbs: targets.carbs || 0,
      fat: targets.fat || 0,
    };
  }, [clientId]);

  // Handle Set Macros to Biometrics
  const handleSetMacrosToBiometrics = useCallback(() => {
    if (coachMacroTargets.calories < 100) {
      toast({
        title: "Cannot Set Empty Macros",
        description: "Please have your coach set macro targets first",
        variant: "destructive",
      });
      return;
    }

    // Save macros to localStorage with "anon" user (default biometrics key)
    setMacroTargets({
      calories: coachMacroTargets.calories,
      protein_g: coachMacroTargets.protein,
      carbs_g: coachMacroTargets.carbs,
      fat_g: coachMacroTargets.fat,
    }); // Use default "anon" user instead of clientId

    // Link the current user to this clientId for ProCare integration
    linkUserToClient("anon", clientId);

    // Save clientId for "Came From" dropdown routing
    saveLastAthleteClientId(clientId);

    toast({
      title: "Macros Set to Biometrics!",
      description: `${coachMacroTargets.calories} kcal coach-set targets saved`,
    });

    setLocation("/my-biometrics?from=athlete-meal-board&view=macros");
  }, [coachMacroTargets, clientId, toast, setLocation]);

  // Show error toast if board load fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Connection Issue",
        description:
          "Showing cached meal plan. Changes will sync when you're back online.",
        variant: "default",
        duration: 5000,
      });
    }
  }, [error, toast]);

  if (loading && !board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-2xl h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Athlete Meal Board...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Failed to load board</p>
        </div>
      </div>
    );
  }

  // Determine current lists based on mode
  const currentLists =
    FEATURES.dayPlanning === "alpha" && planningMode === "day" && activeDayISO
      ? getDayLists(board, activeDayISO)
      : board.lists;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-6"
    >
      <DailyMealProgressBar />
      {/* Fixed Back Button - Top Left */}
      <Button
        size="sm"
        onClick={() => setLocation(mode === "athlete" ? "/procare-cover" : "/dashboard")}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-black/60 backdrop-blur-none rounded-2xl border border-white/20 text-white hover:bg-black/80 px-3 sm:px-4 py-2"
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {mode === "athlete" ? "" : "Home"}
      </Button>

      {/* Fixed Client Dashboard Button - Top Right (only in ProCare mode) */}
      {mode === "procare" && (
        <Button
          size="sm"
          onClick={() => setLocation(`/pro/clients/${clientId}`)}
          className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 bg-black/60 backdrop-blur-none rounded-2xl border border-white/20 text-white hover:bg-black/80 px-3 sm:px-4 py-2"
          data-testid="button-client-dashboard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Client Dashboard
        </Button>
      )}

      {/* Header */}
      <div className="mb-6 border border-zinc-800 bg-zinc-900/60 backdrop-blur rounded-2xl mx-4">
        <div className="px-4 py-4 flex flex-col gap-3">
          
          {/* ROW 1: Week Dates (centered) + ? Button (absolute top-right) */}
          <div className="relative flex justify-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onPrevWeek}
                className="rounded-md px-2 py-1 border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
                aria-label="Previous week"
                data-testid="button-prev-week"
              >
                ‹
              </button>

              <div className="text-sm font-medium text-white/90">
                {formatWeekLabel(weekStartISO)}
              </div>

              <button
                type="button"
                onClick={onNextWeek}
                className="rounded-md px-2 py-1 border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
                aria-label="Next week"
                data-testid="button-next-week"
              >
                ›
              </button>
            </div>

            <button
              onClick={() => setShowInfoModal(true)}
              className="absolute right-0 top-0 bg-lime-700 hover:bg-lime-800 border-2 border-lime-600 text-white rounded-2xl h-4 w-4 flex items-center justify-center text-xs font-bold"
              aria-label="How to use Athlete Meal Board"
            >
              ?
            </button>
          </div>

          {/* ROW 2: Title (centered) */}
          <h1 className="text-center text-2xl font-semibold text-white">
            Professional/ Trainer Meal Board
          </h1>

          {/* ROW 3: Day/Week Toggle + Duplicate */}
          {FEATURES.dayPlanning === "alpha" && (
            <div className="flex items-center justify-between gap-3">
              <DayWeekToggle mode={planningMode} onModeChange={setPlanningMode} />
              
              {planningMode === "day" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDuplicateDayModal(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-3 py-1 rounded-xl"
                  data-testid="button-duplicate-day"
                >
                  Duplicate...
                </Button>
              )}

              {planningMode === "week" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDuplicateWeekModal(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-3 py-1 rounded-xl"
                  data-testid="button-duplicate-week"
                >
                  Copy Week...
                </Button>
              )}
            </div>
          )}

          {/* ROW 4: Days of Week */}
          {FEATURES.dayPlanning === "alpha" && planningMode === "day" && weekDatesList.length > 0 && (
            <div className="flex justify-center">
              <DayChips 
                weekDates={weekDatesList}
                activeDayISO={activeDayISO}
                onDayChange={setActiveDayISO}
              />
            </div>
          )}

          {/* ROW 5: Bottom Actions (Delete All + Save) */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm("Delete all meals from this board? This action cannot be undone.")) {
                  if (board) {
                    const clearedBoard = {
                      ...board,
                      lists: {
                        breakfast: [],
                        lunch: [],
                        dinner: [],
                        snacks: []
                      },
                      days: board.days ? Object.fromEntries(
                        Object.keys(board.days).map(dateISO => [
                          dateISO,
                          { breakfast: [], lunch: [], dinner: [], snacks: [] }
                        ])
                      ) : undefined
                    };
                    saveBoard(clearedBoard);
                    clearAIMealsCache();
                    toast({
                      title: "All Meals Deleted",
                      description: "Successfully cleared all meals from the board",
                    });
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-xl"
              data-testid="button-delete-all"
            >
              Delete All
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving || justSaved}
              size="sm"
              className={`${
                justSaved
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-emerald-600/80 hover:bg-emerald-600 text-white"
              } text-xs px-3 py-1 rounded-xl transition-all duration-200`}
            >
              {justSaved ? (
                <><Check className="h-3 w-3 mr-1" />Saved ✓</>
              ) : saving ? (
                "Saving…"
              ) : (
                "Save Plan"
              )}
            </Button>
          </div>

        </div>
      </div>

      {/* Macro Totals Display - Right Above Meal Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="rounded-2xl border border-white/30 bg-black/60 backdrop-blur-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Coach-Set Macro Targets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70">Calories</div>
              <div className="text-2xl font-bold text-white">
                {coachMacroTargets.calories}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70">Protein</div>
              <div className="text-2xl font-bold text-white">
                {coachMacroTargets.protein}g
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70">Carbs</div>
              <div className="text-2xl font-bold text-white">
                {coachMacroTargets.carbs}g
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70">Fat</div>
              <div className="text-2xl font-bold text-white">
                {coachMacroTargets.fat}g
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Cards Grid - Same structure as Weekly Meal Board */}
      <div className="max-w-[1600px] mx-auto px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Render day view or week view based on mode */}
        {FEATURES.dayPlanning === 'alpha' && planningMode === 'day' && activeDayISO && board ? (
          // DAY MODE: Show only the active day's meals
          (() => {
            const dayLists = getDayLists(board, activeDayISO);
            return (
              <>
                {lists.map(([key, label]) => (
              <section key={key} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white/90 text-lg font-medium">{label}</h2>
                  <div className="flex gap-2">
                    {/* AI Meal Creator button for all meal sections */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/80 hover:bg-black/50 border border-pink-400/30 text-xs font-medium flex items-center gap-1 flash-border"
                      onClick={() => {
                        setAiMealSlot(key as "breakfast" | "lunch" | "dinner" | "snacks");
                        setAiMealModalOpen(true);
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                      Create with AI
                    </Button>

                    {/* Plus button for manual entry */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/80 hover:bg-white/10"
                      onClick={() => openManualModal(key)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    {/* Special Add Snack button for Meal 4 only */}
                    {key === "snacks" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/70 hover:bg-white/10 text-xs font-medium"
                        onClick={onAddSnack}
                      >
                        Add Snack
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {dayLists[key as keyof typeof dayLists].map((meal: Meal, idx: number) => (
                    <MealCard
                      key={meal.id}
                      date={activeDayISO}
                      slot={key}
                      meal={meal}
                      onUpdated={(m) => {
                        if (m === null) {
                          // REMOVE MEAL in Day mode - use the new system

                          // 🗑️ If it's an AI meal, also clear from localStorage
                          if (meal.id.startsWith('ai-meal-')) {
                            console.log("🗑️ Deleting AI meal from localStorage:", meal.name);
                            clearAIMealsCache();
                          }

                          const updatedDayLists = {
                            ...dayLists,
                            [key]: dayLists[key as keyof typeof dayLists].filter((existingMeal) =>
                              existingMeal.id !== meal.id
                            )
                          };
                          const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
                          saveBoard(updatedBoard)
                            .catch((err) => {
                              console.error("❌ Delete failed (Day mode):", err);
                            });
                        } else {
                          // Update meal in day lists
                          const updatedDayLists = {
                            ...dayLists,
                            [key]: dayLists[key as keyof typeof dayLists].map((existingMeal, i) =>
                              i === idx ? m : existingMeal
                            )
                          };
                          const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
                          saveBoard(updatedBoard);
                        }
                      }}
                    />
                  ))}
                  {dayLists[key as keyof typeof dayLists].length === 0 && (
                    <div className="rounded-2xl border border-dashed border-zinc-700 text-white/50 p-6 text-center text-sm">
                      <p className="mb-2">No {label.toLowerCase()} meals yet</p>
                      <p className="text-xs text-white/40">Use "+" to add meals</p>
                    </div>
                  )}
                </div>
              </section>
                ))}

                {/* Meal 5 - Additional meal slot for Pro Care */}
                <section key="meal5" className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white/90 text-lg font-medium">Meal 5</h2>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/80 hover:bg-black/50 border border-pink-400/30 text-xs font-medium flex items-center gap-1 flash-border"
                        onClick={() => {
                          setAiMealSlot("snacks");
                          setAiMealModalOpen(true);
                        }}
                      >
                        <Sparkles className="h-3 w-3" />
                        Create with AI
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/80 hover:bg-white/10"
                        onClick={() => openManualModal("snacks")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dayLists.snacks.map((meal: Meal, idx: number) => (
                      <MealCard
                        key={meal.id}
                        date={activeDayISO}
                        slot="snacks"
                        meal={meal}
                        onUpdated={(m) => {
                          if (m === null) {
                            if (meal.id.startsWith('ai-meal-')) {
                              console.log("🗑️ Deleting AI meal from localStorage:", meal.name);
                              clearAIMealsCache();
                            }

                            const updatedDayLists = {
                              ...dayLists,
                              snacks: dayLists.snacks.filter((existingMeal) =>
                                existingMeal.id !== meal.id
                              )
                            };
                            const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
                            saveBoard(updatedBoard)
                              .catch((err) => {
                                console.error("❌ Delete failed (Day mode):", err);
                              });
                          } else {
                            const updatedDayLists = {
                              ...dayLists,
                              snacks: dayLists.snacks.map((existingMeal, i) =>
                                i === idx ? m : existingMeal
                              )
                            };
                            const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
                            saveBoard(updatedBoard);
                          }
                        }}
                      />
                    ))}
                    {dayLists.snacks.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-zinc-700 text-white/50 p-6 text-center text-sm">
                        <p className="mb-2">No Meal 5 yet</p>
                        <p className="text-xs text-white/40">Use "+" to add meals</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Dynamic Meal Cards (Meal 6+) */}
                {Array.from({ length: dynamicMealCount }, (_, i) => {
                  const mealNumber = 6 + i;
                  return (
                    <section key={`dynamic-meal-${mealNumber}`} className="rounded-2xl border border-emerald-800 bg-emerald-950/40 backdrop-blur p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white/90 text-lg font-medium">Meal {mealNumber}</h2>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/80 hover:bg-black/50 border border-pink-400/30 text-xs font-medium flex items-center gap-1 flash-border"
                            onClick={() => {
                              setAiMealSlot("snacks");
                              setAiMealModalOpen(true);
                            }}
                          >
                            <Sparkles className="h-3 w-3" />
                            Create with AI
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/80 hover:bg-white/10"
                            onClick={() => openManualModal("snacks")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {dayLists.snacks.filter((m: Meal) => m.id.startsWith(`dyn-${mealNumber}-`)).map((meal: Meal, idx: number) => (
                          <MealCard
                            key={meal.id}
                            date={activeDayISO}
                            slot="snacks"
                            meal={meal}
                            onUpdated={(m) => {
                              if (m === null) {
                                const updatedDayLists = {
                                  ...dayLists,
                                  snacks: dayLists.snacks.filter((existingMeal) =>
                                    existingMeal.id !== meal.id
                                  )
                                };
                                const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
                                saveBoard(updatedBoard)
                                  .catch((err) => {
                                    console.error("❌ Delete failed (Day mode):", err);
                                  });
                              } else {
                                const updatedDayLists = {
                                  ...dayLists,
                                  snacks: dayLists.snacks.map((existingMeal) =>
                                    existingMeal.id === meal.id ? m : existingMeal
                                  )
                                };
                                const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
                                saveBoard(updatedBoard);
                              }
                            }}
                          />
                        ))}
                        {dayLists.snacks.filter((m: Meal) => m.id.startsWith(`dyn-${mealNumber}-`)).length === 0 && (
                          <div className="rounded-2xl border border-dashed border-zinc-700 text-white/50 p-6 text-center text-sm">
                            <p className="mb-2">No Meal {mealNumber} yet</p>
                            <p className="text-xs text-white/40">Use "+" to add meals</p>
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}

                {/* Add Meal Button */}
                <div className="col-span-full flex justify-center my-4">
                  <Button
                    onClick={handleAddMealSlot}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Meal {6 + dynamicMealCount}
                  </Button>
                </div>

                {/* Snack Card - Below Add Meal Button, Above Daily Totals */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-4 col-span-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white/90 text-lg font-medium">Snacks</h2>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/80 hover:bg-black/50 border border-pink-400/30 text-xs font-medium flex items-center gap-1 flash-border"
                        onClick={() => {
                          setAiMealSlot("snacks");
                          setAiMealModalOpen(true);
                        }}
                      >
                        <Sparkles className="h-3 w-3" />
                        Create with AI
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/80 hover:bg-white/10"
                        onClick={() => openManualModal("snacks")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/70 hover:bg-white/10 text-xs font-medium"
                        onClick={onAddSnack}
                      >
                        Add Snack
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dayLists.snacks.map((meal: Meal, idx: number) => (
                      <MealCard
                        key={meal.id}
                        date={activeDayISO}
                        slot="snacks"
                        meal={meal}
                        onUpdated={(m) => {
                          if (m === null) {
                            if (meal.id.startsWith('ai-meal-')) {
                              clearAIMealsCache();
                            }
                            const updatedDayLists = {
                              ...dayLists,
                              snacks: dayLists.snacks.filter((existingMeal) =>
                                existingMeal.id !== meal.id
                              )
                            };
                            const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
                            saveBoard(updatedBoard).catch((err) => {
                              console.error("❌ Delete failed (Day mode):", err);
                            });
                          } else {
                            const updatedDayLists = {
                              ...dayLists,
                              snacks: dayLists.snacks.map((existingMeal, i) =>
                                i === idx ? m : existingMeal
                              )
                            };
                            const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
                            saveBoard(updatedBoard);
                          }
                        }}
                      />
                    ))}
                    {dayLists.snacks.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-zinc-700 text-white/50 p-6 text-center text-sm">
                        <p className="mb-2">No snacks yet</p>
                        <p className="text-xs text-white/40">Use "+" to add snacks</p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            );
          })()
        ) : (
          // WEEK MODE: Show traditional week view (legacy lists)
          <>
            {lists.map(([key, label]) => (
          <section key={key} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/90 text-lg font-medium">{label}</h2>
              <div className="flex gap-2">
                {/* AI Meal Creator button for all meal sections */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/80 hover:bg-black/50 border border-pink-400/30 text-xs font-medium flex items-center gap-1 flash-border"
                  onClick={() => {
                    setAiMealSlot(key as "breakfast" | "lunch" | "dinner" | "snacks");
                    setAiMealModalOpen(true);
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  Create with AI
                </Button>

                {/* Plus button for manual entry */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/80 hover:bg-white/10"
                  onClick={() => openManualModal(key)}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                {/* Special Add Snack button for Meal 4 only */}
                {key === "snacks" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:bg-white/10 text-xs font-medium"
                    onClick={onAddSnack}
                  >
                    Add Snack
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {board.lists[key].map((meal: Meal, idx: number) => (
                <MealCard
                  key={meal.id}
                  date={"board"}
                  slot={key}
                  meal={meal}
                  onUpdated={(m) => {
                    if (m === null) {
                      // Remove meal using new API
                      if (!board) return;
                      const updatedBoard = {
                        ...board,
                        lists: {
                          ...board.lists,
                          [key]: board.lists[key].filter((item: Meal) => item.id !== meal.id)
                        },
                        version: board.version + 1,
                        meta: {
                          ...board.meta,
                          lastUpdatedAt: new Date().toISOString()
                        }
                      };
                      setBoard(updatedBoard);
                      saveBoard(updatedBoard).catch((err) => {
                        console.error("❌ Delete failed (Board mode):", err);
                      });
                    } else {
                      // Update meal
                      const updatedBoard = {
                        ...board,
                        lists: {
                          ...board.lists,
                          [key]: board.lists[key].map((item: Meal, i: number) => i === idx ? m : item)
                        },
                        version: board.version + 1
                      };
                      setBoard(updatedBoard);
                      saveBoard(updatedBoard).catch(console.error);
                    }
                  }}
                />
              ))}
              {board.lists[key].length === 0 && (
                <div className="rounded-2xl border border-dashed border-zinc-700 text-white/50 p-6 text-center text-sm">
                  <p className="mb-2">No {label.toLowerCase()} meals yet</p>
                  <p className="text-xs text-white/40">Use "+" to add meals</p>
                </div>
              )}
            </div>
          </section>
            ))}

            {/* Meal 5 - Additional meal slot for Pro Care */}
            <section key="meal5" className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white/90 text-lg font-medium">Meal 5</h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/80 hover:bg-black/50 border border-pink-400/30 text-xs font-medium flex items-center gap-1 flash-border"
                    onClick={() => {
                      setAiMealSlot("snacks");
                      setAiMealModalOpen(true);
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                    Create with AI
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/80 hover:bg-white/10"
                    onClick={() => openManualModal("snacks")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {board.lists.snacks.map((meal: Meal, idx: number) => (
                  <MealCard
                    key={meal.id}
                    date={"board"}
                    slot="snacks"
                    meal={meal}
                    onUpdated={(m) => {
                      if (m === null) {
                        if (!board) return;
                        const updatedBoard = {
                          ...board,
                          lists: {
                            ...board.lists,
                            snacks: board.lists.snacks.filter((item: Meal) => item.id !== meal.id)
                          },
                          version: board.version + 1,
                          meta: {
                            ...board.meta,
                            lastUpdatedAt: new Date().toISOString()
                          }
                        };
                        setBoard(updatedBoard);
                        saveBoard(updatedBoard).catch((err) => {
                          console.error("❌ Delete failed (Board mode):", err);
                        });
                      } else {
                        const updatedBoard = {
                          ...board,
                          lists: {
                            ...board.lists,
                            snacks: board.lists.snacks.map((item: Meal, i: number) => i === idx ? m : item)
                          },
                          version: board.version + 1
                        };
                        setBoard(updatedBoard);
                        saveBoard(updatedBoard).catch(console.error);
                      }
                    }}
                  />
                ))}
                {board.lists.snacks.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-zinc-700 text-white/50 p-6 text-center text-sm">
                    <p className="mb-2">No Meal 5 yet</p>
                    <p className="text-xs text-white/40">Use "+" to add meals</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

          {/* Daily Totals Summary */}
          <div className="col-span-full">
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/95 backdrop-blur-lg p-6">
              <h3 className="text-white font-semibold text-lg mb-4 text-center flex items-center justify-center gap-2">
                {planningMode === "day" && activeDayISO
                  ? `${new Date(activeDayISO + "T00:00:00Z").toLocaleDateString(undefined, { weekday: "long" })} Totals`
                  : "Daily Totals"}
                {(() => {
                  // Check if there are any meals
                  const hasMeals = board && (
                    (planningMode === 'day' && activeDayISO
                      ? (() => {
                          const dayLists = getDayLists(board, activeDayISO);
                          return dayLists.breakfast.length > 0 || dayLists.lunch.length > 0 || dayLists.dinner.length > 0 || dayLists.snacks.length > 0;
                        })()
                      : board.lists.breakfast.length > 0 || board.lists.lunch.length > 0 || board.lists.dinner.length > 0 || board.lists.snacks.length > 0)
                  );

                  // Show button if there are meals, flash only if user hasn't seen the info
                  if (hasMeals) {
                    return (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowDailyTotalsInfo(true)}
                        className={`h-8 w-8 p-0 text-white/90 hover:text-white hover:bg-white/10 rounded-full ${
                          !hasSeenDailyTotalsInfo ? 'flash-border' : ''
                        }`}
                        aria-label="Next Steps Info"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    );
                  }
                  return null;
                })()}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-semi-bold text-white">
                    {Math.round(
                      (() => {
                        if (
                          FEATURES.dayPlanning === "alpha" &&
                          planningMode === "day" &&
                          activeDayISO &&
                          board
                        ) {
                          const dayLists = getDayLists(board, activeDayISO);
                          return [
                            ...dayLists.breakfast,
                            ...dayLists.lunch,
                            ...dayLists.dinner,
                            ...dayLists.snacks,
                          ].reduce(
                            (sum, meal) =>
                              sum + (meal.nutrition?.calories ?? 0),
                            0,
                          );
                        }
                        return [
                          ...board.lists.breakfast,
                          ...board.lists.lunch,
                          ...board.lists.dinner,
                          ...board.lists.snacks,
                        ].reduce(
                          (sum, meal) => sum + (meal.nutrition?.calories ?? 0),
                          0,
                        );
                      })(),
                    )}
                  </div>
                  <div className="text-xs uppercase tracking-wide text--200/70 mt-1">
                    Calories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semi-bold text-white">
                    {Math.round(
                      (() => {
                        if (
                          FEATURES.dayPlanning === "alpha" &&
                          planningMode === "day" &&
                          activeDayISO &&
                          board
                        ) {
                          const dayLists = getDayLists(board, activeDayISO);
                          return [
                            ...dayLists.breakfast,
                            ...dayLists.lunch,
                            ...dayLists.dinner,
                            ...dayLists.snacks,
                          ].reduce(
                            (sum, meal) => sum + (meal.nutrition?.protein ?? 0),
                            0,
                          );
                        }
                        return [
                          ...board.lists.breakfast,
                          ...board.lists.lunch,
                          ...board.lists.dinner,
                          ...board.lists.snacks,
                        ].reduce(
                          (sum, meal) => sum + (meal.nutrition?.protein ?? 0),
                          0,
                        );
                      })(),
                    )}
                    g
                  </div>
                  <div className="text-xs uppercase tracking-wide text-white-200/70 mt-1">
                    Protein
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semi-bold text-white">
                    {Math.round(
                      (() => {
                        if (
                          FEATURES.dayPlanning === "alpha" &&
                          planningMode === "day" &&
                          activeDayISO &&
                          board
                        ) {
                          const dayLists = getDayLists(board, activeDayISO);
                          return [
                            ...dayLists.breakfast,
                            ...dayLists.lunch,
                            ...dayLists.dinner,
                            ...dayLists.snacks,
                          ].reduce(
                            (sum, meal) => sum + (meal.nutrition?.carbs ?? 0),
                            0,
                          );
                        }
                        return [
                          ...board.lists.breakfast,
                          ...board.lists.lunch,
                          ...board.lists.dinner,
                          ...board.lists.snacks,
                        ].reduce(
                          (sum, meal) => sum + (meal.nutrition?.carbs ?? 0),
                          0,
                        );
                      })(),
                    )}
                    g
                  </div>
                  <div className="text-xs uppercase tracking-wide text-white-200/70 mt-1">
                    Carbs
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semi-bold text-white">
                    {Math.round(
                      (() => {
                        if (
                          FEATURES.dayPlanning === "alpha" &&
                          planningMode === "day" &&
                          activeDayISO &&
                          board
                        ) {
                          const dayLists = getDayLists(board, activeDayISO);
                          return [
                            ...dayLists.breakfast,
                            ...dayLists.lunch,
                            ...dayLists.dinner,
                            ...dayLists.snacks,
                          ].reduce(
                            (sum, meal) => sum + (meal.nutrition?.fat ?? 0),
                            0,
                          );
                        }
                        return [
                          ...board.lists.breakfast,
                          ...board.lists.lunch,
                          ...board.lists.dinner,
                          ...board.lists.snacks,
                        ].reduce(
                          (sum, meal) => sum + (meal.nutrition?.fat ?? 0),
                          0,
                        );
                      })(),
                    )}
                    g
                  </div>
                  <div className="text-xs uppercase tracking-wide text-white-200/70 mt-1">
                    Fat
                  </div>
                </div>
              </div>

              {/* Coach-Set Macro Targets for Biometrics */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="text-white/80 text-sm mb-3 text-center">
                  Coach-Set Macro Targets
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white-300">
                      {coachMacroTargets.calories}
                    </div>
                    <div className="text-xs text-white/60">Calories/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white-300">
                      {coachMacroTargets.protein}g
                    </div>
                    <div className="text-xs text-white/60">Protein/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white-300">
                      {coachMacroTargets.carbs}g
                    </div>
                    <div className="text-xs text-white/60">Carbs/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white-300">
                      {coachMacroTargets.fat}g
                    </div>
                    <div className="text-xs text-white/60">Fat/day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Macro Bridge Footer - Day Mode Only */}
          {board &&
            FEATURES.dayPlanning === "alpha" &&
            planningMode === "day" &&
            activeDayISO && (
              <div className="col-span-full">
                <MacroBridgeFooter
                  items={(() => {
                    const dayLists = getDayLists(board, activeDayISO);
                    return [
                      ...dayLists.breakfast.map((m) => ({
                        protein: m.nutrition?.protein || 0,
                        carbs: m.nutrition?.carbs || 0,
                        fat: m.nutrition?.fat || 0,
                        calories: m.nutrition?.calories || 0,
                      })),
                      ...dayLists.lunch.map((m) => ({
                        protein: m.nutrition?.protein || 0,
                        carbs: m.nutrition?.carbs || 0,
                        fat: m.nutrition?.fat || 0,
                        calories: m.nutrition?.calories || 0,
                      })),
                      ...dayLists.dinner.map((m) => ({
                        protein: m.nutrition?.protein || 0,
                        carbs: m.nutrition?.carbs || 0,
                        fat: m.nutrition?.fat || 0,
                        calories: m.nutrition?.calories || 0,
                      })),
                      ...dayLists.snacks.map((m) => ({
                        protein: m.nutrition?.protein || 0,
                        carbs: m.nutrition?.carbs || 0,
                        fat: m.nutrition?.fat || 0,
                        calories: m.nutrition?.calories || 0,
                      })),
                    ];
                  })()}
                  dateISO={activeDayISO}
                  variant="day"
                  source="athlete-meal-board"
                />
              </div>
            )}
      </div>

      {/* Modals */}
      <AthleteMealPickerDrawer
        open={pickerOpen}
        list={pickerList}
        onClose={() => {
          setPickerOpen(false);
          setPickerList(null);
        }}
        onPick={(meal) => {
          if (pickerList) {
            quickAdd(pickerList, meal);
          }
          setPickerOpen(false);
          setPickerList(null);
        }}
      />

      <ManualMealModal
        open={manualModalOpen}
        onClose={() => {
          setManualModalOpen(false);
          setManualModalList(null);
        }}
        onSave={(meal) => {
          if (manualModalList) {
            quickAdd(manualModalList, meal);
          }
          setManualModalOpen(false);
          setManualModalList(null);
        }}
      />

      <AddSnackModal
        open={showSnackModal}
        onClose={() => setShowSnackModal(false)}
        onSave={onSaveSnack}
      />

      <WeeklyOverviewModal
        open={showOverview}
        onClose={() => setShowOverview(false)}
        weekStartISO={weekStartISO}
        board={board}
        onJumpToDay={undefined}
      />

      {FEATURES.dayPlanning === "alpha" && (
        <DuplicateDayModal
          isOpen={showDuplicateDayModal}
          onClose={() => setShowDuplicateDayModal(false)}
          onConfirm={handleDuplicateDay}
          sourceDateISO={activeDayISO}
          availableDates={weekDatesList.filter((date) => date !== activeDayISO)}
        />
      )}

      {FEATURES.dayPlanning === "alpha" && (
        <DuplicateWeekModal
          isOpen={showDuplicateWeekModal}
          onClose={() => setShowDuplicateWeekModal(false)}
          onConfirm={handleDuplicateWeek}
          sourceWeekStartISO={weekStartISO}
        />
      )}

      <ShoppingListPreviewModal
        isOpen={shoppingListModal.isOpen}
        onClose={() => setShoppingListModal({ isOpen: false, meal: null })}
        meal={shoppingListModal.meal}
      />

      {/* AI Meal Creator with Ingredient Picker */}
      <MealIngredientPicker
        open={aiMealModalOpen}
        onOpenChange={setAiMealModalOpen}
        onMealGenerated={handleAIMealGenerated}
        mealSlot={aiMealSlot}
      />

      {/* Shopping List Buttons */}
      {board && (() => {
          const currentBoard = board; // Capture board in local variable for type safety

          const allMeals =
            planningMode === "day" && activeDayISO
              ? (() => {
                  const dayLists = getDayLists(currentBoard, activeDayISO);
                  return [
                    ...dayLists.breakfast,
                    ...dayLists.lunch,
                    ...dayLists.dinner,
                    ...dayLists.snacks,
                  ];
                })()
              : [
                  ...currentBoard.lists.breakfast,
                  ...currentBoard.lists.lunch,
                  ...currentBoard.lists.dinner,
                  ...currentBoard.lists.snacks,
                ];

          const ingredients = allMeals.flatMap((meal) =>
            normalizeIngredients(meal.ingredients || []),
          );

          if (ingredients.length === 0) return null;

          // DAY MODE: Show dual buttons
          if (
            FEATURES.dayPlanning === "alpha" &&
            planningMode === "day" &&
            activeDayISO
          ) {
            const dayName = new Date(
              activeDayISO + "T00:00:00Z",
            ).toLocaleDateString(undefined, { weekday: "long" });

            return (
              <div className="fixed bottom-0 left-0 right-0 pb-4 z-40 bg-gradient-to-r from-zinc-900/95 via-zinc-800/95 to-black/95 backdrop-blur-xl border-t border-white/20 shadow-2xl">
                <div className="container mx-auto px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <div className="text-white text-sm font-semibold">
                      Shopping List Ready - {ingredients.length} ingredients
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          handleAddToShoppingList();
                          setTimeout(
                            () =>
                              setLocation(
                                "/shopping-list-v2?from=athlete-meal-board",
                              ),
                            100,
                          );
                        }}
                        className="flex-1 min-h-[44px] bg-orange-600 hover:bg-orange-700 text-white border border-white/30"
                        data-testid="button-send-day-shopping"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Send {dayName}
                      </Button>
                      <Button
                        onClick={() => {
                          handleAddEntireWeekToShoppingList();
                          setTimeout(
                            () =>
                              setLocation(
                                "/shopping-list-v2?from=athlete-meal-board",
                              ),
                            100,
                          );
                        }}
                        className="flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white border border-white/30"
                        data-testid="button-send-week-shopping"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Send Entire Week
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // WEEK MODE: Use ShoppingAggregateBar
          return (
            <ShoppingAggregateBar
              ingredients={ingredients}
              source="Athlete Meal Board"
              sourceSlug="athlete-meal-board"
            />
          );
        })()}

      {/* Info Modal - How to Use */}
      <Dialog open={showInfoModal} onOpenChange={(open) => {
        if (!open) {
          handleInfoModalClose();
        } else {
          setShowInfoModal(true);
        }
      }}>
        <DialogContent className="bg-black/90 border border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-emerald-400" />
              How to Use Professional Care Meals
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-white/90">
            <p>
              The Athlete Board helps you build competition-ready meal plans with precise macro tracking for peak performance.
            </p>
            <div>
              <h3 className="font-semibold text-emerald-400 mb-2">Steps:</h3>
              <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                <li>Start with Meal 1 (breakfast) and work through each meal section</li>
                <li>Click "Create with AI" to generate meals based on your coach's macro targets</li>
                <li>Choose Day or Week mode to plan one day at a time or your entire week</li>
                <li>Use the duplicate feature to copy successful days across your week</li>
                <li>Delete any meal with the trash icon if you want to try something different</li>
                <li>Send your plan to Biometrics to track your daily macro progress</li>
              </ul>
            </div>
            <p className="text-emerald-400 font-medium">
              💡 Tip: Your coach has set specific macro targets for you. Use "Set Macros to Biometrics" to sync them and track your daily progress!
            </p>
          </div>
          <Button
            onClick={() => setShowInfoModal(false)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl"
          >
            Got It!
          </Button>
        </DialogContent>
      </Dialog>

      {/* Daily Totals Info Modal - Next Steps After First Meal */}
      <Dialog open={showDailyTotalsInfo} onOpenChange={(open) => {
        if (!open) {
          setShowDailyTotalsInfo(false);
          setHasSeenDailyTotalsInfo(true);
          localStorage.setItem("athlete-board-daily-totals-info-seen", "true");
        }
      }}>
        <DialogContent className="bg-gradient-to-b from-orange-900/95 via-zinc-900/95 to-black/95 border-orange-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-orange-400" />
              Next Steps - Track Your Progress!
            </DialogTitle>
          </DialogHeader>
          <div className="text-white/90 text-sm space-y-4">
            <p className="text-base font-semibold text-orange-300">
              Great job creating your meals! Here's what to do next:
            </p>

            <div className="space-y-3">
              <div className="bg-black/30 p-3 rounded-lg border border-orange-500/20">
                <p className="font-semibold text-white mb-1 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-orange-400" />
                  Option 1: Track Your Macros
                </p>
                <p className="text-white/70 text-xs">
                  Send your day to the Macro Calculator to ensure you're hitting your nutrition targets.
                  Look for the "Send to Macros" button below.
                </p>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-orange-500/20">
                <p className="font-semibold text-white mb-1">
                  Option 2: Plan Your Week
                </p>
                <p className="text-white/70 text-xs">
                  Use the Day/Week toggle at the top to switch between planning a single day or your entire week.
                  You can duplicate days or create each day individually.
                </p>
              </div>

              <div className="bg-orange-900/30 p-3 rounded-lg border border-orange-400/30">
                <p className="font-semibold text-orange-200 mb-1">
                  💡 Pro Tip: Macro Tracking
                </p>
                <p className="text-orange-100/80 text-xs">
                  Send just ONE day to macros at a time (not the whole week).
                  This way, if you change meals on other days, you won't have outdated data.
                </p>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-emerald-500/20">
                <p className="font-semibold text-white mb-1 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-emerald-400" />
                  Shopping List Ready
                </p>
                <p className="text-white/70 text-xs">
                  You CAN send your entire week to the shopping list!
                  This consolidates all ingredients for easy grocery shopping.
                  Click "Send Entire Week" at the bottom.
                </p>
              </div>
            </div>

            <p className="text-xs text-white/60 text-center pt-2 border-t border-white/10">
              Next: Check out the Shopping List to learn how to use it effectively!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}