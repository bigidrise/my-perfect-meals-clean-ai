import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft, ChevronUp } from "lucide-react";

type BeerRec = {
  name: string;
  style: string;
  abv?: number;
  ibu?: number;
  brewery?: string;
  region?: string;
  glassware?: string;
  servingTemp?: string;
  calories?: number;
  pairingReason?: string;
  notes?: string[];
  alternatives?: Array<{ name: string; style?: string }>;
};

type BeerResponse = {
  ok: boolean;
  recommendations: BeerRec[];
  debug?: any;
};

const mealTypes = [
  "Burger",
  "BBQ",
  "Pizza",
  "Steak",
  "Fried Chicken",
  "Seafood",
  "Tacos",
  "Curry",
  "Salad",
  "Dessert",
];

const cuisines = [
  "American",
  "Mexican",
  "Italian",
  "Indian",
  "Japanese",
  "Thai",
  "German",
  "BBQ",
  "Mediterranean",
];

const priceRanges = ["$", "$$", "$$$"] as const;

export default function BeerPairingMode() {
  const [, setLocation] = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [mealType, setMealType] = useState<string>("Burger");
  const [cuisine, setCuisine] = useState<string>("American");
  const [mainIngredient, setMainIngredient] = useState<string>("Beef");
  const [occasion, setOccasion] = useState<string>("Casual dinner");
  const [price, setPrice] = useState<(typeof priceRanges)[number]>("$$");
  const [flavorBias, setFlavorBias] = useState<"balanced" | "hoppy" | "malty" | "sour">("balanced");
  const [calorieConscious, setCalorieConscious] = useState<boolean>(false);
  const [abvMin, setAbvMin] = useState<number>(4.0);
  const [abvMax, setAbvMax] = useState<number>(8.0);

  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<BeerRec[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reusable classes to FIX invisible text in selects
  const triggerCls =
    "bg-black/40 border border-white/20 text-white data-[placeholder]:text-white/60";
  const contentCls =
    "bg-black/90 border border-white/20 text-white shadow-xl z-[60]";
  const itemCls =
    "text-white data-[highlighted]:bg-white/10 data-[highlighted]:text-white data-[state=checked]:bg-white/10";

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const canSubmit = useMemo(() => abvMin <= abvMax, [abvMin, abvMax]);

  async function fetchBeerRecs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations/alcohol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "beer",
          mealType,
          cuisine,
          mainIngredient,
          occasion,
          priceRange: price,
          preferences: {
            flavorBias,
            calorieConscious,
          },
          abvRange: { min: abvMin, max: abvMax },
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data: BeerResponse = await res.json();

      if (!data?.recommendations?.length) {
        setRecs([
          {
            name: "American Pale Ale",
            style: "Pale Ale",
            abv: 5.5,
            ibu: 35,
            brewery: "Local Craft",
            glassware: "Pint / Nonic",
            servingTemp: "45–50°F",
            pairingReason:
              "Crisp hop bitterness cuts through fat and salt; citrusy hops complement char and spice.",
            notes: ["Citrus", "Pine", "Light malt"],
            alternatives: [
              { name: "Helles", style: "Lager" },
              { name: "Amber Ale" },
            ],
          },
        ]);
      } else {
        setRecs(data.recommendations);
      }
    } catch (e: any) {
      setError("Could not fetch beer pairings right now.");
      setRecs(null);
    } finally {
      setLoading(false);
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 50);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setLocation("/alcohol-hub")}
          className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-orange-900/40 backdrop-blur-none border border-orange-400/60 hover:bg-orange-800/50 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="bg-black/50 backdrop-blur-lg border border-orange-400/70 rounded-2xl p-8 text-center mb-8 mt-14 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
          <div className="flex items-center justify-center gap-3 mb-3" aria-hidden="true">
            <span className="text-2xl">🍺</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">Beer Pairing Mode</h1>
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-lime-700 hover:bg-lime-800 transition-all duration-200 text-white font-bold flash-border"
              aria-label="How to use Beer Pairing"
            >
              ?
            </button>
          </div>
          <p className="text-sm text-white/90">
            Find the best beer styles and specific picks to match your meal, taste, and ABV preferences.
          </p>
        </div>

        <Card className="bg-black/50 border border-orange-400/70 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg text-white">Tell us about the meal</CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger className={`${triggerCls} mt-1`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={contentCls}>
                    {mealTypes.map((m) => (
                      <SelectItem key={m} value={m} className={itemCls}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cuisine</Label>
                <Select value={cuisine} onValueChange={setCuisine}>
                  <SelectTrigger className={`${triggerCls} mt-1`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={contentCls}>
                    {cuisines.map((c) => (
                      <SelectItem key={c} value={c} className={itemCls}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Main Ingredient</Label>
                <Input
                  value={mainIngredient}
                  onChange={(e) => setMainIngredient(e.target.value)}
                  placeholder="e.g., Beef, Chicken, Salmon, Mushrooms"
                  className="bg-black/40 border border-white/20 text-white mt-1"
                />
              </div>

              <div>
                <Label>Occasion</Label>
                <Input
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g., Casual dinner, Game night, Date night"
                  className="bg-black/40 border border-white/20 text-white mt-1"
                />
              </div>

              <div>
                <Label>Price</Label>
                <Select value={price} onValueChange={(v) => setPrice(v as any)}>
                  <SelectTrigger className={`${triggerCls} mt-1`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={contentCls}>
                    {priceRanges.map((p) => (
                      <SelectItem key={p} value={p} className={itemCls}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Flavor Bias</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(["balanced", "hoppy", "malty", "sour"] as const).map((k) => (
                    <Button
                      key={k}
                      size="sm"
                      onClick={() => setFlavorBias(k)}
                      variant={flavorBias === k ? "default" : "outline"}
                      className={
                        flavorBias === k
                          ? "bg-black/90 backdrop-blur-lg border border-white/30 text-white"
                          : "bg-black/30 border-white/20 text-white hover:bg-black/40"
                      }
                    >
                      {k}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <Label>ABV Range ({abvMin}% – {abvMax}%)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={15}
                      value={abvMin}
                      onChange={(e) => setAbvMin(Number(e.target.value))}
                      className="bg-black/40 border border-white/20 text-white"
                    />
                    <span className="text-white/70 text-sm">min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={20}
                      value={abvMax}
                      onChange={(e) => setAbvMax(Number(e.target.value))}
                      className="bg-black/40 border border-white/20 text-white"
                    />
                    <span className="text-white/70 text-sm">max</span>
                  </div>
                </div>
                {abvMin > abvMax && (
                  <div className="text-amber-300 text-xs mt-1">
                    Min ABV cannot exceed max ABV.
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={calorieConscious}
                    onChange={(e) => setCalorieConscious(e.target.checked)}
                  />
                  <span className="text-white/90">Prefer lower calorie styles</span>
                </label>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={fetchBeerRecs}
                disabled={loading || !canSubmit}
                className="bg-black/90 backdrop-blur-lg border border-white/30 text-white hover:bg-black/95"
              >
                {loading ? "Finding pairings…" : "Get Beer Pairings"}
              </Button>
            </div>

            {error && <div className="mt-3 text-red-300 text-sm">{error}</div>}
          </CardContent>
        </Card>

        {recs && (
          <div className="mt-6 space-y-4">
            {recs.map((b, i) => (
              <Card
                key={`${b.name}-${i}`}
                className="bg-black/50 border border-orange-400/70 shadow-[0_0_20px_rgba(249,115,22,0.12)]"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-baseline justify-between gap-2">
                    <span>{b.name}</span>
                    <span className="text-sm text-white/70">{b.style}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/90">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      {b.brewery && (
                        <div>
                          <span className="text-white/60">Brewery:</span> {b.brewery}
                        </div>
                      )}
                      {b.region && (
                        <div>
                          <span className="text-white/60">Region:</span> {b.region}
                        </div>
                      )}
                      {(b.abv != null || b.ibu != null) && (
                        <div>
                          <span className="text-white/60">ABV / IBU:</span>{" "}
                          {b.abv != null ? `${b.abv}%` : "—"} / {b.ibu ?? "—"}
                        </div>
                      )}
                      {b.calories != null && (
                        <div>
                          <span className="text-white/60">Calories (12oz):</span>{" "}
                          {b.calories}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {b.glassware && (
                        <div>
                          <span className="text-white/60">Glassware:</span> {b.glassware}
                        </div>
                      )}
                      {b.servingTemp && (
                        <div>
                          <span className="text-white/60">Serving temp:</span>{" "}
                          {b.servingTemp}
                        </div>
                      )}
                    </div>
                  </div>

                  {b.pairingReason && (
                    <div className="mt-3 text-white/90">
                      <span className="font-semibold">Why it works:</span>{" "}
                      {b.pairingReason}
                    </div>
                  )}

                  {b.notes?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b.notes.map((n, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {b.alternatives?.length ? (
                    <div className="mt-3">
                      <div className="text-white/80 text-sm mb-1">Alternatives</div>
                      <div className="flex flex-wrap gap-2">
                        {b.alternatives.map((alt, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs bg-black/40 border border-white/20"
                          >
                            {alt.name}
                            {alt.style ? ` — ${alt.style}` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">How to Use Beer Pairing</h3>
              
              <div className="space-y-4 text-white/90 text-sm">
                <p>Find the perfect beer styles and specific recommendations to match your meal, taste preferences, and ABV range.</p>
                <div>
                  <h4 className="font-semibold text-lime-400 mb-2">How It Works:</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Tell us about your meal (type, cuisine, main ingredient)</li>
                    <li>Set your occasion and price range</li>
                    <li>Choose your flavor bias (balanced, hoppy, malty, or sour)</li>
                    <li>Set your preferred ABV range using the sliders</li>
                    <li>Click "Get Beer Pairings" for expert recommendations</li>
                  </ol>
                </div>
                <p className="text-sm text-lime-300">💡 Tip: Check the "calorie conscious" option for lower-calorie beer styles!</p>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="mt-6 w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {showBackToTop && (
          <div className="flex justify-center mt-10">
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="!rounded-full bg-black/30 backdrop-blur-lg border border-black/50 hover:bg-black/40 text-white px-6 py-3"
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
