import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useCopilot } from './CopilotContext';
// ❌ We no longer need guided mode here, so this import is removed
// import { useCopilotGuidedMode } from './CopilotGuidedModeContext';
import { getPageExplanation } from './CopilotPageExplanations';
import { getWalkthroughConfig } from './WalkthroughRegistry';

export function useCopilotPageExplanation() {
  const [pathname] = useLocation();
  const { isOpen, open, close, setLastResponse } = useCopilot();
  // ❌ Guided mode no longer gates explanations
  // const { isGuidedModeEnabled } = useCopilotGuidedMode();
  const lastExplainedPath = useRef<string | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // ✅ 1) Normalize the path: remove query params and trailing slashes
    const normalizedPath = pathname.replace(/\/+$/, '').split('?')[0];

    // Don’t re-run for the same path
    if (lastExplainedPath.current === normalizedPath) return;

    // If this page is running a full walkthrough "flow", don't also show a simple explanation
    const walkthroughConfig = getWalkthroughConfig(normalizedPath);
    if (walkthroughConfig && walkthroughConfig.mode === 'flow') {
      return;
    }

    // ✅ 2) Use normalizedPath instead of raw pathname
    const explanation = getPageExplanation(normalizedPath);
    if (!explanation) return;

    lastExplainedPath.current = normalizedPath;

    // Clear any previous auto-close timers
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    const triggerExplanation = () => {
      // Open Copilot if it's not already open
      if (!isOpen) {
        open();
      }

      // Small delay so the sheet is visually open before we push text/voice
      setTimeout(() => {
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

    const delay = setTimeout(triggerExplanation, 800);

    return () => {
      clearTimeout(delay);
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [pathname, isOpen, open, close, setLastResponse]);

  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);
}
