
import { useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefrigeratorIcon, Utensils, Baby, Wine } from "lucide-react";

interface AIFeature {
  title: string;
  description: string;
  icon: any;
  route: string;
  gradient: string;
  testId: string;
}

export default function LifestyleHub() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Lifestyle | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const lifestyleFeatures: AIFeature[] = [
    {
      title: "Craving Creator",
      description: "AI-powered personalized meal suggestions based on your cravings",
      icon: Sparkles,
      route: "/craving-creator-landing",
      gradient: "from-purple-500/20 to-pink-500/20",
      testId: "card-craving-creator",
    },
    {
      title: "Fridge Rescue",
      description: "Transform ingredients in your kitchen into delicious meals",
      icon: RefrigeratorIcon,
      route: "/fridge-rescue",
      gradient: "from-emerald-500/20 to-teal-500/20",
      testId: "card-fridge-rescue",
    },
    {
      title: "Restaurant Guide",
      description: "Make smart choices when eating out with AI guidance",
      icon: Utensils,
      route: "/restaurant-guide",
      gradient: "from-pink-500/20 to-purple-500/20",
      testId: "card-restaurant-guide",
    },
    {
      title: "Healthy Kids Meals",
      description: "Nutritious, kid-friendly meals that children love",
      icon: Baby,
      route: "/healthy-kids-meals",
      gradient: "from-blue-500/20 to-cyan-500/20",
      testId: "card-healthy-kids-meals",
    },
    {
      title: "Alcohol Hub",
      description: "Wine pairing, smart drinks, mocktails, and mindful consumption",
      icon: Wine,
      route: "/alcohol-hub",
      gradient: "from-orange-500/20 to-red-500/20",
      testId: "card-alcohol-hub",
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
      {/* Header Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-orange-500" />
          <h1 className="text-lg font-bold text-white">Lifestyle</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8 pt-20">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Context Summary Card */}
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl">
            <CardContent className="p-4">
              <p className="text-white/90 text-sm text-center">
                Real life happens. Navigate cravings, dining out, and social drinking with AI-powered guidance.
              </p>
            </CardContent>
          </Card>

          {/* Lifestyle Features - Vertical Stack */}
          <div className="flex flex-col gap-3">
            {lifestyleFeatures.map((feature) => {
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
