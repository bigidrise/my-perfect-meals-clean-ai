
export interface AntiInflammatoryPreset {
  id: string;
  name: string;
  description: string;
  guardrails: {
    omega3MinG: number;
    fiberMinG: number;
    antioxidantServings: number;
    processedMeatMaxG: number;
    sodiumMaxMg: number;
    sugarMaxG: number;
    warmMealsPerDay: number;
  };
}

export const ANTIINFLAMMATORY_PRESETS: AntiInflammatoryPreset[] = [
  {
    id: "standard",
    name: "🩺 Standard Anti-Inflammatory",
    description: "Balanced anti-inflammatory targets for general autoimmune support",
    guardrails: {
      omega3MinG: 2,
      fiberMinG: 30,
      antioxidantServings: 5,
      processedMeatMaxG: 50,
      sodiumMaxMg: 2000,
      sugarMaxG: 25,
      warmMealsPerDay: 2,
    },
  },
  {
    id: "strict",
    name: "🎯 Strict Control",
    description: "Intensive anti-inflammatory protocol for active flare management",
    guardrails: {
      omega3MinG: 3,
      fiberMinG: 35,
      antioxidantServings: 7,
      processedMeatMaxG: 0,
      sodiumMaxMg: 1500,
      sugarMaxG: 15,
      warmMealsPerDay: 3,
    },
  },
  {
    id: "cardiac",
    name: "❤️ Cardiac-Anti-Inflammatory",
    description: "Combined heart health + anti-inflammatory (ultra-low sodium, high omega-3)",
    guardrails: {
      omega3MinG: 3,
      fiberMinG: 40,
      antioxidantServings: 6,
      processedMeatMaxG: 25,
      sodiumMaxMg: 1200,
      sugarMaxG: 20,
      warmMealsPerDay: 2,
    },
  },
  {
    id: "liberal",
    name: "🌟 Liberal/Maintenance",
    description: "More flexible targets for long-term maintenance or elderly patients",
    guardrails: {
      omega3MinG: 1.5,
      fiberMinG: 25,
      antioxidantServings: 4,
      processedMeatMaxG: 75,
      sodiumMaxMg: 2300,
      sugarMaxG: 30,
      warmMealsPerDay: 1,
    },
  },
];
