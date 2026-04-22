import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Clock, FileText, Shield, AlertTriangle, Flag, CheckCircle2, XCircle, Loader2, Activity, Pill, GitCompare, Pencil } from 'lucide-react';
import { ValidationScoreCard } from './ValidationScoreCard';
import SafetyAlertsTab from './review/SafetyAlertsTab';
import ClinicalDataTab from './review/ClinicalDataTab';
import FDAComparisonView from './review/FDAComparisonView';
import MedicationEditDialog from './MedicationEditDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { PendingMedication } from './MedicationDataSync';
import type { ValidationResult } from '@/types/validation';

interface PendingReviewDialogProps {
  medication: PendingMedication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewComplete?: () => void;
}

const REVIEW_TIERS = [
  { value: 'auto_approve', label: 'Auto-Approve', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  { value: 'quick_review', label: 'Quick Review', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  { value: 'full_review', label: 'Full Review', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  { value: 'escalated', label: 'Escalated', color: 'bg-destructive/10 text-destructive' },
];

const PendingReviewDialog = ({ medication, open, onOpenChange, onReviewComplete }: PendingReviewDialogProps) => {
  const { toast } = useToast();
  const [reviewNotes, setReviewNotes] = useState(medication?.review_notes || '');
  const [selectedTier, setSelectedTier] = useState(medication?.review_tier || 'full_review');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogTab, setEditDialogTab] = useState<string | undefined>(undefined);

  if (!medication) return null;

  const handleEditClick = (tab?: string) => {
    setEditDialogTab(tab);
    setEditDialogOpen(true);
  };

  const handleEditSaved = () => {
    setEditDialogOpen(false);
    onReviewComplete?.(); // Refresh data after edit
  };

  const aiContent = medication.ai_generated_content as Record<string, { guide: Record<string, unknown> }> | null;
  const validationResults = medication.validation_results as ValidationResult | null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch the latest medication data to merge AI content
      const { data: latestMed } = await supabase
        .from('medications')
        .select('ai_generated_content, nursing_guide, dosing_info, pharmacokinetics, adverse_reactions, drug_interactions_info')
        .eq('id', medication.id)
        .single();

      const updatePayload: Record<string, unknown> = {
        content_status: 'approved',
        review_tier: selectedTier,
        review_notes: reviewNotes || null,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      };

      // Merge AI-generated content if present
      if (latestMed?.ai_generated_content) {
        const aiContent = latestMed.ai_generated_content as Record<string, unknown>;
        
        if (aiContent.factory_generated) {
          // Content Factory format: clinical_details has dosing, pharma, etc.
          const cd = (aiContent.clinical_details || {}) as Record<string, unknown>;
          if (cd.pharmacokinetics) updatePayload.pharmacokinetics = cd.pharmacokinetics;
          if (cd.dosing_info) updatePayload.dosing_info = cd.dosing_info;
          if (cd.adverse_reactions) updatePayload.adverse_reactions = cd.adverse_reactions;
          if (cd.drug_interactions) updatePayload.drug_interactions_info = cd.drug_interactions;
        } else {
          // Smart Sync format: route-based nursing guide content
          const currentGuide = (latestMed.nursing_guide as Record<string, unknown>) || {};
          const mergedGuide = { ...currentGuide };
          for (const [route, content] of Object.entries(aiContent)) {
            if (typeof content === 'object' && content !== null && 'guide' in content) {
              mergedGuide[route] = (content as { guide: Record<string, unknown> }).guide;
            }
          }
          updatePayload.nursing_guide = mergedGuide;
        }
        updatePayload.ai_generated_content = null;
      }

      const { error } = await supabase
        .from('medications')
        .update(updatePayload)
        .eq('id', medication.id);

      if (error) throw error;

      toast({
        title: 'Medication Approved',
        description: `${medication.generic_name} has been approved and content saved.`,
      });
      onReviewComplete?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve medication.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('medications')
        .update({
          content_status: 'draft',
          review_tier: 'escalated',
          review_notes: reviewNotes || 'Rejected - requires revision',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', medication.id);

      if (error) throw error;

      toast({
        title: 'Medication Rejected',
        description: `${medication.generic_name} sent back for revision.`,
      });
      onReviewComplete?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject medication.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalate = async () => {
    if (!reviewNotes.trim()) {
      toast({
        title: 'Notes Required',
        description: 'Please add review notes explaining why this needs escalation.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('medications')
        .update({
          content_status: 'review',
          review_tier: 'escalated',
          review_notes: reviewNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', medication.id);

      if (error) throw error;

      toast({
        title: 'Escalated for Pharmacist Review',
        description: `${medication.generic_name} requires pharmacist sign-off.`,
      });
      onReviewComplete?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to escalate medication.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderValue = (value: unknown, depth = 0): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Not specified</span>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-muted-foreground italic">Empty</span>;
      }
      return (
        <ul className="list-disc list-inside space-y-1 ml-2">
          {value.map((item, index) => (
            <li key={index} className="text-sm">{renderValue(item, depth + 1)}</li>
          ))}
        </ul>
      );
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return <span className="text-muted-foreground italic">Empty</span>;
      }
      return (
        <div className={`space-y-2 ${depth > 0 ? 'ml-4 border-l-2 border-muted pl-3' : ''}`}>
          {entries.map(([key, val]) => (
            <div key={key}>
              <span className="font-medium text-primary capitalize">{key.replace(/_/g, ' ')}:</span>
              <div className="mt-1">{renderValue(val, depth + 1)}</div>
            </div>
          ))}
        </div>
      );
    }
    
    return <span className="text-sm">{String(value)}</span>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {medication.generic_name}
            {medication.high_alert && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                High Alert
              </Badge>
            )}
            {medication.controlled_substance && (
              <Badge variant="outline" className="ml-1">
                <Shield className="w-3 h-3 mr-1" />
                Controlled
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => handleEditClick()}
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4">
            <Badge variant={medication.content_status === 'pending_review' ? 'default' : 'secondary'}>
              {medication.content_status}
            </Badge>
            {medication.review_tier && (
              <Badge variant="outline">
                Tier: {medication.review_tier.replace('_', ' ')}
              </Badge>
            )}
            {medication.last_synced_at && (
              <span className="text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last synced: {new Date(medication.last_synced_at).toLocaleDateString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="review" className="flex-1">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="review" className="text-xs sm:text-sm">
              <Flag className="w-3 h-3 mr-1 hidden sm:inline" />
              Review
            </TabsTrigger>
            <TabsTrigger value="safety" className="text-xs sm:text-sm">
              <AlertTriangle className="w-3 h-3 mr-1 hidden sm:inline" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="clinical" className="text-xs sm:text-sm">
              <Activity className="w-3 h-3 mr-1 hidden sm:inline" />
              Clinical
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-xs sm:text-sm">
              <GitCompare className="w-3 h-3 mr-1 hidden sm:inline" />
              Compare
            </TabsTrigger>
            <TabsTrigger value="validation" className="text-xs sm:text-sm">
              <Shield className="w-3 h-3 mr-1 hidden sm:inline" />
              Validation
            </TabsTrigger>
            <TabsTrigger value="nursing" className="text-xs sm:text-sm">
              <Pill className="w-3 h-3 mr-1 hidden sm:inline" />
              Nursing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="mt-4">
            <ScrollArea className="h-[45vh] pr-4">
              <div className="space-y-6">
                {/* Quick Safety Panel - Boxed Warning */}
                {(medication.safety_info as { boxed_warning?: string } | null)?.boxed_warning && (
                  <div className="border-2 border-destructive rounded-lg overflow-hidden">
                    <div className="bg-destructive text-destructive-foreground px-3 py-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-wide">Black Box Warning</span>
                    </div>
                    <div className="p-3 bg-destructive/5">
                      <p className="text-sm leading-relaxed">
                        {(medication.safety_info as { boxed_warning?: string }).boxed_warning}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contraindications Quick View */}
                {(medication.safety_info as { contraindications?: string[] } | null)?.contraindications && 
                 (medication.safety_info as { contraindications?: string[] }).contraindications!.length > 0 && (
                  <div className="border rounded-lg p-3 space-y-2 border-amber-500/30 bg-amber-500/5">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <Shield className="w-4 h-4" />
                      Contraindications ({(medication.safety_info as { contraindications?: string[] }).contraindications!.length})
                    </h4>
                    <ul className="space-y-1">
                      {(medication.safety_info as { contraindications?: string[] }).contraindications!.slice(0, 5).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                      {(medication.safety_info as { contraindications?: string[] }).contraindications!.length > 5 && (
                        <li className="text-xs text-muted-foreground pl-4">
                          ...and {(medication.safety_info as { contraindications?: string[] }).contraindications!.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Review Tier Override */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Review Tier Assignment
                  </label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select review tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {REVIEW_TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${tier.color}`}>
                              {tier.label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Override the auto-assigned tier based on your clinical judgment.
                  </p>
                </div>

                {/* Review Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Notes</label>
                  <Textarea
                    placeholder="Add clinical notes, concerns, or instructions for other reviewers..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Required for escalation. Visible to all reviewers.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                  <h4 className="font-medium text-sm">Quick Actions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                      onClick={handleEscalate}
                      disabled={isSubmitting}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Escalate to Pharmacist
                      <span className="ml-auto text-xs text-muted-foreground">Requires notes</span>
                    </Button>
                    <p className="text-xs text-muted-foreground pl-6">
                      Flags for senior clinical review. Use for safety concerns, unusual dosing, or policy questions.
                    </p>
                  </div>
                </div>

                {/* Validation Summary */}
                {validationResults && (
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Validation Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Score:</span>{' '}
                        <span className="font-medium">{validationResults.score}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Auto-Tier:</span>{' '}
                        <span className="font-medium capitalize">{validationResults.tier?.replace('_', ' ')}</span>
                      </div>
                      {validationResults.flags && validationResults.flags.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Flags:</span>{' '}
                          <span className="text-amber-600">{validationResults.flags.length} issue(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="safety" className="mt-4">
            <SafetyAlertsTab
              safetyInfo={medication.safety_info}
              drugInteractions={medication.drug_interactions_info}
              highAlert={medication.high_alert}
              controlledSubstance={medication.controlled_substance}
              fdaLabelData={medication.fda_label_data}
            />
          </TabsContent>

          <TabsContent value="clinical" className="mt-4">
            <ClinicalDataTab
              dosingInfo={medication.dosing_info}
              pharmacokinetics={medication.pharmacokinetics}
              adverseReactions={medication.adverse_reactions}
              holdParameters={medication.hold_parameters}
              monitoring={medication.monitoring}
              drugClass={medication.drug_class}
              routes={medication.route}
            />
          </TabsContent>
          
          <TabsContent value="compare" className="mt-4">
            <FDAComparisonView
              fdaLabelData={medication.fda_label_data as Record<string, unknown> | null}
              aiGeneratedContent={aiContent}
              safetyInfo={medication.safety_info as Record<string, unknown> | null}
              dosingInfo={medication.dosing_info as Record<string, unknown> | null}
              adverseReactions={medication.adverse_reactions as Record<string, unknown> | null}
              onEditSection={handleEditClick}
            />
          </TabsContent>

          <TabsContent value="validation" className="mt-4">
            <ScrollArea className="h-[45vh] pr-4">
              <ValidationScoreCard validation={validationResults} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="nursing" className="mt-4">
            <ScrollArea className="h-[45vh] pr-4">
              {aiContent ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">AI-Generated Nursing Guide for Review</span>
                  </div>
                  
                  {Object.entries(aiContent).map(([route, content]) => (
                    <div key={route} className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold text-lg capitalize border-b pb-2">
                        Route: {route.replace(/_/g, ' ')}
                      </h4>
                      {content.guide && (
                        <div className="space-y-4">
                          {renderValue(content.guide)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No AI-generated nursing guide available for this medication.</p>
                  <p className="text-sm mt-2">
                    Use "Smart Sync" to generate nursing content for review.
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Edit Dialog */}
      <MedicationEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        medicationId={medication.id}
        onSaved={handleEditSaved}
        initialTab={editDialogTab}
      />
    </Dialog>
  );
};

export default PendingReviewDialog;
