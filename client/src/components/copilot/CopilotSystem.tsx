import React, { useEffect } from "react";
import { CopilotProvider, CopilotAction, useCopilot } from "./CopilotContext";
import { CopilotButton } from "./CopilotButton";
import { CopilotSheet } from "./CopilotSheet";
import { executeCommand, setResponseHandler } from "./CopilotCommandRegistry";
import { SpotlightOverlay } from "./SpotlightOverlay";
import { useWalkthroughController } from "./walkthrough/useWalkthroughController";
import { registerCopilotCloser } from "./simple-walkthrough/simpleWalkthroughHelper";
import { CopilotGuidedModeProvider } from "./CopilotGuidedModeContext";
import { useCopilotPageExplanation } from "./useCopilotPageExplanation";

interface CopilotSystemProps {
  children: React.ReactNode;
  onAction?: (action: CopilotAction) => void | Promise<void>;
}

const CopilotSystemInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setLastResponse, close } = useCopilot();
  const walkthrough = useWalkthroughController();

  useCopilotPageExplanation();

  useEffect(() => {
    setResponseHandler((response) => {
      console.log("📖 Setting knowledge response:", response?.title);
      setLastResponse(response);
    });
  }, [setLastResponse]);

  // Register Copilot closer so simple walkthrough can hide it
  useEffect(() => {
    registerCopilotCloser(close);
  }, [close]);

  return (
    <>
      {children}
      <CopilotSheet />
      
      {/* Phase C.1: Spotlight Walkthrough System */}
      {walkthrough.state.isActive && walkthrough.currentSpotlightStep && (
        <SpotlightOverlay
          currentStep={walkthrough.currentSpotlightStep}
          onAdvance={walkthrough.next}
          onExit={walkthrough.cancel}
          canGoPrevious={false}
          canGoNext={true}
          onPrevious={() => {}}
        />
      )}
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
    <CopilotGuidedModeProvider>
      <CopilotProvider onAction={handleAction}>
        <CopilotSystemInner>
          {children}
        </CopilotSystemInner>
      </CopilotProvider>
    </CopilotGuidedModeProvider>
  );
};
