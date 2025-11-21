import React from "react";
import { CopilotProvider, CopilotAction } from "./CopilotContext";
import { CopilotButton } from "./CopilotButton";
import { CopilotSheet } from "./CopilotSheet";

interface CopilotSystemProps {
  children: React.ReactNode;
  onAction?: (action: CopilotAction) => void;
}

/**
 * Wrap your app shell with <CopilotSystem> to enable the global copilot.
 */
export const CopilotSystem: React.FC<CopilotSystemProps> = ({
  children,
  onAction,
}) => {
  return (
    <CopilotProvider onAction={onAction}>
      {children}
      <CopilotButton />
      <CopilotSheet />
    </CopilotProvider>
  );
};
