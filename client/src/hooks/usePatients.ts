
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

interface Patient {
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
  inRange?: boolean;
}

interface Guardrails {
  fastingMin: number;
  fastingMax: number;
  postMealMax: number;
  carbLimit: number;
  fiberMin?: number;
  giCap?: number;
  mealFrequency?: number;
  presetId?: string;
}

export function usePatients() {
  return useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch patients");
      return res.json();
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

export function usePatientDetails(patientId: string) {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const res = await fetch(`/api/patients/${patientId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch patient details");
      return res.json();
    },
    enabled: !!patientId,
  });
}

export function useUpdateGuardrails() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ patientId, guardrails }: { patientId: string; guardrails: Guardrails }) => {
      const res = await fetch(`/api/patients/${patientId}/guardrails`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(guardrails),
      });
      if (!res.ok) throw new Error("Failed to update guardrails");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Guardrails updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update guardrails", variant: "destructive" });
    },
  });
}

export function useAuditTrail(patientId: string) {
  return useQuery({
    queryKey: ["audit", patientId],
    queryFn: async () => {
      const res = await fetch(`/api/patients/${patientId}/audit`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch audit trail");
      return res.json();
    },
    enabled: !!patientId,
  });
}
