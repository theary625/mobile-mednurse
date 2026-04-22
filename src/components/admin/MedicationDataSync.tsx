import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  RefreshCw, 
  Search, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Loader2,
  FileSearch,
  Eye,
  Zap,
  Trash2,
  Play,
  Square,
  Factory,
  Upload,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FDALabelSync from './FDALabelSync';
import PendingReviewDialog from './PendingReviewDialog';
import BatchSyncProgress from './BatchSyncProgress';
import ContentFactoryPanel from './ContentFactoryPanel';
import SyncToLivePanel from './SyncToLivePanel';
import { validateMedication, getCompletenessColor, getCompletenessBgColor } from '@/lib/medicationValidation';
import { Progress } from '@/components/ui/progress';

import type { ValidationResult } from '@/types/validation';

interface SyncLog {
  id: string;
  sync_type: string;
  medications_updated: number;
  medications_created: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  errors: Array<{ drug?: string; error: string }> | null;
}

interface PendingMedication {
  id: string;
  generic_name: string;
  content_status: string;
  last_synced_at: string | null;
  ai_generated_content: Record<string, unknown> | null;
  validation_results?: ValidationResult | null;
  review_tier?: string | null;
  ai_confidence_score?: number | null;
  high_alert?: boolean;
  controlled_substance?: boolean;
  review_notes?: string | null;
  // Clinical fields for review
  brand_names?: string[] | null;
  drug_class?: string | null;
  route?: string[] | null;
  safety_info?: {
    boxed_warning?: string;
    contraindications?: string[];
    warnings?: string[];
    precautions?: string[];
  } | null;
  dosing_info?: {
    standard_dose?: string;
    pediatric_dose?: string;
    max_dose?: string;
    renal_adjustment?: string;
    hepatic_adjustment?: string;
  } | null;
  fda_label_data?: Record<string, unknown> | null;
  drug_interactions_info?: Array<{
    drug: string;
    severity: string;
    effect: string;
    recommendation?: string;
  }> | null;
  adverse_reactions?: {
    common?: string[];
    serious?: string[];
  } | null;
  pharmacokinetics?: {
    half_life?: string;
    metabolism?: string;
    excretion?: string;
    onset?: string;
    duration?: string;
  } | null;
  hold_parameters?: Record<string, unknown> | null;
  monitoring?: Record<string, unknown> | null;
}

export type { PendingMedication };

