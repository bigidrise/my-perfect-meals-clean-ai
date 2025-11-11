export type DailyLimits = {
  date: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type MacroTargets = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

const LS_KEY = (userId?: string) => `mpm.dailyLimits.${userId ?? "anon"}`;
const TARGETS_KEY = (userId?: string) => `mpm.macroTargets.${userId ?? "anon"}`;

// NEW: Persistent macro targets (not date-specific - stays until you change it)
export async function setMacroTargets(targets: MacroTargets, userId?: string): Promise<void> {
  // Save to localStorage for offline support
  const key = TARGETS_KEY(userId);
  localStorage.setItem(key, JSON.stringify(targets));

  // If we have a userId, also save to the database
  if (userId) {
    try {
      const response = await fetch(`/api/users/${userId}/macro-targets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targets),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save macro targets');
      }

      console.log('✅ Macro targets saved to database');
    } catch (error) {
      console.error('Failed to save macro targets to database:', error);
      throw error; // Re-throw to let the caller handle it
    }
  } else {
    throw new Error('User ID is required to save macro targets');
  }
}

export function getMacroTargets(userId?: string): MacroTargets | null {
  const key = TARGETS_KEY(userId);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

// OLD: Date-specific limits (kept for backward compatibility)
export function setDailyLimits(limits: DailyLimits, userId?: string) {
  const key = LS_KEY(userId);
  const map: Record<string, DailyLimits> = JSON.parse(localStorage.getItem(key) || "{}");
  map[limits.date] = limits;
  localStorage.setItem(key, JSON.stringify(map));
}

export function getDailyLimits(date: string, userId?: string): DailyLimits | null {
  const key = LS_KEY(userId);
  const map: Record<string, DailyLimits> = JSON.parse(localStorage.getItem(key) || "{}");
  return map[date] ?? null;
}
