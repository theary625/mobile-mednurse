import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { 
  User, Pill, Calculator, Route, Clock, 
  ChevronDown, AlertTriangle, Shield, CheckCircle2 
} from 'lucide-react';
import { Medication } from '@/types/clinical';
import { cn } from '@/lib/utils';

interface FiveRightsSafetyCheckProps {
  medication: Medication;
  selectedRoute?: string | null;
  compact?: boolean;
}

interface RightCardProps {
  icon: React.ReactNode;
  title: string;
  question: string;
  children: React.ReactNode;
  hasWarnings?: boolean;
  defaultOpen?: boolean;
}

const RightCard = ({ icon, title, question, children, hasWarnings, defaultOpen = false }: RightCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={cn(
        "border transition-all",
        hasWarnings 
          ? "border-destructive/40 bg-destructive/5" 
          : "border-border/50 bg-card/50"
      )}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                hasWarnings ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              )}>
                {icon}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasWarnings && (
                <Badge variant="destructive" className="text-xs">Alert</Badge>
              )}
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )} />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-3">
            <div className="pl-11 space-y-2 text-sm">
              {children}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

// Helper to safely access Record<string, unknown> fields
const getStringField = (obj: Record<string, unknown> | undefined, key: string): string | undefined => {
  if (!obj || typeof obj[key] !== 'string') return undefined;
  return obj[key] as string;
};

const getArrayField = (obj: Record<string, unknown> | undefined, key: string): string[] | undefined => {
  if (!obj || !Array.isArray(obj[key])) return undefined;
  return obj[key] as string[];
};

