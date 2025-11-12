
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Activity, Target, TrendingUp, ChefHat, Home, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useSaveDiabetesProfile, useLogGlucose, useGlucoseLogs, useDiabetesProfile } from "@/hooks/useDiabetes";
import { useToast } from "@/hooks/use-toast";
import { GLUCOSE_THRESHOLDS } from "@/content/diabetesEducation";
import { DIABETIC_PRESETS } from "@/data/diabeticPresets";
import type { GlucoseContext } from "@/hooks/useDiabetes";

function getDeviceId(): string {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

export default function DiabeticHub() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id || getDeviceId();

  // Hooks
  const saveMutation = useSaveDiabetesProfile();
  const logMutation = useLogGlucose();
  const { data: glucoseLogs } = useGlucoseLogs(userId, 1);
  const { data: profile } = useDiabetesProfile(userId);

  // Guardrail state (hydrated from server)
  const [glucoseReading, setGlucoseReading] = useState("");
  const [glucoseContext, setGlucoseContext] = useState<GlucoseContext>("PRE_MEAL");
  const [fastingMin, setFastingMin] = useState("80");
  const [fastingMax, setFastingMax] = useState("120");
  const [postMealMax, setPostMealMax] = useState("140");
  const [dailyCarbLimit, setDailyCarbLimit] = useState("120");
  const [fiberMin, setFiberMin] = useState("25");
  const [giCap, setGiCap] = useState("55");
  const [mealFrequency, setMealFrequency] = useState("4");
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Auto-hydrate guardrails from server on mount
  useEffect(() => {
    if (profile?.data?.guardrails) {
      const g = profile.data.guardrails;
      if (g.fastingMin) setFastingMin(String(g.fastingMin));
      if (g.fastingMax) setFastingMax(String(g.fastingMax));
      if (g.postMealMax) setPostMealMax(String(g.postMealMax));
      if (g.carbLimit) setDailyCarbLimit(String(g.carbLimit));
      if (g.fiberMin) setFiberMin(String(g.fiberMin));
      if (g.giCap) setGiCap(String(g.giCap));
      if (g.mealFrequency) setMealFrequency(String(g.mealFrequency));
    }
  }, [profile?.data?.guardrails]);

  // Get latest reading for display
  const latestReading = glucoseLogs?.data?.[0];
  const lastValue = latestReading?.valueMgdl || 95;
  const targetMin = parseInt(fastingMin) || GLUCOSE_THRESHOLDS.PRE_MEAL_MIN;
  const targetMax = parseInt(fastingMax) || GLUCOSE_THRESHOLDS.PRE_MEAL_MAX;
  const inRange = lastValue >= targetMin && lastValue <= targetMax;

  // Handlers
  const handleSaveGuardrails = async () => {
    try {
      await saveMutation.mutateAsync({
        userId,
        type: "T2D",
        hypoHistory: false,
        guardrails: {
          fastingMin: parseInt(fastingMin) || 80,
          fastingMax: parseInt(fastingMax) || 120,
          postMealMax: parseInt(postMealMax) || 140,
          carbLimit: parseInt(dailyCarbLimit) || 120,
          fiberMin: parseInt(fiberMin) || 25,
          giCap: parseInt(giCap) || 55,
          mealFrequency: parseInt(mealFrequency) || 4,
        },
      });
      setSelectedPreset(""); // Clear preset after manual save
      toast({ title: "Guardrails saved successfully" });
    } catch (error) {
      toast({ title: "Failed to save guardrails", variant: "destructive" });
    }
  };

  const handleLogGlucose = async () => {
    if (!glucoseReading) {
      toast({ title: "Please enter a reading", variant: "destructive" });
      return;
    }

    try {
      await logMutation.mutateAsync({
        userId,
        valueMgdl: parseInt(glucoseReading),
        context: glucoseContext,
        recordedAt: new Date().toISOString(),
      });
      setGlucoseReading("");
      toast({ title: "Reading logged successfully" });
    } catch (error) {
      toast({ title: "Failed to log reading", variant: "destructive" });
    }
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = DIABETIC_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setFastingMin(String(preset.guardrails.fastingMin));
    setFastingMax(String(preset.guardrails.fastingMax));
    setPostMealMax(String(preset.guardrails.postMealMax));
    setDailyCarbLimit(String(preset.guardrails.carbLimit));
    setFiberMin(String(preset.guardrails.fiberMin));
    setGiCap(String(preset.guardrails.giCap));
    setMealFrequency(String(preset.guardrails.mealFrequency));
    setSelectedPreset(presetId);

    toast({ 
      title: `Applied ${preset.name}`,
      description: preset.description 
    });
  };

  return (
    <>
      {/* Back Button - Portal Style */}
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

      {/* Premium Feature Banner */}
      <div
        className="fixed top-4 right-4 pointer-events-auto"
        style={{ 
          zIndex: 2147483647,
          isolation: 'isolate',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <div className="bg-purple-600/90 backdrop-blur-lg border border-purple-400/50 rounded-xl px-4 py-2 text-white shadow-2xl">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="font-semibold text-sm">Premium • $19.99/mo</span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 relative">
        {/* Enhanced Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10 pointer-events-none" />

        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 relative z-10">
          
          {/* Header Section */}
          <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden mb-8 mt-14">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            <h1 className="text-2xl md:text-2xl font-semibold text-white mb-4 relative z-10">
              🩺 Diabetic Nutrition Hub
            </h1>
            <p className="text-sm text-white/90 max-w-3xl mx-auto relative z-10">
              Track blood sugar, set doctor guardrails, and build diabetic-friendly meal plans
            </p>
          </div>

          {/* Doctor / Coach Guardrail Card */}
          <section className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Doctor / Coach Guardrails</h2>
                <p className="text-white/80 text-sm">Set your clinical targets and constraints</p>
              </div>
            </div>

            <div className="mb-6 relative z-10">
              <label className="block text-sm text-white mb-2">Apply Clinical Preset</label>
              <Select value={selectedPreset} onValueChange={handleApplyPreset}>
                <SelectTrigger className="w-full bg-white/20 border-white/40 text-white [&>span]:text-white">
                  <SelectValue placeholder="Choose a preset or customize below..." />
                </SelectTrigger>
                <SelectContent>
                  {DIABETIC_PRESETS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPreset && (
                <p className="text-white/70 text-xs mt-2">
                  {DIABETIC_PRESETS.find(p => p.id === selectedPreset)?.description}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 mb-6">
              <div>
                <label className="block text-sm text-white mb-2">Fasting Range (mg/dL)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fastingMin}
                    onChange={(e) => setFastingMin(e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                  />
                  <input
                    type="number"
                    value={fastingMax}
                    onChange={(e) => setFastingMax(e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Post-Meal Max (mg/dL)</label>
                <input
                  type="number"
                  value={postMealMax}
                  onChange={(e) => setPostMealMax(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Daily Carb Limit (g)</label>
                <input
                  type="number"
                  value={dailyCarbLimit}
                  onChange={(e) => setDailyCarbLimit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Fiber Minimum (g)</label>
                <input
                  type="number"
                  value={fiberMin}
                  onChange={(e) => setFiberMin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">GI Cap (Max)</label>
                <input
                  type="number"
                  value={giCap}
                  onChange={(e) => setGiCap(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Meal Frequency (per day)</label>
                <input
                  type="number"
                  value={mealFrequency}
                  onChange={(e) => setMealFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveGuardrails}
              disabled={saveMutation.isPending}
              className="w-full px-6 py-3 rounded-xl bg-blue-500/90 backdrop-blur-sm hover:bg-blue-600/90 text-white font-medium transition-all shadow-xl border border-white/20 relative overflow-hidden disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
              <span className="relative z-10">{saveMutation.isPending ? "Saving..." : "Save Guardrails"}</span>
            </button>
          </section>

          {/* Blood Sugar Tracker */}
          <section className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Activity className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-medium text-white">
                Blood Sugar Tracker
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-2">
                    Glucose Reading (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={glucoseReading}
                    onChange={(e) => setGlucoseReading(e.target.value)}
                    placeholder="Enter reading..."
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white mb-2">
                    Context
                  </label>
                  <Select value={glucoseContext} onValueChange={(val) => setGlucoseContext(val as GlucoseContext)}>
                    <SelectTrigger className="w-full bg-white/20 border-white/40 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FASTED">Fasting</SelectItem>
                      <SelectItem value="PRE_MEAL">Pre-Meal</SelectItem>
                      <SelectItem value="POST_MEAL_1H">Post-Meal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button 
                  onClick={handleLogGlucose}
                  disabled={logMutation.isPending}
                  className="w-full px-6 py-4 rounded-xl bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 text-white font-bold transition-all shadow-xl border border-white/20 relative overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
                  <span className="relative z-10">{logMutation.isPending ? "Logging..." : "Log Reading"}</span>
                </button>
              </div>

              <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-400/30">
                <div className="text-white font-medium text-sm mb-2">Last Reading</div>
                <div className="text-2xl font-medium text-white mb-2">
                  {latestReading ? `${lastValue} mg/dL` : "No readings yet"}
                </div>
                {latestReading && (
                  <div className={`text-sm ${inRange ? "text-green-200" : "text-yellow-200"}`}>
                    {inRange ? "✅ In Target Range" : "⚠️ Outside Target"}
                  </div>
                )}
                <div className="text-white/80 text-sm mt-4">
                  Target: {targetMin}-{targetMax} mg/dL
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/10 my-8" />

          {/* 7-Day Glucose Trend */}
          <section className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-medium text-white">
                7-Day Glucose Trend
              </h2>
            </div>

            <div className="h-64 bg-yellow-500/20 backdrop-blur-sm rounded-xl border border-yellow-400/30 flex items-center justify-center relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent animate-pulse" />
              <div className="text-center text-white/80 relative z-10">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Trend Chart Coming Soon</p>
                <p className="text-sm">Visual glucose tracking over 7 days</p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/10 my-8" />

          {/* Divider */}
          <div className="border-t border-white/10 my-8" />

          {/* AI Meal Generator */}
          <section className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <ChefHat className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">AI Diabetic Meal Generator</h2>
                <p className="text-white/80 text-sm">Low-GI meals based on your guardrails</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative z-10 mb-6">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
                <h3 className="text-white font-medium text-sm mb-3">Low-Carb Options</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• Grilled salmon with vegetables</li>
                  <li>• Chicken salad with avocado</li>
                  <li>• Cauliflower rice stir-fry</li>
                </ul>
              </div>

              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
                <h3 className="text-white font-medium text-sm mb-3">Balanced Meals</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• Quinoa bowl with lean protein</li>
                  <li>• Sweet potato with black beans</li>
                  <li>• Greek yogurt with berries</li>
                </ul>
              </div>

              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
                <h3 className="text-white font-medium text-sm mb-3">Snack Ideas</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• Apple slices with almond butter</li>
                  <li>• Mixed nuts and seeds</li>
                  <li>• Celery with cream cheese</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setLocation("/diabetic-menu-builder")}
              className="w-full px-8 py-4 rounded-xl bg-green-500/90 backdrop-blur-sm hover:bg-green-600/90 text-white font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
              <span className="relative z-10">Generate Custom Diabetic Meal Plan →</span>
            </button>
          </section>

          {/* Bottom Navigation */}
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <button
              onClick={() => setLocation("/diabetes-support")}
              className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 hover:bg-black/40 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-medium text-white">Blood Sugar History</h3>
                  <p className="text-white/80 text-sm">View detailed logs and trends</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setLocation("/planner")}
              className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 hover:bg-black/40 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Utensils className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-medium text-white">Meal Planner</h3>
                  <p className="text-white/80 text-sm">Plan your diabetic-friendly week</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
