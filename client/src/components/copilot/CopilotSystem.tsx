import React, { useEffect } from "react";
import { CopilotProvider, CopilotAction, useCopilot } from "./CopilotContext";
import { CopilotButton } from "./CopilotButton";
import { CopilotSheet } from "./CopilotSheet";
import { executeCommand, setResponseHandler } from "./CopilotCommandRegistry";

interface CopilotSystemProps {
  children: React.ReactNode;
  onAction?: (action: CopilotAction) => void | Promise<void>;
}

const CopilotSystemInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setLastResponse } = useCopilot();

  useEffect(() => {
    setResponseHandler((response) => {
      console.log("📖 Setting knowledge response:", response?.title);
      setLastResponse(response);
    });
  }, [setLastResponse]);

  return (
    <>
      {children}
      <CopilotSheet />
    </>
  );
};

export const CopilotSystem: React.FC<CopilotSystemProps> = ({ 
  children,
  onAction: customOnAction,
}) => {
  const handleAction = async (action: CopilotAction) => {
    await executeCommand(action);
    
    if (customOnAction) {
      await customOnAction(action);
    }
  };

  return (
    <CopilotProvider onAction={handleAction}>
      <CopilotSystemInner>
        {children}
      </CopilotSystemInner>
    </CopilotProvider>
  );
};