const FiveRightsSafetyCheck = ({ medication, selectedRoute, compact = false }: FiveRightsSafetyCheckProps) => {
  const { 
    generic_name, brand_names, drug_class, high_alert, controlled_substance,
    dosing_info, adjustments, safety_info, hold_parameters, monitoring,
    red_flags, route, timing_rules, rate_dilution, line_compatibility
  } = medication;

  // Safely extract nested values
  const renalAdjustment = getStringField(adjustments, 'renal_adjustment');
  const hepaticAdjustment = getStringField(adjustments, 'hepatic_adjustment');
  const contraindications = getArrayField(safety_info, 'contraindications');
  const standardDose = getStringField(dosing_info, 'standard_dose');
  const maxDose = getStringField(dosing_info, 'max_dose');
  const weightBased = getStringField(dosing_info, 'weight_based');
  const frequency = getStringField(dosing_info, 'frequency');

  // Determine warnings for each Right
  const patientWarnings = !!(
    hold_parameters || 
    renalAdjustment || 
    hepaticAdjustment ||
    (red_flags?.early_danger_signs && red_flags.early_danger_signs.length > 0)
  );

  const medicationWarnings = !!(high_alert || controlled_substance);
  
  const doseWarnings = !!(
    maxDose || 
    renalAdjustment || 
    hepaticAdjustment
  );

  const routeWarnings = !!(
    line_compatibility?.central_preferred ||
    line_compatibility?.dedicated_line_required ||
    (route && route.length > 1)
  );

  const timeWarnings = !!(
    timing_rules?.time_sensitive ||
    rate_dilution?.infusion_duration
  );

  if (compact) {
    return (
      <Card className="mb-4 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">5 Rights Safety Check</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { icon: User, label: "Patient", warn: patientWarnings },
              { icon: Pill, label: "Med", warn: medicationWarnings },
              { icon: Calculator, label: "Dose", warn: doseWarnings },
              { icon: Route, label: "Route", warn: routeWarnings },
              { icon: Clock, label: "Time", warn: timeWarnings },
            ].map(({ icon: Icon, label, warn }) => (
              <div 
                key={label}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg text-center",
                  warn ? "bg-destructive/10" : "bg-muted/50"
                )}
              >
                <Icon className={cn("w-4 h-4 mb-1", warn ? "text-destructive" : "text-muted-foreground")} />
                <span className="text-xs font-medium">{label}</span>
                {warn && <AlertTriangle className="w-3 h-3 text-destructive mt-1" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-primary">5 Rights Safety Check</h3>
      </div>

      {/* Right Patient */}
      <RightCard
        icon={<User className="w-4 h-4" />}
        title="Right Patient"
        question="Is this medication safe for THIS patient?"
        hasWarnings={patientWarnings}
        defaultOpen={patientWarnings}
      >
        {/* Hold Parameters - Always visible first */}
        {hold_parameters && (
          <div className="p-2 bg-warning/10 border border-warning/30 rounded-lg">
            <p className="font-medium text-warning-foreground text-xs mb-1">⚠️ Hold If:</p>
            <div className="space-y-0.5 text-xs">
              {hold_parameters.bp_limits && <p>BP: {hold_parameters.bp_limits}</p>}
              {hold_parameters.hr_limits && <p>HR: {hold_parameters.hr_limits}</p>}
              {hold_parameters.rr_limits && <p>RR: {hold_parameters.rr_limits}</p>}
              {hold_parameters.lab_limits && hold_parameters.lab_limits.length > 0 && (
                <p>Labs: {hold_parameters.lab_limits.join(', ')}</p>
              )}
            </div>
          </div>
        )}

        {/* Renal/Hepatic Adjustments */}
        {renalAdjustment && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Renal Adjustment: </span>
              <span className="text-muted-foreground">{renalAdjustment}</span>
            </div>
          </div>
        )}
        {hepaticAdjustment && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Hepatic Adjustment: </span>
              <span className="text-muted-foreground">{hepaticAdjustment}</span>
            </div>
          </div>
        )}

        {/* Safety Contraindications */}
        {contraindications && contraindications.length > 0 && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-destructive">Contraindicated: </span>
              <span className="text-muted-foreground">{contraindications.slice(0, 3).join(', ')}</span>
            </div>
          </div>
        )}

        {/* Red Flags */}
        {red_flags?.early_danger_signs && red_flags.early_danger_signs.length > 0 && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-destructive">Watch For: </span>
              <span className="text-muted-foreground">{red_flags.early_danger_signs.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        )}

        {!patientWarnings && (
          <p className="text-muted-foreground">No specific patient restrictions flagged.</p>
        )}
      </RightCard>

      {/* Right Medication */}
      <RightCard
        icon={<Pill className="w-4 h-4" />}
        title="Right Medication"
        question="Is this the correct drug?"
        hasWarnings={medicationWarnings}
        defaultOpen={medicationWarnings}
      >
        <div className="space-y-2">
          <div>
            <span className="font-medium">Generic: </span>
            <span className="text-foreground">{generic_name}</span>
          </div>
          
          {brand_names && brand_names.length > 0 && (
            <div>
              <span className="font-medium">Brand Names: </span>
              <span className="text-muted-foreground">{brand_names.join(', ')}</span>
            </div>
          )}

          {drug_class && (
            <div>
              <span className="font-medium">Class: </span>
              <span className="text-muted-foreground">{drug_class}</span>
            </div>
          )}

          {high_alert && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              High-Alert Medication
            </Badge>
          )}

          {controlled_substance && (
            <Badge variant="outline" className="text-xs border-warning text-warning">
              Controlled Substance
            </Badge>
          )}
        </div>
      </RightCard>

      {/* Right Dose */}
      <RightCard
        icon={<Calculator className="w-4 h-4" />}
        title="Right Dose"
        question="Is this the correct amount?"
        hasWarnings={doseWarnings}
        defaultOpen={doseWarnings}
      >
        {standardDose && (
          <div>
            <span className="font-medium">Standard Dose: </span>
            <span className="text-muted-foreground">{standardDose}</span>
          </div>
        )}

        {maxDose && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-destructive">Max Dose: </span>
              <span className="text-muted-foreground">{maxDose}</span>
            </div>
          </div>
        )}

        {weightBased && (
          <div>
            <span className="font-medium">Weight-Based: </span>
            <span className="text-muted-foreground">{weightBased}</span>
          </div>
        )}

        {frequency && (
          <div>
            <span className="font-medium">Frequency: </span>
            <span className="text-muted-foreground">{frequency}</span>
          </div>
        )}

        {!standardDose && !maxDose && (
          <p className="text-muted-foreground">See full dosing guidelines for details.</p>
        )}
      </RightCard>

      {/* Right Route */}
      <RightCard
        icon={<Route className="w-4 h-4" />}
        title="Right Route"
        question="Am I giving this the correct way?"
        hasWarnings={routeWarnings}
        defaultOpen={!!selectedRoute}
      >
        {route && route.length > 0 && (
          <div>
            <span className="font-medium">Approved Routes: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {route.map((r) => (
                <Badge 
                  key={r} 
                  variant={r === selectedRoute ? "default" : "outline"}
                  className="text-xs"
                >
                  {r}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {line_compatibility?.central_preferred && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
            <span className="font-medium text-warning">Central Line Preferred</span>
          </div>
        )}

        {line_compatibility?.dedicated_line_required && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
            <span className="font-medium text-destructive">Dedicated Line Required</span>
          </div>
        )}

        {line_compatibility?.peripheral_allowed && (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
            <span>Peripheral line acceptable</span>
          </div>
        )}

        {rate_dilution?.iv_push_rate && selectedRoute?.toUpperCase() === 'IV' && (
          <div>
            <span className="font-medium">IV Push Rate: </span>
            <span className="text-muted-foreground">{rate_dilution.iv_push_rate}</span>
          </div>
        )}
      </RightCard>

      {/* Right Time */}
      <RightCard
        icon={<Clock className="w-4 h-4" />}
        title="Right Time"
        question="Am I giving it at the right moment?"
        hasWarnings={timeWarnings}
        defaultOpen={timeWarnings}
      >
        {rate_dilution?.infusion_duration && (
          <div>
            <span className="font-medium">Infusion Duration: </span>
            <span className="text-muted-foreground">{rate_dilution.infusion_duration}</span>
          </div>
        )}

        {timing_rules?.time_sensitive && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-destructive">Time-Sensitive: </span>
              <span className="text-muted-foreground">{timing_rules.time_sensitive}</span>
            </div>
          </div>
        )}

        {timing_rules?.food_interaction && (
          <div>
            <span className="font-medium">Food: </span>
            <span className="text-muted-foreground">{timing_rules.food_interaction}</span>
          </div>
        )}

        {timing_rules?.separation_from_meds && (
          <div>
            <span className="font-medium">Separation: </span>
            <span className="text-muted-foreground">{timing_rules.separation_from_meds}</span>
          </div>
        )}

        {monitoring?.timing && (
          <div>
            <span className="font-medium">Monitoring Timing: </span>
            <span className="text-muted-foreground">{monitoring.timing}</span>
          </div>
        )}

        {!rate_dilution?.infusion_duration && !timing_rules?.time_sensitive && !timing_rules?.food_interaction && (
          <p className="text-muted-foreground">Standard timing applies. Check facility policy.</p>
        )}
      </RightCard>
    </div>
  );
};

export default FiveRightsSafetyCheck;
