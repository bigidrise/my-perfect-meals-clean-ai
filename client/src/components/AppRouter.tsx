import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import WelcomeGate from "./WelcomeGate";
import { TourProvider } from "@/contexts/TourContext";
import DiabeticHub from "@/pages/physician/DiabeticHub";
import DiabeticMenuBuilder from "@/pages/physician/DiabeticMenuBuilder";
import DiabetesSupportPage from "@/pages/physician/DiabetesSupportPage";
import PatientAssignmentDashboard from "@/pages/physician/PatientAssignmentDashboard";
import { Route } from "wouter";

interface AppRouterProps {
  children: React.ReactNode;
}

export default function AppRouter({ children }: AppRouterProps) {
  const [location, setLocation] = useLocation();
  const [showWelcomeGate, setShowWelcomeGate] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const hasChosenCoachMode = localStorage.getItem("coachMode") !== null;

    console.log("🔄 AppRouter flow check:", { location, isAuthenticated, hasChosenCoachMode });

    // Handle root path "/"
    if (location === "/") {
      if (!isAuthenticated) {
        // Not signed in → redirect to Welcome page (sign in/create account)
        console.log("🔄 Not authenticated - redirecting to /welcome");
        setLocation("/welcome");
        return;
      }

      if (!hasChosenCoachMode) {
        // Authenticated but hasn't chosen coach mode → show WelcomeGate
        console.log("✨ Showing WelcomeGate for coach mode selection");
        setShowWelcomeGate(true);
        return;
      }

      // Authenticated and has chosen coach mode → go to dashboard
      console.log("🏠 Redirecting to dashboard");
      setLocation("/dashboard");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 100);
      return;
    }

    // Protect all routes except public pages
    const publicRoutes = ["/welcome", "/auth", "/forgot-password", "/reset-password"];
    if (!isAuthenticated && !publicRoutes.includes(location)) {
      console.log("🔒 Protected route - redirecting to /welcome");
      setLocation("/welcome");
    }
  }, [location, setLocation]);

  // Show WelcomeGate modal
  if (showWelcomeGate) {
    return (
      <WelcomeGate
        onComplete={() => {
          console.log("✅ WelcomeGate completed");
          setShowWelcomeGate(false);
          setLocation("/dashboard");
        }}
      />
    );
  }

  // Show normal app wrapped in TourProvider
  return (
    <TourProvider>
      {children}
    </TourProvider>
  );
}