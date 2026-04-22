import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BATCH_SIZE = 20;

const CONTENT_COLUMNS = `id, generic_name, content_status, nursing_guide, dosing_info, pharmacokinetics, 
  adverse_reactions, drug_interactions_info, patient_education, safety_info, clinical_pearls,
  administration_info, monitoring, hold_parameters, red_flags, crushing_info, timing_rules,
  rate_dilution, safe_method, line_compatibility, required_resources, expected_effect,
  pause_triggers, documentation_reminders, safety_badges, double_check_required, high_alert,
  controlled_substance, adjustments, reviewed_at, reviewed_by, review_notes, review_tier`;

export default function SyncToLivePanel() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState({ synced: 0, total: 0, errors: [] as string[] });
  const [approvedCount, setApprovedCount] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkApproved = async () => {
    setIsChecking(true);
    const { count } = await supabase
      .from('medications')
      .select('id', { count: 'exact', head: true })
      .eq('content_status', 'approved');
    setApprovedCount(count ?? 0);
    setIsChecking(false);
  };

  const syncToLive = async () => {
    setIsSyncing(true);
    setProgress({ synced: 0, total: 0, errors: [] });

    try {
      // Fetch all approved medications from Test
      const { data: approvedMeds, error: fetchError } = await supabase
        .from('medications')
        .select(CONTENT_COLUMNS)
        .eq('content_status', 'approved');

      if (fetchError) throw fetchError;
      if (!approvedMeds || approvedMeds.length === 0) {
        toast({ title: 'No approved medications to sync' });
        setIsSyncing(false);
        return;
      }

      setProgress(p => ({ ...p, total: approvedMeds.length }));

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Send in batches to the edge function
      let totalSynced = 0;
      const allErrors: string[] = [];

      for (let i = 0; i < approvedMeds.length; i += BATCH_SIZE) {
        const batch = approvedMeds.slice(i, i + BATCH_SIZE);

        // Refresh token before each batch
        const { data: refreshed } = await supabase.auth.refreshSession();
        const token = refreshed?.session?.access_token || session.access_token;

        const response = await supabase.functions.invoke('sync-medications-to-live', {
          body: { medications: batch },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.error) {
          allErrors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${response.error.message}`);
        } else if (response.data) {
          totalSynced += response.data.synced || 0;
          if (response.data.errors) {
            allErrors.push(...response.data.errors);
          }
        }

        setProgress({ synced: totalSynced, total: approvedMeds.length, errors: allErrors });
      }

      toast({
        title: `Synced ${totalSynced} of ${approvedMeds.length} medications to Live`,
        variant: allErrors.length > 0 ? 'destructive' : 'default',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Sync failed', description: message, variant: 'destructive' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Sync Approved Content to Live
        </CardTitle>
        <CardDescription>
          Push all approved medication content from Test to the Live/published database.
          This updates nursing guides, dosing info, and all clinical content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={checkApproved} disabled={isChecking}>
            {isChecking ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
            Check Approved Count
          </Button>
          {approvedCount !== null && (
            <Badge variant="secondary">{approvedCount} approved medications</Badge>
          )}
        </div>

        <Button onClick={syncToLive} disabled={isSyncing} className="w-full">
          {isSyncing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Syncing {progress.synced} / {progress.total}...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Sync All Approved to Live
            </>
          )}
        </Button>

        {progress.total > 0 && !isSyncing && (
          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Synced {progress.synced} of {progress.total} medications</span>
            </div>
            {progress.errors.length > 0 && (
              <div className="space-y-1">
                {progress.errors.slice(0, 5).map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-destructive">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
                {progress.errors.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    +{progress.errors.length - 5} more errors
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          <strong>Important:</strong> You must publish your app first so this function is deployed to Live. 
          Then trigger this sync from the published app to update Live data.
        </p>
      </CardContent>
    </Card>
  );
}
