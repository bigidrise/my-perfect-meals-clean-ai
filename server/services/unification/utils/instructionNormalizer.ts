// Instruction Normalizer
// Converts any instruction format to UnifiedInstructions

import type { UnifiedInstructions } from '../types';

type LegacyInstructions = 
  | string
  | string[]
  | { step: number; text: string }[]
  | null
  | undefined;

export function normalizeInstructions(
  instructions: LegacyInstructions
): UnifiedInstructions {
  // Null or undefined
  if (!instructions) {
    return null;
  }

  // Already string
  if (typeof instructions === 'string') {
    return instructions;
  }

  // Array of strings
  if (Array.isArray(instructions)) {
    // Check if it's an array of objects with step/text
    if (instructions.length > 0 && typeof instructions[0] === 'object' && 'text' in instructions[0]) {
      return instructions.map((step: any) => step.text);
    }
    
    // Already array of strings
    return instructions.filter(i => typeof i === 'string');
  }

  // Fallback
  return null;
}
