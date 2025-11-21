import React from "react";
import { CopilotProvider, CopilotAction } from "./CopilotContext";
import { CopilotButton } from "./CopilotButton";
import { CopilotSheet } from "./CopilotSheet";
import { executeCommand } from "./CopilotCommandRegistry";

interface CopilotSystemProps {
  children: React.ReactNode;
}

export const CopilotSystem: React.FC<CopilotSystemProps> = ({ children }) => {
  const handleAction = async (action: CopilotAction) => {
    await executeCommand(action);
  };

  return (
    <CopilotProvider onAction={handleAction}>
      {children}
      <CopilotButton />
      <CopilotSheet />
    </CopilotProvider>
  );
};
