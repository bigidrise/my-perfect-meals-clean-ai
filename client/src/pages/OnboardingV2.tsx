import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, Users, Utensils, Target, ArrowRight, Check } from "lucide-react";

interface OnboardingData {
  focus: string;
  allergies: string[];
  macroSource: "auto" | "preset" | "default";
  sex?: string;
  weight?: number;
  height?: number;
  activity?: string;
  preset?: string;
  starterPackId?: string;
  // Birthday
  birthday: string; // Format: "MM-DD"
}

const FOCUS_OPTIONS = [
  { id: "general", label: "General", icon: Utensils, color: "indigo" },
  { id: "diabetes", label: "Diabetes", icon: Activity, color: "red" },
  { id: "glp1", label: "GLP-1", icon: Target, color: "purple" },
  { id: "cardiac", label: "Cardiac", icon: Heart, color: "pink" },
  { id: "family", label: "Family/Kids", icon: Users, color: "emerald" },
];

const ALLERGY_OPTIONS = [
  "nuts", "shellfish", "dairy", "gluten", "eggs", "soy"
];

const STARTER_PACKS: Record<string, Array<{id: string, name: string, meals: string[]}>> = {
  general: [
    { id: "balanced", name: "Balanced Basics", meals: ["Grilled Chicken Salad", "Quinoa Bowl", "Veggie Wrap"] },
    { id: "high-protein", name: "High-Protein Simple", meals: ["Egg White Scramble", "Turkey Chili", "Grilled Salmon"] },
    { id: "quick-easy", name: "Quick & Easy", meals: ["Overnight Oats", "Chicken Wrap", "Stir-Fry"] },
  ],
  diabetes: [
    { id: "diabetic-quickstart", name: "Diabetes Quickstart", meals: ["Low-GI Oatmeal", "Turkey & Veggie Plate", "Grilled Fish"] },
    { id: "blood-sugar-friendly", name: "Blood Sugar Friendly", meals: ["Chia Pudding", "Lentil Soup", "Chicken & Greens"] },
  ],
  glp1: [
    { id: "glp1-lite", name: "GLP-1 Lite", meals: ["Protein Shake", "Light Chicken Soup", "Steamed Fish & Veggies"] },
    { id: "gentle-start", name: "Gentle Start", meals: ["Greek Yogurt", "Soft Scrambled Eggs", "Baked Cod"] },
  ],
  cardiac: [
    { id: "heart-healthy", name: "Heart Healthy", meals: ["Oatmeal with Berries", "Salmon Salad", "Baked Chicken"] },
    { id: "low-sodium", name: "Low Sodium", meals: ["Fresh Fruit Bowl", "Herb Chicken", "Steamed Veggies"] },
  ],
  family: [
    { id: "busy-parent", name: "Busy Parent", meals: ["Breakfast Burritos", "Mac & Cheese", "Taco Night"] },
    { id: "kid-friendly", name: "Kid-Friendly", meals: ["Pancakes", "Chicken Nuggets", "Spaghetti"] },
  ],
};

// 1=Name+Profile+Goal, 2=Medical, 3=Birthday, 4=Nutritional Profile
const TOTAL_STEPS = 4;

