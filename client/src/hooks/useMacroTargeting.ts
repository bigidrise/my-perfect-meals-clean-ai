import { useState, useEffect, useCallback } from 'react';

export interface MacroTargets {
  protein: number | '';
  carbs: number | '';
  fat: number | '';
}

export interface MacroTargetingState {
  enabled: boolean;
  targets: MacroTargets;
  toggleEnabled: () => void;
  updateTarget: (field: keyof MacroTargets, value: number | '') => void;
  applyPreset: (preset: MacroTargets) => void;
  serializeForRequest: () => { protein_g: number; carbs_g: number; fat_g: number } | null;
}

const PRESETS = {
  PRESET_1: { protein: 50, carbs: 30, fat: 20 },
  PRESET_2: { protein: 40, carbs: 40, fat: 15 },
};

/**
 * Reusable hook for macro targeting functionality
 * Handles state, localStorage persistence, and validation
 * 
 * @param storageKey - Unique localStorage key (e.g., "macroTargets::trainer::general")
 */
export function useMacroTargeting(storageKey: string): MacroTargetingState {
  const [enabled, setEnabled] = useState(false);
  const [targets, setTargets] = useState<MacroTargets>({
    protein: '',
    carbs: '',
    fat: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setEnabled(parsed.enabled || false);
        setTargets({
          protein: parsed.protein ?? '',
          carbs: parsed.carbs ?? '',
          fat: parsed.fat ?? '',
        });
      }
    } catch (error) {
      console.error('Failed to load macro targets from localStorage:', error);
    }
  }, [storageKey]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          enabled,
          protein: targets.protein,
          carbs: targets.carbs,
          fat: targets.fat,
        })
      );
    } catch (error) {
      console.error('Failed to save macro targets to localStorage:', error);
    }
  }, [storageKey, enabled, targets]);

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  const updateTarget = useCallback((field: keyof MacroTargets, value: number | '') => {
    setTargets((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyPreset = useCallback((preset: MacroTargets) => {
    setTargets(preset);
  }, []);

  const serializeForRequest = useCallback((): { protein_g: number; carbs_g: number; fat_g: number } | null => {
    if (!enabled) return null;

    const protein = typeof targets.protein === 'number' ? targets.protein : null;
    const carbs = typeof targets.carbs === 'number' ? targets.carbs : null;
    const fat = typeof targets.fat === 'number' ? targets.fat : null;

    // Only return if all three values are valid numbers
    if (protein !== null && carbs !== null && fat !== null) {
      return {
        protein_g: protein,
        carbs_g: carbs,
        fat_g: fat,
      };
    }

    return null;
  }, [enabled, targets]);

  return {
    enabled,
    targets,
    toggleEnabled,
    updateTarget,
    applyPreset,
    serializeForRequest,
  };
}

export { PRESETS };
