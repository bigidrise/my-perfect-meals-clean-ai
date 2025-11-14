import { useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Sparkles, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CravingFeature {
  title: string;
  description: string;
  icon: any;
  route: string;
  gradient: string;
  testId: string;
}

export default function CravingCreatorLanding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Craving Creator Hub | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const cravingFeatures: CravingFeature[] = [
    {
      title: "Create Your Own",
      description: "Use the original AI Craving Creator you already know",
      icon: Brain,
      route: "/craving-creator",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-create-your-own",
    },
    {
      title: "Healthy Premade Cravings",
      description: "20 smarter recipes that satisfy the feeling you're chasing — with servings 1–10",
      icon: Sparkles,
      route: "/craving-presets",
      gradient: "from-orange-500/20 to-orange-600/20",
      testId: "card-premade-cravings",
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
              onClick={() => setLocation("/lifestyle")}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              data-testid="button-back-to-lifestyle"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-orange-400" />
              <h1 className="text-xl font-bold text-white">Craving Creator Hub</h1>
            </div>
            <button
              onClick={() => {/* Info modal trigger - implement if needed */}}
              className="bg-lime-700 hover:bg-lime-800 border-2 border-lime-600 text-white rounded-xl w-6 h-6 flex items-center justify-center text-sm font-bold flash-border"
              aria-label="How to use"
            >
              ?
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Hero Image Section */}
          <div className="relative h-40 rounded-xl overflow-hidden">
            <img 
              src="/images/cravings/satisfy-cravings.jpg" 
              alt="Satisfy your cravings"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23a855f7;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23ec4899;stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='160' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='white' font-size='20' font-family='sans-serif' dy='.3em'%3ESatisfy Smartly%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white/90 text-sm">
                Satisfy your cravings without derailing your goals — smarter choices that hit the spot.
              </p>
            </div>
          </div>
          {/* Craving Features - Vertical Stack */}
          <div className="flex flex-col gap-3">
            {cravingFeatures.map((feature) => {
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