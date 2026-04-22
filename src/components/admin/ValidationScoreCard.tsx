import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Shield, 
  FileCheck, 
  Gauge, 
  FlaskConical,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ValidationResult } from '@/types/validation';

interface ValidationScoreCardProps {
  validation: ValidationResult | null;
  compact?: boolean;
}

const tierConfig = {
  auto_approve: { 
    label: 'Auto-Approve', 
    color: 'bg-green-500/10 text-green-700 border-green-200',
    icon: CheckCircle2 
  },
  quick_review: { 
    label: 'Quick Review', 
    color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    icon: FileCheck 
  },
  full_review: { 
    label: 'Full Review', 
    color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    icon: ListChecks 
  },
  escalated: { 
    label: 'Escalated', 
    color: 'bg-red-500/10 text-red-700 border-red-200',
    icon: AlertTriangle 
  },
};

const checkIcons = {
  fdaConsistency: Shield,
  requiredSections: ListChecks,
  unitValidation: Gauge,
  rateLimits: FlaskConical,
  completeness: FileCheck,
};

const checkLabels = {
  fdaConsistency: 'FDA Consistency',
  requiredSections: 'Required Sections',
  unitValidation: 'Unit Validation',
  rateLimits: 'Rate Limits',
  completeness: 'Completeness',
};

export function ValidationScoreCard({ validation, compact = false }: ValidationScoreCardProps) {
  if (!validation) {
    return (
      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground text-center">
          No validation data available. Run Smart Sync to validate.
        </p>
      </div>
    );
  }

  const TierIcon = tierConfig[validation.tier].icon;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{validation.score}%</span>
          <Badge className={cn('text-xs', tierConfig[validation.tier].color)}>
            <TierIcon className="w-3 h-3 mr-1" />
            {tierConfig[validation.tier].label}
          </Badge>
        </div>
        {validation.flags.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {validation.flags.filter(f => f.type === 'error').length} errors,{' '}
            {validation.flags.filter(f => f.type === 'warning').length} warnings
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Score Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold">{validation.score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <Badge className={cn('text-sm py-1 px-3', tierConfig[validation.tier].color)}>
            <TierIcon className="w-4 h-4 mr-2" />
            {tierConfig[validation.tier].label}
          </Badge>
        </div>
        <div className="text-right space-y-1">
          {validation.autoApproveEligible && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Auto-Approve Eligible
            </Badge>
          )}
          {validation.requiresPharmacistReview && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <Shield className="w-3 h-3 mr-1" />
              Pharmacist Review Required
            </Badge>
          )}
        </div>
      </div>

      {/* Check Details */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(validation.checks).map(([key, check]) => {
          const Icon = checkIcons[key as keyof typeof checkIcons];
          const label = checkLabels[key as keyof typeof checkLabels];
          
          return (
            <div 
              key={key} 
              className={cn(
                "p-3 rounded-lg border",
                check.passed ? "bg-green-50/50 border-green-200" : "bg-amber-50/50 border-amber-200"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn(
                  "w-4 h-4",
                  check.passed ? "text-green-600" : "text-amber-600"
                )} />
                <span className="text-sm font-medium">{label}</span>
                <span className={cn(
                  "ml-auto text-sm font-bold",
                  check.score >= 90 ? "text-green-600" : 
                  check.score >= 70 ? "text-amber-600" : "text-red-600"
                )}>
                  {check.score}%
                </span>
              </div>
              <Progress 
                value={check.score} 
                className="h-1.5"
              />
            </div>
          );
        })}
      </div>

      {/* Flags */}
      {validation.flags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Validation Flags ({validation.flags.length})
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {validation.flags.map((flag, idx) => (
              <div 
                key={idx}
                className={cn(
                  "flex items-start gap-2 p-2 rounded text-sm",
                  flag.type === 'error' && "bg-red-50 text-red-800",
                  flag.type === 'warning' && "bg-amber-50 text-amber-800",
                  flag.type === 'info' && "bg-blue-50 text-blue-800"
                )}
              >
                {flag.type === 'error' && <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {flag.type === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {flag.type === 'info' && <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                <div>
                  <span className="font-medium">[{flag.code}]</span> {flag.message}
                  {flag.section && (
                    <span className="text-xs ml-2 opacity-70">in {flag.section}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
