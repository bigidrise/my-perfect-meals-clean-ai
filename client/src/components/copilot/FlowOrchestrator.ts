import { getWalkthroughConfig } from './WalkthroughRegistry';

type FlowMap = Record<string, string[]>;
type NavigationCallback = (path: string) => void;

const FLOW_SEQUENCES: FlowMap = {
  onboarding: ['/macro-counter', '/my-biometrics', '/weekly-meal-board'],
};

class FlowOrchestratorService {
  private currentFlowId: string | null = null;
  private currentStepIndex: number = 0;
  private listeners: Set<() => void> = new Set();
  private navigateCallback: NavigationCallback | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('macro:saved', () => this.handleFlowStepComplete('/macro-counter'));
      window.addEventListener('biometrics:weightSaved', () => this.handleFlowStepComplete('/my-biometrics'));
      window.addEventListener('mealBuilder:planGenerated', () => this.handleFlowStepComplete('/weekly-meal-board'));
      window.addEventListener('shoppingList:viewed', () => this.handleFlowStepComplete('/shopping-list-v2'));
    }
  }

  setNavigationCallback(callback: NavigationCallback) {
    this.navigateCallback = callback;
  }

  clearNavigationCallback() {
    this.navigateCallback = null;
  }

  startFlowIfNeeded(pathname: string): boolean {
    const config = getWalkthroughConfig(pathname);
    if (!config || config.mode !== 'flow' || !config.flowId) {
      return false;
    }

    const flowSequence = FLOW_SEQUENCES[config.flowId];
    if (!flowSequence) {
      return false;
    }

    const stepIndex = flowSequence.indexOf(pathname);
    if (stepIndex === -1) {
      return false;
    }

    this.currentFlowId = config.flowId;
    this.currentStepIndex = stepIndex;
    
    return true;
  }

  private handleFlowStepComplete(pathname: string): void {
    if (!this.currentFlowId) return;

    const flowSequence = FLOW_SEQUENCES[this.currentFlowId];
    if (!flowSequence) return;

    const currentPath = flowSequence[this.currentStepIndex];
    if (currentPath !== pathname) return;

    const nextIndex = this.currentStepIndex + 1;
    if (nextIndex < flowSequence.length) {
      const nextPath = flowSequence[nextIndex];
      this.currentStepIndex = nextIndex;
      
      setTimeout(() => {
        if (this.navigateCallback) {
          this.navigateCallback(nextPath);
        } else if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('flow-navigate', { detail: { path: nextPath } }));
        }
      }, 1000);
    } else {
      this.currentFlowId = null;
      this.currentStepIndex = 0;
      this.notifyListeners();
    }
  }

  isInFlow(): boolean {
    return this.currentFlowId !== null;
  }

  getCurrentFlowId(): string | null {
    return this.currentFlowId;
  }

  resetFlow(): void {
    this.currentFlowId = null;
    this.currentStepIndex = 0;
    this.notifyListeners();
  }

  onFlowChange(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(cb => cb());
  }
}

export const flowOrchestrator = new FlowOrchestratorService();
