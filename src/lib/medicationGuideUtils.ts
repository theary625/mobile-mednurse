import { Medication, NursingGuideRouteContent } from '@/types/clinical';
import { IVMethod } from '@/components/medications/IVMethodSelector';

/**
 * Drug classes where IV Push is NEVER appropriate for routine use
 * These are continuous infusion-only medications
 */
const INFUSION_ONLY_DRUG_CLASSES = [
  'vasopressor',
  'vasopressors',
  'inotrope',
  'inotropes',
  'catecholamine',
  'catecholamines',
];

/**
 * Specific medications that should NEVER be given IV Push
 * Even if nursing_guide has an IV_Push entry (for cardiac arrest), 
 * we hide it from routine selection
 */
const NO_PUSH_MEDICATIONS = [
  'norepinephrine',
  'levophed',
  'epinephrine', // except for anaphylaxis/cardiac arrest - handled separately
  'dopamine',
  'dobutamine',
  'vasopressin',
  'phenylephrine',
  'milrinone',
  'amiodarone', // IV push only in VF/pulseless VT
];

/**
 * Checks if a medication should restrict IV Push from being shown
 */
function shouldRestrictIVPush(medication: Medication): boolean {
  const genericName = medication.generic_name?.toLowerCase() || '';
  const drugClass = (medication.drug_class?.toLowerCase() || '');
  
  // Check if it's a known infusion-only drug class
  if (INFUSION_ONLY_DRUG_CLASSES.some(cls => drugClass.includes(cls))) {
    return true;
  }
  
  // Check specific medication names
  if (NO_PUSH_MEDICATIONS.some(name => genericName.includes(name))) {
    return true;
  }
  
  return false;
}

/**
 * Detects available IV methods from a medication's nursing_guide
 * Looks for keys like IV_Push, IV_Infusion, IV_Piggyback, IV_Drip
 * Applies safety filtering to hide inappropriate methods
 */
export function getAvailableIVMethods(medication: Medication): IVMethod[] {
  const methods: IVMethod[] = [];
  const guide = medication.nursing_guide as Record<string, unknown> | undefined;
  const adminInfo = medication.administration_info as Record<string, unknown> | undefined;
  
  if (!guide && !adminInfo) return methods;

  const restrictPush = shouldRestrictIVPush(medication);

  // Check nursing_guide for IV method keys
  if (guide) {
    const keys = Object.keys(guide).map(k => k.toLowerCase());
    
    // Only add Push if NOT restricted
    if (!restrictPush && keys.some(k => k === 'iv_push' || k === 'ivpush' || k === 'iv push')) {
      methods.push('Push');
    }
    if (keys.some(k => k === 'iv_infusion' || k === 'ivinfusion' || k === 'iv_drip' || k === 'ivdrip' || k === 'iv')) {
      methods.push('Infusion');
    }
    if (keys.some(k => k === 'iv_piggyback' || k === 'ivpiggyback' || k === 'ivpb')) {
      methods.push('Piggyback');
    }
  }

  // Also check administration_info.IV.methods for legacy support
  if (adminInfo?.IV && typeof adminInfo.IV === 'object') {
    const ivInfo = adminInfo.IV as Record<string, unknown>;
    if (ivInfo.methods && typeof ivInfo.methods === 'object') {
      const methodKeys = Object.keys(ivInfo.methods as Record<string, unknown>).map(k => k.toLowerCase());
      
      // Only add Push if NOT restricted
      if (!restrictPush && methodKeys.some(k => k.includes('push')) && !methods.includes('Push')) {
        methods.push('Push');
      }
      if (methodKeys.some(k => k.includes('drip') || k.includes('infusion')) && !methods.includes('Infusion')) {
        methods.push('Infusion');
      }
      if (methodKeys.some(k => k.includes('piggyback')) && !methods.includes('Piggyback')) {
        methods.push('Piggyback');
      }
    }
  }

  return methods;
}

/**
 * Converts an IV method to the corresponding nursing_guide key
 */
export function getIVMethodKey(method: IVMethod): string {
  switch (method) {
    case 'Push':
      return 'IV_Push';
    case 'Infusion':
      return 'IV_Infusion';
    case 'Piggyback':
      return 'IV_Piggyback';
    default:
      return 'IV';
  }
}

/**
 * Computes the effective route key for looking up nursing_guide data
 * Combines the base route with IV method when applicable
 */
export function getEffectiveRouteKey(
  route: string | null | undefined, 
  ivMethod: IVMethod | null
): string | null {
  if (!route) return null;
  
  // If it's an IV route and we have a specific method selected
  if (route.toUpperCase() === 'IV' && ivMethod) {
    return getIVMethodKey(ivMethod);
  }
  
  return route;
}

/**
 * Resolves guide data from nursing_guide, trying multiple key formats
 */
export function resolveGuideData(
  medication: Medication, 
  routeKey: string | null
): NursingGuideRouteContent | null {
  if (!medication.nursing_guide || !routeKey) return null;
  
  const guide = medication.nursing_guide as Record<string, unknown>;
  const normalizedKey = routeKey.toLowerCase().replace(/\s+/g, '_');
  
  // Try exact match first
  for (const key of Object.keys(guide)) {
    if (key.toLowerCase() === normalizedKey) {
      return guide[key] as NursingGuideRouteContent;
    }
  }
  
  // Try variations
  const variations = [
    routeKey,
    routeKey.toUpperCase(),
    routeKey.toLowerCase(),
    normalizedKey,
    normalizedKey.replace(/_/g, ''),
  ];
  
  for (const variant of variations) {
    if (guide[variant]) {
      return guide[variant] as NursingGuideRouteContent;
    }
  }
  
  // For IV methods, fall back to generic IV if specific method not found
  if (normalizedKey.startsWith('iv_')) {
    const ivVariations = ['IV', 'iv', 'Iv'];
    for (const v of ivVariations) {
      if (guide[v]) {
        return guide[v] as NursingGuideRouteContent;
      }
    }
  }
  
  return null;
}

/**
 * Gets display information for an IV method
 */
export function getIVMethodDisplayInfo(method: IVMethod): {
  label: string;
  description: string;
  color: string;
} {
  switch (method) {
    case 'Push':
      return {
        label: 'IV Push',
        description: 'Direct bolus injection',
        color: 'amber',
      };
    case 'Infusion':
      return {
        label: 'IV Infusion',
        description: 'Continuous drip',
        color: 'blue',
      };
    case 'Piggyback':
      return {
        label: 'IV Piggyback',
        description: 'Secondary line infusion',
        color: 'emerald',
      };
    default:
      return {
        label: 'IV',
        description: 'Intravenous',
        color: 'primary',
      };
  }
}

/**
 * Checks if a route is an IV route
 */
export function isIVRoute(route: string | null | undefined): boolean {
  if (!route) return false;
  const upper = route.toUpperCase();
  return upper === 'IV' || upper.startsWith('IV_') || upper.startsWith('IV ');
}
