import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { ArrowLeft, Wine, Sparkles, ChefHat, Home, ChevronUp } from "lucide-react";
import { saveScrollPosition, saveNavigationHistory } from "@/utils/scrollUtils";

interface WineRecommendation {
  wineName: string;
  wineType: string;
  varietal: string;
  region: string;
  vintageRange: string;
  priceRange: string;
  flavorProfile: string;
  pairingReason: string;
  servingTemp: string;
  glassType: string;
  alternatives: string[];
}

interface WinePairingResult {
  id: string;
  userId: string;
  mealType: string;
  cuisine?: string;
  mainIngredient?: string;
  occasion?: string;
  priceRange?: string;
  preferences?: string;
  recommendations: WineRecommendation[];
  createdAt: string;
}

export default function WinePairingPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WinePairingResult | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Form state
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [mainIngredient, setMainIngredient] = useState("");
  const [occasion, setOccasion] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [preferences, setPreferences] = useState("");

  // Reusable classes to FIX invisible text in selects
  const triggerCls =
    "bg-black/40 border border-white/20 text-white data-[placeholder]:text-white/60";
  const contentCls =
    "bg-black/90 border border-white/20 text-white shadow-xl z-[60]";
  const itemCls =
    "text-white data-[highlighted]:bg-white/10 data-[highlighted]:text-white data-[state=checked]:bg-white/10";

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Wine Pairing | My Perfect Meals";
    saveNavigationHistory("/wine-pairing", "/alcohol-hub");

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealType) return;

    try {
      setLoading(true);
      const response = await fetch("/api/ai/wine-pairing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "test-user-1", // Using test user
          mealType,
          cuisine: cuisine || undefined,
          mainIngredient: mainIngredient || undefined,
          occasion: occasion || undefined,
          priceRange: priceRange || undefined,
          preferences: preferences || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Failed to get wine pairing recommendations");
      }
    } catch (error) {
      console.error("Wine pairing error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWineTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'red':
        return 'text-red-600 bg-red-50';
      case 'white':
        return 'text-yellow-600 bg-yellow-50';
      case 'rosé':
      case 'rose':
        return 'text-pink-600 bg-pink-50';
      case 'sparkling':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-purple-600 bg-purple-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            saveScrollPosition("winePairingScroll");
            saveNavigationHistory("/alcohol-hub", "/wine-pairing");
            setLocation("/alcohol-hub");
          }}
          className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-purple-900/40 backdrop-blur-none border border-purple-400/60 hover:bg-purple-800/50 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base transition-all"
        >
          <ArrowLeft className="h-4 w-4" />

        </Button>

        {/* Glass Title Card */}
        <div className="bg-black/20 backdrop-blur-lg border border-purple-400/70 shadow-[0_0_30px_rgba(168,85,247,0.15)] rounded-2xl p-8 text-center mb-12 mt-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-white">
              🍷 Wine Pairing AI
            </h1>
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-lime-700 hover:bg-lime-800 transition-all duration-200 text-white font-bold flash-border"
              aria-label="How to use Wine Pairing"
            >
              ?
            </button>
          </div>
          <p className="text-sm text-white/80 max-w-2xl mx-auto">
            Get expert sommelier recommendations for the perfect wine pairing with your meals.
          </p>
        </div>

        {/* Pairing Form */}
        <Card className="mb-8 bg-black/50 backdrop-blur-lg border border-purple-400/70 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <ChefHat className="h-5 w-5" />
              Find Your Perfect Pairing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mealType">Meal Type *</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger className={triggerCls}>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent className={contentCls}>
                      <SelectItem value="Appetizer" className={itemCls}>Appetizer</SelectItem>
                      <SelectItem value="Main Course" className={itemCls}>Main Course</SelectItem>
                      <SelectItem value="Dessert" className={itemCls}>Dessert</SelectItem>
                      <SelectItem value="Light Meal" className={itemCls}>Light Meal</SelectItem>
                      <SelectItem value="Cheese Course" className={itemCls}>Cheese Course</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine Style</Label>
                  <Input
                    id="cuisine"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="e.g., Italian, French, Asian"
                    className="bg-black/40 border border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mainIngredient">Main Ingredient</Label>
                  <Input
                    id="mainIngredient"
                    value={mainIngredient}
                    onChange={(e) => setMainIngredient(e.target.value)}
                    placeholder="e.g., salmon, beef, chicken"
                    className="bg-black/40 border border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <Label htmlFor="occasion">Occasion</Label>
                  <Select value={occasion} onValueChange={setOccasion}>
                    <SelectTrigger className={triggerCls}>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent className={contentCls}>
                      <SelectItem value="Casual Dinner" className={itemCls}>Casual Dinner</SelectItem>
                      <SelectItem value="Romantic Date" className={itemCls}>Romantic Date</SelectItem>
                      <SelectItem value="Business Meal" className={itemCls}>Business Meal</SelectItem>
                      <SelectItem value="Celebration" className={itemCls}>Celebration</SelectItem>
                      <SelectItem value="Family Gathering" className={itemCls}>Family Gathering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="priceRange">Price Range</Label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className={triggerCls}>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent className={contentCls}>
                    <SelectItem value="Under $20" className={itemCls}>Under $20</SelectItem>
                    <SelectItem value="$20-40" className={itemCls}>$20-40</SelectItem>
                    <SelectItem value="$40-80" className={itemCls}>$40-80</SelectItem>
                    <SelectItem value="$80-150" className={itemCls}>$80-150</SelectItem>
                    <SelectItem value="Above $150" className={itemCls}>Above $150</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferences">Additional Preferences</Label>
                <Textarea
                  id="preferences"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Any specific preferences, allergies, or requirements..."
                  rows={3}
                  className="bg-black/40 border border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading || !mealType} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  <>
                    <Wine className="h-4 w-4 mr-2" />
                    Get Wine Pairing
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Your Wine Pairing Recommendations
            </h2>

            {result.recommendations.map((wine, index) => (
              <Card key={index} className="overflow-hidden bg-black/50 backdrop-blur-lg border border-purple-400/70 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <CardHeader className={`${getWineTypeColor(wine.wineType)} border-b`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{wine.wineName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Wine className="h-5 w-5" />
                      <span className="font-medium">{wine.wineType}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{wine.varietal} • {wine.region}</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Pairing Details</h4>
                        <p className="text-white/90 text-sm">{wine.pairingReason}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Flavor Profile</h4>
                        <p className="text-white/90 text-sm">{wine.flavorProfile}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-white">Vintage</p>
                          <p className="text-white/80">{wine.vintageRange}</p>
                        </div>
                        <div>
                          <p className="font-medium text-white">Price Range</p>
                          <p className="text-white/80">{wine.priceRange}</p>
                        </div>
                        <div>
                          <p className="font-medium text-white">Serving Temp</p>
                          <p className="text-white/80">{wine.servingTemp}</p>
                        </div>
                        <div>
                          <p className="font-medium text-white">Glass Type</p>
                          <p className="text-white/80">{wine.glassType}</p>
                        </div>
                      </div>

                      {wine.alternatives && wine.alternatives.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-white mb-2">Alternatives</h4>
                          <div className="flex flex-wrap gap-2">
                            {wine.alternatives.map((alt, altIndex) => (
                              <span
                                key={altIndex}
                                className="px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                              >
                                {alt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInfoModal(false)}>
          <Card className="max-w-lg w-full bg-black/90 border border-purple-400/70 shadow-[0_0_30px_rgba(168,85,247,0.3)]" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">How to Use Wine Pairing</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowInfoModal(false)} className="text-white hover:text-purple-400">✕</Button>
              </div>
              <div className="space-y-4 text-white/90">
                <p>Get expert sommelier recommendations for the perfect wine to complement your meal.</p>
                <div>
                  <h3 className="font-semibold text-purple-400 mb-2">How It Works:</h3>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Select your meal type (appetizer, main course, dessert, etc.)</li>
                    <li>Optionally add cuisine style and main ingredient</li>
                    <li>Choose your occasion and price range</li>
                    <li>Click "Get Wine Pairing" for personalized recommendations</li>
                    <li>View detailed wine info including serving temperature and alternatives</li>
                  </ol>
                </div>
                <p className="text-sm text-purple-300">💡 Tip: Include your preferences in the additional notes for more tailored suggestions!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={scrollToTop}
            className="!rounded-full bg-black/30 backdrop-blur-lg border border-black/50 hover:bg-black/40 text-white px-6 py-3"
          >
            <ChevronUp className="h-4 w-4 mr-2" />
            Back to Top
          </Button>
        </div>
      )}
    </div>
  );
}