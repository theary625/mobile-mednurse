// Validation types for medication data quality assurance

export interface ValidationFlag {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  section?: string;
  details?: string;
}

export interface ValidationChecks {
  fdaConsistency: { passed: boolean; score: number; issues: string[] };
  requiredSections: { passed: boolean; score: number; missing: string[] };
  unitValidation: { passed: boolean; score: number; issues: string[] };
  rateLimits: { passed: boolean; score: number; issues: string[] };
  completeness: { passed: boolean; score: number; percentage: number };
}

export interface ValidationResult {
  score: number;
  tier: 'auto_approve' | 'quick_review' | 'full_review' | 'escalated';
  flags: ValidationFlag[];
  checks: ValidationChecks;
  autoApproveEligible: boolean;
  requiresPharmacistReview: boolean;
}

export type ReviewTier = ValidationResult['tier'];

export const TIER_CONFIG = {
  auto_approve: { 
    label: 'Auto-Approve', 
    color: 'bg-green-500/10 text-green-700 border-green-200',
    description: 'Standard medication with 95%+ validation score and no flags'
  },
  quick_review: { 
    label: 'Quick Review', 
    color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    description: 'Standard medication with 85-94% score'
  },
  full_review: { 
    label: 'Full Review', 
    color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    description: 'High-alert, controlled, or flagged content'
  },
  escalated: { 
    label: 'Escalated', 
    color: 'bg-red-500/10 text-red-700 border-red-200',
    description: 'Critical safety flags - requires pharmacist sign-off'
  },
} as const;
