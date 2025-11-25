/**
 * Multi-Page Walkthrough Flow Configuration
 * 
 * Defines the complete walkthrough journey across multiple pages:
 * 1. Macro Calculator → 2. Biometrics → 3. Weekly Meal Builder → 4. Shopping List
 */

export interface WalkthroughStep {
  selector: string;
  text?: string;
  showArrow?: boolean;
}

export interface PageSegment {
  route: string;
  pageId: string;
  steps: WalkthroughStep[];
  completionEvent?: string;
  nextRoute?: string;
  autoNavigate?: boolean;
}

export interface WalkthroughFlow {
  id: string;
  name: string;
  pages: PageSegment[];
}

export const ONBOARDING_FLOW: WalkthroughFlow = {
  id: 'onboarding',
  name: 'Getting Started',
  pages: [
    {
      route: '/macro-counter',
      pageId: 'macro-calculator',
      steps: [
        {
          selector: '#goal-card',
          text: 'Pick your fitness goal - weight loss, maintenance, or muscle gain',
          showArrow: true
        },
        {
          selector: '#bodytype-card',
          text: 'Pick your body type - ectomorph burns fast, mesomorph is balanced, endomorph holds weight',
          showArrow: true
        },
        {
          selector: '#details-card',
          text: 'Enter your stats - age, height, weight, and activity level',
          showArrow: true
        },
        {
          selector: '#set-targets-button',
          text: 'Tap here to save your personalized macros',
          showArrow: true
        }
      ],
      completionEvent: 'macro:saved',
      nextRoute: '/my-biometrics',
      autoNavigate: true
    },
    {
      route: '/my-biometrics',
      pageId: 'biometrics',
      steps: [
        {
          selector: '#save-weight-button, [data-testid="biometrics-save-weight-button"], [data-walkthrough="save-weight"]',
          text: 'Save your current body weight to track your progress',
          showArrow: true
        }
      ],
      completionEvent: 'biometrics:weightSaved',
      nextRoute: '/weekly-meal-board',
      autoNavigate: true
    },
    {
      route: '/weekly-meal-board',
      pageId: 'weekly-meal-builder',
      steps: [
        {
          selector: '[data-walkthrough="day-chip"], [data-testid="day-chip"], .day-chip',
          text: 'Pick a day to start planning your meals',
          showArrow: true
        },
        {
          selector: '[data-walkthrough="add-meal"], [data-testid="add-meal-button"], button:has(.plus-icon)',
          text: 'Tap to add a meal - breakfast, lunch, dinner, or snacks',
          showArrow: true
        }
      ],
      completionEvent: 'mealBuilder:planGenerated',
      nextRoute: '/shopping-list-v2',
      autoNavigate: true
    },
    {
      route: '/shopping-list-v2',
      pageId: 'shopping-list',
      steps: [
        {
          selector: '[data-walkthrough="shopping-list-items"], [data-testid="shopping-list-items"], .shopping-list-content',
          text: 'Here is your shopping list with all ingredients for your meal plan',
          showArrow: true
        },
        {
          selector: '[data-walkthrough="start-shopping"], [data-testid="start-shopping-button"], .start-shopping-btn',
          text: 'Ready to shop? Check items as you go or come back later!',
          showArrow: true
        }
      ],
      completionEvent: 'shoppingList:viewed'
    }
  ]
};

export const ALL_FLOWS: Record<string, WalkthroughFlow> = {
  'onboarding': ONBOARDING_FLOW
};

export function getFlowById(flowId: string): WalkthroughFlow | undefined {
  return ALL_FLOWS[flowId];
}

export function getPageSegment(flowId: string, route: string): PageSegment | undefined {
  const flow = getFlowById(flowId);
  if (!flow) return undefined;
  return flow.pages.find(p => p.route === route);
}

export function getNextPageSegment(flowId: string, currentRoute: string): PageSegment | undefined {
  const flow = getFlowById(flowId);
  if (!flow) return undefined;
  const currentIndex = flow.pages.findIndex(p => p.route === currentRoute);
  if (currentIndex === -1 || currentIndex >= flow.pages.length - 1) return undefined;
  return flow.pages[currentIndex + 1];
}
