export type WalkthroughActionType = "click" | "input" | "change" | "blur" | "navigation" | "none";

export interface WalkthroughScriptStep {
  id: string;
  target?: string;
  description: string;
  speak?: string;
  waitForAction?: WalkthroughActionType;
  navigationPath?: string;
}

export interface WalkthroughScript {
  id: string;
  title: string;
  steps: WalkthroughScriptStep[];
}

export interface WalkthroughState {
  isActive: boolean;
  scriptId: string | null;
  currentStepIndex: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export type WalkthroughEventType = 
  | "started"
  | "step_changed"
  | "completed"
  | "cancelled"
  | "error";

export interface WalkthroughEvent {
  type: WalkthroughEventType;
  scriptId: string;
  stepIndex?: number;
  error?: string;
}
