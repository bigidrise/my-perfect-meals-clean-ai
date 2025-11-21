import { AppKnowledge } from "@/lib/knowledge/AppKnowledgeRegistry";

export const explainFeature = async (featureId: string) => {
  const data = AppKnowledge[featureId];
  if (!data) {
    return {
      title: "Unknown Feature",
      description:
        "I don’t have information about this feature yet, but I'm learning more every day.",
      howTo: [],
      tips: [],
    };
  }

  return data;
};
