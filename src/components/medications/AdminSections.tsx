import { 
  Check, 
  X, 
  AlertTriangle, 
  Syringe, 
  Activity, 
  Timer, 
  Hand,
  Package,
  Pill,
  Clock,
  BookOpen,
  FileText,
  Stethoscope,
  Heart
} from 'lucide-react';
import { Medication } from '@/types/clinical';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AdminSectionsProps {
  medication: Medication;
}

const YesNo = ({ value, label }: { value: boolean | undefined; label: string }) => {
  if (value === undefined) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      {value ? (
        <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
          <Check className="w-4 h-4" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-sm text-red-500 font-medium">
          <X className="w-4 h-4" /> No
        </span>
      )}
    </div>
  );
};

const SectionCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 bg-muted/30 rounded-xl border border-border/30 ${className}`}>
    {children}
  </div>
);

const AdminSections = ({ medication }: AdminSectionsProps) => {
  const { 
    safe_method, 
    rate_dilution, 
    line_compatibility, 
    monitoring, 
    hold_parameters,
    required_resources,
    crushing_info,
    timing_rules,
    patient_education,
    red_flags,
    expected_effect,
    documentation_reminders
  } = medication;

  return (
    <Accordion type="multiple" defaultValue={['safe-method', 'red-flags']} className="space-y-3">
      {/* Safe Method */}
      {safe_method && (
        <AccordionItem value="safe-method" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <Syringe className="w-5 h-5 text-primary" />
              <span className="font-medium">Safe Method</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Preferred Method</span>
                  <span className="text-sm font-medium">{safe_method.preferred_method}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Push/Infusion Time</span>
                  <span className="text-sm font-medium">{safe_method.push_or_infusion_time}</span>
                </div>
                <YesNo value={safe_method.pump_required} label="Pump Required" />
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Rate & Dilution */}
      {rate_dilution && (
        <AccordionItem value="rate-dilution" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Rate & Dilution</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-2">
                {rate_dilution.iv_push_rate && (
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">IV Push Rate</span>
                    <span className="text-sm font-medium">{rate_dilution.iv_push_rate}</span>
                  </div>
                )}
                {rate_dilution.infusion_duration && (
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Infusion Duration</span>
                    <span className="text-sm font-medium">{rate_dilution.infusion_duration}</span>
                  </div>
                )}
                <YesNo value={rate_dilution.dilution_required} label="Dilution Required" />
                {rate_dilution.dilution_instructions && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Dilution Instructions</p>
                    <p className="text-sm">{rate_dilution.dilution_instructions}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Line Compatibility */}
      {line_compatibility && (
        <AccordionItem value="line-compatibility" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Line & Compatibility</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-2">
                <YesNo value={line_compatibility.peripheral_allowed} label="Peripheral Allowed" />
                <YesNo value={line_compatibility.central_preferred} label="Central Preferred" />
                <YesNo value={line_compatibility.dedicated_line_required} label="Dedicated Line Required" />
                <YesNo value={line_compatibility.flush_before_after} label="Flush Before/After" />
                {line_compatibility.y_site_restrictions && line_compatibility.y_site_restrictions.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Y-Site Restrictions</p>
                    <div className="flex flex-wrap gap-1">
                      {line_compatibility.y_site_restrictions.map((r, i) => (
                        <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Monitoring */}
      {monitoring && (
        <AccordionItem value="monitoring" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-green-500" />
              <span className="font-medium">Required Monitoring</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-2">
                <YesNo value={monitoring.vitals_required} label="Vitals Required" />
                <YesNo value={monitoring.cardiac_monitoring} label="Cardiac Monitoring" />
                <YesNo value={monitoring.oxygen_monitoring} label="Oxygen Monitoring" />
                <YesNo value={monitoring.neuro_checks} label="Neuro Checks" />
                {monitoring.timing && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Timing</span>
                    <span className="text-sm font-medium">{monitoring.timing}</span>
                  </div>
                )}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Hold Parameters */}
      {hold_parameters && (
        <AccordionItem value="hold-parameters" className="border rounded-xl overflow-hidden border-amber-200 dark:border-amber-800">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-amber-50 dark:hover:bg-amber-950/30">
            <div className="flex items-center gap-3">
              <Hand className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-700 dark:text-amber-400">Hold Parameters</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <div className="space-y-2">
                {hold_parameters.bp_limits && (
                  <div className="flex items-center justify-between py-2 border-b border-amber-200 dark:border-amber-800">
                    <span className="text-sm text-amber-700 dark:text-amber-400">Blood Pressure</span>
                    <span className="text-sm font-medium">{hold_parameters.bp_limits}</span>
                  </div>
                )}
                {hold_parameters.hr_limits && (
                  <div className="flex items-center justify-between py-2 border-b border-amber-200 dark:border-amber-800">
                    <span className="text-sm text-amber-700 dark:text-amber-400">Heart Rate</span>
                    <span className="text-sm font-medium">{hold_parameters.hr_limits}</span>
                  </div>
                )}
                {hold_parameters.rr_limits && (
                  <div className="flex items-center justify-between py-2 border-b border-amber-200 dark:border-amber-800">
                    <span className="text-sm text-amber-700 dark:text-amber-400">Respiratory Rate</span>
                    <span className="text-sm font-medium">{hold_parameters.rr_limits}</span>
                  </div>
                )}
                {hold_parameters.lab_limits && hold_parameters.lab_limits.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-amber-600 mb-2">Lab Value Limits</p>
                    <ul className="space-y-1">
                      {hold_parameters.lab_limits.map((lab, i) => (
                        <li key={i} className="text-sm">{lab}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Required Resources */}
      {required_resources && (
        <AccordionItem value="resources" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-indigo-500" />
              <span className="font-medium">Required Resources</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-2">
                <YesNo value={required_resources.iv_pump} label="IV Pump" />
                <YesNo value={required_resources.filter_required} label="Filter Required" />
                {required_resources.special_tubing && (
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Special Tubing</span>
                    <span className="text-sm font-medium">{required_resources.special_tubing}</span>
                  </div>
                )}
                {required_resources.ppe_required && (
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">PPE Required</span>
                    <span className="text-sm font-medium">{required_resources.ppe_required}</span>
                  </div>
                )}
                {required_resources.antidote && (
                  <div className="flex items-center justify-between py-2 bg-green-50 dark:bg-green-950/30 -mx-4 px-4 mt-2 rounded-b-lg">
                    <span className="text-sm text-green-700 dark:text-green-400">Antidote Available</span>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">{required_resources.antidote}</span>
                  </div>
                )}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Crushing Info */}
      {crushing_info && (
        <AccordionItem value="crushing" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-cyan-500" />
              <span className="font-medium">Crushing & Splitting</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-2">
                <YesNo value={crushing_info.crush_allowed} label="Crush Allowed" />
                <YesNo value={crushing_info.split_allowed} label="Split Allowed" />
                {crushing_info.do_not_crush_warning && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg mt-2 -mx-1">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">{crushing_info.do_not_crush_warning}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Timing Rules */}
      {timing_rules && (
        <AccordionItem value="timing" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="font-medium">Timing Rules</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-3">
                {timing_rules.food_interaction && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Food Interaction</p>
                    <p className="text-sm">{timing_rules.food_interaction}</p>
                  </div>
                )}
                {timing_rules.separation_from_meds && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Separation from Other Meds</p>
                    <p className="text-sm">{timing_rules.separation_from_meds}</p>
                  </div>
                )}
                {timing_rules.time_sensitive && (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-700 dark:text-orange-400">{timing_rules.time_sensitive}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Patient Education */}
      {patient_education && (
        <AccordionItem value="education" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-teal-500" />
              <span className="font-medium">Patient Education</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Purpose</p>
                  <p className="text-sm">{patient_education.purpose}</p>
                </div>
                {patient_education.expected_feelings && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">What Patient May Feel</p>
                    <p className="text-sm">{patient_education.expected_feelings}</p>
                  </div>
                )}
                {patient_education.report_immediately && patient_education.report_immediately.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Report Immediately</p>
                    <ul className="space-y-1">
                      {patient_education.report_immediately.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Red Flags */}
      {red_flags && (
        <AccordionItem value="red-flags" className="border-2 border-destructive/30 rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline bg-destructive/5 hover:bg-destructive/10">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="font-medium text-destructive">Red Flags</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 bg-destructive/5">
            <div className="space-y-4">
              {red_flags.early_danger_signs && red_flags.early_danger_signs.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-destructive mb-2">Early Danger Signs</p>
                  <ul className="space-y-2">
                    {red_flags.early_danger_signs.map((sign, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm p-2 bg-background/60 rounded-lg">
                        <span className="text-destructive">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {red_flags.immediate_action && red_flags.immediate_action.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-destructive mb-2">Immediate Action Required</p>
                  <ul className="space-y-2">
                    {red_flags.immediate_action.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm p-2 bg-background/80 rounded-lg border border-destructive/20">
                        <span className="text-destructive font-bold">{i + 1}.</span>
                        <span className="font-medium">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Expected Effect */}
      {expected_effect && (
        <AccordionItem value="expected-effect" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="font-medium">Expected Effect</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Onset Timeframe</span>
                  <span className="text-sm font-medium">{expected_effect.onset_timeframe}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Reassessment Target</span>
                  <span className="text-sm font-medium">{expected_effect.reassessment_target}</span>
                </div>
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Documentation Reminders */}
      {documentation_reminders && (
        <AccordionItem value="documentation" className="border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-500" />
              <span className="font-medium">Documentation Reminders</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SectionCard>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pre-Administration Assessment</p>
                  <p className="text-sm">{documentation_reminders.pre_admin_assessment}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monitoring Documented</p>
                  <p className="text-sm">{documentation_reminders.monitoring_documented}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Patient Response</p>
                  <p className="text-sm">{documentation_reminders.patient_response}</p>
                </div>
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default AdminSections;
