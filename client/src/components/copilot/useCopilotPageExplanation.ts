import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { useLocation } from 'wouter';
import { useCopilot } from './CopilotContext';
import { getPageExplanation } from './CopilotPageExplanations';
import { CopilotExplanationStore } from './CopilotExplanationStore';
import { shouldAllowAutoOpen } from './CopilotRespectGuard';

export function useCopilotPageExplanation() {
  const [pathname] = useLocation();
  const { isOpen, open, close, setLastResponse } = useCopilot();
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const explanationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to explanation store changes
  const storeVersion = useSyncExternalStore(
    CopilotExplanationStore.subscribe.bind(CopilotExplanationStore),
    CopilotExplanationStore.getSnapshot.bind(CopilotExplanationStore)
  );

  // Normalize path helper
  const normalizePath = useCallback((path: string) => {
    return path.replace(/\/+$/, '').split('?')[0];
  }, []);

  // Main explanation effect
  useEffect(() => {
    if (!shouldAllowAutoOpen()) return;

    const normalizedPath = normalizePath(pathname);

    // Don't re-run for already explained paths
    if (CopilotExplanationStore.hasExplained(normalizedPath)) return;

    // Get page explanation
    const explanation = getPageExplanation(normalizedPath);
    if (!explanation) return;

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
      // Open Copilot if it's not already open
      if (!isOpen) {
        open();
      }

      // Small delay so the sheet is visually open before we push text/voice
      setTimeout(() => {
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
  }, [pathname, isOpen, open, close, setLastResponse, normalizePath, storeVersion]);

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
