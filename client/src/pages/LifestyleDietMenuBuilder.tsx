
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { MealCard, Meal } from "@/components/MealCard";
import { getWeekBoard, saveWeekBoard, removeMealFromCurrentWeek, getCurrentWeekBoard, getWeekBoardByDate, putWeekBoard, type WeekBoard, weekDates, getDayLists, setDayLists, cloneDayLists } from "@/lib/boardApi";
import { MealPickerDrawer } from "@/components/pickers/MealPickerDrawer";
import { ManualMealModal } from "@/components/pickers/ManualMealModal";
import { AddSnackModal } from "@/components/AddSnackModal";
import { MacroBridgeFooter } from "@/components/biometrics/MacroBridgeFooter";
import WeeklyOverviewModal from "@/components/WeeklyOverviewModal";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";
import { normalizeIngredients } from "@/utils/ingredientParser";
import { useOnboardingProfile } from "@/hooks/useOnboardingProfile";
import { addItems } from "@/stores/shoppingListStore";
import { computeTargetsFromOnboarding, sumBoard } from "@/lib/targets";
import { useTodayMacros } from "@/hooks/useTodayMacros";
import { useMidnightReset } from "@/hooks/useMidnightReset";
import { todayISOInTZ } from "@/utils/midnight";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Check, Sparkles, BarChart3, ShoppingCart, X, Home, ArrowLeft, Info } from "lucide-react";
import { FEATURES } from "@/utils/features";
import { DayWeekToggle } from "@/components/DayWeekToggle";
import { DayChips } from "@/components/DayChips";
import { DuplicateDayModal } from "@/components/DuplicateDayModal";
import { DuplicateWeekModal } from "@/components/DuplicateWeekModal";
import { WhyChip } from "@/components/WhyChip";
import { WhyDrawer } from "@/components/WhyDrawer";
import { getWeeklyPlanningWhy } from "@/utils/reasons";
import { useToast } from "@/hooks/use-toast";
import ShoppingListPreviewModal from "@/components/ShoppingListPreviewModal";
import { useWeeklyBoard } from "@/hooks/useWeeklyBoard";
import { getMondayISO } from "@/../../shared/schema/weeklyBoard";
import { v4 as uuidv4 } from "uuid";
import MealIngredientPicker from "@/components/MealIngredientPicker";
import DailyMealProgressBar from "@/components/guided/DailyMealProgressBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lifestyleDietPickerConfig, type LifestyleDietKey } from "@/data/lifestyleDietPickerConfig";

type LifestyleDietMode = "mediterranean" | "vegan" | "vegetarian" | "pescatarian" | "paleo" | "keto" | "flexitarian";

function makeNewSnack(nextIndex: number): Meal {
  return {
    id: `snk-${Date.now()}`,
    title: 'Snack',
    servings: 1,
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };
}

function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatWeekLabel(weekStartISO: string): string {
  const start = new Date(weekStartISO + 'T00:00:00Z');
  const end = new Date(start); 
  end.setUTCDate(start.getUTCDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${fmt(start)}–${fmt(end)}`;
}

export default function LifestyleDietMenuBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [weekStartISO, setWeekStartISO] = React.useState<string>(getMondayISO());
  const { board: hookBoard, loading: hookLoading, error, save: saveToHook, source } = useWeeklyBoard("1", weekStartISO);

  const [board, setBoard] = React.useState<WeekBoard | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);

  React.useEffect(() => {
    if (hookBoard) {
      setBoard(hookBoard);
      setLoading(hookLoading);
    }
  }, [hookBoard, hookLoading]);

  const saveBoard = React.useCallback(async (updatedBoard: WeekBoard) => {
    setSaving(true);
    try {
      await saveToHook(updatedBoard as any, uuidv4());
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save board:", err);
      toast({ title: "Save failed", description: "Changes will retry when you're online", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [saveToHook, toast]);

  const [planningMode, setPlanningMode] = React.useState<'day' | 'week'>('day');
  const [activeDayISO, setActiveDayISO] = React.useState<string>('');
  const [dietMode, setDietMode] = React.useState<LifestyleDietMode>("mediterranean");

  // TODO PHASE 4: Wire this to actual picker ingredients
  const activePickerConfig = lifestyleDietPickerConfig[dietMode];

  const weekDatesList = useMemo(() => {
    return weekStartISO ? weekDates(weekStartISO) : [];
  }, [weekStartISO]);

  useEffect(() => {
    if (weekDatesList.length > 0 && !activeDayISO) {
      setActiveDayISO(weekDatesList[0]);
    }
  }, [weekDatesList, activeDayISO]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed top-4 left-4 pointer-events-auto"
        style={{ 
          zIndex: 2147483647,
          isolation: 'isolate',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <Button
          onClick={() => setLocation("/planner")}
          className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-none border border-white/30 hover:bg-black/40 transition-all duration-200 font-medium rounded-xl shadow-2xl"
        >
          <ArrowLeft className="h-4 w-4 text-white" />
          Planner
        </Button>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10 pointer-events-none" />

        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 relative z-10">
          <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden mb-8 mt-14">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            <h1 className="text-2xl md:text-2xl font-semibold text-white mb-4 relative z-10">
              🥗 Lifestyle Diet Meal Board
            </h1>
            <p className="text-sm text-white/90 max-w-3xl mx-auto relative z-10">
              Build your meal plan with lifestyle-friendly options
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
            <div className="relative z-10">
              <label className="block text-sm text-white mb-2 font-medium">Choose Lifestyle Diet</label>
              <Select value={dietMode} onValueChange={(val) => setDietMode(val as LifestyleDietMode)}>
                <SelectTrigger className="w-full bg-white/20 border-white/40 text-white [&>span]:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="flexitarian">Flexitarian</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-white/60 mt-2">Selected: {dietMode}</p>
            </div>
          </div>

          <div className="text-center text-white/70 py-20">
            <p>Lifestyle Diet Meal Board - Coming Soon</p>
            <p className="text-sm mt-2">Meal cards and planning features will appear here</p>
          </div>
        </div>
      </div>
    </>
  );
}
