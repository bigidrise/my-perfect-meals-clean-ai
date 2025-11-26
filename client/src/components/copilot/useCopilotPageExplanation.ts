import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useCopilot } from './CopilotContext';
import { useCopilotGuidedMode } from './CopilotGuidedModeContext';
import { getPageExplanation } from './CopilotPageExplanations';
import { getWalkthroughConfig } from './WalkthroughRegistry';

export function useCopilotPageExplanation() {
  const [pathname] = useLocation();
  const { isOpen, open, close, setLastResponse } = useCopilot();
  const { isGuidedModeEnabled } = useCopilotGuidedMode();
  const lastExplainedPath = useRef<string | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isGuidedModeEnabled) return;
    if (lastExplainedPath.current === pathname) return;

    const walkthroughConfig = getWalkthroughConfig(pathname);
    if (walkthroughConfig && walkthroughConfig.mode === 'flow') {
      return;
    }

    const explanation = getPageExplanation(pathname);
    if (!explanation) return;

    lastExplainedPath.current = pathname;

    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    const triggerExplanation = () => {
      if (!isOpen) {
        open();
      }

      setTimeout(() => {
        setLastResponse({
          title: explanation.title,
          description: explanation.description,
          spokenText: explanation.spokenText,
        });

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
  }, [pathname, isGuidedModeEnabled, isOpen, open, close, setLastResponse]);

  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);
}
