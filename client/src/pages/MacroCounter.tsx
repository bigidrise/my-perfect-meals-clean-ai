
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Calculator, Send } from "lucide-react";
import MacroCalculatorGuidedTour from "@/components/guided/MacroCalculatorGuidedTour";

type Goal = "cut" | "maintain" | "bulk";
type BodyType = "ecto" | "meso" | "endo";
type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extreme";

interface MacroResults {
  protein: number;
  proteinPct: number;
  carbs: number;
  starchyCarbs: number | string;
  fibrousCarbs: string;
  carbsPct: number;
  fats: number;
  fatsPct: number;
  calories: number;
}

export default function MacroCounter() {
  const [, setLocation] = useLocation();
  const [goal, setGoal] = useState<Goal | "">("");
  const [bodyType, setBodyType] = useState<BodyType | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activity, setActivity] = useState<ActivityLevel | "">("");
  const [results, setResults] = useState<MacroResults | null>(null);
  const [detailsComplete, setDetailsComplete] = useState(false);

  const trigger = (step: "goal" | "body" | "details" | "targets") => {
    window.dispatchEvent(new CustomEvent("macro:next", { detail: { step } }));
  };

  // Helper: determine starchy carb grams based on gender and goal
  const getStarchyCarbs = (gender: Gender, goal: Goal): number | string => {
    if (gender === "female") {
      switch (goal) {
        case "cut": return 25;
        case "maintain": return 50;
        case "bulk": return "75-100";
      }
    } else if (gender === "male") {
      switch (goal) {
        case "cut": return 50;
        case "maintain": return "75-100";
        case "bulk": return "100-150";
      }
    }
    return 0;
  };

  // Simple macro calculation
  const handleCalculate = () => {
    if (!gender || !goal || !weight || !age || !activity) return;

    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age);
    const heightInches = parseInt(heightFt || "0") * 12 + parseInt(heightIn || "0");

    // Basic BMR calculation (Mifflin-St Jeor)
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * (weightNum * 0.453592) + 6.25 * (heightInches * 2.54) - 5 * ageNum + 5;
    } else {
      bmr = 10 * (weightNum * 0.453592) + 6.25 * (heightInches * 2.54) - 5 * ageNum - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extreme: 1.9
    };

    let tdee = bmr * activityMultipliers[activity as ActivityLevel];

    // Adjust for goal
    let calories = tdee;
    if (goal === "cut") calories = tdee * 0.8;
    if (goal === "bulk") calories = tdee * 1.15;

    // Calculate macros
    const protein = Math.round(weightNum * 1.0); // 1g per lb bodyweight
    const proteinCals = protein * 4;
    
    const fatsPct = 0.25;
    const fats = Math.round((calories * fatsPct) / 9);
    const fatsCals = fats * 9;

    const carbsCals = calories - proteinCals - fatsCals;
    const carbs = Math.round(carbsCals / 4);

    const starchyCarbs = getStarchyCarbs(gender as Gender, goal as Goal);
    const fibrousCarbs = typeof starchyCarbs === "number" 
      ? `${carbs - starchyCarbs} g` 
      : "rest of total";

    const resultsData: MacroResults = {
      protein,
      proteinPct: 30,
      carbs,
      starchyCarbs,
      fibrousCarbs,
      carbsPct: 45,
      fats,
      fatsPct: 25,
      calories: Math.round(calories)
    };

    setResults(resultsData);
    setDetailsComplete(true);
    
    // Trigger guided tour to show results card
    setTimeout(() => trigger("details"), 300);
  };

  const handleSendToBiometrics = () => {
    if (!results) return;

    // Save to localStorage for biometrics page
    localStorage.setItem("macroTargets", JSON.stringify({
      protein: results.protein,
      carbs: results.carbs,
      fats: results.fats,
      calories: results.calories,
      starchyCarbs: results.starchyCarbs,
      goal,
      gender
    }));

    trigger("targets");
    setTimeout(() => setLocation("/my-biometrics"), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-20">
      <MacroCalculatorGuidedTour />

      <Button
        onClick={() => setLocation("/dashboard")}
        className="fixed top-4 left-4 z-50 bg-black/30 hover:bg-black/50 text-white rounded-2xl border border-white/10"
        size="sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto px-4 pt-20 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Macro Calculator</h1>
          <p className="text-white/80">Find your personalized daily macro targets</p>
        </div>

        {/* Goal Card */}
        <Card id="goal-card" className="bg-black/40 backdrop-blur-lg border border-white/10">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-orange-500" />
              Choose Your Goal
            </h3>
            <RadioGroup value={goal} onValueChange={(v) => { setGoal(v as Goal); trigger("goal"); }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                  <RadioGroupItem value="cut" id="cut" />
                  <Label htmlFor="cut" className="text-white cursor-pointer flex-1">Cut (Lose Fat)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                  <RadioGroupItem value="maintain" id="maintain" />
                  <Label htmlFor="maintain" className="text-white cursor-pointer flex-1">Maintain</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                  <RadioGroupItem value="bulk" id="bulk" />
                  <Label htmlFor="bulk" className="text-white cursor-pointer flex-1">Bulk (Build Muscle)</Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Body Type Card */}
        <Card id="bodytype-card" className="bg-black/40 backdrop-blur-lg border border-white/10">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4">What's Your Body Type?</h3>
            <RadioGroup value={bodyType} onValueChange={(v) => { setBodyType(v as BodyType); trigger("body"); }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                  <RadioGroupItem value="ecto" id="ecto" />
                  <Label htmlFor="ecto" className="text-white cursor-pointer flex-1">Ectomorph (Lean, fast metabolism)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                  <RadioGroupItem value="meso" id="meso" />
                  <Label htmlFor="meso" className="text-white cursor-pointer flex-1">Mesomorph (Athletic, muscular)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                  <RadioGroupItem value="endo" id="endo" />
                  <Label htmlFor="endo" className="text-white cursor-pointer flex-1">Endomorph (Stocky, gains easily)</Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card id="details-card" className="bg-black/40 backdrop-blur-lg border border-white/10">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4">Your Details</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Gender</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Age</Label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="30"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Weight (lbs)</Label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="160"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Height (ft)</Label>
                  <Input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="5"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Height (in)</Label>
                  <Input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="7"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Activity Level</Label>
                <Select value={activity} onValueChange={(v) => setActivity(v as ActivityLevel)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="very">Very Active (6-7 days/week)</SelectItem>
                    <SelectItem value="extreme">Extremely Active (athlete)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCalculate}
                disabled={!gender || !goal || !weight || !age || !activity}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Macros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        {results && (
          <Card id="results-card" className="bg-black/40 backdrop-blur-lg border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-4 text-xl">Your Daily Totals</h3>
              <div className="space-y-3 text-white">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="font-semibold text-lg">Protein: {results.protein} g</div>
                  <div className="text-white/70 text-sm">({results.proteinPct}% of calories)</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="font-semibold text-lg">Carbs: {results.carbs} g</div>
                  <div className="text-white/70 text-sm">({results.carbsPct}% of calories)</div>
                  <div className="ml-4 mt-2 space-y-1 text-sm">
                    <div className="text-orange-400">• Starchy: {results.starchyCarbs} g</div>
                    <div className="text-lime-400">• Fibrous: {results.fibrousCarbs}</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="font-semibold text-lg">Fats: {results.fats} g</div>
                  <div className="text-white/70 text-sm">({results.fatsPct}% of calories)</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
                  <div className="font-semibold text-xl text-orange-300">Total Calories: {results.calories}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Send to Biometrics Button */}
        {detailsComplete && results && (
          <div className="flex justify-center pb-8">
            <Button
              id="macro-targets-btn"
              onClick={handleSendToBiometrics}
              className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-8 py-6 text-lg"
            >
              <Send className="h-5 w-5 mr-2" />
              Send to Biometrics
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
