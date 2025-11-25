import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useSimpleWalkthrough } from "./SimpleWalkthroughContext";
import { getFlowById } from "./simpleWalkthroughFlows";

export function SimpleWalkthroughFlowController() {
  const [location] = useLocation();
  const { state, startWalkthrough, getCurrentPageSegment, advanceToNextPage } = useSimpleWalkthrough();
  const hasStartedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!state.activeFlowId) {
      hasStartedRef.current = null;
      return;
    }

    const flow = getFlowById(state.activeFlowId);
    if (!flow) return;

    const currentPage = flow.pages[state.currentPageIndex];
    if (!currentPage) return;

    if (location !== currentPage.route) {
      console.log("[FlowController] Not on expected route. Expected:", currentPage.route, "Got:", location);
      return;
    }

    const pageKey = `${state.activeFlowId}-${currentPage.pageId}-${state.currentPageIndex}`;
    if (hasStartedRef.current === pageKey) {
      console.log("[FlowController] Already started walkthrough for this page");
      return;
    }

    console.log("[FlowController] Starting walkthrough for page:", currentPage.pageId);
    
    const delay = setTimeout(() => {
      const steps = currentPage.steps.map(s => ({
        selector: s.selector,
        text: s.text,
        showArrow: s.showArrow
      }));
      
      startWalkthrough(currentPage.pageId, steps);
      hasStartedRef.current = pageKey;
    }, 500);

    return () => clearTimeout(delay);
  }, [location, state.activeFlowId, state.currentPageIndex, startWalkthrough]);

  useEffect(() => {
    const handleCompletionEvent = (event: CustomEvent<{ eventName: string }>) => {
      const { eventName } = event.detail;
      const currentPage = getCurrentPageSegment();
      
      if (currentPage && currentPage.completionEvent === eventName) {
        console.log("[FlowController] Completion event received:", eventName);
        advanceToNextPage();
      }
    };

    window.addEventListener('walkthrough:completion' as any, handleCompletionEvent);
    return () => window.removeEventListener('walkthrough:completion' as any, handleCompletionEvent);
  }, [getCurrentPageSegment, advanceToNextPage]);

  return null;
}

export function dispatchWalkthroughCompletion(eventName: string) {
  console.log("[FlowController] Dispatching completion:", eventName);
  const event = new CustomEvent('walkthrough:completion', {
    detail: { eventName }
  });
  window.dispatchEvent(event);
}
