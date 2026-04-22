import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, Activity, Hand, Zap } from 'lucide-react';
import { Medication } from '@/types/clinical';

interface QuickViewCardProps {
  medication: Medication;
}

const QuickViewCard = ({ medication }: QuickViewCardProps) => {
  const { safe_method, rate_dilution, monitoring, hold_parameters, red_flags } = medication;
  
  // Don't render if no quick view data available
  if (!safe_method && !rate_dilution && !monitoring && !hold_parameters && !red_flags) {
    return null;
  }

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Quick View</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Safe Method */}
          {safe_method && (
            <div className="flex items-start gap-3 p-3 bg-background/60 rounded-xl">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Safe Method</p>
                <p className="text-sm font-medium">{safe_method.preferred_method}</p>
                {safe_method.push_or_infusion_time && (
                  <p className="text-xs text-muted-foreground">{safe_method.push_or_infusion_time}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Rate */}
          {rate_dilution && (rate_dilution.iv_push_rate || rate_dilution.infusion_duration) && (
            <div className="flex items-start gap-3 p-3 bg-background/60 rounded-xl">
              <Activity className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Rate</p>
                <p className="text-sm font-medium">
                  {rate_dilution.iv_push_rate || rate_dilution.infusion_duration}
                </p>
              </div>
            </div>
          )}
          
          {/* Monitoring */}
          {monitoring && (
            <div className="flex items-start gap-3 p-3 bg-background/60 rounded-xl">
              <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Monitoring</p>
                <div className="flex flex-wrap gap-1">
                  {monitoring.vitals_required && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Vitals</span>}
                  {monitoring.cardiac_monitoring && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Cardiac</span>}
                  {monitoring.oxygen_monitoring && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">SpO2</span>}
                  {monitoring.neuro_checks && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Neuro</span>}
                </div>
                {monitoring.timing && (
                  <p className="text-xs text-muted-foreground mt-1">{monitoring.timing}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Hold Parameters */}
          {hold_parameters && (hold_parameters.bp_limits || hold_parameters.hr_limits || hold_parameters.rr_limits) && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
              <Hand className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-0.5">Hold Parameters</p>
                <div className="text-sm space-y-0.5">
                  {hold_parameters.bp_limits && <p className="text-amber-800 dark:text-amber-300">BP: {hold_parameters.bp_limits}</p>}
                  {hold_parameters.hr_limits && <p className="text-amber-800 dark:text-amber-300">HR: {hold_parameters.hr_limits}</p>}
                  {hold_parameters.rr_limits && <p className="text-amber-800 dark:text-amber-300">RR: {hold_parameters.rr_limits}</p>}
                </div>
              </div>
            </div>
          )}
          
          {/* Red Flags */}
          {red_flags && red_flags.early_danger_signs && red_flags.early_danger_signs.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-xl border border-destructive/20">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-destructive mb-1">Red Flags</p>
                <ul className="text-sm text-destructive/90 space-y-0.5">
                  {red_flags.early_danger_signs.slice(0, 3).map((sign, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-destructive">•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickViewCard;
