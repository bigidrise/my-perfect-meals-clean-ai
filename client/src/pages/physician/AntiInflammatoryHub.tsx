import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Activity, Target, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ANTIINFLAMMATORY_PRESETS } from "@/data/antiInflammatoryPresets";

function getDeviceId(): string {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

export default function AntiInflammatoryHub() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id?.toString() || getDeviceId();
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Guardrail state
  const [omega3Min, setOmega3Min] = useState("2");
  const [fiberMin, setFiberMin] = useState("30");
  const [antioxidantServings, setAntioxidantServings] = useState("5");
  const [processedMeatMax, setProcessedMeatMax] = useState("50");
  const [sodiumMax, setSodiumMax] = useState("2000");
  const [sugarMax, setSugarMax] = useState("25");
  const [warmMealsPerDay, setWarmMealsPerDay] = useState("2");
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Connect to copilot system: show info modal on first visit if coach mode is enabled
  useEffect(() => {
    if (localStorage.getItem("coachMode") === "guided" && !localStorage.getItem("anti-inflammatory-hub-info-seen")) {
      setShowInfoModal(true);
    }
  }, []);

  useEffect(() => {
    document.title = "Anti-Inflammatory Hub | My Perfect Meals";
  }, []);

  // Handlers
  const handleSaveGuardrails = async () => {
    // Store in localStorage for now (until backend hook is created)
    const guardrails = {
      omega3MinG: parseInt(omega3Min) || 2,
      fiberMinG: parseInt(fiberMin) || 30,
      antioxidantServings: parseInt(antioxidantServings) || 5,
      processedMeatMaxG: parseInt(processedMeatMax) || 50,
      sodiumMaxMg: parseInt(sodiumMax) || 2000,
      sugarMaxG: parseInt(sugarMax) || 25,
      warmMealsPerDay: parseInt(warmMealsPerDay) || 2,
    };
    localStorage.setItem(`anti-inflammatory-guardrails-${userId}`, JSON.stringify(guardrails));
    setSelectedPreset("");
    toast({ title: "Guardrails saved successfully" });
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = ANTIINFLAMMATORY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setOmega3Min(String(preset.guardrails.omega3MinG));
    setFiberMin(String(preset.guardrails.fiberMinG));
    setAntioxidantServings(String(preset.guardrails.antioxidantServings));
    setProcessedMeatMax(String(preset.guardrails.processedMeatMaxG));
    setSodiumMax(String(preset.guardrails.sodiumMaxMg));
    setSugarMax(String(preset.guardrails.sugarMaxG));
    setWarmMealsPerDay(String(preset.guardrails.warmMealsPerDay));
    setSelectedPreset(presetId);

    toast({ 
      title: `Applied ${preset.name}`,
      description: preset.description 
    });
  };

  // Handle info modal close - mark as seen for copilot system
  const handleInfoModalClose = () => {
    setShowInfoModal(false);
    localStorage.setItem("anti-inflammatory-hub-info-seen", "true");
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
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden mb-8 mt-14">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-2xl md:text-2xl font-semibold text-white relative z-10">
                🩺 Anti-Inflammatory Nutrition Hub
              </h1>
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-lime-700 hover:bg-lime-800 transition-all duration-200 text-white font-bold flash-border relative z-10"
                aria-label="Who is this hub for?"
              >
                ?
              </button>
            </div>
            <p className="text-sm text-white/90 max-w-3xl mx-auto relative z-10">
              Specialized meal planning for autoimmune & inflammatory conditions
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
                  {ANTIINFLAMMATORY_PRESETS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPreset && (
                <p className="text-white/70 text-xs mt-2">
                  {ANTIINFLAMMATORY_PRESETS.find(p => p.id === selectedPreset)?.description}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 mb-6">
              <div>
                <label className="block text-sm text-white mb-2">Omega-3 Minimum (g/day)</label>
                <input
                  type="number"
                  value={omega3Min}
                  onChange={(e) => setOmega3Min(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Fiber Minimum (g/day)</label>
                <input
                  type="number"
                  value={fiberMin}
                  onChange={(e) => setFiberMin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Antioxidant Servings/day</label>
                <input
                  type="number"
                  value={antioxidantServings}
                  onChange={(e) => setAntioxidantServings(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Processed Meat Max (g/day)</label>
                <input
                  type="number"
                  value={processedMeatMax}
                  onChange={(e) => setProcessedMeatMax(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Sodium Maximum (mg/day)</label>
                <input
                  type="number"
                  value={sodiumMax}
                  onChange={(e) => setSodiumMax(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Sugar Maximum (g/day)</label>
                <input
                  type="number"
                  value={sugarMax}
                  onChange={(e) => setSugarMax(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Warm Meals/day (preference)</label>
                <input
                  type="number"
                  value={warmMealsPerDay}
                  onChange={(e) => setWarmMealsPerDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-orange-300"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveGuardrails}
              className="w-full px-6 py-3 rounded-xl bg-blue-500/90 backdrop-blur-sm hover:bg-blue-600/90 text-white font-medium transition-all shadow-xl border border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
              <span className="relative z-10">Save Guardrails</span>
            </button>
          </section>

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
                <h2 className="text-lg font-medium text-white">AI Anti-Inflammatory Meal Generator</h2>
                <p className="text-white/80 text-sm">Omega-3 rich meals based on your guardrails</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative z-10 mb-6">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
                <h3 className="text-white font-medium text-sm mb-3">Omega-3 Rich Options</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• Grilled salmon with leafy greens</li>
                  <li>• Sardine salad with olive oil</li>
                  <li>• Chia seed pudding with berries</li>
                </ul>
              </div>

              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
                <h3 className="text-white font-medium text-sm mb-3">Balanced Anti-Inflammatory</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• Turmeric quinoa bowl with veggies</li>
                  <li>• Lentil soup with ginger</li>
                  <li>• Warm oatmeal with walnuts</li>
                </ul>
              </div>

              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
                <h3 className="text-white font-medium text-sm mb-3">Snack Ideas</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• Mixed berries with almonds</li>
                  <li>• Green tea with lemon</li>
                  <li>• Avocado with flax crackers</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setLocation("/weekly-meal-board")}
              className="w-full px-8 py-4 rounded-xl bg-green-500/90 backdrop-blur-sm hover:bg-green-600/90 text-white font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
              <span className="relative z-10">Generate Custom Anti-Inflammatory Meal Plan →</span>
            </button>
          </section>

        </div>

        {/* Info Modal - "Who is this hub for?" */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-2xl w-full shadow-xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Who is this Anti-Inflammatory Clinical Hub for?</h3>

              <div className="space-y-4 text-white/90 text-sm">
                <p>This Anti-Inflammatory Clinical Plan is designed to support people who have been advised by their doctor or dietitian to follow an anti-inflammatory or autoimmune-friendly eating pattern.</p>
                
                <p className="font-semibold text-white">It is commonly used for conditions such as:</p>

                <div className="space-y-3 ml-2">
                  <div>
                    <p className="font-semibold text-blue-400">• Rheumatoid Arthritis (RA)</p>
                    <p className="font-semibold text-blue-400">• Raynaud's Phenomenon</p>
                  </div>

                  <div>
                    <p className="font-semibold text-blue-400">• Autoimmune disorders such as:</p>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-white/80">
                      <li>Lupus</li>
                      <li>Hashimoto's Thyroiditis</li>
                      <li>Psoriatic Arthritis</li>
                      <li>Sjögren's Syndrome</li>
                      <li>Mixed Connective Tissue Disease</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-blue-400">• Inflammatory joint & muscle conditions such as:</p>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-white/80">
                      <li>Fibromyalgia</li>
                      <li>Polymyalgia Rheumatica</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-blue-400">• Chronic inflammation-related conditions, where a clinician has recommended an anti-inflammatory pattern:</p>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-white/80">
                      <li>Chronic inflammatory pain</li>
                      <li>General autoimmune inflammation</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-blue-400">• Circulation & vascular sensitivity, including:</p>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-white/80">
                      <li>Cold-induced circulation issues (such as Raynaud's)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-blue-400">• Gut-related autoimmune conditions, when an anti-inflammatory plan is recommended and tolerated:</p>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-white/80">
                      <li>Crohn's disease</li>
                      <li>Ulcerative colitis</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-orange-400/30 mt-4">
                  <p className="text-orange-200 font-semibold">
                    ⚠️ Important: This hub is designed to support medically recommended eating patterns, not replace medical treatment. Always confirm with your healthcare provider if you are unsure which plan is right for your condition.
                  </p>
                </div>
              </div>

              <button
                onClick={handleInfoModalClose}
                className="mt-6 w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
