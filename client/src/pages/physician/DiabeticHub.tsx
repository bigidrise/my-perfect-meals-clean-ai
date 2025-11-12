
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Activity, Target, TrendingUp, ChefHat, Home, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiabeticHub() {
  const [, setLocation] = useLocation();
  
  // Static state for visual display only
  const [glucoseReading, setGlucoseReading] = useState("");
  const [fastingMin, setFastingMin] = useState("70");
  const [fastingMax, setFastingMax] = useState("100");
  const [postMealMax, setPostMealMax] = useState("140");
  const [dailyCarbLimit, setDailyCarbLimit] = useState("150");
  const [fiberMin, setFiberMin] = useState("25");
  const [giCap, setGiCap] = useState("55");
  const [mealFrequency, setMealFrequency] = useState("3");

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
          <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden mb-12 mt-14">
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
              className="w-full px-6 py-3 rounded-xl bg-blue-500/90 backdrop-blur-sm hover:bg-blue-600/90 text-white font-medium transition-all shadow-xl border border-white/20 relative overflow-hidden"
              title="Coming in next update - wiring to database in progress"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
              <span className="relative z-10">Save Guardrails</span>
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

                <button className="w-full px-6 py-4 rounded-xl bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600/90 text-white font-bold transition-all shadow-xl border border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
                  <span className="relative z-10">Log Reading</span>
                </button>
              </div>

              <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-400/30">
                <div className="text-white font-medium text-sm mb-2">Last Reading</div>
                <div className="text-2xl font-medium text-white mb-2">95 mg/dL</div>
                <div className="text-sm text-green-200">✅ In Target Range</div>
                <div className="text-white/80 text-sm mt-4">
                  Target: {fastingMin}-{fastingMax} mg/dL
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
