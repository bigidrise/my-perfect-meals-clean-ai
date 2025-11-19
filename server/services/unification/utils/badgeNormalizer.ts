// Badge Normalizer
// Converts any medical badge format to UnifiedMedicalBadge[]

import type { UnifiedMedicalBadge, BadgeLevel, MedicalCategory } from '../types';

type LegacyBadge = 
  | string
  | { label: string; level?: string; category?: string; reason?: string };

export function normalizeBadges(
  badges: LegacyBadge[] | string[] | undefined
): UnifiedMedicalBadge[] {
  if (!badges || !Array.isArray(badges)) {
    return [];
  }

  return badges.map(badge => {
    // String format: "Diabetic Friendly"
    if (typeof badge === 'string') {
      return {
        label: badge,
        level: inferBadgeLevel(badge),
        category: inferCategory(badge),
        reason: undefined
      };
    }

    // Object format (already rich)
    if (typeof badge === 'object' && 'label' in badge) {
      return {
        label: badge.label,
        level: (badge.level as BadgeLevel) || 'safe',
        category: (badge.category as MedicalCategory) || 'general',
        reason: badge.reason
      };
    }

    // Fallback
    return {
      label: 'Unknown',
      level: 'safe' as BadgeLevel,
      category: 'general' as MedicalCategory,
      reason: undefined
    };
  });
}

function inferBadgeLevel(label: string): BadgeLevel {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes('caution') || lowerLabel.includes('moderate')) {
    return 'caution';
  }
  if (lowerLabel.includes('warning') || lowerLabel.includes('high')) {
    return 'warning';
  }
  if (lowerLabel.includes('danger') || lowerLabel.includes('avoid')) {
    return 'danger';
  }
  
  return 'safe';
}

function inferCategory(label: string): MedicalCategory {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes('diabet')) return 'diabetes';
  if (lowerLabel.includes('heart') || lowerLabel.includes('cardiac')) return 'heart-health';
  if (lowerLabel.includes('kidney') || lowerLabel.includes('renal')) return 'kidney-health';
  if (lowerLabel.includes('allerg')) return 'allergies';
  if (lowerLabel.includes('gluten') || lowerLabel.includes('dairy') || lowerLabel.includes('vegan')) {
    return 'dietary-restriction';
  }
  if (lowerLabel.includes('keto') || lowerLabel.includes('paleo')) {
    return 'therapeutic-diet';
  }
  
  return 'general';
}