export default function OnboardingV2() {
  const [, setLocation] = useLocation();
  const [currentScreen, setCurrentScreen] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    focus: "",
    allergies: [],
    macroSource: "auto",
    // Birthday
    birthday: "",
  });

  const progress = (currentScreen / TOTAL_STEPS) * 100;

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Focus & Allergies
        return data.focus !== "";
      case 2: // Medical Conditions & Allergies
        return true; // Optional - allow proceeding even if nothing selected
      case 3: // Birthday
        return data.birthday !== ""; // Required
      case 4: // Nutritional Profile
        return true; // Optional - allow proceeding even if nothing selected
      default:
        return false;
    }
  };

  // Screen 1: Focus & Allergies
  const renderFocusAllergies = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">What's your main focus?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FOCUS_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = data.focus === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setData({ ...data, focus: option.id });
                  console.log("📊 Analytics: onboarding_focus_selected", option.id);
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `border-${option.color}-500 bg-${option.color}-500/20`
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
                data-testid={`focus-${option.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <span className="font-semibold">{option.label}</span>
                  {isSelected && <Check className="h-5 w-5 ml-auto text-green-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Any allergies? (Optional)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALLERGY_OPTIONS.map((allergy) => {
            const isChecked = data.allergies.includes(allergy);
            return (
              <label
                key={allergy}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  isChecked
                    ? "border-red-500 bg-red-500/20"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    setData({
                      ...data,
                      allergies: checked
                        ? [...data.allergies, allergy]
                        : data.allergies.filter((a) => a !== allergy),
                    });
                  }}
                />
                <span className="capitalize text-sm">{allergy}</span>
              </label>
            );
          })}
        </div>
      </div>

      <Button
        onClick={() => {
          setCurrentScreen(2);
          // Persist to API
          saveFocusData();
        }}
        disabled={!isStepValid(currentScreen)}
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500"
        data-testid="button-continue-screen-1"
      >
        Continue <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  // Screen 2: Targets
  const renderTargets = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">How should we set your macro targets?</h2>

        <RadioGroup
          value={data.macroSource}
          onValueChange={(value) => setData({ ...data, macroSource: value as any })}
        >
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-white/20 bg-white/5 cursor-pointer hover:border-white/40">
              <RadioGroupItem value="auto" id="auto" />
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">Set automatically (Recommended)</div>
                <p className="text-sm text-neutral-400">We'll calculate based on your profile</p>

                {data.macroSource === "auto" && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-indigo-500">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-neutral-400">Sex</Label>
                        <select
                          value={data.sex || ""}
                          onChange={(e) => setData({ ...data, sex: e.target.value })}
                          className="w-full mt-1 px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs text-neutral-400">Weight (lbs)</Label>
                        <Input
                          type="number"
                          value={data.weight || ""}
                          onChange={(e) => setData({ ...data, weight: Number(e.target.value) })}
                          placeholder="150"
                          className="mt-1 bg-black/40 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-neutral-400">Height (inches)</Label>
                        <Input
                          type="number"
                          value={data.height || ""}
                          onChange={(e) => setData({ ...data, height: Number(e.target.value) })}
                          placeholder="68"
                          className="mt-1 bg-black/40 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-neutral-400">Activity</Label>
                        <select
                          value={data.activity || ""}
                          onChange={(e) => setData({ ...data, activity: e.target.value })}
                          className="w-full mt-1 px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white"
                        >
                          <option value="">Select</option>
                          <option value="sedentary">Sedentary</option>
                          <option value="light">Light</option>
                          <option value="moderate">Moderate</option>
                          <option value="active">Active</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-white/20 bg-white/5 cursor-pointer hover:border-white/40">
              <RadioGroupItem value="preset" id="preset" />
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">Use a preset</div>
                <p className="text-sm text-neutral-400">Choose a common goal</p>

                {data.macroSource === "preset" && (
                  <div className="mt-4 space-y-2 pl-4 border-l-2 border-indigo-500">
                    {["Weight Loss", "Maintain", "Muscle Gain"].map((preset) => (
                      <label
                        key={preset}
                        className="flex items-center gap-2 p-2 rounded-lg bg-black/40 cursor-pointer hover:bg-black/60"
                      >
                        <input
                          type="radio"
                          name="preset"
                          value={preset}
                          checked={data.preset === preset}
                          onChange={(e) => setData({ ...data, preset: e.target.value })}
                          className="text-indigo-600"
                        />
                        <span className="text-sm">{preset}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-white/20 bg-white/5 cursor-pointer hover:border-white/40">
              <RadioGroupItem value="default" id="default" />
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">Use defaults / set later</div>
                <p className="text-sm text-neutral-400">Skip for now, customize anytime in Settings</p>
              </div>
            </label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setCurrentScreen(1)}
          variant="outline"
          className="flex-1 h-12 border-white/30 bg-white/5 hover:bg-white/10 text-white"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            setCurrentScreen(3);
            console.log("📊 Analytics: onboarding_targets_set", data.macroSource);
            saveTargetsData();
          }}
          className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500"
          data-testid="button-continue-screen-2"
        >
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Screen 3: Birthday
  const renderBirthday = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">When's your birthday?</h2>
        <p className="text-neutral-400 mb-6">We'll send you a special message!</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-white">Month</Label>
            <select
              value={data.birthday.split("-")[0] || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  birthday: `${e.target.value}-${data.birthday.split("-")[1] || "DD"}`,
                })
              }
              className="w-full mt-1 px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white"
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month.toString().padStart(2, "0")}>
                  {new Date(2000, month - 1, 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-white">Day</Label>
            <select
              value={data.birthday.split("-")[1] || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  birthday: `${data.birthday.split("-")[0] || "MM"}-${e.target.value}`,
                })
              }
              className="w-full mt-1 px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white"
            >
              <option value="">Select Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day.toString().padStart(2, "0")}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setCurrentScreen(2)}
          variant="outline"
          className="flex-1 h-12 border-white/30 bg-white/5 hover:bg-white/10 text-white"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            setCurrentScreen(4);
            console.log("📊 Analytics: onboarding_birthday_set", data.birthday);
            saveBirthdayData();
          }}
          disabled={!isStepValid(currentScreen)}
          className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500"
          data-testid="button-continue-screen-3"
        >
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Screen 4: Starter Pack
  const renderStarterPack = () => {
    const packs = STARTER_PACKS[data.focus] || STARTER_PACKS.general;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Choose your starter pack</h2>
          <p className="text-neutral-400 mb-6">We'll show you meals from this collection first</p>

          <div className="space-y-4">
            {packs.map((pack) => (
              <button
                key={pack.id}
                onClick={() => {
                  setData({ ...data, starterPackId: pack.id });
                  console.log("📊 Analytics: onboarding_starter_pack_selected", pack.id);
                  setCurrentScreen(5); // Changed to 5 to account for birthday step
                  saveStarterPackData();
                }}
                className="w-full p-5 rounded-xl border-2 border-white/20 bg-white/5 hover:border-indigo-500 hover:bg-indigo-500/10 text-left transition-all"
                data-testid={`pack-${pack.id}`}
              >
                <h3 className="font-bold text-lg mb-2 text-white">{pack.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {pack.meals.map((meal, i) => (
                    <span key={i} className="px-2 py-1 bg-black/40 rounded text-xs text-neutral-300">
                      {meal}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-indigo-400">
                  <span className="text-sm font-semibold">Use this pack</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setCurrentScreen(3)} // Changed to 3 to go back to birthday
          variant="outline"
          className="w-full h-12 border-white/30 bg-white/5 hover:bg-white/10 text-white"
        >
          Back
        </Button>
      </div>
    );
  };

  // Screen 5: First Win
  const renderFirstWin = () => (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
        <Check className="h-10 w-10 text-white" />
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-3 text-white">You're all set!</h2>
        <p className="text-xl text-neutral-300 mb-6">
          Tap <span className="font-bold text-indigo-400">Add to Macros</span> on any meal. That's it.
        </p>
      </div>

      <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-xl p-6">
        <p className="text-sm text-neutral-300">
          We've personalized your meal recommendations based on your {data.focus} focus
          {data.allergies.length > 0 && `, excluding ${data.allergies.join(", ")}`}.
          You can change these anytime in Settings.
        </p>
      </div>

      <Button
        onClick={() => {
          // Set completion flags
          localStorage.setItem("onboardingCompleted", "true");
          localStorage.setItem("completedProfile", "true");
          localStorage.setItem("completedIntro", "true");
          localStorage.setItem("isAuthenticated", "true");
          console.log("📊 Analytics: onboarding_completed", { focus: data.focus, starterPackId: data.starterPackId });

          // Route to fast-food with starter pack filter
          setLocation(`/fast-food?pack=${data.starterPackId || "quickstart"}`);
        }}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
        data-testid="button-take-me-to-meals"
      >
        Take me to meals <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentScreen) {
      case 1:
        return renderFocusAllergies();
      case 2:
        return renderTargets();
      case 3:
        return renderBirthday();
      case 4: // Changed from 3 to 4 for starter pack
        return renderStarterPack();
      case 5: // Changed from 4 to 5 for first win
        return renderFirstWin();
      default:
        return <div>Error: Unknown step</div>;
    }
  };

  // API save functions (stubs for now - implement based on existing backend)
  const saveFocusData = async () => {
    try {
      // PUT /api/onboarding/step/focus with { data: { focus, allergies } }
      console.log("💾 Saving focus data:", { focus: data.focus, allergies: data.allergies });
    } catch (error) {
      console.error("Failed to save focus data:", error);
    }
  };

  const saveTargetsData = async () => {
    try {
      // PUT /api/onboarding/step/targets
      console.log("💾 Saving targets data:", data);
    } catch (error) {
      console.error("Failed to save targets data:", error);
    }
  };

  const saveBirthdayData = async () => {
    try {
      // PUT /api/onboarding/step/birthday
      console.log("💾 Saving birthday data:", { birthday: data.birthday });
    } catch (error) {
      console.error("Failed to save birthday data:", error);
    }
  };

  const saveStarterPackData = async () => {
    try {
      // PUT /api/onboarding/step/starterPack
      console.log("💾 Saving starter pack data:", { starterPackId: data.starterPackId });
    } catch (error) {
      console.error("Failed to save starter pack data:", error);
    }
  };

  const handleSubmit = async () => {
    // This function will be called when the user completes the final step
    try {
      // Assuming a final API call to submit all onboarding data
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focus: data.focus,
          allergies: data.allergies,
          macroSource: data.macroSource,
          sex: data.sex,
          weight: data.weight,
          height: data.height,
          activity: data.activity,
          preset: data.preset,
          starterPackId: data.starterPackId,
          birthday: data.birthday,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      // Set completion flags
      localStorage.setItem("onboardingCompleted", "true");
      localStorage.setItem("completedProfile", "true");
      localStorage.setItem("completedIntro", "true");
      localStorage.setItem("isAuthenticated", "true");
      console.log("📊 Analytics: onboarding_completed", { focus: data.focus, starterPackId: data.starterPackId, birthday: data.birthday });

      // Route to fast-food with starter pack filter
      setLocation(`/fast-food?pack=${data.starterPackId || "quickstart"}`);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-400">Step {currentScreen} of {TOTAL_STEPS}</span>
            <span className="text-sm text-neutral-400">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main card */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Setup</CardTitle>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation buttons - only shown on screens that are not the final screen */}
        {currentScreen < TOTAL_STEPS + 1 && ( // Adjust condition to show on all screens except the very last one
          <div className="mt-8 flex gap-3">
            {currentScreen > 1 && (
              <Button
                onClick={() => setCurrentScreen(currentScreen - 1)}
                variant="outline"
                className="flex-1 h-12 border-white/30 bg-white/5 hover:bg-white/10 text-white"
              >
                Back
              </Button>
            )}
            {currentScreen === TOTAL_STEPS ? ( // If it's the last step before completion
              <Button
                onClick={handleSubmit} // Call handleSubmit for final submission
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500"
                data-testid="button-complete-onboarding"
              >
                Finish Setup <Check className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (isStepValid(currentScreen)) {
                    setCurrentScreen(currentScreen + 1);
                  }
                }}
                disabled={!isStepValid(currentScreen)}
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500"
                data-testid={`button-continue-screen-${currentScreen}`}
              >
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}