const MedicationDataSync = () => {
  const { toast } = useToast();
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [pendingReview, setPendingReview] = useState<PendingMedication[]>([]);
  const [syncedMedications, setSyncedMedications] = useState<PendingMedication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');
  const [syncedSearchTerm, setSyncedSearchTerm] = useState('');
  const [syncedSortByCompleteness, setSyncedSortByCompleteness] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<PendingMedication | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncedLoading, setIsSyncedLoading] = useState(false);
  
  // Batch processing state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedSyncedIds, setSelectedSyncedIds] = useState<Set<string>>(new Set());
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ total: 0, processed: 0, results: [] as Array<{
    medicationId: string;
    genericName: string;
    fdaSynced: boolean;
    guideGenerated: boolean;
    error?: string;
  }> });
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  
  // Auto-sync state
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const autoSyncStopRef = useRef(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSyncLogs = async () => {
    const { data, error } = await supabase
      .from('medication_sync_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching sync logs:', error);
    } else {
      setSyncLogs((data || []) as unknown as SyncLog[]);
    }
  };

  const fetchPendingReview = async () => {
    setIsLoading(true);
    // Fetch medications that haven't been synced yet (no AI content)
    const { data, error } = await supabase
      .from('medications')
      .select(`
        id, generic_name, content_status, last_synced_at, ai_generated_content,
        validation_results, review_tier, ai_confidence_score, high_alert, 
        controlled_substance, review_notes, brand_names, drug_class, route,
        safety_info, dosing_info, fda_label_data, drug_interactions_info,
        adverse_reactions, pharmacokinetics, hold_parameters, monitoring
      `)
      .in('content_status', ['pending_review', 'draft'])
      .is('ai_generated_content', null)
      .order('generic_name', { ascending: true });

    if (error) {
      console.error('Error fetching pending medications:', error);
    } else {
      setPendingReview((data || []) as unknown as PendingMedication[]);
    }
    setIsLoading(false);
  };

  const fetchSyncedMedications = async () => {
    setIsSyncedLoading(true);
    // Fetch medications that have completed smart sync (have AI content)
    const { data, error } = await supabase
      .from('medications')
      .select(`
        id, generic_name, content_status, last_synced_at, ai_generated_content,
        validation_results, review_tier, ai_confidence_score, high_alert, 
        controlled_substance, review_notes, brand_names, drug_class, route,
        safety_info, dosing_info, fda_label_data, drug_interactions_info,
        adverse_reactions, pharmacokinetics, hold_parameters, monitoring
      `)
      .in('content_status', ['pending_review', 'draft'])
      .not('ai_generated_content', 'is', null)
      .order('last_synced_at', { ascending: false })
      .limit(5000);

    if (error) {
      console.error('Error fetching synced medications:', error);
    } else {
      setSyncedMedications((data || []) as unknown as PendingMedication[]);
    }
    setIsSyncedLoading(false);
  };

  // Fetch counts on mount for tab badges
  useEffect(() => {
    fetchPendingReview();
    fetchSyncedMedications();
  }, []);

  const syncFromOpenFDA = async (singleMedId?: string) => {
    setIsSyncing(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-openfda`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({
            searchTerm: searchTerm || undefined,
            medicationId: singleMedId || undefined,
          }),
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Sync failed');
      }

      toast({
        title: 'OpenFDA Sync Complete',
        description: `Created: ${result.created}, Updated: ${result.updated}${result.errors?.length ? `, Errors: ${result.errors.length}` : ''}`,
      });

      fetchSyncLogs();
      fetchPendingReview();
      fetchSyncedMedications();
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const generateNursingGuide = async (medicationId: string, route?: string) => {
    setIsGenerating(medicationId);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-nursing-guide`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({ medicationId, route }),
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Generation failed');
      }

      toast({
        title: 'Nursing Guide Generated',
        description: 'Content saved for review',
      });

      fetchPendingReview();
      fetchSyncedMedications();
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const approveContent = async (medicationId: string) => {
    try {
      // Get the medication's AI-generated content
      const { data: med } = await supabase
        .from('medications')
        .select('ai_generated_content, nursing_guide')
        .eq('id', medicationId)
        .single();

      if (!med) {
        throw new Error('Medication not found');
      }

      const aiContent = med.ai_generated_content as Record<string, { guide: Record<string, unknown> }> | null;
      const currentGuide = (med.nursing_guide as Record<string, unknown>) || {};

      // Merge AI-generated content into nursing_guide
      const mergedGuide = { ...currentGuide };
      if (aiContent) {
        for (const [route, content] of Object.entries(aiContent)) {
          mergedGuide[route] = content.guide;
        }
      }

      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('medications')
        .update({
          nursing_guide: mergedGuide as unknown as Record<string, never>,
          content_status: 'approved',
          reviewed_by: session.session?.user.id,
          reviewed_at: new Date().toISOString(),
          ai_generated_content: null,
        })
        .eq('id', medicationId);

      if (error) throw error;

      toast({
        title: 'Content Approved',
        description: 'Nursing guide has been published',
      });

      fetchPendingReview();
      fetchSyncedMedications();
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: 'Approval Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const rejectContent = async (medicationId: string, notes?: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('medications')
        .update({
          content_status: 'rejected',
          reviewed_by: session.session?.user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes || 'Content did not meet clinical standards',
          ai_generated_content: null,
        })
        .eq('id', medicationId);

      if (error) throw error;

      toast({
        title: 'Content Rejected',
        description: 'Medication marked for manual review',
      });

      fetchPendingReview();
      fetchSyncedMedications();
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: 'Rejection Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  // Delete medications
  const confirmDelete = (ids: string[]) => {
    setDeletingIds(ids);
    setDeleteConfirmOpen(true);
  };

  const deleteMedications = async () => {
    if (deletingIds.length === 0) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .in('id', deletingIds);

      if (error) throw error;

      toast({
        title: 'Medications Deleted',
        description: `Successfully deleted ${deletingIds.length} medication(s)`,
      });

      // Clear selection if bulk delete
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        deletingIds.forEach(id => newSet.delete(id));
        return newSet;
      });
      setSelectedSyncedIds(prev => {
        const newSet = new Set(prev);
        deletingIds.forEach(id => newSet.delete(id));
        return newSet;
      });
      
      fetchPendingReview();
      fetchSyncedMedications();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setDeletingIds([]);
    }
  };
  const smartSync = async (medicationIds: string[]) => {
    if (medicationIds.length === 0) return;
    
    setIsBatchProcessing(true);
    
    const BATCH_SIZE = 10;
    const batches = [];
    for (let i = 0; i < medicationIds.length; i += BATCH_SIZE) {
      batches.push(medicationIds.slice(i, i + BATCH_SIZE));
    }
    
    const totalResults = {
      total: medicationIds.length,
      processed: 0,
      fdaSynced: 0,
      guidesGenerated: 0,
      errors: [] as Array<{ medicationId: string; error: string }>,
      results: [] as Array<{ medicationId: string; genericName: string; fdaSynced: boolean; guideGenerated: boolean; validated: boolean; validationScore?: number; reviewTier?: string; error?: string }>,
    };
    
    setBatchProgress({ total: medicationIds.length, processed: 0, results: [] });
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Not authenticated');
      }

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        
        toast({
          title: `Processing batch ${batchIndex + 1}/${batches.length}`,
          description: `Syncing ${batch.length} medications...`,
        });

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-medication-sync`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.session.access_token}`,
            },
            body: JSON.stringify({
              medicationIds: batch,
              skipIfRecentSync: false,
              generateGuide: true,
            }),
          }
        );

        const result = await response.json();
        
        if (!response.ok) {
          // Log batch error but continue with other batches
          console.error(`Batch ${batchIndex + 1} failed:`, result.error);
          batch.forEach(id => {
            totalResults.errors.push({ medicationId: id, error: result.error || 'Batch failed' });
          });
        } else {
          totalResults.processed += result.processed || 0;
          totalResults.fdaSynced += result.fdaSynced || 0;
          totalResults.guidesGenerated += result.guidesGenerated || 0;
          if (result.errors) totalResults.errors.push(...result.errors);
          if (result.results) totalResults.results.push(...result.results);
        }

        setBatchProgress({
          total: medicationIds.length,
          processed: totalResults.processed,
          results: totalResults.results,
        });

        // Small delay between batches to avoid overwhelming the server
        if (batchIndex < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      toast({
        title: 'Smart Sync Complete',
        description: `FDA synced: ${totalResults.fdaSynced}, Guides generated: ${totalResults.guidesGenerated}${totalResults.errors.length ? `, Errors: ${totalResults.errors.length}` : ''}`,
      });

      // Clear selection and refresh
      setSelectedIds(new Set());
      setSelectedSyncedIds(new Set());
      fetchPendingReview();
      fetchSyncedMedications();
      fetchSyncLogs();
    } catch (error) {
      console.error('Smart sync error:', error);
      toast({
        title: 'Smart Sync Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsBatchProcessing(false);
    }
  };

  // Auto sync 10 at a time until list is empty
  const startAutoSync = async () => {
    setIsAutoSyncing(true);
    autoSyncStopRef.current = false;
    
    // Get fresh list of pending medications
    let currentPending = [...pendingReview];
    
    while (currentPending.length > 0 && !autoSyncStopRef.current) {
      // Take first 10
      const batch = currentPending.slice(0, 10);
      const batchIds = batch.map(m => m.id);
      
      toast({
        title: `Auto Sync: ${currentPending.length} remaining`,
        description: `Processing next ${batch.length} medications...`,
      });
      
      // Run smart sync on this batch
      await smartSync(batchIds);
      
      // Check if stopped during sync
      if (autoSyncStopRef.current) break;
      
      // Fetch fresh pending list after sync
      const { data } = await supabase
        .from('medications')
        .select(`
          id, generic_name, content_status, last_synced_at, ai_generated_content,
          validation_results, review_tier, ai_confidence_score, high_alert, 
          controlled_substance, review_notes, brand_names, drug_class, route,
          safety_info, dosing_info, fda_label_data, drug_interactions_info,
          adverse_reactions, pharmacokinetics, hold_parameters, monitoring
        `)
        .in('content_status', ['pending_review', 'draft'])
        .is('ai_generated_content', null)
        .order('generic_name', { ascending: true });
      
      currentPending = (data || []) as unknown as PendingMedication[];
      setPendingReview(currentPending);
      
      // Small delay between auto-sync batches
      if (currentPending.length > 0 && !autoSyncStopRef.current) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    setIsAutoSyncing(false);
    
    if (currentPending.length === 0) {
      toast({
        title: 'Auto Sync Complete',
        description: 'All pending medications have been synced!',
      });
    } else {
      toast({
        title: 'Auto Sync Stopped',
        description: `${currentPending.length} medications still pending`,
      });
    }
    
    fetchSyncedMedications();
  };
  
  const stopAutoSync = () => {
    autoSyncStopRef.current = true;
    toast({
      title: 'Stopping Auto Sync',
      description: 'Will stop after current batch completes...',
    });
  };

  const toggleSelectAll = () => {
    const filteredMeds = pendingReview.filter(med => 
      !reviewSearchTerm || 
      med.generic_name.toLowerCase().includes(reviewSearchTerm.toLowerCase())
    );
    
    if (selectedIds.size === filteredMeds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMeds.map(m => m.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'running':
        return <Badge variant="outline"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Running</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getContentStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary">Approved</Badge>;
      case 'pending_review':
        return <Badge variant="outline">Pending Review</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Medication Data Sync
          </CardTitle>
          <CardDescription>
            Import official drug data from OpenFDA and generate AI nursing guides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sync" onValueChange={(v) => {
            if (v === 'sync') fetchSyncLogs();
            if (v === 'review') fetchPendingReview();
            if (v === 'synced') fetchSyncedMedications();
          }}>
            <TabsList className="mb-4 flex-wrap h-auto gap-1">
              <TabsTrigger value="factory">
                <Factory className="w-4 h-4 mr-1" />
                Content Factory
              </TabsTrigger>
              <TabsTrigger value="sync">OpenFDA Sync</TabsTrigger>
              <TabsTrigger value="fda-labels">
                <FileSearch className="w-4 h-4 mr-1" />
                FDA Labels
              </TabsTrigger>
              <TabsTrigger value="review">
                Pending Sync
                {pendingReview.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">{pendingReview.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="synced">
                <Sparkles className="w-4 h-4 mr-1" />
                Ready for Review
                {syncedMedications.length > 0 && (
                  <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0 border-primary text-primary">{syncedMedications.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history">Sync History</TabsTrigger>
              <TabsTrigger value="sync-live">
                <Upload className="w-4 h-4 mr-1" />
                Sync to Live
              </TabsTrigger>
            </TabsList>

            <TabsContent value="factory">
              <ContentFactoryPanel onComplete={() => {
                fetchPendingReview();
                fetchSyncedMedications();
              }} />
            </TabsContent>

            <TabsContent value="sync-live">
              <SyncToLivePanel />
            </TabsContent>

            <TabsContent value="sync" className="space-y-4">
              {/* OpenFDA Sync */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    OpenFDA Sync
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search drug name (optional)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => syncFromOpenFDA()}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      {searchTerm ? 'Search & Import' : 'Sync All Outdated'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Imports official FDA drug labels including dosing, warnings, and interactions.
                    Without a search term, syncs medications not updated in the last 7 days.
                  </p>
                </CardContent>
              </Card>

              {/* AI Nursing Guide Generator */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Nursing Guide Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate nursing administration guides using AI. Content is saved for clinical review before publishing.
                  </p>
                  <Button variant="outline" onClick={fetchPendingReview}>
                    <FileText className="w-4 h-4 mr-2" />
                    View Medications Needing Guides
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fda-labels">
              <FDALabelSync />
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              {/* Batch processing progress */}
              {(isBatchProcessing || batchProgress.results.length > 0) && (
                <BatchSyncProgress
                  isProcessing={isBatchProcessing}
                  total={batchProgress.total}
                  processed={batchProgress.processed}
                  results={batchProgress.results}
                />
              )}

              {/* Search and batch actions bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medications..."
                    value={reviewSearchTerm}
                    onChange={(e) => setReviewSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {/* Auto Sync 10 button - always visible when there are pending items */}
                  {pendingReview.length > 0 && (
                    isAutoSyncing ? (
                      <Button
                        variant="outline"
                        onClick={stopAutoSync}
                        className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Square className="w-4 h-4" />
                        Stop Auto Sync
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={startAutoSync}
                        disabled={isBatchProcessing || isDeleting}
                        className="gap-2 border-primary"
                      >
                        <Play className="w-4 h-4" />
                        Auto Sync 10
                      </Button>
                    )
                  )}
                  {selectedIds.size > 0 && (
                    <>
                      <Button
                        onClick={() => smartSync(Array.from(selectedIds))}
                        disabled={isBatchProcessing || isDeleting || isAutoSyncing}
                        className="gap-2"
                      >
                        {isBatchProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        Smart Sync ({selectedIds.size})
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => confirmDelete(Array.from(selectedIds))}
                        disabled={isBatchProcessing || isDeleting || isAutoSyncing}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete ({selectedIds.size})
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : pendingReview.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No medications pending sync</p>
                  <p className="text-sm mt-1">All medications have been synced</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Select all header */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg">
                    <Checkbox
                      checked={selectedIds.size === pendingReview.filter(med => 
                        !reviewSearchTerm || 
                        med.generic_name.toLowerCase().includes(reviewSearchTerm.toLowerCase())
                      ).length && selectedIds.size > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      {selectedIds.size > 0 
                        ? `${selectedIds.size} selected` 
                        : 'Select all'}
                    </span>
                  </div>

                  {pendingReview
                    .filter(med => 
                      !reviewSearchTerm || 
                      med.generic_name.toLowerCase().includes(reviewSearchTerm.toLowerCase())
                    )
                    .map((med) => (
                    <Card key={med.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedIds.has(med.id)}
                          onCheckedChange={() => toggleSelect(med.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-medium">{med.generic_name}</h4>
                            {getContentStatusBadge(med.content_status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {med.last_synced_at 
                              ? `Last synced: ${new Date(med.last_synced_at).toLocaleDateString()}`
                              : 'Never synced'}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedMedication(med);
                              setIsDetailDialogOpen(true);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => smartSync([med.id])}
                            disabled={isBatchProcessing}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Smart Sync
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => confirmDelete([med.id])}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Synced Medications - Ready for Review */}
            <TabsContent value="synced" className="space-y-4">
              {/* Search and batch actions bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search synced medications..."
                    value={syncedSearchTerm}
                    onChange={(e) => setSyncedSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant={syncedSortByCompleteness ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSyncedSortByCompleteness(prev => !prev)}
                  className="gap-1.5 shrink-0"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {syncedSortByCompleteness ? 'Sorted: Least Complete' : 'Sort by Completeness'}
                </Button>
                <div className="flex gap-2 flex-wrap">
                  {syncedMedications.length > 0 && (
                    <Button
                      onClick={async () => {
                        const ids = syncedMedications.map(m => m.id);
                        for (const id of ids) {
                          await approveContent(id);
                        }
                        toast({ title: 'Bulk Approve Complete', description: `Approved ${ids.length} medications` });
                      }}
                      disabled={isBatchProcessing || isDeleting}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve All ({syncedMedications.length})
                    </Button>
                  )}
                  {selectedSyncedIds.size > 0 && (
                    <>
                      <Button
                        onClick={async () => {
                          const ids = Array.from(selectedSyncedIds);
                          for (const id of ids) {
                            await approveContent(id);
                          }
                          setSelectedSyncedIds(new Set());
                          toast({ title: 'Bulk Approve Complete', description: `Approved ${ids.length} medications` });
                        }}
                        disabled={isBatchProcessing || isDeleting}
                        variant="outline"
                        className="gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Selected ({selectedSyncedIds.size})
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => confirmDelete(Array.from(selectedSyncedIds))}
                        disabled={isBatchProcessing || isDeleting}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete ({selectedSyncedIds.size})
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {isSyncedLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : syncedMedications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No synced medications ready for review</p>
                  <p className="text-sm mt-1">Run Smart Sync on pending medications to generate AI content</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Select all header */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg">
                    <Checkbox
                      checked={selectedSyncedIds.size === syncedMedications.filter(med => 
                        !syncedSearchTerm || 
                        med.generic_name.toLowerCase().includes(syncedSearchTerm.toLowerCase())
                      ).length && selectedSyncedIds.size > 0}
                      onCheckedChange={() => {
                        const filteredMeds = syncedMedications.filter(med => 
                          !syncedSearchTerm || 
                          med.generic_name.toLowerCase().includes(syncedSearchTerm.toLowerCase())
                        );
                        if (selectedSyncedIds.size === filteredMeds.length) {
                          setSelectedSyncedIds(new Set());
                        } else {
                          setSelectedSyncedIds(new Set(filteredMeds.map(m => m.id)));
                        }
                      }}
                    />
                    <span className="text-sm font-medium">
                      {selectedSyncedIds.size > 0 
                        ? `${selectedSyncedIds.size} selected` 
                        : 'Select all'}
                    </span>
                  </div>

                  {syncedMedications
                    .filter(med => 
                      !syncedSearchTerm || 
                      med.generic_name.toLowerCase().includes(syncedSearchTerm.toLowerCase())
                    )
                    .sort((a, b) => {
                      if (!syncedSortByCompleteness) return 0;
                      const scoreA = validateMedication(a as unknown as Record<string, unknown>, 'approved').completenessScore;
                      const scoreB = validateMedication(b as unknown as Record<string, unknown>, 'approved').completenessScore;
                      return scoreA - scoreB;
                    })
                    .map((med) => {
                    const validation = validateMedication(med as unknown as Record<string, unknown>, 'approved');
                    const borderColor = validation.completenessScore >= 90 
                      ? 'border-green-500/40' 
                      : validation.completenessScore >= 70 
                        ? 'border-amber-500/40' 
                        : 'border-red-500/40';
                    return (
                    <Card key={med.id} className={`p-4 ${borderColor}`}>
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedSyncedIds.has(med.id)}
                          onCheckedChange={() => {
                            const newSet = new Set(selectedSyncedIds);
                            if (newSet.has(med.id)) {
                              newSet.delete(med.id);
                            } else {
                              newSet.add(med.id);
                            }
                            setSelectedSyncedIds(newSet);
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-medium">{med.generic_name}</h4>
                            {getContentStatusBadge(med.content_status)}
                            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Ready
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <span>
                              {med.last_synced_at 
                                ? `Synced: ${new Date(med.last_synced_at).toLocaleDateString()}`
                                : 'Never synced'}
                            </span>
                            <span className="text-muted-foreground">|</span>
                            <span className={getCompletenessColor(validation.completenessScore)}>
                              {validation.completenessScore}% complete
                            </span>
                          </div>
                          <div className="mb-2">
                            <Progress value={validation.completenessScore} className="h-1.5" />
                          </div>
                          {validation.missingFields.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-xs text-muted-foreground mr-1">Missing:</span>
                              {validation.missingFields.map(f => (
                                <Badge 
                                  key={f.field} 
                                  variant="outline" 
                                  className="text-[10px] px-1.5 py-0 border-amber-500/50 text-amber-600"
                                >
                                  {f.label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedMedication(med);
                              setIsDetailDialogOpen(true);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectContent(med.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => approveContent(med.id)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => confirmDelete([med.id])}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {syncLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No sync history yet</p>
                  <Button variant="link" onClick={fetchSyncLogs} className="mt-2">
                    Refresh
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {syncLogs.map((log) => (
                    <Card key={log.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="capitalize">
                              {log.sync_type.replace('_', ' ')}
                            </Badge>
                            {getStatusBadge(log.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.started_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          {log.medications_created > 0 && (
                            <p className="text-primary">+{log.medications_created} created</p>
                          )}
                          {log.medications_updated > 0 && (
                            <p className="text-muted-foreground">{log.medications_updated} updated</p>
                          )}
                          {log.errors && log.errors.length > 0 && (
                            <p className="text-destructive flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {log.errors.length} errors
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PendingReviewDialog
        medication={selectedMedication}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onReviewComplete={fetchPendingReview}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication{deletingIds.length > 1 ? 's' : ''}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingIds.length} medication{deletingIds.length > 1 ? 's' : ''}? 
              This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteMedications}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MedicationDataSync;
