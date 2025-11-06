
import { useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Pill, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupplementFeature {
  title: string;
  description: string;
  icon: any;
  route: string;
  testId: string;
}

export default function SupplementHubLanding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Supplement Hub | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const supplementFeatures: SupplementFeature[] = [
    {
      title: "Supplement Hub",
      description: "Browse curated supplement partners and products",
      icon: Pill,
      route: "/supplement-hub",
      testId: "card-supplement-hub",
    },
    {
      title: "Supplement Education",
      description: "Learn about supplements with AI guidance and evidence-based information",
      icon: GraduationCap,
      route: "/supplement-education",
      testId: "card-supplement-education",
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
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-20 flex flex-col"
    >
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setLocation("/procare-cover")}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              data-testid="button-back-to-procare"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Pill className="h-6 w-6 text-orange-400" />
              <h1 className="text-xl font-bold text-white">Supplement Hub</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Hero Section */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center shadow-xl mb-6 mt-6">
            <h1 className="text-3xl font-bold text-white mb-4">
              💊 Supplement Hub
            </h1>
            <p className="text-white/90 text-md max-w-2xl mx-auto">
              Evidence-based supplement guidance and trusted partner products
            </p>
          </div>

          {/* Supplement Features - Vertical Stack */}
          <div className="flex flex-col gap-3">
            {supplementFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.testId}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 bg-black/30 backdrop-blur-lg border border-white/10 hover:border-orange-500/50 rounded-xl shadow-md"
                  onClick={() => handleCardClick(feature.route)}
                  data-testid={feature.testId}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <h3 className="text-base font-semibold text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-sm text-white/80 ml-8">
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
