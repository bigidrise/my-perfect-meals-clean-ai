import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronDown, ChevronUp, Activity } from "lucide-react";
import { useGLP1Profile, useSaveGLP1Profile } from "@/hooks/useGLP1";
import { useToast } from "@/hooks/use-toast";
import { glp1Presets } from "@/data/glp1Presets";
import ShotTrackerPanel from "@/pages/glp1/ShotTrackerPanel";

export default function GLP1Hub() {
  const [, setLocation] = useLocation();
  const [noteOpen, setNoteOpen] = useState(false);
  const [shotTrackerOpen, setShotTrackerOpen] = useState(false);

  // Fetch and mutate state for GLP-1 profile
  const { data: profile, isLoading: profileLoading } = useGLP1Profile();
  const saveMutation = useSaveGLP1Profile();
  const { toast } = useToast();

  // Initialize form fields with profile data
  const [maxMealVolume, setMaxMealVolume] = useState<number | undefined>(undefined);
  const [proteinMin, setProteinMin] = useState<number | undefined>(undefined);
  const [fatMax, setFatMax] = useState<number | undefined>(undefined);
  const [fiberMin, setFiberMin] = useState<number | undefined>(undefined);
  const [hydrationGoal, setHydrationGoal] = useState<number | undefined>(undefined);
  const [mealsPerDay, setMealsPerDay] = useState<number | undefined>(undefined);
  const [slowDigestFoodsOnly, setSlowDigestFoodsOnly] = useState<boolean>(false);
  const [limitCarbonation, setLimitCarbonation] = useState<boolean>(false);
  const [limitAlcohol, setLimitAlcohol] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  useEffect(() => {
    document.title = "GLP-1 Hub | My Perfect Meals";
  }, []);

  // Effect to populate form fields when profile data is loaded
  useEffect(() => {
    if (profile) {
      setMaxMealVolume(profile.maxMealVolume);
      setProteinMin(profile.proteinMin);
      setFatMax(profile.fatMax);
      setFiberMin(profile.fiberMin);
      setHydrationGoal(profile.hydrationGoal);
      setMealsPerDay(profile.mealsPerDay);
      setSlowDigestFoodsOnly(profile.slowDigestFoodsOnly);
      setLimitCarbonation(profile.limitCarbonation);
      setLimitAlcohol(profile.limitAlcohol);
    }
  }, [profile]);


  

  const handlePresetSelect = (presetId: string) => {
    const preset = glp1Presets.find(p => p.id === presetId);
    if (preset) {
      setMaxMealVolume(preset.values.maxMealVolumeMl);
      setProteinMin(preset.values.proteinMinG);
      setFatMax(preset.values.fatMaxG);
      setFiberMin(preset.values.fiberMinG);
      setHydrationGoal(preset.values.hydrationMinMl);
      setMealsPerDay(preset.values.mealsPerDay);
      setSlowDigestFoodsOnly(preset.values.slowDigestOnly ?? false);
      setLimitCarbonation(preset.values.limitCarbonation ?? false);
      setLimitAlcohol(preset.values.limitAlcohol ?? false);
    }
    setSelectedPreset(presetId);
  };

  const handleSave = async () => {
    saveMutation.mutate({
      maxMealVolume,
      proteinMin,
      fatMax,
      fiberMin,
      hydrationGoal,
      mealsPerDay,
      slowDigestFoodsOnly,
      limitCarbonation,
      limitAlcohol,
    });
    toast({
      title: "GLP-1 Profile Saved",
      description: "Your guardrail settings have been updated.",
      variant: "success",
    });
  };

  return (
    <div className="min-h-screen p-4 pb-16 bg-gradient-to-br from-black/60 via-orange-600 to-black/80">
      {/* Back to Planner Hub */}
      <button
        type="button"
        onClick={() => setLocation("/planner")}
        aria-label="Back to Planner Hub"
        className="fixed top-4 left-4 z-[9999] bg-black/10 border border-white/20 text-white hover:bg-black/20 rounded-2xl px-3 py-2 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />Planner
        <span className="text-sm font-medium"></span>
      </button>

      {/* Premium Feature Banner */}
      <div className="fixed top-4 right-4 z-[9999] bg-purple-600/90 backdrop-blur-lg border border-purple-400/50 rounded-xl px-4 py-2 text-white shadow-2xl">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span className="font-semibold text-sm">Premium • $19.99/mo</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 pt-14">
        {/* Header with Black Glass Background */}
        <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-white text-center">
          <h1 className="text-2xl font-semibold mb-2">GLP-1 Hub</h1>
          <p className="text-white/90 text-sm">Track your GLP-1 medication - simple, reliable, and always with you.</p>
        </div>

        {/* Important Medical Note Dropdown */}
        <section className="bg-black/40 backdrop-blur-lg border border-purple-300/30 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => setNoteOpen(!noteOpen)}
            className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
          >
            <span className="font-medium">
              <span className="text-emerald-400">Important:</span>{" "}
              <span className="text-sm text-white">How This App Supports Your Care</span>
            </span>
            {noteOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {noteOpen && (
            <div className="px-4 pb-4">
              <p className="text-sm leading-relaxed text-white/90">
                <span className="font-semibold text-emerald-400">Important:</span> My Perfect Meals is designed to work{" "}
                <span className="font-semibold text-white">with</span> your doctor, dietitian, or healthcare provider — never
                instead of them. Use the information and tools here to stay consistent between visits, to understand your
                body, and to make small, confident choices that honor your professional guidance. Every tracker, every meal,
                and every suggestion in this app is meant to <span className="italic">support</span> your care plan, not
                replace it.
              </p>
            </div>
          )}
        </section>

        {/* Shot Tracker - Database-backed */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-4 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg text-white font-medium">GLP-1 Shot Tracker</h2>
            <Button
              onClick={() => setShotTrackerOpen(!shotTrackerOpen)}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2"
              data-testid="button-toggle-shot-tracker"
            >
              {shotTrackerOpen ? "Hide Tracker" : "Open Tracker"}
            </Button>
          </div>
          {shotTrackerOpen && (
            <div className="mt-4">
              <ShotTrackerPanel onClose={() => setShotTrackerOpen(false)} />
            </div>
          )}
          {!shotTrackerOpen && (
            <p className="text-white/80 text-sm">
              Track your medication shots with date, dosage, injection site, and notes. Click "Open Tracker" to manage your shot history.
            </p>
          )}
        </section>

        {/* Doctor / Coach Guardrails */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-5 backdrop-blur shadow-lg">
          <h2 className="text-lg text-white font-medium mb-2">Doctor / Coach Guardrails</h2>
          <p className="text-white/80 text-sm mb-4">Set clinical meal guardrails for GLP-1 patients (portion, macros, hydration).</p>

          {/* Preset Selector */}
          <div className="mb-4">
            <label className="text-white/90 text-sm block mb-1">Quick Start Preset</label>
            <Select value={selectedPreset} onValueChange={handlePresetSelect}>
              <SelectTrigger className="w-full bg-black/30 border-purple-300/30 text-white [&>span]:text-white">
                <SelectValue placeholder="Choose a preset or customize below..." />
              </SelectTrigger>
              <SelectContent>
                {glp1Presets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPreset && (
              <p className="text-white/70 text-xs mt-2">
                {glp1Presets.find(p => p.id === selectedPreset)?.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/90 text-sm block mb-1">Max Meal Volume (mL)</label>
              <input
                type="number"
                placeholder="e.g., 300"
                value={maxMealVolume}
                onChange={(e) => setMaxMealVolume(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Protein Min (g per meal)</label>
              <input
                type="number"
                placeholder="e.g., 20"
                value={proteinMin}
                onChange={(e) => setProteinMin(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Fat Max (g per meal)</label>
              <input
                type="number"
                placeholder="e.g., 15"
                value={fatMax}
                onChange={(e) => setFatMax(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Fiber Min (g per day)</label>
              <input
                type="number"
                placeholder="e.g., 25"
                value={fiberMin}
                onChange={(e) => setFiberMin(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Hydration Goal (mL per day)</label>
              <input
                type="number"
                placeholder="e.g., 2000"
                value={hydrationGoal}
                onChange={(e) => setHydrationGoal(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Meals per Day</label>
              <input
                type="number"
                placeholder="e.g., 4"
                value={mealsPerDay}
                onChange={(e) => setMealsPerDay(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white/90 text-sm">Slow-Digest Foods Only</label>
              <input
                type="checkbox"
                checked={slowDigestFoodsOnly}
                onChange={(e) => setSlowDigestFoodsOnly(e.target.checked)}
                className="h-5 w-5 rounded bg-black/30 border-purple-300/30 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white/90 text-sm">Limit Carbonation</label>
              <input
                type="checkbox"
                checked={limitCarbonation}
                onChange={(e) => setLimitCarbonation(e.target.checked)}
                className="h-5 w-5 rounded bg-black/30 border-purple-300/30 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white/90 text-sm">Limit Alcohol</label>
              <input
                type="checkbox"
                checked={limitAlcohol}
                onChange={(e) => setLimitAlcohol(e.target.checked)}
                className="h-5 w-5 rounded bg-black/30 border-purple-300/30 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full rounded-xl mt-4"
          >
            {saveMutation.isPending ? "Saving..." : "Save Guardrails"}
          </Button>
        </section>

        {/* CTA → Meals */}
        <section className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-xl">
          <h3 className="text-white font-medium text-lg mb-1">Find Meals for GLP-1 Users</h3>
          <p className="text-white/90 text-sm mb-3">Small portions • Calorie-dense • Mixed cuisines.</p>
          <Button
            onClick={() => setLocation("/glp1-meal-builder")}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full rounded-xl"
            data-testid="button-go-to-glp1-meals"
          >
            Go to GLP-1 Meal Builder
          </Button>
        </section>
      </div>
    </div>
  );
}