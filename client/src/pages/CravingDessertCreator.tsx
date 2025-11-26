// 🔒 DESSERT CREATOR FINAL LOCKDOWN (MIRRORS CRAVING CREATOR LAYOUT)
// Identical UI system: safe-area header, black-glass cards, progress ticker,
// uniform typography, matching structure + output sequence.

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlassButton } from "@/components/glass";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowLeft, Users, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";
import PhaseGate from "@/components/PhaseGate";

const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

export default function DessertCreator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [dessert, setDessert] = useState("");
  const [dessertType, setDessertType] = useState("");
  const [flavor, setFlavor] = useState("");
  const [dietary, setDietary] = useState("");
  const [servings, setServings] = useState(8);
  const [generatedDessert, setGeneratedDessert] = useState<any | null>(null);

  const [progress, setProgress] = useState(0);
  const tickerRef = useRef<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Safe-area + onboarding
  useEffect(() => {
    document.title = "Dessert Creator | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Progress ticker (identical to Craving Creator)
  const startProgressTicker = () => {
    if (tickerRef.current) return;
    setProgress(0);
    tickerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p < 90) {
          const next = p + Math.max(1, Math.floor((90 - p) * 0.07));
          return Math.min(next, 90);
        }
        return p;
      });
    }, 150);
  };

  const stopProgressTicker = () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    setProgress(100);
  };

  // Generate dessert using your backend
  async function handleGenerateDessert() {
    if (!dessert.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe what dessert you're craving.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    startProgressTicker();

    try {
      const res = await fetch("/api/meals/dessert-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dessert,
          dessertType,
          flavor,
          dietary,
          servings,
          userId: DEV_USER_ID,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        console.error("🍨 Dessert Creator API Error:", res.status, errorBody);
        throw new Error(errorBody?.error || "Generation failed");
      }

      const data = await res.json();
      const meal = data.meal || data;

      stopProgressTicker();
      setGeneratedDessert(meal);

      toast({
        title: "✨ Dessert Created!",
        description: `${meal.name} is ready for you.`,
      });
    } catch {
      stopProgressTicker();
      toast({
        title: "Generation Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function getNutrition(meal: any) {
    const n = meal?.nutrition || {};
    return {
      calories: Number(n.calories ?? meal.calories ?? 0),
      protein: Number(n.protein ?? meal.protein ?? 0),
      carbs: Number(n.carbs ?? meal.carbs ?? 0),
      fat: Number(n.fat ?? meal.fat ?? 0),
    };
  }


  return (
    <PhaseGate phase="PHASE_1_CORE" feature="dessert-creator">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-safe-nav"
      >
        {/* Header - identical to Craving Creator */}
        <div
          className="fixed left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10"
          style={{ top: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="px-8 py-3 flex items-center gap-3">
            <button
              onClick={() => setLocation("/craving-creator-landing")}
              className="flex items-center gap-2 text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-lg"
              data-testid="dessertcreator-back"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <h1 className="text-lg font-bold text-white">Dessert Creator</h1>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="max-w-2xl mx-auto px-4 pb-32"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 6rem)" }}
        >
          {/* Form Card */}
          <Card className="shadow-2xl bg-black/30 backdrop-blur-lg border border-white/20 w-full max-w-xl mx-auto mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-white">
                <Sparkles className="h-4 w-4 text-white" />
                Describe Your Dessert
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Dessert Input */}
              <div>
                <label className="block text-xs font-medium text-white mb-1">
                  What dessert are you craving?
                </label>
                <textarea
                  value={dessert}
                  onChange={(e) => setDessert(e.target.value)}
                  className="w-full px-3 py-2 bg-black text-white placeholder:text-white/50 border border-white/30 rounded-lg h-20 resize-none text-sm"
                  placeholder="Example: warm apple pie, fudge brownies, lemon cheesecake…"
                  maxLength={200}
                />
                <p className="text-xs text-white/70 text-right mt-1">
                  {dessert.length}/200
                </p>
              </div>

              {/* Dessert Type Dropdown */}
              <div>
                <label className="block text-xs font-medium mb-1 text-white">
                  What type of dessert?
                </label>
                <Select value={dessertType} onValueChange={(v) => setDessertType(v)}>
                  <SelectTrigger className="w-full text-sm bg-black text-white border-white/30">
                    <SelectValue placeholder="Select dessert type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pie">Pie</SelectItem>
                    <SelectItem value="cake">Cake</SelectItem>
                    <SelectItem value="cookie">Cookie</SelectItem>
                    <SelectItem value="brownie">Brownie</SelectItem>
                    <SelectItem value="cheesecake">Cheesecake</SelectItem>
                    <SelectItem value="smoothie">Smoothie</SelectItem>
                    <SelectItem value="frozen">Frozen Dessert</SelectItem>
                    <SelectItem value="pudding">Pudding / Custard</SelectItem>
                    <SelectItem value="nobake">No-Bake Dessert</SelectItem>
                    <SelectItem value="bars">Bars</SelectItem>
                    <SelectItem value="muffin">Muffins</SelectItem>
                    <SelectItem value="cupcake">Cupcakes</SelectItem>
                    <SelectItem value="pastry">Pastry</SelectItem>
                    <SelectItem value="surprise">Surprise Me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Flavor Input */}
              <div>
                <label className="block text-xs font-medium mb-1 text-white">
                  Flavor / Texture Vibe
                </label>
                <input
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  placeholder="rich & gooey, light & fluffy, fruity & tangy…"
                  className="w-full bg-black text-white border-white/30 px-3 py-2 rounded-lg text-sm"
                />
              </div>

              {/* Servings Dropdown */}
              <div>
                <label className="block text-xs font-medium mb-1 text-white">
                  Servings
                </label>
                <Select value={String(servings)} onValueChange={(v) => setServings(Number(v))}>
                  <SelectTrigger className="w-full text-sm bg-black text-white border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem value={String(i + 1)} key={i}>
                        {i + 1} {i + 1 === 1 ? "serving" : "servings"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="block text-xs font-medium mb-1 text-white">
                  Dietary Requirements (optional)
                </label>
                <input
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="gluten-free, low sugar, dairy-free, diabetic friendly…"
                  className="w-full bg-black text-white border-white/30 px-3 py-2 rounded-lg text-sm"
                />
              </div>

              {/* Generate Button */}
              {isGenerating ? (
                <div className="max-w-md mx-auto mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">AI Analysis Progress</span>
                    <span className="text-sm text-white/80">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-black/30 border border-white/20" />
                </div>
              ) : (
                <GlassButton
                  onClick={handleGenerateDessert}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  icon={<Sparkles className="h-4 w-4" />}
                >
                  Create My Dessert
                </GlassButton>
              )}
            </CardContent>
          </Card>

          {/* OUTPUT CARD — identical structure to Craving Creator */}
          {generatedDessert && (
            <div className="space-y-6">
              <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl">
                <CardContent className="p-6">
                  {/* Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-white">{generatedDessert.name}</h3>
                  </div>

                  <p className="text-white/90 mb-4">{generatedDessert.description}</p>

                  {/* Image */}
                  {generatedDessert.imageUrl && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img
                        src={generatedDessert.imageUrl}
                        alt={generatedDessert.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Serving Size */}
                  <div className="mb-4 p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Users className="h-4 w-4 text-white" />
                      <span className="font-medium">Serving Size:</span>{" "}
                      {generatedDessert.servingSize || `${servings} servings`}
                    </div>
                  </div>

                  {/* Macro Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-4 text-center">
                    {["calories", "protein", "carbs", "fat"].map((key, i) => (
                      <div
                        key={i}
                        className="bg-black/40 backdrop-blur-md border border-white/20 p-3 rounded-md"
                      >
                        <div className="text-lg font-bold text-white">
                          {getNutrition(generatedDessert)[key]}
                          {key !== "calories" && "g"}
                        </div>
                        <div className="text-xs text-white capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Ingredients */}
                  {generatedDessert.ingredients?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-white">Ingredients:</h4>
                      <ul className="text-sm text-white/80 space-y-1">
                        {generatedDessert.ingredients.map((ing: any, i: number) => (
                          <li key={i}>{ing.displayText || `${ing.amount || ""} ${ing.unit || ""} ${ing.name || ing.item}`}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Instructions */}
                  {generatedDessert.instructions && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-white">Instructions:</h4>
                      <div className="text-sm text-white/80 whitespace-pre-line max-h-40 overflow-y-auto">
                        {generatedDessert.instructions}
                      </div>
                    </div>
                  )}

                  {/* Why This Works */}
                  {generatedDessert.reasoning && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-white">
                        <Brain className="h-4 w-4" />
                        Why This Works For You:
                      </h4>
                      <p className="text-sm text-white/80">{generatedDessert.reasoning}</p>
                    </div>
                  )}



                  {/* Add Macros */}
                  <GlassButton
                    onClick={() => {
                      setLocation("/biometrics?from=dessert-creator&view=macros");
                    }}
                    className="w-full bg-black hover:bg-black/80 text-white"
                  >
                    Add Your Macros
                  </GlassButton>
                </CardContent>
              </Card>

              {/* Shopping Bar */}
              <ShoppingAggregateBar
                ingredients={generatedDessert.ingredients.map((ing: any) => ({
                  name: ing.name,
                  qty: ing.amount,
                  unit: ing.unit,
                }))}
                source="Dessert Creator"
                hideCopyButton={true}
              />
            </div>
          )}
        </div>
      </motion.div>
    </PhaseGate>
  );
}