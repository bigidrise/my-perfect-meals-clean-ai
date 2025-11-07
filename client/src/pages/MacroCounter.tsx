// client/src/pages/MacroCounter.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  User2,
  Info,
  Ruler,
  Scale,
  Target,
  X,
  Home,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setMacroTargets } from "@/lib/dailyLimits";
import ReadOnlyNote from "@/components/ReadOnlyNote";

type Goal = "loss" | "maint" | "gain";
type Sex = "male" | "female";
type Units = "imperial" | "metric";
type BodyType = "ecto" | "meso" | "endo";

const toNum = (v: string | number) => {
  const n = typeof v === "string" ? v.trim() : v;
  const out = Number(n || 0);
  return Number.isFinite(out) ? out : 0;
};

const kgFromLbs = (lbs: number) => lbs * 0.45359237;
const cmFromFeetInches = (ft: number, inch: number) => ft * 30.48 + inch * 2.54;

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

function mifflin({
  sex,
  kg,
  cm,
  age,
}: {
  sex: Sex;
  kg: number;
  cm: number;
  age: number;
}) {
  const b = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
  return Math.max(800, Math.round(b));
}

function goalAdjust(tdee: number, goal: Goal) {
  if (goal === "loss") return Math.round(tdee * 0.85);
  if (goal === "gain") return Math.round(tdee * 1.1);
  return Math.round(tdee);
}

function calcMacrosBase({ calories, kg, proteinPerKg, fatPct, sex }: any) {
  const pG = Math.round(kg * proteinPerKg);
  const pK = pG * 4;
  const fK = Math.round(calories * fatPct);
  const fG = Math.round(fK / 9);
  const cK = Math.max(0, calories - pK - fK);
  const cG = Math.round(cK / 4);
  return {
    calories,
    protein: { g: pG, kcal: pK },
    fat: { g: fG, kcal: fK },
    carbs: { g: cG, kcal: cK },
  };
}

function applyBodyTypeTilt(base: any, bodyType: BodyType) {
  let tilt = 0;
  if (bodyType === "ecto") tilt = +0.14;
  if (bodyType === "endo") tilt = -0.18;
  if (tilt === 0) return base;
  const shiftKcal = Math.round(base.calories * Math.abs(tilt));
  if (tilt > 0) {
    const nextFatK = Math.max(0, base.fat.kcal - shiftKcal);
    const nextCarbK = base.carbs.kcal + shiftKcal;
    return {
      ...base,
      fat: { kcal: nextFatK, g: Math.round(nextFatK / 9) },
      carbs: { kcal: nextCarbK, g: Math.round(nextCarbK / 4) },
    };
  } else {
    const nextCarbK = Math.max(0, base.carbs.kcal - shiftKcal);
    const nextFatK = base.fat.kcal + shiftKcal;
    return {
      ...base,
      fat: { kcal: nextFatK, g: Math.round(nextFatK / 9) },
      carbs: { kcal: nextCarbK, g: Math.round(nextCarbK / 4) },
    };
  }
}

// ===== Nutrition Profile storage (localStorage) =====
const LS_USER_PROFILE = "mpm_user_profile_v1";

type NutritionProfile = {
  dietaryPatterns: string[];
  allergies: string[];
  sodiumPreference: "normal" | "low" | "very_low";
  notes?: string;
};

const defaultProfile: NutritionProfile = {
  dietaryPatterns: [],
  allergies: [],
  sodiumPreference: "normal",
  notes: "",
};

