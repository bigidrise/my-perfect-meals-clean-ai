import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, ChevronDown, ChevronUp, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useGLP1Profile, useSaveGLP1Profile } from "@/hooks/useGLP1";
import { useToast } from "@/hooks/use-toast";
import { glp1Presets } from "@/data/glp1Presets";

type SiteType = "abdomen" | "thigh" | "upper_arm" | "buttock";

export default function GLP1Hub() {
  const [, setLocation] = useLocation();
  const [shotDate, setShotDate] = useState<string>("");
  const [dosage, setDosage] = useState<string>("0.5");
  const [currentSite, setCurrentSite] = useState<SiteType | "">("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string>("");
  const [data, setData] = useState<{ date: string; shot: number }[]>([]);
  const [view, setView] = useState<"daily" | "7day" | "30day">("7day");
  const [siteHistory, setSiteHistory] = useState<SiteType[]>([]);
  const [noteOpen, setNoteOpen] = useState(false);

  // Fetch and mutate state for GLP-1 profile
  const { data: profile, isLoading: profileLoading } = useGLP1Profile();
  const saveMutation = useSaveGLP1Profile();
  const { toast } = useToast();

  // Initialize form fields with profile data
  const [maxMealVolume, setMaxMealVolume] = useState<number | undefined>(undefined);
  const [proteinMin, setProteinMin] = useState<number | undefined>(undefined);
  const [fatMax, setFatMax] = useState<number | undefined>(undefined);
  const [fiberMin, setFiberMin] = useState<number | undefined>(undefined);
  const [hydrationGoal, setHydrationGoal] = useState<number | undefined>(undefined);
  const [mealsPerDay, setMealsPerDay] = useState<number | undefined>(undefined);
  const [slowDigestFoodsOnly, setSlowDigestFoodsOnly] = useState<boolean>(false);
  const [limitCarbonation, setLimitCarbonation] = useState<boolean>(false);
  const [limitAlcohol, setLimitAlcohol] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  useEffect(() => {
    document.title = "GLP-1 Hub | My Perfect Meals";
    const saved = localStorage.getItem("glp1-site-history");
    if (saved) {
      setSiteHistory(JSON.parse(saved));
    }
  }, []);

  // Effect to populate form fields when profile data is loaded
  useEffect(() => {
    if (profile) {
      setMaxMealVolume(profile.maxMealVolume);
      setProteinMin(profile.proteinMin);
      setFatMax(profile.fatMax);
      setFiberMin(profile.fiberMin);
      setHydrationGoal(profile.hydrationGoal);
      setMealsPerDay(profile.mealsPerDay);
      setSlowDigestFoodsOnly(profile.slowDigestFoodsOnly);
      setLimitCarbonation(profile.limitCarbonation);
      setLimitAlcohol(profile.limitAlcohol);
    }
  }, [profile]);


  const logShot = async () => {
    const dateVal = shotDate || new Date().toISOString().slice(0, 10);
    setSaving(true);
    try {
      setData((prev) => [...prev, { date: dateVal, shot: 1 }]);

      if (currentSite) {
        const newHistory = [currentSite, ...siteHistory].slice(0, 4);
        setSiteHistory(newHistory);
        localStorage.setItem("glp1-site-history", JSON.stringify(newHistory));
      }

      setSavedMsg("Shot logged successfully!");
      setShotDate("");
      setCurrentSite("");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch {
      alert("Could not save right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const chartData = useMemo(() => {
    const now = new Date();
    let days = 1;
    if (view === "7day") days = 7;
    if (view === "30day") days = 30;
    const arr: { date: string; shot: number | null }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const found = data.filter((x) => x.date === ds).length;
      arr.push({ date: ds.slice(5), shot: found > 0 ? found : null });
    }
    return arr;
  }, [data, view]);

  const handlePresetSelect = (presetId: string) => {
    const preset = glp1Presets.find(p => p.id === presetId);
    if (preset) {
      setMaxMealVolume(preset.values.maxMealVolumeMl);
      setProteinMin(preset.values.proteinMinG);
      setFatMax(preset.values.fatMaxG);
      setFiberMin(preset.values.fiberMinG);
      setHydrationGoal(preset.values.hydrationMinMl);
      setMealsPerDay(preset.values.mealsPerDay);
      setSlowDigestFoodsOnly(preset.values.slowDigestOnly ?? false);
      setLimitCarbonation(preset.values.limitCarbonation ?? false);
      setLimitAlcohol(preset.values.limitAlcohol ?? false);
    }
    setSelectedPreset(presetId);
  };

  const handleSave = async () => {
    saveMutation.mutate({
      maxMealVolume,
      proteinMin,
      fatMax,
      fiberMin,
      hydrationGoal,
      mealsPerDay,
      slowDigestFoodsOnly,
      limitCarbonation,
      limitAlcohol,
    });
    toast({
      title: "GLP-1 Profile Saved",
      description: "Your guardrail settings have been updated.",
      variant: "success",
    });
  };

  return (
    <div className="min-h-screen p-4 pb-16 bg-gradient-to-br from-black/60 via-orange-600 to-black/80">
      {/* Back to Planner Hub */}
      <button
        type="button"
        onClick={() => setLocation("/planner")}
        aria-label="Back to Planner Hub"
        className="fixed top-4 left-4 z-[9999] bg-black/10 border border-white/20 text-white hover:bg-black/20 rounded-2xl px-3 py-2 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />Planner
        <span className="text-sm font-medium"></span>
      </button>

      {/* Premium Feature Banner */}
      <div className="fixed top-4 right-4 z-[9999] bg-purple-600/90 backdrop-blur-lg border border-purple-400/50 rounded-xl px-4 py-2 text-white shadow-2xl">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span className="font-semibold text-sm">Premium • $19.99/mo</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 pt-14">
        {/* Header with Black Glass Background */}
        <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-white text-center">
          <h1 className="text-2xl font-semibold mb-2">GLP-1 Hub</h1>
          <p className="text-white/90 text-sm">Track your GLP-1 medication - simple, reliable, and always with you.</p>
        </div>

        {/* Important Medical Note Dropdown */}
        <section className="bg-black/40 backdrop-blur-lg border border-purple-300/30 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => setNoteOpen(!noteOpen)}
            className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
          >
            <span className="font-medium">
              <span className="text-emerald-400">Important:</span>{" "}
              <span className="text-sm text-white">How This App Supports Your Care</span>
            </span>
            {noteOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {noteOpen && (
            <div className="px-4 pb-4">
              <p className="text-sm leading-relaxed text-white/90">
                <span className="font-semibold text-emerald-400">Important:</span> My Perfect Meals is designed to work{" "}
                <span className="font-semibold text-white">with</span> your doctor, dietitian, or healthcare provider — never
                instead of them. Use the information and tools here to stay consistent between visits, to understand your
                body, and to make small, confident choices that honor your professional guidance. Every tracker, every meal,
                and every suggestion in this app is meant to <span className="italic">support</span> your care plan, not
                replace it.
              </p>
            </div>
          )}
        </section>

        {/* Shot Tracker - Log Shots */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-4 backdrop-blur">
          <h2 className="text-lg text-white font-medium mb-2">Log GLP-1 Shot</h2>
          <p className="text-white/80 text-sm mb-3">Track your medication - date, dosage, and location.</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={shotDate}
              onChange={(e) => setShotDate(e.target.value)}
              className="rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm"
              placeholder="Date"
            />
            <select
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm"
            >
              <option value="0.25">0.25mg</option>
              <option value="0.5">0.5mg</option>
              <option value="1">1mg</option>
              <option value="1.7">1.7mg</option>
              <option value="2">2mg</option>
              <option value="2.4">2.4mg</option>
            </select>
            <select
              value={currentSite}
              onChange={(e) => setCurrentSite(e.target.value as SiteType)}
              className="rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm"
            >
              <option value="">Site...</option>
              <option value="abdomen">Abdomen</option>
              <option value="thigh">Thigh</option>
              <option value="upper_arm">Upper Arm</option>
              <option value="buttock">Buttock</option>
            </select>
            <Button
              onClick={logShot}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2"
              data-testid="button-log-shot"
            >
              {saving ? "Saving…" : "Log Shot"}
            </Button>
            {savedMsg && <span className="text-purple-300 text-sm">{savedMsg}</span>}
          </div>
        </section>

        {/* Shot History Graph */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-5 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg text-white font-medium">Shot History</h2>
            <div className="flex gap-2">
              {["daily", "7day", "30day"].map((v) => (
                <Button
                  key={v}
                  onClick={() => setView(v as any)}
                  className={`rounded-xl px-3 py-1 text-sm ${
                    view === v
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {v === "daily" ? "Daily" : v === "7day" ? "7-Day" : "30-Day"}
                </Button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(192,132,252,0.3)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="shot"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#a855f7" }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* 4-Site Rotation Tracker */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-4 backdrop-blur">
          <h2 className="text-lg text-white font-medium mb-2">Last 4 Injection Sites</h2>
          <p className="text-white/80 text-sm mb-3">Track your rotation to avoid using the same site.</p>
          <div className="grid grid-cols-4 gap-2">
            {siteHistory.length === 0 ? (
              <div className="col-span-4 text-white/50 text-center py-4 text-sm">
                No sites logged yet. Log a shot above to start tracking.
              </div>
            ) : (
              <>
                {siteHistory.map((site, index) => {
                  const siteColors = {
                    abdomen: "bg-purple-600/80 border-purple-400",
                    thigh: "bg-blue-600/80 border-blue-400",
                    upper_arm: "bg-green-600/80 border-green-400",
                    buttock: "bg-orange-600/80 border-orange-400",
                  };
                  const siteLabels = {
                    abdomen: "Abdomen",
                    thigh: "Thigh",
                    upper_arm: "Upper Arm",
                    buttock: "Buttock",
                  };
                  return (
                    <div
                      key={index}
                      className={`${siteColors[site]} border-2 rounded-xl p-3 text-center`}
                    >
                      <div className="text-white font-bold text-sm">{siteLabels[site]}</div>
                      <div className="text-white/80 text-xs mt-1">
                        {index === 0 ? "Most Recent" : `#${index + 1}`}
                      </div>
                    </div>
                  );
                })}
                {[...Array(4 - siteHistory.length)].map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="bg-white/5 border-2 border-white/20 rounded-xl p-3 text-center"
                  >
                    <div className="text-white/40 text-sm">Not Used</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* Doctor / Coach Guardrails */}
        <section className="bg-black/60 border border-purple-300/20 rounded-xl p-5 backdrop-blur shadow-lg">
          <h2 className="text-lg text-white font-medium mb-2">Doctor / Coach Guardrails</h2>
          <p className="text-white/80 text-sm mb-4">Set clinical meal guardrails for GLP-1 patients (portion, macros, hydration).</p>

          {/* Preset Selector */}
          <div className="mb-4">
            <label className="text-white/90 text-sm block mb-1">Quick Start Preset</label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="">-- Select Preset --</option>
              {glp1Presets.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            {selectedPreset && (
              <p className="text-white/70 text-xs mt-2">
                {glp1Presets.find(p => p.id === selectedPreset)?.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/90 text-sm block mb-1">Max Meal Volume (mL)</label>
              <input
                type="number"
                placeholder="e.g., 300"
                value={maxMealVolume}
                onChange={(e) => setMaxMealVolume(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Protein Min (g per meal)</label>
              <input
                type="number"
                placeholder="e.g., 20"
                value={proteinMin}
                onChange={(e) => setProteinMin(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Fat Max (g per meal)</label>
              <input
                type="number"
                placeholder="e.g., 15"
                value={fatMax}
                onChange={(e) => setFatMax(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Fiber Min (g per day)</label>
              <input
                type="number"
                placeholder="e.g., 25"
                value={fiberMin}
                onChange={(e) => setFiberMin(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Hydration Goal (mL per day)</label>
              <input
                type="number"
                placeholder="e.g., 2000"
                value={hydrationGoal}
                onChange={(e) => setHydrationGoal(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="text-white/90 text-sm block mb-1">Meals per Day</label>
              <input
                type="number"
                placeholder="e.g., 4"
                value={mealsPerDay}
                onChange={(e) => setMealsPerDay(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-xl bg-black/30 border border-purple-300/30 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white/90 text-sm">Slow-Digest Foods Only</label>
              <input
                type="checkbox"
                checked={slowDigestFoodsOnly}
                onChange={(e) => setSlowDigestFoodsOnly(e.target.checked)}
                className="h-5 w-5 rounded bg-black/30 border-purple-300/30 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white/90 text-sm">Limit Carbonation</label>
              <input
                type="checkbox"
                checked={limitCarbonation}
                onChange={(e) => setLimitCarbonation(e.target.checked)}
                className="h-5 w-5 rounded bg-black/30 border-purple-300/30 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white/90 text-sm">Limit Alcohol</label>
              <input
                type="checkbox"
                checked={limitAlcohol}
                onChange={(e) => setLimitAlcohol(e.target.checked)}
                className="h-5 w-5 rounded bg-black/30 border-purple-300/30 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full rounded-xl mt-4"
          >
            {saveMutation.isPending ? "Saving..." : "Save Guardrails"}
          </Button>
        </section>

        {/* CTA → Meals */}
        <section className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-xl">
          <h3 className="text-white font-medium text-lg mb-1">Find Meals for GLP-1 Users</h3>
          <p className="text-white/90 text-sm mb-3">Small portions • Calorie-dense • Mixed cuisines.</p>
          <Button
            onClick={() => setLocation("/glp1-meal-builder")}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full rounded-xl"
            data-testid="button-go-to-glp1-meals"
          >
            Go to GLP-1 Meal Builder
          </Button>
        </section>
      </div>
    </div>
  );
}