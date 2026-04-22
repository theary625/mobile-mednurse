// Medication Data Validation Utility
// Defines validation rules for medication data completeness

export type ContentStatus = 'draft' | 'review' | 'approved';

export interface ValidationRule {
  field: string;
  label: string;
  required_for: ContentStatus[];
  category: 'critical' | 'required' | 'recommended';
  validate: (value: unknown) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];       // Critical errors that block save
  warnings: string[];     // Warnings that allow save
  missingFields: { field: string; label: string; category: string }[];
  completenessScore: number;
  totalFields: number;
  completedFields: number;
}

// Helper to check if a value is a non-empty object
const isNonEmptyObject = (v: unknown): boolean => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  return Object.keys(v as object).length > 0;
};

// Helper to check if a value is a non-empty array
const isNonEmptyArray = (v: unknown): boolean => {
  return Array.isArray(v) && v.length > 0;
};

// Helper to check if a value is a non-empty string
const isNonEmptyString = (v: unknown): boolean => {
  return typeof v === 'string' && v.trim().length > 0;
};

export const MEDICATION_VALIDATION_RULES: ValidationRule[] = [
  // Critical - Block save if missing
  { 
    field: 'generic_name', 
    label: 'Generic Name', 
    required_for: ['draft', 'review', 'approved'], 
    category: 'critical',
    validate: isNonEmptyString
  },
  
  // Required for Draft
  { 
    field: 'route', 
    label: 'Administration Routes', 
    required_for: ['draft', 'review', 'approved'], 
    category: 'required',
    validate: isNonEmptyArray
  },
  
  // Required for Review
  { 
    field: 'drug_class', 
    label: 'Drug Class', 
    required_for: ['review', 'approved'], 
    category: 'required',
    validate: isNonEmptyString
  },
  { 
    field: 'dosing_info', 
    label: 'Dosing Information', 
    required_for: ['review', 'approved'], 
    category: 'required',
    validate: isNonEmptyObject
  },
  { 
    field: 'safety_info', 
    label: 'Safety Information', 
    required_for: ['review', 'approved'], 
    category: 'required',
    validate: isNonEmptyObject
  },
  
  // Required for Approved (Nurse-Ready)
  { 
    field: 'nursing_guide', 
    label: 'Nursing Guide', 
    required_for: ['approved'], 
    category: 'required',
    validate: isNonEmptyObject
  },
  { 
    field: 'adverse_reactions', 
    label: 'Adverse Reactions', 
    required_for: ['approved'], 
    category: 'required',
    validate: isNonEmptyObject
  },
  { 
    field: 'hold_parameters', 
    label: 'Hold Parameters', 
    required_for: ['approved'], 
    category: 'required',
    validate: isNonEmptyObject
  },
  { 
    field: 'monitoring', 
    label: 'Monitoring Parameters', 
    required_for: ['approved'], 
    category: 'required',
    validate: isNonEmptyObject
  },
  { 
    field: 'patient_education', 
    label: 'Patient Education', 
    required_for: ['approved'], 
    category: 'required',
    validate: isNonEmptyObject
  },
  
  // Recommended (Warnings only)
  { 
    field: 'pharmacokinetics', 
    label: 'Pharmacokinetics', 
    required_for: [], 
    category: 'recommended',
    validate: isNonEmptyObject
  },
  { 
    field: 'clinical_pearls', 
    label: 'Clinical Pearls', 
    required_for: [], 
    category: 'recommended',
    validate: isNonEmptyArray
  },
  { 
    field: 'image_url', 
    label: 'Medication Image', 
    required_for: [], 
    category: 'recommended',
    validate: isNonEmptyString
  },
  { 
    field: 'pronunciation_text', 
    label: 'Pronunciation', 
    required_for: [], 
    category: 'recommended',
    validate: isNonEmptyString
  },
  { 
    field: 'brand_names', 
    label: 'Brand Names', 
    required_for: [], 
    category: 'recommended',
    validate: isNonEmptyArray
  },
  { 
    field: 'drug_interactions_info', 
    label: 'Drug Interactions', 
    required_for: [], 
    category: 'recommended',
    validate: isNonEmptyObject
  },
  { 
    field: 'administration_info', 
    label: 'Administration Info', 
    required_for: [], 
    category: 'recommended',
    validate: isNonEmptyObject
  },
  { 
    field: 'adjustments', 
    label: 'Dose Adjustments', 
    required_for: [], 
    category: 'recommended',
    validate: isNonEmptyObject
  },
];

