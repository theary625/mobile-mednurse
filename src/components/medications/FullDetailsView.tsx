import { 
  ChevronDown,
  Pill,
  Beaker,
  AlertTriangle,
  Shield,
  Syringe,
  Clock,
  Activity,
  FileText,
  Users,
  Heart,
  ExternalLink,
  BookOpen,
  FlaskConical,
  Stethoscope,
  Package,
  Zap,
  CircleAlert,
  Info
} from 'lucide-react';
import { Medication } from '@/types/clinical';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FullDetailsViewProps {
  medication: Medication;
}

// Visibility settings from admin panel
interface VisibilitySettings {
  hide_dosing?: boolean;
  hide_adjustments?: boolean;
  hide_safety_info?: boolean;
  hide_pharmacokinetics?: boolean;
  hide_adverse_reactions?: boolean;
  hide_drug_interactions?: boolean;
  hide_red_flags?: boolean;
  hide_administration?: boolean;
  hide_monitoring?: boolean;
  hide_hold_parameters?: boolean;
  hide_timing_rules?: boolean;
  hide_crushing?: boolean;
  hide_patient_education?: boolean;
  hide_resources?: boolean;
  hide_documentation?: boolean;
  hide_clinical_pearls?: boolean;
}

interface DetailSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'warning' | 'critical';
}

