
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, Filter, User, Activity, Clock, Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { DIABETIC_PRESETS } from "@/data/diabeticPresets";

interface PatientRecord {
  id: string;
  name: string;
  email: string;
  condition: "T2D" | "GLP1" | "CARDIAC";
  currentPreset?: string;
  latestGlucose?: number;
  lastUpdated?: string;
  guardrails?: {
    fastingMin: number;
    fastingMax: number;
    postMealMax: number;
    carbLimit: number;
  };
}

// Mock data - will be replaced with real API calls
const mockPatients: PatientRecord[] = [
  {
    id: "patient-1",
    name: "John Doe",
    email: "john@example.com",
    condition: "T2D",
    currentPreset: "standard",
    latestGlucose: 145,
    lastUpdated: "2024-01-15T10:30:00Z",
    guardrails: { fastingMin: 80, fastingMax: 130, postMealMax: 180, carbLimit: 150 }
  },
  {
    id: "patient-2",
    name: "Jane Smith",
    email: "jane@example.com",
    condition: "GLP1",
    currentPreset: "glp1",
    latestGlucose: 115,
    lastUpdated: "2024-01-15T09:15:00Z",
    guardrails: { fastingMin: 80, fastingMax: 120, postMealMax: 160, carbLimit: 120 }
  },
  {
    id: "patient-3",
    name: "Robert Johnson",
    email: "robert@example.com",
    condition: "CARDIAC",
    currentPreset: "cardiac",
    latestGlucose: 98,
    lastUpdated: "2024-01-14T16:45:00Z",
    guardrails: { fastingMin: 80, fastingMax: 130, postMealMax: 180, carbLimit: 130 }
  }
];

export default function PatientAssignmentDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [filterPreset, setFilterPreset] = useState<string>("all");
  const [patients] = useState<PatientRecord[]>(mockPatients);

  // Authorization check
  if (user?.role !== 'doctor' && user?.role !== 'coach' && user?.role !== 'trainer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-red-600 to-black/80 flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center max-w-md">
          <h2 className="text-2xl font-semibold text-white mb-4">Access Denied</h2>
          <p className="text-white/80 mb-6">This dashboard is only accessible to healthcare professionals.</p>
          <Button onClick={() => setLocation("/planner")} className="bg-white/20 hover:bg-white/30">
            Return to Planner
          </Button>
        </div>
      </div>
    );
  }

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = filterCondition === "all" || patient.condition === filterCondition;
    const matchesPreset = filterPreset === "all" || patient.currentPreset === filterPreset;
    return matchesSearch && matchesCondition && matchesPreset;
  });

  const getPresetLabel = (presetId?: string) => {
    if (!presetId) return "Custom";
    const preset = DIABETIC_PRESETS.find(p => p.id === presetId);
    return preset ? preset.name : "Custom";
  };

  const getGlucoseStatus = (glucose?: number) => {
    if (!glucose) return { color: "gray", text: "No data" };
    if (glucose < 70) return { color: "red", text: "Low" };
    if (glucose > 180) return { color: "yellow", text: "High" };
    return { color: "green", text: "In range" };
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <>
      {/* Back Button */}
      <div
        className="fixed top-4 left-4 pointer-events-auto"
        style={{ 
          zIndex: 2147483647,
          isolation: 'isolate',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <Button
          onClick={() => setLocation("/clinical-lifestyle-hub")}
          className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-none border border-white/30 hover:bg-black/40 transition-all duration-200 font-medium rounded-xl shadow-2xl"
        >
          <ArrowLeft className="h-4 w-4 text-white" />
          Back
        </Button>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-black/60 via-blue-600 to-black/80 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 relative z-10">
          
          {/* Header */}
          <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden mb-8 mt-14">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4 relative z-10">
              👨‍⚕️ Patient Assignment Dashboard
            </h1>
            <p className="text-sm text-white/90 max-w-3xl mx-auto relative z-10">
              Manage diabetic guardrails and monitor patient progress
            </p>
          </div>

          {/* Filters & Search */}
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
            <div className="grid md:grid-cols-3 gap-4 relative z-10">
              <div>
                <label className="block text-sm text-white mb-2">Search Patients</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name or email..."
                    className="pl-10 bg-white/20 border-white/40 text-white placeholder-white/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Filter by Condition</label>
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger className="bg-white/20 border-white/40 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="T2D">Type 2 Diabetes</SelectItem>
                    <SelectItem value="GLP1">GLP-1 Patients</SelectItem>
                    <SelectItem value="CARDIAC">Cardiac-Diabetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Filter by Preset</label>
                <Select value={filterPreset} onValueChange={setFilterPreset}>
                  <SelectTrigger className="bg-white/20 border-white/40 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Presets</SelectItem>
                    {DIABETIC_PRESETS.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <div className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-12 text-center">
                <User className="h-16 w-16 mx-auto mb-4 text-white/40" />
                <p className="text-white/80 text-lg">No patients found</p>
                <p className="text-white/60 text-sm mt-2">Try adjusting your filters or search query</p>
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const glucoseStatus = getGlucoseStatus(patient.latestGlucose);
                
                return (
                  <div
                    key={patient.id}
                    className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 relative overflow-hidden hover:bg-black/40 transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Patient Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{patient.name}</h3>
                              <p className="text-sm text-white/70">{patient.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge className="bg-purple-600/40 text-purple-100">
                              {patient.condition}
                            </Badge>
                            <Badge className="bg-blue-600/40 text-blue-100">
                              {getPresetLabel(patient.currentPreset)}
                            </Badge>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-xs text-white/60 mb-1">Latest Glucose</div>
                            <div className={`text-lg font-semibold ${
                              glucoseStatus.color === 'green' ? 'text-green-300' :
                              glucoseStatus.color === 'yellow' ? 'text-yellow-300' :
                              glucoseStatus.color === 'red' ? 'text-red-300' : 'text-white/40'
                            }`}>
                              {patient.latestGlucose || '--'} mg/dL
                            </div>
                            <div className="text-xs text-white/60">{glucoseStatus.text}</div>
                          </div>

                          <div className="text-center">
                            <div className="text-xs text-white/60 mb-1">Carb Limit</div>
                            <div className="text-lg font-semibold text-white">
                              {patient.guardrails?.carbLimit || '--'}g
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-xs text-white/60 mb-1 flex items-center justify-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last Update
                            </div>
                            <div className="text-sm text-white/80">
                              {formatTimestamp(patient.lastUpdated)}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              toast({ title: "View feature coming soon" });
                            }}
                            className="bg-blue-500/30 hover:bg-blue-500/50 text-white border border-white/20"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            onClick={() => {
                              toast({ title: "Edit feature coming soon" });
                            }}
                            className="bg-orange-500/30 hover:bg-orange-500/50 text-white border border-white/20"
                            size="sm"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white mb-2">{patients.length}</div>
              <div className="text-sm text-white/70">Total Patients</div>
            </div>
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-green-300 mb-2">
                {patients.filter(p => p.latestGlucose && p.latestGlucose >= 70 && p.latestGlucose <= 180).length}
              </div>
              <div className="text-sm text-white/70">In Range</div>
            </div>
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                {patients.filter(p => p.latestGlucose && p.latestGlucose > 180).length}
              </div>
              <div className="text-sm text-white/70">High Glucose</div>
            </div>
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-blue-300 mb-2">
                {DIABETIC_PRESETS.length}
              </div>
              <div className="text-sm text-white/70">Active Presets</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
