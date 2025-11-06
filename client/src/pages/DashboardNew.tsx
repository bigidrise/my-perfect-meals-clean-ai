import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  ShoppingCart,
  Lightbulb,
  Activity,
  User,
  TrendingUp,
  Flame,
} from "lucide-react";
import { ProfileSheet } from "@/components/ProfileSheet";

interface FeatureCard {
  title: string;
  description: string;
  icon: any;
  route: string;
  size: "large" | "small";
  testId: string;
}

// Placeholder for todayMacros - this would typically come from a query or state management
const todayMacros = {
  protein: 50,
  carbs: 150,
  fat: 70,
};

export default function DashboardNew() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Home | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Get user profile for greeting
  const { data: fullUserData } = useQuery<{ name?: string; email?: string }>({
    queryKey: ["/api/users/1"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const userName = fullUserData?.name || "there";
  const firstName = userName.split(" ")[0];

  const features: FeatureCard[] = [
    {
      title: "Macro Calculator",
      description: "Track nutrition & biometrics",
      icon: Calculator,
      route: "/macro-counter",
      size: "large",
      testId: "card-macro-calculator",
    },
    {
      title: "My Biometrics",
      description: "Track your health metrics",
      icon: Activity,
      route: "/my-biometrics",
      size: "large",
      testId: "card-biometrics",
    },
    {
      title: "Shopping List",
      description: "Organize your groceries",
      icon: ShoppingCart,
      route: "/shopping-list-v2",
      size: "small",
      testId: "card-shopping-list",
    },
    {
      title: "Get Inspiration",
      description: "Daily motivation",
      icon: Lightbulb,
      route: "/get-inspiration",
      size: "small",
      testId: "card-inspiration",
    },
  ];

  const handleCardClick = (route: string) => {
    setLocation(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] pb-24"
    >
      {/* Fixed Profile Avatar - Top Right */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
        <ProfileSheet>
          <button
            className="p-1 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            data-testid="button-profile-avatar"
          >
            <User className="h-6 w-6 text-white" />
          </button>
        </ProfileSheet>
      </div>

      {/* Header Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="px-4 py-3 flex items-center gap-3">
          <img
            src="/assets/MPMTransparentLogo.png"
            alt="My Perfect Meals Logo"
            className="h-16 w-16 object-contain"
          />
          <h1 className="text-lg font-bold text-white">My Perfect Meals</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-8">
        {/* Hero Welcome Card with Fire Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="relative overflow-hidden border border-orange-500/30 shadow-2xl">
            {/* Animated Fire Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-black animate-gradient-x">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              {/* Flame accent overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
            </div>
            
            <CardContent className="relative z-10 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {firstName}! 👋
              </h2>
              <p className="text-white/90 text-sm mb-6">
                Ready to hit your macro goals today?
              </p>

              {/* Quick Stats - Real Macro Data */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <Flame className="h-5 w-5 text-blue-500 mb-1" />
                  <div className="text-xs text-white/60">Protein</div>
                  <div className="text-lg font-bold text-white">{Math.round(todayMacros.protein)}g</div>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <TrendingUp className="h-5 w-5 text-orange-500 mb-1" />
                  <div className="text-xs text-white/60">Carbs</div>
                  <div className="text-lg font-bold text-white">{Math.round(todayMacros.carbs)}g</div>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <Activity className="h-5 w-5 text-purple-500 mb-1" />
                  <div className="text-xs text-white/60">Fat</div>
                  <div className="text-lg font-bold text-white">{Math.round(todayMacros.fat)}g</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.testId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className={feature.size === "large" ? "md:col-span-1" : "md:col-span-1"}
              >
                <Card
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 bg-black/30 backdrop-blur-lg border border-white/10 hover:border-orange-500/50 rounded-xl h-full group"
                  onClick={() => handleCardClick(feature.route)}
                  data-testid={feature.testId}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-700/20 border border-orange-500/30 group-hover:from-orange-500/30 group-hover:to-orange-700/30 transition-all">
                        <Icon className="h-6 w-6 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-white/70 text-sm mt-1">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all">
            <CardContent className="p-6 text-center">
              <h3 className="text-white font-semibold mb-2">
                Ready to plan your meals?
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Start building your perfect week with AI-powered meal planning
              </p>
              <button
                onClick={() => setLocation("/planner")}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Go to Planner
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}