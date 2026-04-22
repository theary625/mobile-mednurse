import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, Shield, XCircle, AlertCircle, Pill } from 'lucide-react';

interface SafetyInfo {
  boxed_warning?: string;
  contraindications?: string[];
  warnings?: string[];
  precautions?: string[];
}

interface DrugInteraction {
  drug: string;
  severity: string;
  effect: string;
  recommendation?: string;
}

interface SafetyAlertsTabProps {
  safetyInfo?: SafetyInfo | null;
  drugInteractions?: DrugInteraction[] | null;
  highAlert?: boolean;
  controlledSubstance?: boolean;
  fdaLabelData?: Record<string, unknown> | null;
}

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'major':
    case 'severe':
    case 'contraindicated':
      return 'bg-destructive/10 text-destructive border-destructive/30';
    case 'moderate':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
    case 'minor':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const SafetyAlertsTab = ({ 
  safetyInfo, 
  drugInteractions, 
  highAlert, 
  controlledSubstance,
  fdaLabelData 
}: SafetyAlertsTabProps) => {
  const hasBoxedWarning = safetyInfo?.boxed_warning && safetyInfo.boxed_warning.length > 0;
  const hasContraindications = safetyInfo?.contraindications && safetyInfo.contraindications.length > 0;
  const hasWarnings = safetyInfo?.warnings && safetyInfo.warnings.length > 0;
  const hasPrecautions = safetyInfo?.precautions && safetyInfo.precautions.length > 0;
  const hasInteractions = drugInteractions && drugInteractions.length > 0;

  return (
    <ScrollArea className="h-[45vh] pr-4">
      <div className="space-y-6">
        {/* Safety Badges */}
        {(highAlert || controlledSubstance) && (
          <div className="flex flex-wrap gap-2 pb-4 border-b">
            {highAlert && (
              <Badge variant="destructive" className="text-sm py-1 px-3">
                <AlertTriangle className="w-4 h-4 mr-2" />
                HIGH ALERT Medication
              </Badge>
            )}
            {controlledSubstance && (
              <Badge variant="outline" className="text-sm py-1 px-3 border-amber-500/50 text-amber-700 dark:text-amber-400">
                <Shield className="w-4 h-4 mr-2" />
                Controlled Substance
              </Badge>
            )}
          </div>
        )}

        {/* BLACK BOX WARNING */}
        {hasBoxedWarning && (
          <div className="border-2 border-destructive rounded-lg overflow-hidden">
            <div className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wide">Black Box Warning</span>
            </div>
            <div className="p-4 bg-destructive/5">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {safetyInfo?.boxed_warning}
              </p>
            </div>
          </div>
        )}

        {/* Contraindications */}
        {hasContraindications && (
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-destructive">
              <XCircle className="w-4 h-4" />
              Contraindications
            </h4>
            <ul className="space-y-2">
              {safetyInfo?.contraindications?.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-destructive mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings & Precautions Accordion */}
        {(hasWarnings || hasPrecautions) && (
          <Accordion type="multiple" className="space-y-2">
            {hasWarnings && (
              <AccordionItem value="warnings" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Warnings ({safetyInfo?.warnings?.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pb-2">
                    {safetyInfo?.warnings?.map((warning, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {hasPrecautions && (
              <AccordionItem value="precautions" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Precautions ({safetyInfo?.precautions?.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pb-2">
                    {safetyInfo?.precautions?.map((precaution, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}

        {/* Drug Interactions */}
        {hasInteractions && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Drug Interactions ({drugInteractions?.length})
              </h4>
            </div>
            <div className="divide-y">
              {drugInteractions?.map((interaction, index) => (
                <div key={index} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{interaction.drug}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSeverityColor(interaction.severity)}`}
                    >
                      {interaction.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{interaction.effect}</p>
                  {interaction.recommendation && (
                    <p className="text-sm text-primary bg-primary/5 p-2 rounded">
                      <strong>Recommendation:</strong> {interaction.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasBoxedWarning && !hasContraindications && !hasWarnings && !hasPrecautions && !hasInteractions && !highAlert && !controlledSubstance && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No safety alerts or warnings found for this medication.</p>
            <p className="text-sm mt-2">
              This may indicate missing FDA data. Consider running FDA Label Sync.
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default SafetyAlertsTab;
