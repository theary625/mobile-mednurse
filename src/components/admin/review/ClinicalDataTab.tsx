import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Pill, 
  Activity, 
  AlertCircle, 
  Clock, 
  Beaker,
  Stethoscope,
  Baby,
  FileText
} from 'lucide-react';

interface DosingInfo {
  standard_dose?: string;
  pediatric_dose?: string;
  max_dose?: string;
  renal_adjustment?: string;
  hepatic_adjustment?: string;
}

interface Pharmacokinetics {
  half_life?: string;
  metabolism?: string;
  excretion?: string;
  onset?: string;
  duration?: string;
}

interface AdverseReactions {
  common?: string[];
  serious?: string[];
}

interface ClinicalDataTabProps {
  dosingInfo?: DosingInfo | null;
  pharmacokinetics?: Pharmacokinetics | null;
  adverseReactions?: AdverseReactions | null;
  holdParameters?: Record<string, unknown> | null;
  monitoring?: Record<string, unknown> | null;
  drugClass?: string | null;
  routes?: string[] | null;
}

const ClinicalDataTab = ({ 
  dosingInfo, 
  pharmacokinetics, 
  adverseReactions,
  holdParameters,
  monitoring,
  drugClass,
  routes
}: ClinicalDataTabProps) => {
  const hasDosingInfo = dosingInfo && Object.values(dosingInfo).some(v => v);
  const hasPK = pharmacokinetics && Object.values(pharmacokinetics).some(v => v);
  const hasCommonReactions = adverseReactions?.common && adverseReactions.common.length > 0;
  const hasSeriousReactions = adverseReactions?.serious && adverseReactions.serious.length > 0;
  const hasHoldParams = holdParameters && Object.keys(holdParameters).length > 0;
  const hasMonitoring = monitoring && Object.keys(monitoring).length > 0;

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground italic">Not specified</span>;
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : <span className="text-muted-foreground italic">None</span>;
    }
    if (typeof value === 'object') {
      return (
        <div className="space-y-1 mt-1">
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="text-sm">
              <span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
              <span>{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(value);
  };

  return (
    <ScrollArea className="h-[45vh] pr-4">
      <div className="space-y-6">
        {/* Drug Classification */}
        {(drugClass || routes) && (
          <div className="flex flex-wrap gap-2 pb-4 border-b">
            {drugClass && (
              <Badge variant="secondary" className="text-xs">
                <Beaker className="w-3 h-3 mr-1" />
                {drugClass}
              </Badge>
            )}
            {routes?.map((route) => (
              <Badge key={route} variant="outline" className="text-xs">
                {route}
              </Badge>
            ))}
          </div>
        )}

        {/* Dosing Information */}
        {hasDosingInfo && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Dosing Information
              </h4>
            </div>
            <div className="p-4 space-y-4">
              {dosingInfo?.standard_dose && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Standard Dose</div>
                  <div className="text-sm">{dosingInfo.standard_dose}</div>
                </div>
              )}
              {dosingInfo?.max_dose && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Maximum Dose</div>
                  <div className="text-sm font-medium text-destructive">{dosingInfo.max_dose}</div>
                </div>
              )}
              {dosingInfo?.pediatric_dose && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1 flex items-center gap-1">
                    <Baby className="w-3 h-3" />
                    Pediatric Dose
                  </div>
                  <div className="text-sm">{dosingInfo.pediatric_dose}</div>
                </div>
              )}
              
              {/* Dose Adjustments */}
              {(dosingInfo?.renal_adjustment || dosingInfo?.hepatic_adjustment) && (
                <div className="border-t pt-4 mt-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-3">Dose Adjustments</div>
                  <div className="grid gap-3">
                    {dosingInfo?.renal_adjustment && (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded p-3">
                        <div className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">Renal Impairment</div>
                        <div className="text-sm">{dosingInfo.renal_adjustment}</div>
                      </div>
                    )}
                    {dosingInfo?.hepatic_adjustment && (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded p-3">
                        <div className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">Hepatic Impairment</div>
                        <div className="text-sm">{dosingInfo.hepatic_adjustment}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pharmacokinetics */}
        {hasPK && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Pharmacokinetics
              </h4>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {pharmacokinetics?.half_life && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Half-Life
                    </div>
                    <div className="text-sm font-medium">{pharmacokinetics.half_life}</div>
                  </div>
                )}
                {pharmacokinetics?.onset && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Onset</div>
                    <div className="text-sm">{pharmacokinetics.onset}</div>
                  </div>
                )}
                {pharmacokinetics?.duration && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Duration</div>
                    <div className="text-sm">{pharmacokinetics.duration}</div>
                  </div>
                )}
                {pharmacokinetics?.metabolism && (
                  <div className="col-span-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Metabolism</div>
                    <div className="text-sm">{pharmacokinetics.metabolism}</div>
                  </div>
                )}
                {pharmacokinetics?.excretion && (
                  <div className="col-span-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Excretion</div>
                    <div className="text-sm">{pharmacokinetics.excretion}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Adverse Reactions */}
        {(hasCommonReactions || hasSeriousReactions) && (
          <Accordion type="multiple" defaultValue={hasSeriousReactions ? ['serious'] : []} className="space-y-2">
            {hasSeriousReactions && (
              <AccordionItem value="serious" className="border border-destructive/30 rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Serious Reactions ({adverseReactions?.serious?.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 pb-2">
                    {adverseReactions?.serious?.map((reaction, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        <span>{reaction}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {hasCommonReactions && (
              <AccordionItem value="common" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Common Reactions ({adverseReactions?.common?.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 pb-2">
                    {adverseReactions?.common?.map((reaction, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>{reaction}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}

        {/* Hold Parameters & Monitoring */}
        {(hasHoldParams || hasMonitoring) && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Clinical Parameters
              </h4>
            </div>
            <div className="p-4 space-y-4">
              {hasHoldParams && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Hold Parameters</div>
                  <div className="text-sm">{renderValue(holdParameters)}</div>
                </div>
              )}
              {hasMonitoring && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Monitoring Requirements</div>
                  <div className="text-sm">{renderValue(monitoring)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasDosingInfo && !hasPK && !hasCommonReactions && !hasSeriousReactions && !hasHoldParams && !hasMonitoring && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No clinical data available for this medication.</p>
            <p className="text-sm mt-2">
              Run Smart Sync to populate dosing and pharmacokinetic data.
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ClinicalDataTab;
