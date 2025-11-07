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

import WelcomeGate from "./WelcomeGate";
import { TourProvider } from "@/contexts/TourContext";

interface AppRouterProps {
  children: React.ReactNode;
}

export default function AppRouter({ children }: AppRouterProps) {
  const [location, setLocation] = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [coachMode, setCoachMode] = useState(() => localStorage.getItem("coachMode"));

  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showEmotionalGate, setShowEmotionalGate] = useState(false);

  // Weekly plan generation removed as meal calendar functionality was disabled

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const hasSeenWelcome = localStorage.getItem("mpm.hasSeenWelcome") === "true";

    // If at root, determine where to send them
    if (location === "/") {
      if (!isAuthenticated) {
        // Not signed in → go to Welcome page (sign up/sign in)
        console.log("🔄 Not authenticated - redirecting to /welcome");
        setLocation("/welcome");
        return;
      }
      
      if (!coachMode) {
        // Signed in but hasn't chosen coach mode yet → show WelcomeGate
        console.log("🔄 Showing WelcomeGate for mode selection");
        setShowGate(true);
        return;
      }
      
      // Signed in and has chosen mode → go to dashboard
      console.log("🔄 Redirecting to dashboard");
      setLocation("/dashboard");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 100);
    }

    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated && location !== "/welcome" && location !== "/auth") {
      console.log("🔄 Not authenticated - redirecting to /welcome");
      setLocation("/welcome");
    }
  }, [location, setLocation, coachMode]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const completedProfile = localStorage.getItem("completedProfile") === "true";
    const completedIntro = localStorage.getItem("completedIntro") === "true";

    console.log("🔄 AppRouter checking flow state:", {
      location,
      isAuthenticated,
      completedProfile,
      completedIntro,
      coachMode,
    });

    // Check if we need to show the welcome gate
    if (!coachMode && location === "/" && isAuthenticated && completedProfile && completedIntro) {
      setShowGate(true);
    }

    // Allow time for localStorage to be read
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location, setLocation, coachMode]);

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

  if (!isReady) {
    return null;
  }

  if (showGate) {
    return (
      <WelcomeGate
        onComplete={() => {
          setShowGate(false);
          setCoachMode(localStorage.getItem("coachMode"));
          setLocation("/dashboard");
        }}
      />
    );
  }

  // Show normal app
  return (
    <TourProvider>
      {children}
    </TourProvider>
  );
}