/**
 * Validate a medication record against the validation rules
 */
export function validateMedication(
  medication: Record<string, unknown>,
  targetStatus: ContentStatus
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingFields: { field: string; label: string; category: string }[] = [];
  
  let completedFields = 0;
  const totalFields = MEDICATION_VALIDATION_RULES.length;

  for (const rule of MEDICATION_VALIDATION_RULES) {
    const value = medication[rule.field];
    const isValid = rule.validate(value);
    
    if (isValid) {
      completedFields++;
    } else {
      // Check if this field is required for the target status
      const isRequired = rule.required_for.includes(targetStatus);
      
      if (isRequired) {
        if (rule.category === 'critical') {
          errors.push(`${rule.label} is required`);
        } else {
          missingFields.push({ field: rule.field, label: rule.label, category: rule.category });
        }
      } else if (rule.category === 'recommended') {
        warnings.push(`${rule.label} is recommended for complete data`);
      }
    }
  }

  const completenessScore = Math.round((completedFields / totalFields) * 100);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingFields,
    completenessScore,
    totalFields,
    completedFields,
  };
}

/**
 * Get rules required for a specific status
 */
export function getRequiredFieldsForStatus(status: ContentStatus): ValidationRule[] {
  return MEDICATION_VALIDATION_RULES.filter(rule => rule.required_for.includes(status));
}

/**
 * Check if medication can be promoted to a higher status
 */
export function canPromoteToStatus(
  medication: Record<string, unknown>,
  targetStatus: ContentStatus
): { canPromote: boolean; blockers: string[] } {
  const result = validateMedication(medication, targetStatus);
  
  const blockers = [
    ...result.errors,
    ...result.missingFields.map(f => `Missing: ${f.label}`),
  ];

  return {
    canPromote: blockers.length === 0,
    blockers,
  };
}

/**
 * Get a color for the completeness score
 */
export function getCompletenessColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-amber-600';
  if (score >= 50) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get background color for completeness progress bar
 */
export function getCompletenessBgColor(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-amber-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-red-500';
}

/**
 * Calculate data quality metrics for a list of medications
 */
export function calculateDataQualityMetrics(medications: Record<string, unknown>[]): {
  complete: number;
  needsReview: number;
  incomplete: number;
  criticalGaps: number;
  averageScore: number;
  byStatus: Record<string, number>;
} {
  let complete = 0;
  let needsReview = 0;
  let incomplete = 0;
  let criticalGaps = 0;
  let totalScore = 0;
  const byStatus: Record<string, number> = { draft: 0, review: 0, approved: 0 };

  for (const med of medications) {
    const status = (med.content_status as ContentStatus) || 'draft';
    byStatus[status] = (byStatus[status] || 0) + 1;
    
    const result = validateMedication(med, status);
    totalScore += result.completenessScore;
    
    if (result.completenessScore >= 90) {
      complete++;
    } else if (result.completenessScore >= 70) {
      needsReview++;
    } else if (result.completenessScore >= 50) {
      incomplete++;
    } else {
      criticalGaps++;
    }
  }

  return {
    complete,
    needsReview,
    incomplete,
    criticalGaps,
    averageScore: medications.length > 0 ? Math.round(totalScore / medications.length) : 0,
    byStatus,
  };
}
