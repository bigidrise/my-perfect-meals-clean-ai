import { waitForElement, waitForNavigationReady } from "../WalkthroughEngine";
import type {
  WalkthroughScript,
  WalkthroughScriptStep,
  WalkthroughState,
  WalkthroughEvent,
  WalkthroughEventType,
} from "./WalkthroughTypes";

type WalkthroughEventListener = (event: WalkthroughEvent) => void;

export class WalkthroughScriptEngine {
  private script: WalkthroughScript | null = null;
  private currentStepIndex: number = 0;
  private listeners: WalkthroughEventListener[] = [];
  private actionListener: ((e: Event) => void) | null = null;
  private currentElement: Element | null = null;
  private isActive: boolean = false;

  /**
   * Start a walkthrough script
   */
  async start(script: WalkthroughScript): Promise<void> {
    if (this.isActive) {
      console.warn("[WalkthroughScriptEngine] Cannot start - walkthrough already active");
      return;
    }

    this.script = script;
    this.currentStepIndex = 0;
    this.isActive = true;

    this.emitEvent({
      type: "started",
      scriptId: script.id,
      stepIndex: 0,
    });

    await this.executeCurrentStep();
  }

  /**
   * Move to the next step
   */
  async next(): Promise<void> {
    if (!this.script || !this.isActive) {
      console.warn("[WalkthroughScriptEngine] Cannot advance - no active walkthrough");
      return;
    }

    this.cleanupCurrentStep();

    if (this.currentStepIndex < this.script.steps.length - 1) {
      this.currentStepIndex++;
      this.emitEvent({
        type: "step_changed",
        scriptId: this.script.id,
        stepIndex: this.currentStepIndex,
      });
      await this.executeCurrentStep();
    } else {
      this.complete();
    }
  }

  /**
   * Move to the previous step
   */
  async previous(): Promise<void> {
    if (!this.script || !this.isActive) {
      console.warn("[WalkthroughScriptEngine] Cannot go back - no active walkthrough");
      return;
    }

    this.cleanupCurrentStep();

    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.emitEvent({
        type: "step_changed",
        scriptId: this.script.id,
        stepIndex: this.currentStepIndex,
      });
      await this.executeCurrentStep();
    }
  }

  /**
   * Skip the current step
   */
  async skip(): Promise<void> {
    if (!this.script || !this.isActive) return;
    await this.next();
  }

  /**
   * Retry the current step
   */
  async retry(): Promise<void> {
    if (!this.script || !this.isActive) return;

    this.cleanupCurrentStep();
    await this.executeCurrentStep();
  }

  /**
   * Cancel the walkthrough
   */
  cancel(): void {
    if (!this.script || !this.isActive) return;

    const scriptId = this.script.id;
    this.cleanupCurrentStep();
    this.reset();

    this.emitEvent({
      type: "cancelled",
      scriptId,
    });
  }

  /**
   * Complete the walkthrough
   */
  private complete(): void {
    if (!this.script) return;

    const scriptId = this.script.id;
    this.cleanupCurrentStep();
    this.reset();

    this.emitEvent({
      type: "completed",
      scriptId,
    });
  }

  /**
   * Get current walkthrough state
   */
  getState(): WalkthroughState {
    return {
      isActive: this.isActive,
      scriptId: this.script?.id || null,
      currentStepIndex: this.currentStepIndex,
      totalSteps: this.script?.steps.length || 0,
      canGoNext: this.currentStepIndex < (this.script?.steps.length || 0) - 1,
      canGoPrevious: this.currentStepIndex > 0,
    };
  }

  /**
   * Get current step
   */
  getCurrentStep(): WalkthroughScriptStep | null {
    if (!this.script || !this.isActive) return null;
    return this.script.steps[this.currentStepIndex] || null;
  }

  /**
   * Subscribe to walkthrough events
   */
  addEventListener(listener: WalkthroughEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Execute the current step
   */
  private async executeCurrentStep(): Promise<void> {
    const step = this.getCurrentStep();
    if (!step) {
      this.emitError("No step to execute");
      return;
    }

    // Handle navigation requirement
    if (step.navigationPath) {
      try {
        await waitForNavigationReady(step.navigationPath, 5000);
      } catch (error) {
        console.warn(
          `[WalkthroughScriptEngine] Navigation timeout to ${step.navigationPath}`,
          error
        );
        this.emitError(`Navigation to ${step.navigationPath} failed`);
        return;
      }
    }

    // Handle target element
    if (step.target) {
      const element = await waitForElement(step.target, {
        timeout: 5000,
        retryInterval: 100,
      });

      if (!element) {
        console.warn(
          `[WalkthroughScriptEngine] Element not found: ${step.target}`
        );
        this.emitError(`Target element not found: ${step.target}`);
        return;
      }

      this.currentElement = element;

      // Setup action listener for auto-advance
      if (step.waitForAction && step.waitForAction !== "none") {
        this.setupActionListener(element, step.waitForAction);
      }
    }

    // Speak instruction if voice is enabled (placeholder for future integration)
    if (step.speak) {
      // TODO: Integrate with ElevenLabs voice system
      console.log(`[WalkthroughScriptEngine] Voice: ${step.speak}`);
    }
  }

  /**
   * Setup action listener for auto-advance
   */
  private setupActionListener(element: Element, actionType: string): void {
    this.actionListener = () => {
      setTimeout(() => {
        this.next();
      }, 300); // Small delay for UX smoothness
    };

    element.addEventListener(actionType, this.actionListener);
  }

  /**
   * Cleanup current step (remove listeners, etc.)
   */
  private cleanupCurrentStep(): void {
    if (this.actionListener && this.currentElement) {
      const step = this.getCurrentStep();
      if (step?.waitForAction) {
        this.currentElement.removeEventListener(
          step.waitForAction,
          this.actionListener
        );
      }
    }

    this.actionListener = null;
    this.currentElement = null;
  }

  /**
   * Reset engine state
   */
  private reset(): void {
    this.script = null;
    this.currentStepIndex = 0;
    this.isActive = false;
    this.currentElement = null;
    this.actionListener = null;
  }

  /**
   * Emit an event to all listeners
   */
  private emitEvent(event: WalkthroughEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Emit an error event
   */
  private emitError(error: string): void {
    if (!this.script) return;

    this.emitEvent({
      type: "error",
      scriptId: this.script.id,
      stepIndex: this.currentStepIndex,
      error,
    });
  }
}

// Global singleton instance
export const walkthroughEngine = new WalkthroughScriptEngine();
