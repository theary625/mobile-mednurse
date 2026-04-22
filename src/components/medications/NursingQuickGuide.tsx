import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Clock, 
  Activity, 
  Hand, 
  Syringe,
  Stethoscope,
  Pill,
  CheckCircle2
} from 'lucide-react';
import { Medication } from '@/types/clinical';

interface NursingQuickGuideProps {
  medication: Medication;
  selectedRoute?: string | null;
}

const NursingQuickGuide = ({ medication, selectedRoute }: NursingQuickGuideProps) => {
  const { 
    safe_method, 
    rate_dilution, 
    monitoring, 
    hold_parameters, 
    red_flags,
    crushing_info,
    timing_rules,
    line_compatibility,
    required_resources
  } = medication;

  // Build the quick action items based on medication data
  const quickActions: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
    priority: 'critical' | 'warning' | 'info';
  }> = [];

  // Red flags first (critical)
  if (red_flags?.early_danger_signs?.length) {
    red_flags.early_danger_signs.slice(0, 2).forEach(sign => {
      quickActions.push({
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Watch for',
        value: sign,
        priority: 'critical'
      });
    });
  }

  // Hold parameters (warning)
  if (hold_parameters?.bp_limits) {
    quickActions.push({
      icon: <Hand className="w-4 h-4" />,
      label: 'Hold if BP',
      value: hold_parameters.bp_limits,
      priority: 'warning'
    });
  }
  if (hold_parameters?.hr_limits) {
    quickActions.push({
      icon: <Hand className="w-4 h-4" />,
      label: 'Hold if HR',
      value: hold_parameters.hr_limits,
      priority: 'warning'
    });
  }

  // Monitoring requirements (info)
  if (monitoring?.vitals_required) {
    quickActions.push({
      icon: <Stethoscope className="w-4 h-4" />,
      label: 'Check vitals',
      value: monitoring.timing || 'Before and after',
      priority: 'info'
    });
  }

  // Administration method
  if (safe_method?.preferred_method) {
    quickActions.push({
      icon: <Syringe className="w-4 h-4" />,
      label: 'Method',
      value: safe_method.preferred_method,
      priority: 'info'
    });
  }

  // Rate information
  if (rate_dilution?.iv_push_rate) {
    quickActions.push({
      icon: <Clock className="w-4 h-4" />,
      label: 'Rate',
      value: rate_dilution.iv_push_rate,
      priority: 'info'
    });
  } else if (rate_dilution?.infusion_duration) {
    quickActions.push({
      icon: <Clock className="w-4 h-4" />,
      label: 'Infuse over',
      value: rate_dilution.infusion_duration,
      priority: 'info'
    });
  }

  // Crushing info for PO route
  if ((selectedRoute === 'PO' || !selectedRoute) && crushing_info) {
    if (!crushing_info.crush_allowed && crushing_info.do_not_crush_warning) {
      quickActions.push({
        icon: <Pill className="w-4 h-4" />,
        label: 'Do NOT crush',
        value: crushing_info.do_not_crush_warning,
        priority: 'critical'
      });
    }
  }

  // Timing rules
  if (timing_rules?.food_interaction) {
    quickActions.push({
      icon: <Clock className="w-4 h-4" />,
      label: 'Timing',
      value: timing_rules.food_interaction,
      priority: 'info'
    });
  }

  const getPriorityStyles = (priority: 'critical' | 'warning' | 'info') => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200';
      case 'info':
        return 'bg-primary/5 border-primary/20 text-foreground';
    }
  };

  const getIconStyles = (priority: 'critical' | 'warning' | 'info') => {
    switch (priority) {
      case 'critical':
        return 'text-destructive';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      case 'info':
        return 'text-primary';
    }
  };

  // If no quick actions available, show fallback
  if (quickActions.length === 0) {
    return (
      <Card className="border-2 border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Quick Nursing Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No specific nursing guidance available. Refer to facility protocols.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Quick Nursing Guide
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Essential bedside reminders for safe administration
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-xl border ${getPriorityStyles(action.priority)}`}
            >
              <div className={`mt-0.5 flex-shrink-0 ${getIconStyles(action.priority)}`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {action.label}
                </p>
                <p className="text-sm font-medium mt-0.5">{action.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick checklist */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Pre-Administration Checklist
          </p>
          <div className="grid grid-cols-2 gap-2">
            {monitoring?.vitals_required && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>Vitals checked</span>
              </div>
            )}
            {monitoring?.cardiac_monitoring && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>On monitor</span>
              </div>
            )}
            {line_compatibility?.flush_before_after && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>Line flushed</span>
              </div>
            )}
            {required_resources?.iv_pump && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>Pump ready</span>
              </div>
            )}
            {medication.double_check_required && (
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>Double-check done</span>
              </div>
            )}
            {medication.high_alert && (
              <div className="flex items-center gap-2 text-xs text-amber-600">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>High-alert med</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NursingQuickGuide;
