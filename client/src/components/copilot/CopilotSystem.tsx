import React from "react";
import { CopilotProvider, CopilotAction } from "./CopilotContext";
import { CopilotButton } from "./CopilotButton";
import { CopilotSheet } from "./CopilotSheet";
import { executeCommand } from "./CopilotCommandRegistry";

interface CopilotSystemProps {
  children: React.ReactNode;
  onAction?: (action: CopilotAction) => void | Promise<void>;
}

export const CopilotSystem: React.FC<CopilotSystemProps> = ({ 
  children,
  onAction: customOnAction,
}) => {
  const handleAction = async (action: CopilotAction) => {
    if (customOnAction) {
      await customOnAction(action);
    } else {
      await executeCommand(action);
    }
  };

  return (
    <CopilotProvider onAction={handleAction}>
      {children}
      <CopilotButton />
      <CopilotSheet />
    </CopilotProvider>
  );
};