const loadProfile = (): NutritionProfile => {
  try {
    const raw = localStorage.getItem(LS_USER_PROFILE);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
};

const saveProfile = (p: NutritionProfile) => {
  try {
    localStorage.setItem(LS_USER_PROFILE, JSON.stringify(p));
  } catch {}
};

const DIETARY_PATTERNS = [
  { key: "diabetic", label: "Diabetic" },
  { key: "glp1", label: "GLP-1" },
  { key: "pescatarian", label: "Pescatarian" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
  { key: "low_fodmap", label: "Low-FODMAP" },
  { key: "keto", label: "Keto" },
];

const ALLERGY_LIST = [
  { key: "peanut", label: "Peanut" },
  { key: "tree_nut", label: "Tree Nuts" },
  { key: "dairy", label: "Dairy" },
  { key: "egg", label: "Egg" },
  { key: "soy", label: "Soy" },
  { key: "wheat", label: "Wheat/Gluten" },
  { key: "fish", label: "Fish" },
  { key: "shellfish", label: "Shellfish" },
];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-sm transition
        ${active ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}
      `}
    >
      {children}
    </button>
  );
}

function BodyTypeGuide() {
  return (
    <div className="mb-3">
      <details className="rounded-xl border border-white/15 bg-white/5 p-3">
        <summary className="cursor-pointer select-none text-sm font-semibold text-white/90">
          Body Type Guide (tap to expand)
        </summary>

        <div className="mt-2 space-y-3 text-sm text-white/80">
          <div>
            <div className="font-semibold text-white">Ectomorph</div>
            <p className="mt-1 leading-relaxed">
              Naturally lean or "hard gainer." Smaller frame, narrower
              shoulders/hips, and tends to struggle gaining weight or muscle.
              Often a faster metabolism.{" "}
              <span className="text-white/90">Strategy:</span> a bit more
              calories and carbs; keep protein steady.
            </p>
          </div>

          <div>
            <div className="font-semibold text-white">Mesomorph</div>
            <p className="mt-1 leading-relaxed">
              Athletic middle build—can gain muscle and lose fat more easily.
              Medium frame and usually responds well to training and nutrition
              changes. <span className="text-white/90">Strategy:</span> balanced
              calories and macros; adjust up/down with goals.
            </p>
          </div>

          <div>
            <div className="font-semibold text-white">Endomorph</div>
            <p className="mt-1 leading-relaxed">
              Bigger frame ("full house") that gains weight more easily and may
              lose it more slowly. Often benefits from tighter calorie control
              and mindful carbs.{" "}
              <span className="text-white/90">Strategy:</span> slightly fewer
              starchy carbs, a bit more fat for satiety.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-2">
            <div className="text-white/90 font-medium text-[13px]">
              How to choose quickly
            </div>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>
                If you've always been naturally thin and struggle to gain →{" "}
                <b>Ectomorph</b>
              </li>
              <li>
                If you build/lean fairly easily with training → <b>Mesomorph</b>
              </li>
              <li>
                If you gain easily and fat loss feels slower → <b>Endomorph</b>
              </li>
            </ul>
            <p className="mt-2 text-[12px] text-white/60">
              Not exact? Pick the one that best matches your history and how
              your body responds. This just sets a smart starting split.
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}

export default function MacroCounter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Load calculator settings from localStorage
  const loadCalculatorSettings = () => {
    try {
      const saved = localStorage.getItem('macro_calculator_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📥 Loaded macro settings:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load macro settings:', error);
    }
    return null;
  };

  const savedSettings = loadCalculatorSettings();

  const [goal, setGoal] = useState<Goal>(savedSettings?.goal ?? "maint");
  const [bodyType, setBodyType] = useState<BodyType>(savedSettings?.bodyType ?? "meso");
  const [units, setUnits] = useState<Units>(savedSettings?.units ?? "imperial");
  const [sex, setSex] = useState<Sex>(savedSettings?.sex ?? "female");
  const [age, setAge] = useState<number>(savedSettings?.age ?? 30);
  const [heightFt, setHeightFt] = useState<number>(savedSettings?.heightFt ?? 5);
  const [heightIn, setHeightIn] = useState<number>(savedSettings?.heightIn ?? 7);
  const [weightLbs, setWeightLbs] = useState<number>(savedSettings?.weightLbs ?? 160);
  const [heightCm, setHeightCm] = useState<number>(savedSettings?.heightCm ?? 170);
  const [weightKg, setWeightKg] = useState<number>(savedSettings?.weightKg ?? 72.5);
  const [activity, setActivity] =
    useState<keyof typeof ACTIVITY_FACTORS>(savedSettings?.activity ?? "light");
  const [proteinPerKg, setProteinPerKg] = useState<number>(savedSettings?.proteinPerKg ?? 1.8);
  const [fatPct, setFatPct] = useState<number>(savedSettings?.fatPct ?? 0.3);
  const [sugarCapMode, setSugarCapMode] = useState<"AHA" | "DGA">(savedSettings?.sugarCapMode ?? "AHA");

  // Nutrition Profile state
  const [profile, setProfile] = useState<NutritionProfile>(() => loadProfile());
  const toggleDietary = (key: string) =>
    setProfile((p) => {
      const has = p.dietaryPatterns.includes(key);
      return {
        ...p,
        dietaryPatterns: has
          ? p.dietaryPatterns.filter((k) => k !== key)
          : [...p.dietaryPatterns, key],
      };
    });
  const toggleAllergy = (key: string) =>
    setProfile((p) => {
      const has = p.allergies.includes(key);
      return {
        ...p,
        allergies: has
          ? p.allergies.filter((k) => k !== key)
          : [...p.allergies, key],
      };
    });

  // Load profile from localStorage on component mount
  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Save calculator settings to localStorage whenever they change
  useEffect(() => {
    try {
      const settings = {
        goal,
        bodyType,
        units,
        sex,
        age,
        heightFt,
        heightIn,
        weightLbs,
        heightCm,
        weightKg,
        activity,
        proteinPerKg,
        fatPct,
        sugarCapMode
      };
      localStorage.setItem('macro_calculator_settings', JSON.stringify(settings));
      console.log('💾 Saved macro settings:', settings);
    } catch (error) {
      console.error('Failed to save macro settings:', error);
    }
  }, [goal, bodyType, units, sex, age, heightFt, heightIn, weightLbs, heightCm, weightKg, activity, proteinPerKg, fatPct, sugarCapMode]);

  const kg = units === "imperial" ? kgFromLbs(weightLbs) : weightKg;
  const cm =
    units === "imperial" ? cmFromFeetInches(heightFt, heightIn) : heightCm;

  const results = useMemo(() => {
    const bmr = mifflin({ sex, kg, cm, age });
    const tdee = Math.round(bmr * ACTIVITY_FACTORS[activity]);
    const target = goalAdjust(tdee, goal);
    const base = calcMacrosBase({
      calories: target,
      kg,
      sex,
      proteinPerKg,
      fatPct,
    });
    const macros = applyBodyTypeTilt(base, bodyType);
    return { bmr, tdee, target, macros };
  }, [sex, kg, cm, age, activity, goal, proteinPerKg, fatPct, bodyType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 text-white px-4 pt-8 pb-32"
    >
      <Button
        onClick={() => setLocation("/dashboard")}
        className="fixed top-4 left-4 z-50 bg-black/30 hover:bg-black/50 text-white rounded-2xl border border-white/10 backdrop-blur-none"
        size="sm"
        data-testid="button-back-dashboard"
      >
        <Home className="h-4 w-4" />
      </Button>

      <div className="max-w-5xl mx-auto space-y-6 pt-14">
        <Card className="bg-black/30 backdrop-blur-lg border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Macro Calculator</CardTitle>
            <p className="text-white/90 text-sm mt-2">
              Understand what macros you need for <b>cut</b>, <b>maintenance</b>, or{" "}
              <b>gain</b>.
            </p>
          </CardHeader>
        </Card>

        {/* Goal & Body Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-zinc-900/80 border border-white/30 text-white">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-emerald-300" />Choose Your Goal
              </h3>
              <RadioGroup
                value={goal}
                onValueChange={(v: Goal) => setGoal(v)}
                className="mt-3 grid grid-cols-3 gap-3"
              >
                {[
                  { v: "loss", label: "Cut" },
                  { v: "maint", label: "Maintain" },
                  { v: "gain", label: "Gain" },
                ].map((g) => (
                  <Label
                    key={g.v}
                    htmlFor={g.v}
                    className={`px-3 py-2 border rounded-lg cursor-pointer text-center ${goal === g.v ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}`}
                  >
                    <RadioGroupItem id={g.v} value={g.v} className="sr-only" />
                    {g.label}
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 border border-white/30 text-white">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold flex items-center">
                <User2 className="h-5 w-5 mr-2 text-pink-300" />What's Your Body Type
              </h3>
              <BodyTypeGuide />
              <RadioGroup
                value={bodyType}
                onValueChange={(v: BodyType) => setBodyType(v)}
                className="mt-3 grid grid-cols-3 gap-3"
              >
                {[
                  { v: "ecto", label: "Ectomorph" },
                  { v: "meso", label: "Mesomorph" },
                  { v: "endo", label: "Endomorph" },
                ].map((b) => (
                  <Label
                    key={b.v}
                    htmlFor={b.v}
                    className={`px-3 py-2 border rounded-lg cursor-pointer text-center ${bodyType === b.v ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}`}
                  >
                    <RadioGroupItem id={b.v} value={b.v} className="sr-only" />
                    {b.label}
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Inputs */}
        <Card className="bg-zinc-900/80 rounded-2xl border border-white/30 text-white mt-5">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold flex items-center">
              <Ruler className="h-5 w-5 mr-2" /> Your Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-3">
                <div className="text-xs text-white font-semibold">Units</div>
                <RadioGroup value={units} onValueChange={(v: Units) => setUnits(v)} className="grid grid-cols-2 gap-2">
                  {(["imperial", "metric"] as const).map((u) => (
                    <Label
                      key={u}
                      htmlFor={`u-${u}`}
                      className={`px-3 py-2 border rounded-lg text-sm cursor-pointer text-white ${
                        units === u ? "border-white bg-white/15" : "border-white/40 hover:border-white/70"
                      }`}
                    >
                      <RadioGroupItem id={`u-${u}`} value={u} className="sr-only" />
                      {u === "imperial" ? "US / Imperial" : "Metric"}
                    </Label>
                  ))}
                </RadioGroup>

                <div className="text-xs text-white font-semibold">Sex</div>
                <RadioGroup value={sex} onValueChange={(v: Sex) => setSex(v)} className="grid grid-cols-2 gap-2">
                  {(["female", "male"] as const).map((s) => (
                    <Label
                      key={s}
                      htmlFor={`sex-${s}`}
                      className={`px-3 py-2 border rounded-lg text-sm cursor-pointer text-white ${
                        sex === s ? "border-white bg-white/15" : "border-white/40 hover:border-white/70"
                      }`}
                    >
                      <RadioGroupItem id={`sex-${s}`} value={s} className="sr-only" />
                      {s}
                    </Label>
                  ))}
                </RadioGroup>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-3">
                    <div className="text-xs text-white font-semibold">Age</div>
                    <Input
                      type="number"
                      className="bg-black/60 border-white/50 text-white placeholder-white"
                      value={age || ""}
                      onChange={(e) => setAge(e.target.value === "" ? 0 : toNum(e.target.value))}
                    />
                  </div>

                  {units === "imperial" ? (
                    <>
                      <div>
                        <div className="text-xs text-white font-semibold">Height (ft)</div>
                        <Input
                          type="number"
                          className="bg-black/60 border-white/50 text-white placeholder-white"
                          value={heightFt || ""}
                          onChange={(e) => setHeightFt(e.target.value === "" ? 0 : toNum(e.target.value))}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-white font-semibold">Height (in)</div>
                        <Input
                          type="number"
                          className="bg-black/60 border-white/50 text-white placeholder-white"
                          value={heightIn || ""}
                          onChange={(e) => setHeightIn(e.target.value === "" ? 0 : toNum(e.target.value))}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-white font-semibold">Weight (lbs)</div>
                        <Input
                          type="number"
                          className="bg-black/60 border-white/50 text-white placeholder-white"
                          value={weightLbs || ""}
                          onChange={(e) => setWeightLbs(e.target.value === "" ? 0 : toNum(e.target.value))}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2">
                        <div className="text-xs text-white font-semibold">Height (cm)</div>
                        <Input
                          type="number"
                          className="bg-black/60 border-white/50 text-white placeholder-white"
                          value={heightCm || ""}
                          onChange={(e) => setHeightCm(e.target.value === "" ? 0 : toNum(e.target.value))}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-white font-semibold">Weight (kg)</div>
                        <Input
                          type="number"
                          className="bg-black/60 border-white/50 text-white placeholder-white"
                          value={weightKg || ""}
                          onChange={(e) => setWeightKg(e.target.value === "" ? 0 : toNum(e.target.value))}
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-3">
                    <ReadOnlyNote>
                      <strong>Finish Your Macro Setup First:</strong> Changing your weight automatically recalculates your targets. Complete all settings below, then click <strong>Set Macro Targets</strong>. After that, you can sync your weight to Biometrics.
                    </ReadOnlyNote>
                  </div>
                  <div className="col-span-3 mt-3">
                    <Button
                      onClick={() => {
                        const weight = units === "imperial" ? weightLbs : weightKg;
                        if (!weight || weight <= 0) {
                          toast({ title: "Enter weight first", description: "Please enter a valid weight before syncing.", variant: "destructive" });
                          return;
                        }
                        localStorage.setItem("pending-weight-sync", JSON.stringify({ weight, units, timestamp: Date.now() }));
                        toast({ title: "✓ Weight ready to sync", description: "Go to My Biometrics to save it to your history." });
                      }}
                      className="w-full bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/30 hover:border-emerald-400"
                      data-testid="button-sync-weight"
                    >
                      <Scale className="h-4 w-4 mr-2" />
                      Sync Weight (After Setting Targets)
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-white font-semibold">Activity</div>
                <RadioGroup
                  value={activity}
                  onValueChange={(v: keyof typeof ACTIVITY_FACTORS) => setActivity(v)}
                  className="grid grid-cols-2 md:grid-cols-3 gap-2"
                >
                  {(
                    [
                      ["sedentary", "Sedentary"],
                      ["light", "Light"],
                      ["moderate", "Moderate"],
                      ["very", "Very Active"],
                      ["extra", "Extra"],
                    ] as const
                  ).map(([k, label]) => (
                    <Label
                      key={k}
                      htmlFor={`act-${k}`}
                      className={`px-3 py-2 border rounded-lg text-sm cursor-pointer text-white ${
                        activity === k ? "border-white bg-white/15" : "border-white/40 hover:border-white/70"
                      }`}
                    >
                      <RadioGroupItem id={`act-${k}`} value={k} className="sr-only" />
                      {label}
                    </Label>
                  ))}
                </RadioGroup>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <div className="text-xs text-white font-semibold">Protein (g/kg)</div>
                    <Input
                      type="number"
                      step="0.1"
                      className="bg-black/60 border-white/50 text-white placeholder-white"
                      value={proteinPerKg}
                      onChange={(e) => setProteinPerKg(parseFloat(e.target.value || "0"))}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-white font-semibold">Fat share (% kcal)</div>
                    <Input
                      type="number"
                      step="1"
                      className="bg-black/60 border-white/50 text-white placeholder-white"
                      value={Math.round(fatPct * 100)}
                      onChange={(e) => {
                        const pct = Math.max(10, Math.min(60, toNum(e.target.value)));
                        setFatPct(pct / 100);
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-white font-semibold">Sugar cap</div>
                    <RadioGroup
                      value={sugarCapMode}
                      onValueChange={(v: "AHA" | "DGA") => setSugarCapMode(v)}
                      className="grid grid-cols-2 gap-2"
                    >
                      {(["AHA", "DGA"] as const).map((k) => (
                        <Label
                          key={k}
                          htmlFor={`sc-${k}`}
                          className={`px-3 py-2 border rounded-lg text-sm cursor-pointer text-white ${
                            sugarCapMode === k ? "border-white bg-white/15" : "border-white/40 hover:border-white/70"
                          }`}
                        >
                          <RadioGroupItem id={`sc-${k}`} value={k} className="sr-only" />
                          {k}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Nutrition Profile */}
        <Card className="bg-zinc-900/80 border border-white/30 text-white">
          <CardContent className="p-5 space-y-5">
            <h3 className="text-lg font-semibold flex items-center">
              <Info className="h-5 w-5 mr-2" /> My Nutrition Profile
            </h3>

            {/* Dietary Patterns */}
            <div>
              <div className="text-xs font-semibold mb-2">
                Dietary preferences / conditions
              </div>
              <div className="flex flex-wrap gap-2">
                {DIETARY_PATTERNS.map((opt) => (
                  <Pill
                    key={opt.key}
                    active={profile.dietaryPatterns.includes(opt.key)}
                    onClick={() => toggleDietary(opt.key)}
                  >
                    {opt.label}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <div className="text-xs font-semibold mb-2">Allergies</div>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_LIST.map((opt) => (
                  <Pill
                    key={opt.key}
                    active={profile.allergies.includes(opt.key)}
                    onClick={() => toggleAllergy(opt.key)}
                  >
                    {opt.label}
                  </Pill>
                ))}
              </div>

              {/* Active allergy chips */}
              {profile.allergies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.allergies.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-white/10 border border-white/20"
                    >
                      {ALLERGY_LIST.find((x) => x.key === a)?.label || a}
                      <button
                        type="button"
                        aria-label="remove allergy"
                        className="opacity-80 hover:opacity-100"
                        onClick={() => toggleAllergy(a)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sodium preference */}
            <div>
              <div className="text-xs font-semibold mb-2">
                Sodium preference
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["normal", "low", "very_low"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() =>
                      setProfile((p) => ({ ...p, sodiumPreference: lvl }))
                    }
                    className={`px-3 py-2 rounded-lg border text-sm transition
                      ${profile.sodiumPreference === lvl ? "bg-white/15 border-white" : "border-white/40 hover:border-white/70"}
                    `}
                  >
                    {lvl === "normal"
                      ? "Normal"
                      : lvl === "low"
                        ? "Low"
                        : "Very Low"}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes (optional) */}
            <div>
              <div className="text-xs font-semibold mb-2">Notes (optional)</div>
              <Input
                value={profile.notes || ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Anything we should know when generating meals?"
                className="bg-black/60 border-white/50 text-white"
              />
              <p className="text-[11px] text-white/60 mt-2">
                This profile helps **all** AI features (Fridge Rescue, Weekly
                Board, GLP-1, Diabetic, etc.) adapt your meals.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-zinc-900/80 border border-white/30 text-white">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Scale className="h-5 w-5 mr-2 text-indigo-300" /> Your Baseline
            </h3>
            <div className="grid md:grid-cols-4 gap-3">
              <Stat label="BMR" value={results.bmr} suffix="kcal" />
              <Stat label="TDEE" value={results.tdee} suffix="kcal" />
              <Stat label="Target kcal" value={results.target} suffix="kcal" />
              <Stat
                label="Protein / Carbs / Fat"
                value={results.macros.protein.g}
                sub={`${results.macros.carbs.g}g C / ${results.macros.fat.g}g F`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Targets */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setMacroTargets({
                calories: results.target,
                protein_g: results.macros.protein.g,
                carbs_g: results.macros.carbs.g,
                fat_g: results.macros.fat.g,
              });

              // Persist nutrition profile alongside targets
              saveProfile(profile);

              toast({
                title: "Macro Targets Set!",
                description: "Your targets have been saved.",
              });
              setLocation("/my-biometrics");
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 text-lg py-3 shadow-2xl hover:shadow-red-500/50 transition-all duration-200 animate-pulse"
          >
            <Target className="h-5 w-5 mr-2" /> Set Macro Targets
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  suffix,
  sub,
}: {
  label: string;
  value: number;
  suffix?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/30 bg-black/70 p-3 text-white">
      <div className="text-[11px] uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-sm font-semibold">
        {Math.round(value)} {suffix || ""}
      </div>
      {sub && <div className="text-xs">{sub}</div>}
    </div>
  );
}