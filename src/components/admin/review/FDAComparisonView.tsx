import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { FileText, Sparkles, AlertTriangle, CheckCircle2, XCircle, Pencil } from 'lucide-react';

interface FDAComparisonViewProps {
  fdaLabelData: Record<string, unknown> | null;
  aiGeneratedContent: Record<string, { guide: Record<string, unknown> }> | null;
  safetyInfo: Record<string, unknown> | null;
  dosingInfo: Record<string, unknown> | null;
  adverseReactions: Record<string, unknown> | null;
  onEditSection?: (section: string) => void;
}

// Map comparison sections to edit dialog tabs
const SECTION_TAB_MAP: Record<string, string> = {
  'Dosing & Administration': 'clinical',
  'Warnings & Precautions': 'safety',
  'Adverse Reactions': 'safety',
  'Contraindications': 'safety',
  'Drug Interactions': 'safety',
};

const FDAComparisonView = ({
  fdaLabelData,
  aiGeneratedContent,
  safetyInfo,
  dosingInfo,
  adverseReactions,
  onEditSection,
}: FDAComparisonViewProps) => {
  const renderValue = (value: unknown, depth = 0): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic text-xs">Not specified</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-muted-foreground italic text-xs">Empty</span>;
      }
      return (
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          {value.slice(0, 10).map((item, index) => (
            <li key={index} className="text-xs">{renderValue(item, depth + 1)}</li>
          ))}
          {value.length > 10 && (
            <li className="text-xs text-muted-foreground">...and {value.length - 10} more</li>
          )}
        </ul>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return <span className="text-muted-foreground italic text-xs">Empty</span>;
      }
      return (
        <div className={`space-y-1.5 ${depth > 0 ? 'ml-3 border-l border-muted pl-2' : ''}`}>
          {entries.slice(0, 8).map(([key, val]) => (
            <div key={key}>
              <span className="font-medium text-xs text-primary capitalize">
                {key.replace(/_/g, ' ')}:
              </span>
              <div className="mt-0.5">{renderValue(val, depth + 1)}</div>
            </div>
          ))}
          {entries.length > 8 && (
            <p className="text-xs text-muted-foreground">...and {entries.length - 8} more fields</p>
          )}
        </div>
      );
    }

    const strValue = String(value);
    if (strValue.length > 300) {
      return <span className="text-xs">{strValue.substring(0, 300)}...</span>;
    }
    return <span className="text-xs">{strValue}</span>;
  };

  const hasData = (data: unknown): boolean => {
    if (!data) return false;
    if (typeof data === 'object') {
      return Object.keys(data as Record<string, unknown>).length > 0;
    }
    return true;
  };

  const getComparisonStatus = (fdaData: unknown, aiData: unknown): 'match' | 'partial' | 'missing' => {
    const hasFDA = hasData(fdaData);
    const hasAI = hasData(aiData);
    
    if (hasFDA && hasAI) return 'match';
    if (hasFDA || hasAI) return 'partial';
    return 'missing';
  };

  // Extract relevant FDA sections for comparison
  const fdaSections = {
    dosing: fdaLabelData?.dosage_and_administration || fdaLabelData?.dosing || dosingInfo,
    warnings: fdaLabelData?.warnings || fdaLabelData?.boxed_warning || safetyInfo,
    adverseReactions: fdaLabelData?.adverse_reactions || adverseReactions,
    contraindications: fdaLabelData?.contraindications || (safetyInfo as Record<string, unknown>)?.contraindications,
    drugInteractions: fdaLabelData?.drug_interactions,
    precautions: fdaLabelData?.warnings_and_precautions || fdaLabelData?.precautions,
  };

  // Extract AI sections for comparison
  const aiSections = aiGeneratedContent ? Object.entries(aiGeneratedContent).reduce((acc, [route, content]) => {
    if (content?.guide) {
      const guide = content.guide as Record<string, unknown>;
      return {
        dosing: acc.dosing || guide.dosing || guide.administration,
        warnings: acc.warnings || guide.safety_considerations || guide.warnings,
        adverseReactions: acc.adverseReactions || guide.adverse_effects || guide.side_effects,
        contraindications: acc.contraindications || guide.contraindications,
        drugInteractions: acc.drugInteractions || guide.drug_interactions,
        precautions: acc.precautions || guide.precautions || guide.monitoring,
      };
    }
    return acc;
  }, {} as Record<string, unknown>) : {};

  const comparisonSections = [
    { 
      label: 'Dosing & Administration', 
      fdaKey: 'dosing', 
      aiKey: 'dosing',
      fdaData: fdaSections.dosing,
      aiData: aiSections.dosing,
    },
    { 
      label: 'Warnings & Precautions', 
      fdaKey: 'warnings', 
      aiKey: 'warnings',
      fdaData: fdaSections.warnings,
      aiData: aiSections.warnings,
    },
    { 
      label: 'Adverse Reactions', 
      fdaKey: 'adverseReactions', 
      aiKey: 'adverseReactions',
      fdaData: fdaSections.adverseReactions,
      aiData: aiSections.adverseReactions,
    },
    { 
      label: 'Contraindications', 
      fdaKey: 'contraindications', 
      aiKey: 'contraindications',
      fdaData: fdaSections.contraindications,
      aiData: aiSections.contraindications,
    },
    { 
      label: 'Drug Interactions', 
      fdaKey: 'drugInteractions', 
      aiKey: 'drugInteractions',
      fdaData: fdaSections.drugInteractions,
      aiData: aiSections.drugInteractions,
    },
  ];

  const StatusBadge = ({ status, sectionLabel }: { status: 'match' | 'partial' | 'missing'; sectionLabel: string }) => {
    const showEditButton = status !== 'match' && onEditSection;
    
    return (
      <div className="flex items-center gap-1.5">
        {status === 'match' && (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 text-[10px]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Both Present
          </Badge>
        )}
        {status === 'partial' && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px]">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        )}
        {status === 'missing' && (
          <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px]">
            <XCircle className="w-3 h-3 mr-1" />
            Missing
          </Badge>
        )}
        {showEditButton && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-primary/10"
            onClick={() => onEditSection(SECTION_TAB_MAP[sectionLabel] || 'clinical')}
            title={`Edit ${sectionLabel}`}
          >
            <Pencil className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="h-[45vh]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          Compare FDA source data with AI-generated nursing content to verify accuracy.
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[10px]">
            <FileText className="w-3 h-3 mr-1" />
            FDA Source
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Generated
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[calc(45vh-40px)]">
        <div className="space-y-4 pr-4">
          {comparisonSections.map((section) => {
            const status = getComparisonStatus(section.fdaData, section.aiData);
            
            return (
              <Card key={section.label} className="overflow-hidden">
                <CardHeader className="py-2 px-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{section.label}</CardTitle>
                    <StatusBadge status={status} sectionLabel={section.label} />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ResizablePanelGroup direction="horizontal" className="min-h-[120px]">
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <div className="p-3 h-full border-r">
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium text-primary">FDA Label Data</span>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {hasData(section.fdaData) ? (
                            renderValue(section.fdaData)
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              No FDA data available for this section
                            </p>
                          )}
                        </div>
                      </div>
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle />
                    
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <div className="p-3 h-full bg-accent/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium text-primary">AI-Generated Content</span>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {hasData(section.aiData) ? (
                            renderValue(section.aiData)
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              No AI content generated for this section
                            </p>
                          )}
                        </div>
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FDAComparisonView;