const DetailSection = ({ title, icon, children, defaultOpen = true, variant = 'default' }: DetailSectionProps) => {
  const getBorderStyle = () => {
    switch (variant) {
      case 'critical':
        return 'border-destructive/30';
      case 'warning':
        return 'border-amber-300 dark:border-amber-700';
      default:
        return 'border-border';
    }
  };

  const getHeaderStyle = () => {
    switch (variant) {
      case 'critical':
        return 'bg-destructive/5 hover:bg-destructive/10';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50';
      default:
        return 'bg-muted/30 hover:bg-muted/50';
    }
  };

  const getIconStyle = () => {
    switch (variant) {
      case 'critical':
        return 'text-destructive';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-primary';
    }
  };

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <div className={`border rounded-xl overflow-hidden ${getBorderStyle()}`}>
        <CollapsibleTrigger className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${getHeaderStyle()} group`}>
          <div className="flex items-center gap-3">
            <span className={getIconStyle()}>{icon}</span>
            <span className="font-medium text-sm">{title}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-[-90deg]" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 py-4 bg-background border-t border-border/50">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// Component to show placeholder for missing data
const MissingDataPlaceholder = ({ sectionName }: { sectionName: string }) => (
  <div className="border border-dashed border-muted-foreground/30 rounded-xl p-4 bg-muted/10">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Info className="w-4 h-4" />
      <p className="text-sm">{sectionName} information not yet available for this medication</p>
    </div>
  </div>
);

const DataRow = ({ label, value }: { label: string; value: string | undefined | null }) => {
  if (!value) return null;
  return (
    <div className="py-2 border-b border-border/30 last:border-0">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
};

const DataList = ({ label, items }: { label: string; items: string[] | undefined }) => {
  if (!items?.length) return null;
  return (
    <div className="py-2 border-b border-border/30 last:border-0">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FullDetailsView = ({ medication }: FullDetailsViewProps) => {
  const {
    dosing_info,
    adjustments,
    safety_info,
    administration_info,
    clinical_pearls,
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

  // Parse JSON fields if they exist
  const dosing = dosing_info as Record<string, unknown> | undefined;
  const adjusts = adjustments as Record<string, unknown> | undefined;
  const safety = safety_info as Record<string, unknown> | undefined;
  const admin = administration_info as Record<string, unknown> | undefined;
  const pharmacokinetics = (medication as any).pharmacokinetics as Record<string, unknown> | undefined;
  const adverseReactions = (medication as any).adverse_reactions as Record<string, unknown> | undefined;
  const drugInteractions = (medication as any).drug_interactions_info as Record<string, unknown> | undefined;
  
  // Extract visibility settings from medication data
  const visibility = (medication as any).visibility_settings as VisibilitySettings | undefined;


  // Format keys for display
  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace('Iv ', 'IV ')
      .replace('Im ', 'IM ')
      .replace('Po ', 'PO ')
      .replace(' Im', ' IM')
      .replace(' Iv', ' IV');
  };

  // Render indication/dosing subsection with better formatting
  const renderIndicationCard = (key: string, data: Record<string, unknown>) => {
    const title = formatKey(key);
    return (
      <div key={key} className="bg-muted/30 rounded-lg p-3 mb-3 last:mb-0">
        <h4 className="font-medium text-sm text-primary mb-2">{title}</h4>
        <div className="space-y-2">
          {Object.entries(data).map(([subKey, value]) => {
            if (typeof value === 'string') {
              return (
                <div key={subKey}>
                  <span className="text-xs text-muted-foreground">{formatKey(subKey)}:</span>
                  <p className="text-sm mt-0.5">{value}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const renderObjectContent = (obj: Record<string, unknown> | undefined, depth = 0, isIndication = false) => {
    if (!obj) return null;
    
    return (
      <div className={`space-y-2 ${depth > 0 ? 'ml-4 mt-2' : ''}`}>
        {Object.entries(obj).map(([key, value]) => {
          const formattedKey = formatKey(key);
          
          // Special handling for indications structure
          if (isIndication && typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return renderIndicationCard(key, value as Record<string, unknown>);
          }
          
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return (
              <div key={key} className="py-2 border-b border-border/20 last:border-0">
                <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide">{formattedKey}</p>
                {renderObjectContent(value as Record<string, unknown>, depth + 1)}
              </div>
            );
          }
          
          if (Array.isArray(value)) {
            return <DataList key={key} label={formattedKey} items={value.map(String)} />;
          }
          
          return <DataRow key={key} label={formattedKey} value={String(value)} />;
        })}
      </div>
    );
  };

  // Render safety warnings with proper formatting
  const renderSafetyContent = (safety: Record<string, unknown>) => {
    return (
      <div className="space-y-4">
        {/* Black Box Warning - Priority */}
        {safety.black_box_warning && (
          <div className="bg-black text-white border-4 border-black rounded-lg p-4 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-lg shadow-black/30">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-white mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-black uppercase mb-2 tracking-wide">⚠ BLACK BOX WARNING</p>
                <p className="text-sm font-medium leading-relaxed">{String(safety.black_box_warning)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contraindications */}
        {safety.contraindications && Array.isArray(safety.contraindications) && (
          <div>
            <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide">Contraindications</p>
            <ul className="space-y-1">
              {(safety.contraindications as string[]).map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-destructive mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {safety.warnings_and_precautions && Array.isArray(safety.warnings_and_precautions) && (
          <div>
            <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide">Warnings & Precautions</p>
            <ul className="space-y-1">
              {(safety.warnings_and_precautions as string[]).map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-amber-500 mt-1">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pregnancy/Lactation */}
        {(safety.pregnancy || safety.lactation) && (
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide">Pregnancy & Lactation</p>
            {safety.pregnancy && typeof safety.pregnancy === 'object' && (
              <div className="mb-2">
                <span className="text-xs text-muted-foreground">Pregnancy Category: </span>
                <span className="text-sm font-medium">{(safety.pregnancy as Record<string, string>).category}</span>
                {(safety.pregnancy as Record<string, string>).note && (
                  <p className="text-sm mt-1">{(safety.pregnancy as Record<string, string>).note}</p>
                )}
              </div>
            )}
            {safety.lactation && (
              <div>
                <span className="text-xs text-muted-foreground">Lactation: </span>
                <span className="text-sm">{String(safety.lactation)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Generate FDA drug search URL based on generic name
  const getFDALink = () => {
    if ((medication as any).fda_link) {
      return (medication as any).fda_link;
    }
    // Fallback to FDA AccessData drug search (more accessible than DailyMed)
    return `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=&varq=${encodeURIComponent(medication.generic_name)}`;
  };

  return (
    <div className="space-y-4">
      {/* Header with FDA Link */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Complete Prescribing Information</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Comprehensive drug reference including indications, dosing, contraindications, warnings, and clinical pharmacology from FDA-approved labeling.
            </p>
          </div>
          <a
            href={getFDALink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center shrink-0 gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">FDA Label</span>
          </a>
        </div>
        
        {/* Quick Reference Badges */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-primary/10">
          {medication.drug_class && (
            <Badge variant="secondary" className="text-xs">
              <FlaskConical className="w-3 h-3 mr-1" />
              {medication.drug_class}
            </Badge>
          )}
          {medication.dosage_form && (
            <Badge variant="outline" className="text-xs">
              <Package className="w-3 h-3 mr-1" />
              {medication.dosage_form}
            </Badge>
          )}
          {medication.route && medication.route.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Syringe className="w-3 h-3 mr-1" />
              {medication.route.join(', ')}
            </Badge>
          )}
          {medication.manufacturer && (
            <Badge variant="outline" className="text-xs">
              {medication.manufacturer}
            </Badge>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
        <p className="text-xs text-amber-800 dark:text-amber-200">
          <strong>Clinical Reference:</strong> This information is for educational purposes. Always verify with current FDA prescribing information and institutional protocols. Not a substitute for clinical judgment.
        </p>
      </div>

      {/* Indications & Dosing */}
      {!visibility?.hide_dosing && dosing && Object.keys(dosing).length > 0 && (
        <DetailSection
          title="Indications & Dosing"
          icon={<Pill className="w-5 h-5" />}
        >
          {/* Render indications with special formatting */}
          {dosing.indications && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-foreground/80 mb-3 uppercase tracking-wide">FDA-Approved Indications</p>
              {renderObjectContent({ indications: dosing.indications }, 0, true)}
            </div>
          )}
          {/* Pediatric dosing */}
          {dosing.pediatric_dosing && (
            <div className="mb-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/30">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">Pediatric Dosing</p>
              {renderObjectContent(dosing.pediatric_dosing as Record<string, unknown>)}
            </div>
          )}
          {/* Geriatric considerations */}
          {dosing.geriatric_considerations && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wide">Geriatric Considerations</p>
              <p className="text-sm">{String(dosing.geriatric_considerations)}</p>
            </div>
          )}
        </DetailSection>
      )}

      {/* Dose Adjustments */}
      {!visibility?.hide_adjustments && adjusts && Object.keys(adjusts).length > 0 && (
        <DetailSection
          title="Dose Adjustments"
          icon={<Beaker className="w-5 h-5" />}
        >
          {renderObjectContent(adjusts)}
        </DetailSection>
      )}

      {/* Contraindications & Warnings */}
      {!visibility?.hide_safety_info && safety && Object.keys(safety).length > 0 && (
        <DetailSection
          title="Contraindications & Warnings"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="warning"
        >
          {renderSafetyContent(safety)}
        </DetailSection>
      )}

      {/* Pharmacokinetics */}
      {!visibility?.hide_pharmacokinetics && pharmacokinetics && Object.keys(pharmacokinetics).length > 0 && (
        <DetailSection
          title="Pharmacokinetics (ADME)"
          icon={<FlaskConical className="w-5 h-5" />}
        >
          {/* Visual ADME Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { key: 'absorption', label: 'Absorption', color: 'bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300', icon: '💊' },
              { key: 'distribution', label: 'Distribution', color: 'bg-green-500/15 border-green-500/30 text-green-700 dark:text-green-300', icon: '🫀' },
              { key: 'metabolism', label: 'Metabolism', color: 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300', icon: '🧬' },
              { key: 'excretion', label: 'Excretion', color: 'bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300', icon: '🫘' },
            ].map(({ key, label, color, icon }) => {
              const val = pharmacokinetics[key];
              if (!val) return null;
              const summary = typeof val === 'string' 
                ? val 
                : typeof val === 'object' && val !== null
                  ? Object.values(val as Record<string, unknown>).filter(v => typeof v === 'string').slice(0, 1).join('') || label
                  : label;
              return (
                <div key={key} className={`rounded-lg border p-2.5 ${color} text-center`}>
                  <span className="text-lg">{icon}</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-1">{label}</p>
                  <p className="text-[11px] mt-1 line-clamp-2 leading-tight">{summary}</p>
                </div>
              );
            })}
          </div>

          {/* Key PK Parameters Table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parameter</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {pharmacokinetics.half_life && (
                  <tr className="bg-primary/5">
                    <td className="px-3 py-2 font-medium text-primary">Half-Life (t½)</td>
                    <td className="px-3 py-2">{typeof pharmacokinetics.half_life === 'string' ? pharmacokinetics.half_life : JSON.stringify(pharmacokinetics.half_life)}</td>
                  </tr>
                )}
                {pharmacokinetics.duration_of_action && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Duration of Action</td>
                    <td className="px-3 py-2">{typeof pharmacokinetics.duration_of_action === 'string' ? pharmacokinetics.duration_of_action : JSON.stringify(pharmacokinetics.duration_of_action)}</td>
                  </tr>
                )}
                {pharmacokinetics.onset && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Onset</td>
                    <td className="px-3 py-2">{typeof pharmacokinetics.onset === 'string' ? pharmacokinetics.onset : JSON.stringify(pharmacokinetics.onset)}</td>
                  </tr>
                )}
                {pharmacokinetics.peak && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Peak</td>
                    <td className="px-3 py-2">{typeof pharmacokinetics.peak === 'string' ? pharmacokinetics.peak : JSON.stringify(pharmacokinetics.peak)}</td>
                  </tr>
                )}
                {pharmacokinetics.bioavailability && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Bioavailability</td>
                    <td className="px-3 py-2">{typeof pharmacokinetics.bioavailability === 'string' ? pharmacokinetics.bioavailability : JSON.stringify(pharmacokinetics.bioavailability)}</td>
                  </tr>
                )}
                {pharmacokinetics.protein_binding && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Protein Binding</td>
                    <td className="px-3 py-2">{typeof pharmacokinetics.protein_binding === 'string' ? pharmacokinetics.protein_binding : JSON.stringify(pharmacokinetics.protein_binding)}</td>
                  </tr>
                )}
                {pharmacokinetics.dialysis && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Dialyzable</td>
                    <td className="px-3 py-2">{typeof pharmacokinetics.dialysis === 'string' ? pharmacokinetics.dialysis : JSON.stringify(pharmacokinetics.dialysis)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detailed ADME if complex */}
          {pharmacokinetics.absorption && typeof pharmacokinetics.absorption === 'object' && (
            <div className="mt-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/30">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">Absorption Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(pharmacokinetics.absorption as Record<string, unknown>).map(([key, value]) => (
                  <div key={key} className="bg-white/60 dark:bg-white/5 rounded-md px-3 py-2">
                    <p className="text-[11px] font-medium text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wide">{formatKey(key)}</p>
                    <p className="text-sm font-medium mt-0.5">{typeof value === 'object' && value !== null ? Object.entries(value as Record<string, string>).map(([k, v]) => `${formatKey(k)}: ${v}`).join(', ') : String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {pharmacokinetics.metabolism && typeof pharmacokinetics.metabolism === 'object' && (
            <div className="mt-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800/30">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wide">Metabolism Details</p>
              {renderObjectContent(pharmacokinetics.metabolism as Record<string, unknown>)}
            </div>
          )}
        </DetailSection>
      )}

      {/* Adverse Reactions */}
      {!visibility?.hide_adverse_reactions && adverseReactions && Object.keys(adverseReactions).length > 0 && (
        <DetailSection
          title="Adverse Reactions & Side Effects"
          icon={<CircleAlert className="w-5 h-5" />}
          variant="warning"
        >
          <div className="space-y-4">
            {/* By Frequency */}
            {adverseReactions.by_frequency && (
              <div>
                <p className="text-xs font-semibold text-foreground/80 mb-3 uppercase tracking-wide">By Frequency</p>
                <div className="space-y-3">
                  {/* Common (>10%) */}
                  {(adverseReactions.by_frequency as Record<string, any>).common && (
                    <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-destructive uppercase">Common</span>
                        <Badge variant="destructive" className="text-xs">{(adverseReactions.by_frequency as Record<string, any>).common.frequency}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {((adverseReactions.by_frequency as Record<string, any>).common.reactions as string[]).map((r, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-destructive/5 border-destructive/30">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Frequent (1-10%) */}
                  {(adverseReactions.by_frequency as Record<string, any>).frequent && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Frequent</span>
                        <Badge className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">{(adverseReactions.by_frequency as Record<string, any>).frequent.frequency}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {((adverseReactions.by_frequency as Record<string, any>).frequent.reactions as string[]).map((r, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Infrequent (0.1-1%) */}
                  {(adverseReactions.by_frequency as Record<string, any>).infrequent && (
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Infrequent</span>
                        <Badge variant="secondary" className="text-xs">{(adverseReactions.by_frequency as Record<string, any>).infrequent.frequency}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {((adverseReactions.by_frequency as Record<string, any>).infrequent.reactions as string[]).map((r, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Rare (<0.1%) */}
                  {(adverseReactions.by_frequency as Record<string, any>).rare && (
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Rare</span>
                        <Badge variant="outline" className="text-xs">{(adverseReactions.by_frequency as Record<string, any>).rare.frequency}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {((adverseReactions.by_frequency as Record<string, any>).rare.reactions as string[]).map((r, i) => (
                          <Badge key={i} variant="outline" className="text-xs text-muted-foreground">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* By Body System */}
            {adverseReactions.by_system && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs font-semibold text-foreground/80 mb-3 uppercase tracking-wide">By Body System</p>
                <div className="grid gap-2">
                  {Object.entries(adverseReactions.by_system as Record<string, string[]>).map(([system, reactions]) => (
                    <div key={system} className="bg-muted/20 rounded-lg p-2.5">
                      <p className="text-xs font-medium text-primary mb-1.5">{formatKey(system)}</p>
                      <p className="text-xs text-muted-foreground">{reactions.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DetailSection>
      )}

      {/* Drug Interactions */}
      {!visibility?.hide_drug_interactions && drugInteractions && Object.keys(drugInteractions).length > 0 && (
        <DetailSection
          title="Drug Interactions"
          icon={<Zap className="w-5 h-5" />}
          variant="warning"
        >
          <div className="space-y-4">
            {/* Major Interactions */}
            {drugInteractions.major && Array.isArray(drugInteractions.major) && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive" className="text-xs">MAJOR</Badge>
                  <span className="text-xs text-muted-foreground">Avoid combination or use extreme caution</span>
                </div>
                <div className="space-y-2">
                  {(drugInteractions.major as any[]).map((interaction, i) => (
                    <div key={i} className="bg-destructive/5 rounded-lg p-3 border border-destructive/20">
                      <p className="font-medium text-sm text-destructive">{interaction.drug}</p>
                      <p className="text-sm mt-1">{interaction.effect}</p>
                      <p className="text-xs text-muted-foreground mt-1"><strong>Mechanism:</strong> {interaction.mechanism}</p>
                      <p className="text-xs text-primary mt-1"><strong>Management:</strong> {interaction.management}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Moderate Interactions */}
            {drugInteractions.moderate && Array.isArray(drugInteractions.moderate) && (
              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="text-xs bg-amber-500 hover:bg-amber-600">MODERATE</Badge>
                  <span className="text-xs text-muted-foreground">Usually avoid; use only if benefit outweighs risk</span>
                </div>
                <div className="space-y-2">
                  {(drugInteractions.moderate as any[]).map((interaction, i) => (
                    <div key={i} className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800/30">
                      <p className="font-medium text-sm text-amber-800 dark:text-amber-300">{interaction.drug}</p>
                      <p className="text-sm mt-1">{interaction.effect}</p>
                      <p className="text-xs text-muted-foreground mt-1"><strong>Mechanism:</strong> {interaction.mechanism}</p>
                      <p className="text-xs text-primary mt-1"><strong>Management:</strong> {interaction.management}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Minor Interactions */}
            {drugInteractions.minor && Array.isArray(drugInteractions.minor) && (
              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">MINOR</Badge>
                  <span className="text-xs text-muted-foreground">Monitor therapy</span>
                </div>
                <div className="space-y-2">
                  {(drugInteractions.minor as any[]).map((interaction, i) => (
                    <div key={i} className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <p className="font-medium text-sm">{interaction.drug}</p>
                      <p className="text-sm mt-1 text-muted-foreground">{interaction.effect}</p>
                      <p className="text-xs text-primary mt-1"><strong>Management:</strong> {interaction.management}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Food Interactions */}
            {drugInteractions.food_interactions && Array.isArray(drugInteractions.food_interactions) && (
              <div className="pt-3 border-t border-border/50">
                <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide">Food & Supplement Interactions</p>
                <div className="space-y-2">
                  {(drugInteractions.food_interactions as any[]).map((interaction, i) => (
                    <div key={i} className="bg-muted/20 rounded-lg p-2.5 flex items-start gap-3">
                      <Badge variant="outline" className="text-xs shrink-0">{interaction.substance}</Badge>
                      <div>
                        <p className="text-sm">{interaction.effect}</p>
                        <p className="text-xs text-primary mt-0.5">{interaction.management}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DetailSection>
      )}
      {!visibility?.hide_red_flags && red_flags && (red_flags.early_danger_signs?.length > 0 || red_flags.immediate_action?.length > 0) && (
        <DetailSection
          title="Critical Safety Alerts"
          icon={<Shield className="w-5 h-5" />}
          variant="critical"
        >
          {red_flags.early_danger_signs && (
            <DataList label="Early Danger Signs" items={red_flags.early_danger_signs} />
          )}
          {red_flags.immediate_action && (
            <DataList label="Immediate Actions Required" items={red_flags.immediate_action} />
          )}
        </DetailSection>
      )}

      {/* Administration */}
      {!visibility?.hide_administration && (admin || safe_method || rate_dilution || line_compatibility) && (
        <DetailSection
          title="Administration & Preparation"
          icon={<Syringe className="w-5 h-5" />}
        >
          {/* Display administration_info with route-specific sections */}
          {admin && (
            <div className="space-y-4">
              {/* Oral Administration */}
              {(admin as Record<string, unknown>).oral && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Pill className="w-3 h-3" /> Oral Administration
                  </p>
                  {renderObjectContent((admin as Record<string, Record<string, unknown>>).oral)}
                </div>
              )}
              
              {/* IV Administration */}
              {(admin as Record<string, unknown>).iv && (
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/30">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Syringe className="w-3 h-3" /> IV Administration
                  </p>
                  {renderObjectContent((admin as Record<string, Record<string, unknown>>).iv)}
                </div>
              )}
              
              {/* IM Administration */}
              {(admin as Record<string, unknown>).im && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Syringe className="w-3 h-3" /> IM Administration
                  </p>
                  {renderObjectContent((admin as Record<string, Record<string, unknown>>).im)}
                </div>
              )}
            </div>
          )}

          {/* Legacy fields for backwards compatibility */}
          {safe_method && !admin && (
            <>
              <DataRow label="Preferred Method" value={safe_method.preferred_method} />
              <DataRow label="Push/Infusion Time" value={safe_method.push_or_infusion_time} />
              {safe_method.pump_required && (
                <DataRow label="Pump Required" value="Yes" />
              )}
            </>
          )}
          {rate_dilution && !admin && (
            <>
              <DataRow label="IV Push Rate" value={rate_dilution.iv_push_rate} />
              <DataRow label="Infusion Duration" value={rate_dilution.infusion_duration} />
              {rate_dilution.dilution_required && (
                <DataRow label="Dilution Instructions" value={rate_dilution.dilution_instructions || 'Dilution required - see pharmacy'} />
              )}
            </>
          )}
          {line_compatibility && !admin && (
            <>
              <DataRow label="Peripheral Line" value={line_compatibility.peripheral_allowed ? 'Allowed' : 'Not recommended'} />
              <DataRow label="Central Line" value={line_compatibility.central_preferred ? 'Preferred' : 'Not required'} />
              {line_compatibility.dedicated_line_required && (
                <DataRow label="Dedicated Line" value="Required" />
              )}
              {line_compatibility.y_site_restrictions?.length > 0 && (
                <DataList label="Y-Site Restrictions" items={line_compatibility.y_site_restrictions} />
              )}
            </>
          )}
        </DetailSection>
      )}

      {/* Monitoring Parameters */}
      {!visibility?.hide_monitoring && monitoring && (
        <DetailSection
          title="Monitoring Parameters"
          icon={<Activity className="w-5 h-5" />}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {monitoring.vitals_required && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-primary text-sm">✅</span>
                <span className="text-xs font-medium">Vitals</span>
              </div>
            )}
            {monitoring.cardiac_monitoring && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20">
                <span className="text-destructive text-sm">❤️</span>
                <span className="text-xs font-medium">Cardiac Monitor</span>
              </div>
            )}
            {monitoring.oxygen_monitoring && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <span className="text-sm">🫁</span>
                <span className="text-xs font-medium">SpO2</span>
              </div>
            )}
            {monitoring.neuro_checks && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <span className="text-sm">🧠</span>
                <span className="text-xs font-medium">Neuro Checks</span>
              </div>
            )}
          </div>
          {monitoring.timing && (
            <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-sm"><span className="font-medium">Timing:</span> {monitoring.timing}</p>
            </div>
          )}
        </DetailSection>
      )}

      {/* Hold Parameters */}
      {!visibility?.hide_hold_parameters && hold_parameters && (
        <DetailSection
          title="Hold Parameters"
          icon={<Clock className="w-5 h-5" />}
          variant="warning"
        >
          <div className="overflow-x-auto rounded-lg border border-amber-200 dark:border-amber-800/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-50 dark:bg-amber-950/30">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">Parameter</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">Hold If</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 dark:divide-amber-900/30">
                {hold_parameters.bp_limits && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Blood Pressure</td>
                    <td className="px-3 py-2">{hold_parameters.bp_limits}</td>
                  </tr>
                )}
                {hold_parameters.hr_limits && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Heart Rate</td>
                    <td className="px-3 py-2">{hold_parameters.hr_limits}</td>
                  </tr>
                )}
                {hold_parameters.rr_limits && (
                  <tr>
                    <td className="px-3 py-2 font-medium">Respiratory Rate</td>
                    <td className="px-3 py-2">{hold_parameters.rr_limits}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {hold_parameters.lab_limits && (
            <div className="mt-3">
              <DataList label="Lab Value Limits" items={hold_parameters.lab_limits} />
            </div>
          )}
        </DetailSection>
      )}

      {/* Timing & Food Interactions */}
      {!visibility?.hide_timing_rules && timing_rules && (
        <DetailSection
          title="Timing & Food Interactions"
          icon={<Clock className="w-5 h-5" />}
        >
          <DataRow label="Food Interaction" value={timing_rules.food_interaction} />
          <DataRow label="Separation from Other Medications" value={timing_rules.separation_from_meds} />
          <DataRow label="Time Sensitivity" value={timing_rules.time_sensitive} />
        </DetailSection>
      )}

      {/* Crushing/Splitting */}
      {!visibility?.hide_crushing && crushing_info && (
        <DetailSection
          title="Crushing & Splitting"
          icon={<Pill className="w-5 h-5" />}
        >
          <DataRow label="Crush Allowed" value={crushing_info.crush_allowed ? 'Yes' : 'No'} />
          <DataRow label="Split Allowed" value={crushing_info.split_allowed ? 'Yes' : 'No'} />
          {crushing_info.do_not_crush_warning && (
            <div className="mt-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive font-medium">
                ⚠️ {crushing_info.do_not_crush_warning}
              </p>
            </div>
          )}
        </DetailSection>
      )}

      {/* Special Populations */}
      {!visibility?.hide_patient_education && (patient_education || expected_effect) && (
        <DetailSection
          title="Patient Information"
          icon={<Users className="w-5 h-5" />}
        >
          {patient_education && (
            <>
              <DataRow label="Purpose" value={patient_education.purpose} />
              <DataRow label="Expected Feelings" value={patient_education.expected_feelings} />
              {patient_education.report_immediately && (
                <DataList label="Report Immediately" items={patient_education.report_immediately} />
              )}
            </>
          )}
          {expected_effect && (
            <>
              <DataRow label="Onset Timeframe" value={expected_effect.onset_timeframe} />
              <DataRow label="Reassessment Target" value={expected_effect.reassessment_target} />
            </>
          )}
        </DetailSection>
      )}

      {/* Required Resources */}
      {!visibility?.hide_resources && required_resources && (
        <DetailSection
          title="Required Equipment & Resources"
          icon={<Beaker className="w-5 h-5" />}
        >
          {required_resources.iv_pump && <DataRow label="IV Pump" value="Required" />}
          {required_resources.filter_required && <DataRow label="Filter" value="Required" />}
          <DataRow label="Special Tubing" value={required_resources.special_tubing} />
          <DataRow label="PPE Required" value={required_resources.ppe_required} />
          {required_resources.antidote && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">Antidote Available</p>
              <p className="text-sm mt-0.5">{required_resources.antidote}</p>
            </div>
          )}
        </DetailSection>
      )}

      {/* Documentation */}
      {!visibility?.hide_documentation && documentation_reminders && (
        <DetailSection
          title="Documentation Requirements"
          icon={<FileText className="w-5 h-5" />}
        >
          <DataRow label="Pre-Administration Assessment" value={documentation_reminders.pre_admin_assessment} />
          <DataRow label="Monitoring Documentation" value={documentation_reminders.monitoring_documented} />
          <DataRow label="Patient Response" value={documentation_reminders.patient_response} />
        </DetailSection>
      )}

      {/* Clinical Pearls */}
      {!visibility?.hide_clinical_pearls && clinical_pearls && clinical_pearls.length > 0 && (
        <DetailSection
          title="Clinical Pearls & Practice Tips"
          icon={<Heart className="w-5 h-5" />}
        >
          <div className="space-y-2">
            {clinical_pearls.map((pearl, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border-l-2 border-primary">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm">{pearl}</p>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Footer with external links */}
      <div className="flex flex-wrap gap-2 pt-2">
        <a
          href={getFDALink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Full FDA Prescribing Information
        </a>
        <a
          href={`https://www.drugs.com/${medication.generic_name.toLowerCase()}.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Drugs.com Reference
        </a>
      </div>
    </div>
  );
};

export default FullDetailsView;
