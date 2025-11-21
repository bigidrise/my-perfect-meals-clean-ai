import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Minus, Calendar, TrendingDown, Heart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WeaningPlan {
  baseline: {
    drinksPerDay: number;
    daysPerWeek: number;
  };
  pace: "gentle" | "standard" | "custom";
  customPercent?: number;
  weeklyTargets: { week: number; maxDrinks: number }[];
  startDate: string;
}

interface CheckIn {
  week: number;
  date: string;
  status: "met" | "over" | "skip";
}

const WeaningOffTool = () => {
  const [, setLocation] = useLocation();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [step, setStep] = useState<"setup" | "plan" | "tracking">("setup");
  const [drinksPerDay, setDrinksPerDay] = useState(3);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [pace, setPace] = useState<"gentle" | "standard" | "custom">("standard");
  const [customPercent, setCustomPercent] = useState(15);
  const [plan, setPlan] = useState<WeaningPlan | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Load from localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem("weaningPlan");
    const savedCheckIns = localStorage.getItem("weaningCheckIns");

    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      setPlan(parsedPlan);

      // Calculate current week based on start date
      const startDate = new Date(parsedPlan.startDate);
      const today = new Date();
      const weeksDiff = Math.floor((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
      setCurrentWeek(Math.min(weeksDiff, parsedPlan.weeklyTargets.length));

      setStep("tracking");
    }

    if (savedCheckIns) {
      setCheckIns(JSON.parse(savedCheckIns));
    }

    // Auto-open instructions on first visit in coach mode
    const coachMode = localStorage.getItem("coachMode");
    const hasSeenWeaningInfo = localStorage.getItem("hasSeenWeaningInfo");

    if (coachMode === "guided" && !hasSeenWeaningInfo) {
      setTimeout(() => {
        setShowInfoModal(true);
      }, 300);
    }
  }, []);

  const handleInfoModalClose = () => {
    setShowInfoModal(false);
    localStorage.setItem("hasSeenWeaningInfo", "true");
  };

  const generatePlan = () => {
    const weeklyAverage = drinksPerDay * daysPerWeek;
    let reductionRate = 0.2; // 20% standard

    if (pace === "gentle") reductionRate = 0.1; // 10%
    if (pace === "custom") reductionRate = Math.min(0.25, Math.max(0.05, customPercent / 100)); // 5-25% capped

    const weeklyTargets: { week: number; maxDrinks: number }[] = [];
    let currentTarget = drinksPerDay;
    let week = 1;

    while (currentTarget > 0.5) {
      weeklyTargets.push({
        week,
        maxDrinks: Math.round(currentTarget * 10) / 10 // Round to 1 decimal
      });
      currentTarget = currentTarget * (1 - reductionRate);
      week++;
    }

    // Final week: 0
    weeklyTargets.push({ week: weeklyTargets.length + 1, maxDrinks: 0 });

    const newPlan: WeaningPlan = {
      baseline: { drinksPerDay, daysPerWeek },
      pace,
      customPercent: pace === "custom" ? customPercent : undefined,
      weeklyTargets,
      startDate: new Date().toISOString()
    };

    setPlan(newPlan);
    setCurrentWeek(1);
    localStorage.setItem("weaningPlan", JSON.stringify(newPlan));
    setStep("tracking");
  };

  const recordCheckIn = (status: "met" | "over" | "skip") => {
    const newCheckIn: CheckIn = {
      week: currentWeek,
      date: new Date().toISOString(),
      status
    };

    const updatedCheckIns = [...checkIns, newCheckIn];
    setCheckIns(updatedCheckIns);
    localStorage.setItem("weaningCheckIns", JSON.stringify(updatedCheckIns));

    // Move to next week if met or skip
    if (status === "met" || status === "skip") {
      if (plan && currentWeek < plan.weeklyTargets.length) {
        setCurrentWeek(currentWeek + 1);
      }
    }
  };

  const resetPlan = () => {
    localStorage.removeItem("weaningPlan");
    localStorage.removeItem("weaningCheckIns");
    setPlan(null);
    setCheckIns([]);
    setCurrentWeek(1);
    setStep("setup");
  };

  const pauseWeek = () => {
    // Stay on current week
    const newCheckIn: CheckIn = {
      week: currentWeek,
      date: new Date().toISOString(),
      status: "skip"
    };
    const updatedCheckIns = [...checkIns, newCheckIn];
    setCheckIns(updatedCheckIns);
    localStorage.setItem("weaningCheckIns", JSON.stringify(updatedCheckIns));
  };

  const getProgress = () => {
    if (!plan) return 0;
    return Math.round((currentWeek / plan.weeklyTargets.length) * 100);
  };

  const weeklyAverage = drinksPerDay * daysPerWeek;
  const showMedicalWarning = drinksPerDay > 5 || weeklyAverage > 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-safe-nav">
      {/* Universal Safe-Area Header */}
      <div
        className="fixed left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10"
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="px-8 py-3 flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => {
              if (step === "tracking") {
                setStep("setup");
              } else {
                setLocation("/alcohol-hub");
              }
            }}
            className="flex items-center gap-2 text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-lg"
            data-testid="button-back-to-hub"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-bold text-white">Weaning Off Tool</h1>

          {/* Info Button */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="ml-auto flex items-center justify-center w-8 h-8 rounded-xl bg-lime-700 hover:bg-lime-800 transition-all duration-200 text-white text-xl font-bold flash-border"
            aria-label="How to use Weaning Off Tool"
          >
            ?
          </button>
        </div>
      </div>

      <div
        className="max-w-4xl mx-auto px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 6rem)" }}
      >

        {/* Setup Step */}
        {step === "setup" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-[1px] bg-gradient-to-r from-black/60 via-teal-500 to-black/80 transition">
              <Card className="bg-black/30 backdrop-blur-lg border-transparent shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Step 1: Your Baseline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-white">
                  {/* Drinks Per Day */}
                  <div className="space-y-3">
                    <Label className="text-sm text-white">Average drinks per drinking day</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDrinksPerDay(Math.max(1, drinksPerDay - 1))}
                        className="bg-black/20 border-white/20 text-white hover:bg-black/30"
                        data-testid="button-decrease-drinks"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={drinksPerDay}
                        onChange={(e) => setDrinksPerDay(Math.max(1, parseInt(e.target.value) || 1))}
                        className="bg-black/20 border-white/20 text-white text-center text-xl font-bold w-24"
                        data-testid="input-drinks-per-day"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDrinksPerDay(drinksPerDay + 1)}
                        className="bg-black/20 border-white/20 text-white hover:bg-black/30"
                        data-testid="button-increase-drinks"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Days Per Week */}
                  <div className="space-y-3">
                    <Label className="text-white">Drinking days per week</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDaysPerWeek(Math.max(1, daysPerWeek - 1))}
                        className="bg-black/20 border-white/20 text-white hover:bg-black/30"
                        data-testid="button-decrease-days"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={daysPerWeek}
                        onChange={(e) => setDaysPerWeek(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
                        className="bg-black/20 border-white/20 text-white text-center text-2xl font-bold w-24"
                        data-testid="input-days-per-week"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDaysPerWeek(Math.min(7, daysPerWeek + 1))}
                        className="bg-black/20 border-white/20 text-white hover:bg-black/30"
                        data-testid="button-increase-days"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Weekly Average */}
                  <div className="bg-black/20 p-4 rounded-lg text-center">
                    <p className="text-white/70 text-sm">Weekly average</p>
                    <p className="text-xl font-bold text-teal-400">{weeklyAverage} drinks/week</p>
                  </div>

                  {/* Medical Warning */}
                  {showMedicalWarning && (
                    <Alert className="bg-amber-500/20 border-amber-500/50">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      <AlertDescription className="text-white">
                        Your intake is higher than recommended. Consider consulting a healthcare provider before tapering, 
                        especially if you've been drinking at this level for a while.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pace Selection */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-r from-black/60 via-teal-500 to-black/80 transition">
              <Card className="bg-black/30 backdrop-blur-lg border-transparent shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Step 2: Pick Your Pace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant={pace === "gentle" ? "default" : "outline"}
                      onClick={() => setPace("gentle")}
                      className={`h-auto py-4 ${pace === "gentle" ? "bg-teal-500 text-white" : "bg-black/20 border-white/20 text-white hover:bg-black/30"}`}
                      data-testid="button-pace-gentle"
                    >
                      <div className="text-center">
                        <div className="text-md font-bold">Gentle</div>
                        <div className="text-sm opacity-80">~10% per week</div>
                      </div>
                    </Button>

                    <Button
                      variant={pace === "standard" ? "default" : "outline"}
                      onClick={() => setPace("standard")}
                      className={`h-auto py-4 ${pace === "standard" ? "bg-teal-500 text-white" : "bg-black/20 border-white/20 text-white hover:bg-black/30"}`}
                      data-testid="button-pace-standard"
                    >
                      <div className="text-center">
                        <div className="text-md font-bold">Standard</div>
                        <div className="text-sm opacity-80">~20% per week</div>
                      </div>
                    </Button>

                    <Button
                      variant={pace === "custom" ? "default" : "outline"}
                      onClick={() => setPace("custom")}
                      className={`h-auto py-4 ${pace === "custom" ? "bg-teal-500 text-white" : "bg-black/20 border-white/20 text-white hover:bg-black/30"}`}
                      data-testid="button-pace-custom"
                    >
                      <div className="text-center">
                        <div className="text-md font-bold">Custom</div>
                        <div className="text-sm opacity-80">5-25% per week</div>
                      </div>
                    </Button>
                  </div>

                  {pace === "custom" && (
                    <div className="space-y-2">
                      <Label className="text-white">Custom reduction rate: {customPercent}%/week</Label>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        value={customPercent}
                        onChange={(e) => setCustomPercent(parseInt(e.target.value))}
                        className="w-full"
                        data-testid="slider-custom-percent"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Generate Plan Button */}
            <Button
              onClick={generatePlan}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white text-lg py-6"
              data-testid="button-generate-plan"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Generate My Plan
            </Button>
          </div>
        )}

        {/* Tracking Step */}
        {step === "tracking" && plan && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-r from-black/60 via-teal-500 to-black/80 transition">
              <Card className="bg-black/30 backdrop-blur-lg border-transparent shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="h-5 w-5 text-teal-400" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={getProgress()} className="h-3" />
                  <p className="text-white text-center">
                    Week {currentWeek} of {plan.weeklyTargets.length} • {getProgress()}% Complete
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Current Week Target */}
            {currentWeek <= plan.weeklyTargets.length && (
              <div className="rounded-2xl p-[1px] bg-gradient-to-r from-black/60 via-teal-500 to-black/80 transition">
                <Card className="bg-black/30 backdrop-blur-lg border-transparent shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">This Week's Target</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-teal-400">
                        ≤ {plan.weeklyTargets[currentWeek - 1].maxDrinks}
                      </p>
                      <p className="text-white/70 mt-2">drinks per day max</p>
                    </div>

                    {/* Check-in Buttons */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <Button
                        onClick={() => recordCheckIn("met")}
                        className="bg-green-500/20 border border-green-500/50 text-white hover:bg-green-500/30"
                        data-testid="button-met-cap"
                      >
                        ✓ Met Cap
                      </Button>
                      <Button
                        onClick={() => recordCheckIn("over")}
                        className="bg-red-500/20 border border-red-500/50 text-white hover:bg-red-500/30"
                        data-testid="button-went-over"
                      >
                        Went Over
                      </Button>
                      <Button
                        onClick={() => recordCheckIn("skip")}
                        className="bg-gray-500/20 border border-gray-500/50 text-white hover:bg-gray-500/30"
                        data-testid="button-skip-week"
                      >
                        Skip
                      </Button>
                    </div>

                    {/* Pause Week */}
                    <Button
                      onClick={pauseWeek}
                      variant="outline"
                      className="w-full mt-3 bg-black/20 border-white/20 text-white hover:bg-black/30"
                      data-testid="button-pause-week"
                    >
                      Pause & Repeat This Week
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Complete Message */}
            {currentWeek > plan.weeklyTargets.length && (
              <div className="rounded-2xl p-[1px] bg-gradient-to-r from-black/60 via-teal-500 to-black/80 transition">
                <Card className="bg-black/30 backdrop-blur-lg border-transparent shadow-xl">
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-white mb-2">You Did It!</h3>
                    <p className="text-white/80">
                      You've completed your weaning plan. Take pride in your journey!
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Weekly Schedule */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-r from-black/60 via-teal-500 to-black/80 transition">
              <Card className="bg-black/30 backdrop-blur-lg border-transparent shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Full Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {plan.weeklyTargets.map((target) => {
                      const weekCheckIns = checkIns.filter(c => c.week === target.week);
                      const isComplete = weekCheckIns.some(c => c.status === "met" || c.status === "skip");
                      const isCurrent = target.week === currentWeek;

                      return (
                        <div
                          key={target.week}
                          className={`p-3 rounded-lg flex items-center justify-between ${
                            isCurrent ? "bg-teal-500/30 border border-teal-500/50" : "bg-black/20"
                          }`}
                          data-testid={`week-schedule-${target.week}`}
                        >
                          <div className="flex items-center gap-3">
                            {isComplete && <span className="text-green-400">✓</span>}
                            <span className="text-white font-medium">Week {target.week}</span>
                          </div>
                          <span className="text-white/90">≤ {target.maxDrinks} drinks/day</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reset Button */}
            <Button
              onClick={resetPlan}
              variant="outline"
              className="w-full bg-black/20 border-white/20 text-white hover:bg-black/30"
              data-testid="button-reset-plan"
            >
              Start Over With New Plan
            </Button>
          </div>
        )}

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">How to Use Weaning Off Tool</h3>
              
              <div className="space-y-4 text-white/90 text-sm">
                <p>Gradually reduce your alcohol intake at your own pace with a personalized, judgment-free tapering plan.</p>
                <div>
                  <h4 className="font-semibold text-lime-400 mb-2">How It Works:</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Enter your current drinking baseline (drinks per day and days per week)</li>
                    <li>Choose your reduction pace: gentle (10%), standard (20%), or custom</li>
                    <li>Generate your personalized weekly reduction plan</li>
                    <li>Check in each week to track progress or pause if needed</li>
                    <li>View your full schedule and celebrate milestones</li>
                  </ol>
                </div>
                <p className="text-sm text-lime-300">⚠️ Medical Note: If you drink heavily, consult a healthcare provider before tapering to avoid withdrawal risks.</p>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="mt-6 w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaningOffTool;
