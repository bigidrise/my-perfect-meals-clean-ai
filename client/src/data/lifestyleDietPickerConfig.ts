
export type LifestyleDietKey =
  | "mediterranean"
  | "vegan"
  | "vegetarian"
  | "pescatarian"
  | "paleo"
  | "keto"
  | "flexitarian";

// This will later point to per-diet ingredient sets.
// For now, leave the values as empty objects/placeholders.
export const lifestyleDietPickerConfig: Record<LifestyleDietKey, any> = {
  mediterranean: {},
  vegan: {},
  vegetarian: {},
  pescatarian: {},
  paleo: {},
  keto: {},
  flexitarian: {},
};
