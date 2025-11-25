import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const GUIDED_MODE_KEY = 'copilot_guided_mode';

interface CopilotGuidedModeContextValue {
  isGuidedModeEnabled: boolean;
  enableGuidedMode: () => void;
  disableGuidedMode: () => void;
  toggleGuidedMode: () => void;
}

const CopilotGuidedModeContext = createContext<CopilotGuidedModeContextValue | null>(null);

export function CopilotGuidedModeProvider({ children }: { children: React.ReactNode }) {
  const [isGuidedModeEnabled, setIsGuidedModeEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(GUIDED_MODE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const enableGuidedMode = useCallback(() => {
    setIsGuidedModeEnabled(true);
    localStorage.setItem(GUIDED_MODE_KEY, 'true');
    window.dispatchEvent(new CustomEvent('copilot-guided-mode-changed', { detail: { enabled: true } }));
  }, []);

  const disableGuidedMode = useCallback(() => {
    setIsGuidedModeEnabled(false);
    localStorage.setItem(GUIDED_MODE_KEY, 'false');
    window.dispatchEvent(new CustomEvent('copilot-guided-mode-changed', { detail: { enabled: false } }));
  }, []);

  const toggleGuidedMode = useCallback(() => {
    if (isGuidedModeEnabled) {
      disableGuidedMode();
    } else {
      enableGuidedMode();
    }
  }, [isGuidedModeEnabled, enableGuidedMode, disableGuidedMode]);

  return (
    <CopilotGuidedModeContext.Provider
      value={{
        isGuidedModeEnabled,
        enableGuidedMode,
        disableGuidedMode,
        toggleGuidedMode,
      }}
    >
      {children}
    </CopilotGuidedModeContext.Provider>
  );
}

export function useCopilotGuidedMode() {
  const context = useContext(CopilotGuidedModeContext);
  if (!context) {
    throw new Error("useCopilotGuidedMode must be used within CopilotGuidedModeProvider");
  }
  return context;
}
