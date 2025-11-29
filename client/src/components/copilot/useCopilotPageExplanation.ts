import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { useLocation } from 'wouter';
import { useCopilot } from './CopilotContext';
import { getPageExplanation } from './CopilotPageExplanations';
import { getWalkthroughConfig } from './WalkthroughRegistry';
import { walkthroughEngine } from './walkthrough/WalkthroughScriptEngine';
import { CopilotExplanationStore } from './CopilotExplanationStore';
import { shouldAllowAutoOpen } from './CopilotRespectGuard';

export function useCopilotPageExplanation() {
  const [pathname] = useLocation();
  const { isOpen, open, close, setLastResponse } = useCopilot();
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const explanationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to engine state changes via useSyncExternalStore
  const engineState = useSyncExternalStore(
    walkthroughEngine.subscribe.bind(walkthroughEngine),
    walkthroughEngine.getSnapshot.bind(walkthroughEngine)
  );

  // Subscribe to explanation store changes
  const storeVersion = useSyncExternalStore(
    CopilotExplanationStore.subscribe.bind(CopilotExplanationStore),
    CopilotExplanationStore.getSnapshot.bind(CopilotExplanationStore)
  );

  // Normalize path helper
  const normalizePath = useCallback((path: string) => {
    return path.replace(/\/+$/, '').split('?')[0];
  }, []);

  // Handle walkthrough completion - reset explained paths for matching scripts
  useEffect(() => {
    const unsubscribe = walkthroughEngine.addEventListener((event) => {
      if (event.type === 'completed' || event.type === 'cancelled') {
        CopilotExplanationStore.resetForScript(event.scriptId);
      }
    });
    return unsubscribe;
  }, []);

  // Main explanation effect
  useEffect(() => {
    // ╔═══════════════════════════════════════════════════════════════════════╗
    // ║  PROTECTED INVARIANT: Respect user's mode preference                  ║
    // ║  See CopilotRespectGuard.ts for details - DO NOT BYPASS              ║
    // ╚═══════════════════════════════════════════════════════════════════════╝
    if (!shouldAllowAutoOpen()) return;

    const normalizedPath = normalizePath(pathname);

    // Don't re-run for already explained paths
    if (CopilotExplanationStore.hasExplained(normalizedPath)) return;

    // Get page explanation
    const explanation = getPageExplanation(normalizedPath);
    if (!explanation) return;

    // Get walkthrough config for this page
    const walkthroughConfig = getWalkthroughConfig(normalizedPath);

    // Skip if THIS page's walkthrough script is currently active
    // Check engine state directly (includes 'starting' status)
    if (walkthroughConfig && 
        walkthroughConfig.scriptId && 
        engineState.isActive && 
        engineState.scriptId === walkthroughConfig.scriptId) {
      return;
    }

    // Clear any previous timers
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (explanationTimerRef.current) {
      clearTimeout(explanationTimerRef.current);
      explanationTimerRef.current = null;
    }

    const triggerExplanation = () => {
      // Re-check if this page's script is active
      const currentState = walkthroughEngine.getState();
      if (walkthroughConfig && 
          walkthroughConfig.scriptId && 
          currentState.isActive && 
          currentState.scriptId === walkthroughConfig.scriptId) {
        return;
      }

      // Open Copilot if it's not already open
      if (!isOpen) {
        open();
      }

      // Small delay so the sheet is visually open before we push text/voice
      setTimeout(() => {
        // Final check before pushing response
        const finalState = walkthroughEngine.getState();
        if (walkthroughConfig && 
            walkthroughConfig.scriptId && 
            finalState.isActive && 
            finalState.scriptId === walkthroughConfig.scriptId) {
          return;
        }

        // Mark path as explained ONLY after successfully firing
        CopilotExplanationStore.markExplained(normalizedPath);

        setLastResponse({
          title: explanation.title,
          description: explanation.description,
          spokenText: explanation.spokenText,
        });

        // Auto-close timing based on words (but never less than 7s)
        if (explanation.autoClose) {
          const wordCount = explanation.spokenText.split(' ').length;
          const estimatedDuration = Math.max(7000, wordCount * 400);

          autoCloseTimerRef.current = setTimeout(() => {
            close();
          }, estimatedDuration);
        }
      }, 300);
    };

    explanationTimerRef.current = setTimeout(triggerExplanation, 800);

    return () => {
      if (explanationTimerRef.current) {
        clearTimeout(explanationTimerRef.current);
        explanationTimerRef.current = null;
      }
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, [pathname, isOpen, open, close, setLastResponse, normalizePath, engineState, storeVersion]);

  // Cancel pending explanation only when THIS PAGE's flow starts
  useEffect(() => {
    if (!engineState.isActive || !explanationTimerRef.current) return;
    
    const normalizedPath = normalizePath(pathname);
    const walkthroughConfig = getWalkthroughConfig(normalizedPath);
    
    // Only cancel if the active script matches this page's script
    if (walkthroughConfig && 
        walkthroughConfig.scriptId && 
        engineState.scriptId === walkthroughConfig.scriptId) {
      clearTimeout(explanationTimerRef.current);
      explanationTimerRef.current = null;
    }
  }, [engineState.isActive, engineState.scriptId, pathname, normalizePath]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
      if (explanationTimerRef.current) {
        clearTimeout(explanationTimerRef.current);
      }
    };
  }, []);
}
