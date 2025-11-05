import { useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wine, GlassWater, Sparkles, Beer, TrendingDown, CookingPot } from "lucide-react";

interface AlcoholFeature {
  title: string;
  description: string;
  icon: any;
  route: string;
  gradient: string;
  testId: string;
}

export default function AlcoholHubLanding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Alcohol Hub | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const alcoholFeatures: AlcoholFeature[] = [
    {
      title: "Alcohol Lean and Social",
      description: "Diet-friendly drinks and wines for social occasions",
      icon: Wine,
      route: "/alcohol/lean-and-social",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-lean-social",
    },
    {
      title: "Mocktails",
      description: "Delicious alcohol-free cocktails for any occasion",
      icon: Sparkles,
      route: "/mocktails-low-cal-mixers",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-mocktails",
    },
    {
      title: "Meal Pairing",
      description: "Pair meals based on your drink selection",
      icon: CookingPot,
      route: "/meal-pairing-ai",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-meal-pairing",
    },
    {
      title: "Wine Pairing",
      description: "Discover wines and ideal pairings",
      icon: Wine,
      route: "/wine-pairing",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-wine-pairing",
    },
    {
      title: "Beer Pairing",
      description: "Match your meals with the perfect beer",
      icon: Beer,
      route: "/beer-pairing",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-beer-pairing",
    },
    {
      title: "Bourbon Pairing",
      description: "Find the perfect spirit for your vibe",
      icon: GlassWater,
      route: "/bourbon-spirits",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-bourbon-pairing",
    },
    {
      title: "Alcohol Log",
      description: "Track your intake without judgment",
      icon: Wine,
      route: "/alcohol-log",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-alcohol-log",
    },
    {
      title: "Weaning Off Tool",
      description: "Taper gently at your own pace",
      icon: TrendingDown,
      route: "/weaning-off-tool",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-weaning-off",
    },
  ];

  const handleCardClick = (route: string) => {
    setLocation(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] pb-20 flex flex-col"
    >
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setLocation("/emotion-ai")}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              data-testid="button-back-to-emotion-ai"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Wine className="h-6 w-6 text-orange-400" />
              <h1 className="text-xl font-bold text-white">Alcohol Hub</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Vertical Button Stack */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 pt-20">
        <div className="max-w-2xl w-full">
          {/* Alcohol Features - Vertical Stack */}
          <div className="flex flex-col gap-3">
            {alcoholFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.testId}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 bg-black/30 backdrop-blur-lg border border-white/10 hover:border-orange-500/50 rounded-xl shadow-md"
                  onClick={() => handleCardClick(feature.route)}
                  data-testid={feature.testId}
                >
                  <CardContent className="p-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <h3 className="text-sm font-semibold text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-xs text-white/80 ml-6">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
