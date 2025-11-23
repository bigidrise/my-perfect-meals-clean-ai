import { KnowledgeResponse } from "../CopilotContext";
import {
  findFeatureFromRegistry,
  findSubOptionByAlias,
  getHubPromptMessage,
  type FeatureDefinition,
} from "../CanonicalAliasRegistry";

/**
 * QueryProcessor - Unified query handler for both voice AND text inputs
 * 
 * This module provides a single processing pipeline that handles:
 * - Hub-first routing (Phase B locked logic)
 * - Feature matching via CanonicalAliasRegistry
 * - Sub-option selection within hubs
 * - Error fallback with suggested options
 * 
 * Used by:
 * - Voice input (via Whisper transcription)
 * - Text input (via CopilotInputBar)
 */

export interface QueryResult {
  success: boolean;
  route?: string;
  response?: KnowledgeResponse;
  needsRetry?: boolean;
  suggestedOptions?: string[];
  hubContext?: FeatureDefinition;
}

// Track active hub for sub-option navigation (shared state)
let currentHub: FeatureDefinition | null = null;

/**
 * Get current hub context
 */
export function getCurrentHub(): FeatureDefinition | null {
  return currentHub;
}

/**
 * Set current hub context (for hub navigation)
 */
export function setCurrentHub(hub: FeatureDefinition | null) {
  currentHub = hub;
}

/**
 * Clear current hub context
 */
export function clearCurrentHub() {
  currentHub = null;
}

/**
 * Main query processor - handles both voice and text inputs
 * Returns QueryResult with navigation info and response
 */
export async function processUserQuery(query: string): Promise<QueryResult> {
  console.log(`🔍 QueryProcessor: Processing query "${query}"`);

  const trimmedQuery = query.trim();
  
  // Empty query protection
  if (!trimmedQuery) {
    return {
      success: false,
      needsRetry: true,
      response: {
        title: "Empty Query",
        description: "I didn't catch that. Please try again or type your command.",
        spokenText: "I didn't hear anything. Please try again or type your command.",
      }
    };
  }

  const lower = trimmedQuery.toLowerCase();

  // ===================================
  // PHASE B: HUB-FIRST ROUTING SYSTEM (PRIORITY)
  // ===================================
  
  // Check if user is selecting a sub-option within current hub
  if (currentHub && currentHub.isHub && currentHub.subOptions) {
    const subOption = findSubOptionByAlias(currentHub, trimmedQuery);
    
    if (subOption) {
      console.log(`🎯 Sub-option selected: ${subOption.label} → ${subOption.route}`);
      
      // Clear hub context after navigation
      const route = subOption.route;
      currentHub = null;
      
      return {
        success: true,
        route,
        response: {
          title: `Opening ${subOption.label}`,
          description: `Navigating to ${subOption.label}`,
          spokenText: `Opening ${subOption.label}`
        }
      };
    }
    
    // User is in hub but didn't match a sub-option
    // Return suggested options instead of bouncing out
    const suggestedOptions = currentHub.subOptions.map(opt => opt.label);
    
    return {
      success: false,
      needsRetry: true,
      hubContext: currentHub,
      suggestedOptions,
      response: {
        title: `${currentHub.id.replace(/_/g, ' ')}`,
        description: `I didn't catch that. ${getHubPromptMessage(currentHub)}`,
        spokenText: `I didn't catch that. ${getHubPromptMessage(currentHub)}`
      }
    };
  }

  // Check for feature match in canonical registry
  const registryFeature = findFeatureFromRegistry(trimmedQuery);
  
  if (registryFeature) {
    console.log(`🔍 Registry match: ${registryFeature.id} → ${registryFeature.primaryRoute}`);
    
    // If it's a hub, store context and prompt for sub-option
    if (registryFeature.isHub) {
      currentHub = registryFeature;
      
      const promptMessage = getHubPromptMessage(registryFeature);
      
      return {
        success: true,
        route: registryFeature.primaryRoute,
        hubContext: registryFeature,
        response: {
          title: `${registryFeature.id.replace(/_/g, ' ')}`,
          description: promptMessage,
          spokenText: promptMessage
        }
      };
    }
    
    // Direct page - clear hub context and provide confirmation
    currentHub = null;
    
    return {
      success: true,
      route: registryFeature.primaryRoute,
      response: {
        title: `Opening ${registryFeature.id.replace(/_/g, ' ')}`,
        description: `Navigating to ${registryFeature.primaryRoute}`,
        spokenText: `Opening ${registryFeature.id.replace(/_/g, ' ').toLowerCase()}`
      }
    };
  }

  // No match found - suggest retry with text input
  return {
    success: false,
    needsRetry: true,
    response: {
      title: "Not Found",
      description: "I couldn't find that feature. Try saying it again or type the feature name.",
      spokenText: "I couldn't find that feature. Try saying it again or type the feature name.",
    }
  };
}

/**
 * Check if query is likely mis-transcribed (for voice fallback)
 */
export function isLikelyMisheard(transcript: string, confidence?: number): boolean {
  // Empty or very short transcripts
  if (!transcript || transcript.trim().length < 2) {
    return true;
  }
  
  // Low confidence score from Whisper
  if (confidence !== undefined && confidence < 0.5) {
    return true;
  }
  
  // Contains only gibberish characters
  const hasOnlyNonAlpha = !/[a-zA-Z]/.test(transcript);
  if (hasOnlyNonAlpha) {
    return true;
  }
  
  return false;
}
