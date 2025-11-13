
export type ClinicalDietKey =
  | "low_fodmap"
  | "aip"
  | "cardiac"
  | "renal"
  | "bariatric"
  | "anti_inflammatory"
  | "liver_friendly";

export const clinicalDietPickerConfig: Record<ClinicalDietKey, any> = {
  low_fodmap: {},
  aip: {},
  cardiac: {},
  renal: {},
  bariatric: {},
  anti_inflammatory: {},
  liver_friendly: {},
};
