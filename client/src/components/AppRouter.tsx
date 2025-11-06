import GameHub from "@/pages/GameHub";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import IngredientsTetris from "@/pages/IngredientsTetris";
import { useLocation, Switch, Route } from "wouter";
import DisclaimerModal from "./DisclaimerModal";
import EmotionalGate from "./EmotionalGate";
import { justFinished } from "@/lib/completion";
// Removed weeklyPlanApi import as meal calendar functionality was removed

// ✅ Import your TrackWater page
import TrackWater from "@/pages/track-water";

// ✅ Import WeeklyMealBoard
import WeeklyMealBoard from "@/pages/WeeklyMealBoard";

// Import FastFoodHub and FastFoodRestaurant
import FastFoodHub from "@/pages/FastFoodHub";
import FastFoodRestaurant from "@/pages/FastFoodRestaurant";
import DiabeticHub from "@/pages/DiabeticHub";
import DiabeticMenuBuilder from "@/pages/DiabeticMenuBuilder";
import DiabeticMenuBoard from "@/pages/DiabeticMenuBoard";
import DiabetesSupport from "@/pages/DiabetesSupport";
import MedicalDietHub from "@/pages/MedicalDietHub";
import SmartMenuBuilder from "@/pages/SmartMenuBuilder";
import GLP1Hub from "@/pages/GLP1Hub";

interface AppRouterProps {
  children: React.ReactNode;
}

export default function AppRouter({ children }: AppRouterProps) {
  const [location, setLocation] = useLocation();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showEmotionalGate, setShowEmotionalGate] = useState(false);

  // Weekly plan generation removed as meal calendar functionality was disabled

  useEffect(() => {
    // AUTO-BYPASS: Skip all authentication gates to allow guest access
    console.log("🚀 Auto-bypass enabled - allowing guest access to all routes");
    
    // Auto-complete onboarding and disclaimer for guest users
    if (!localStorage.getItem("onboardingCompleted")) {
      localStorage.setItem("onboardingCompleted", "true");
    }
    if (!localStorage.getItem("disclaimerAccepted")) {
      localStorage.setItem("disclaimerAccepted", "true");
    }
    if (!localStorage.getItem("isAuthenticated")) {
      localStorage.setItem("isAuthenticated", "true");
    }
    
    setShowDisclaimer(false);
    setShowEmotionalGate(false);

    // If at root, redirect to dashboard
    if (location === "/") {
      console.log("🔄 Redirecting to dashboard");
      setLocation("/dashboard");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 100);
    }
  }, [location, setLocation]);

  const handleDisclaimerAccept = () => {
    console.log("✅ Disclaimer accepted");
    localStorage.setItem("disclaimerAccepted", "true");
    setShowDisclaimer(false);
    setLocation("/onboarding");
  };

  const handleEmotionalGateComplete = () => {
    console.log("✅ Emotional gate completed");
    setShowEmotionalGate(false);
    setLocation("/onboarding");
  };

  // Show disclaimer modal
  if (showDisclaimer) {
    return (
      <>
        <DisclaimerModal onAccept={handleDisclaimerAccept} />
      </>
    );
  }

  // Show emotional gate
  if (showEmotionalGate) {
    return (
      <>
        <EmotionalGate />
      </>
    );
  }

  // Show normal app
  return (
    <>
      {children}
    </>
  );
}