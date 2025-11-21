import React from "react";
import { useCopilotBrain, CopilotBrainProps } from "./useCopilotBrain";

export const CopilotBrain: React.FC<CopilotBrainProps> = (props) => {
  useCopilotBrain(props);
  return null;
};
