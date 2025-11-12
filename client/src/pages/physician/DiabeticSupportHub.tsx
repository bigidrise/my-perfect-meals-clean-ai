// ⚠️ DEPRECATED: Replaced by DiabeticHub.tsx
// This file is kept for rollback reference only
// Last active: 2025-01-22

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function DiabeticSupportHub_DEPRECATED() {
  const [, setLocation] = useLocation();
  const [prefs, setPrefs] = useState<{ carbId: string; preference: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch current glycemic preferences on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api("/api/glycemic-settings") as Response;
        const json = await res.json();
        setPrefs(json.items ?? []);
      } catch (error) {
        console.error("Failed to load glycemic preferences:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* Back to Planner Hub */}
      <div
        className="fixed top-4 left-4 pointer-events-auto"
        style={{ zIndex: 2147483647, isolation: "isolate", transform: "translateZ(0)", willChange: "transform" }}
      >
        <Button
          onClick={() => setLocation("/planner")}
          className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-none border border-white/30 hover:bg-black/40 transition-all duration-200 font-medium rounded-xl shadow-2xl"
        >
          <ArrowLeft className="h-4 w-4 text-white" />
            Planner
        </Button>
      </div>

      {/* Premium Feature Banner */}
      <div
        className="fixed top-4 right-4 pointer-events-auto"
        style={{ zIndex: 2147483647, isolation: "isolate", transform: "translateZ(0)", willChange: "transform" }}
      >
        <div className="bg-purple-600/90 backdrop-blur-lg border border-purple-400/50 rounded-xl px-4 py-2 text-white shadow-2xl">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="font-semibold text-sm">Premium • $19.99/mo</span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8 text-center mt-14">
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              ⚠️ This page has been replaced
            </h1>
            <p className="text-sm text-white/90 max-w-3xl mx-auto mb-6">
              This is a deprecated backup file. Please use the new Diabetic Hub instead.
            </p>
            <Button
              onClick={() => setLocation("/diabetic-hub")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-xl"
            >
              Go to Diabetic Hub →
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}