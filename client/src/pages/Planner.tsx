import { useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Activity, Pill, Trophy } from "lucide-react";

interface PlannerFeature {
  title: string;
  description: string;
  icon: any;
  route: string;
  testId: string;
}

export default function Planner() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Planner | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const plannerFeatures: PlannerFeature[] = [
    {
      title: "Weekly Meal Board",
      description: "AI generated meal planning for users that want to eat healthier meals designed for them ",
      icon: Calendar,
      route: "/weekly-meal-board",
      testId: "card-weekly-meal-board",
    },
    {
      title: "Diabetic Hub",
      description: "Blood sugar monitoring and meal AI planning for diabetic users ",
      icon: Activity,
      route: "/diabetic-hub",
      testId: "card-diabetic-hub",
    },
    {
      title: "GLP-1 Hub",
      description: "Shot, location logging and specialized AI meal plans for GLP-1 users",
      icon: Pill,
      route: "/glp1-hub",
      testId: "card-glp1-hub",
    },
    {
      title: "Competition & Beachbody",
      description: "Contest prep meal planning with strategic macro timing",
      icon: Trophy,
      route: "/athlete-board",
      testId: "card-competition-beachbody",
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
      {/* Header Banner - Planner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Calendar className="h-6 w-6 text-orange-500" />
          <h1 className="text-lg font-bold text-white">Planner</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8 pt-20">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Context Summary Card */}
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl">
            <CardContent className="p-4">
              <p className="text-white/90 text-sm text-center">
                Medical-grade meal planning tailored to your health needs. Choose your protocol below.
              </p>
            </CardContent>
          </Card>

          {/* Planner Features - Vertical Stack */}
          <div className="flex flex-col gap-3">
            {plannerFeatures.map((feature) => {
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
