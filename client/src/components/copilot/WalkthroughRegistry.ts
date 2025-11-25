type WalkthroughMode = 'flow' | 'page';

export interface WalkthroughConfig {
  mode: WalkthroughMode;
  scriptId?: string;
  flowId?: string;
  autoStartDelay?: number;
}

const registry: Record<string, WalkthroughConfig> = {};

const PAGE_SCRIPTS: Record<string, any[]> = {
  'restaurant-guide': [
    { selector: '[data-walkthrough="restaurant-list"]', text: 'Browse your saved restaurants', showArrow: true },
    { selector: '[data-walkthrough="add-restaurant"]', text: 'Add a new restaurant to your list', showArrow: true },
  ],
  'craving-creator': [
    { selector: '[data-walkthrough="craving-input"]', text: 'Describe what you re craving', showArrow: true },
    { selector: '[data-walkthrough="generate-meal"]', text: 'Generate a meal that satisfies your craving', showArrow: true },
  ],
  'shopping-list': [
    { selector: '[data-walkthrough="shopping-items"]', text: 'Your shopping list with all ingredients', showArrow: true },
    { selector: '[data-walkthrough="check-items"]', text: 'Check off items as you shop', showArrow: true },
  ],
};

export function getPageScript(scriptId: string): any[] | null {
  return PAGE_SCRIPTS[scriptId] || null;
}

export function registerWalkthrough(pathname: string, config: WalkthroughConfig): void {
  registry[pathname] = config;
}

export function getWalkthroughConfig(pathname: string): WalkthroughConfig | null {
  return registry[pathname] || null;
}

export function registerOnboardingFlow(): void {
  registerWalkthrough('/macro-counter', {
    mode: 'flow',
    flowId: 'onboarding',
    scriptId: 'macro-calculator',
    autoStartDelay: 500,
  });

  registerWalkthrough('/my-biometrics', {
    mode: 'flow',
    flowId: 'onboarding',
    scriptId: 'biometrics',
    autoStartDelay: 500,
  });

  registerWalkthrough('/weekly-meal-board', {
    mode: 'flow',
    flowId: 'onboarding',
    scriptId: 'weekly-meal-builder',
    autoStartDelay: 500,
  });

  registerWalkthrough('/shopping-list-v2', {
    mode: 'flow',
    flowId: 'onboarding',
    scriptId: 'shopping-list',
    autoStartDelay: 500,
  });
}

export function registerPageWalkthroughs(): void {
  registerWalkthrough('/restaurant-guide', {
    mode: 'page',
    scriptId: 'restaurant-guide',
    autoStartDelay: 500,
  });

  registerWalkthrough('/craving-creator', {
    mode: 'page',
    scriptId: 'craving-creator',
    autoStartDelay: 500,
  });

  registerWalkthrough('/shopping-list', {
    mode: 'page',
    scriptId: 'shopping-list',
    autoStartDelay: 500,
  });
}

registerOnboardingFlow();
registerPageWalkthroughs();
