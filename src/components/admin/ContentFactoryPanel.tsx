import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  Factory,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FactoryResult {
  id: string;
  name: string;
  success: boolean;
  approved: boolean;
  error?: string;
}

interface ContentFactoryPanelProps {
  onComplete: () => void;
}

export default function ContentFactoryPanel({ onComplete }: ContentFactoryPanelProps) {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [autoApprove, setAutoApprove] = useState(true);
  const stopRef = useRef(false);
  const [currentBatch, setCurrentBatch] = useState<string[]>([]);
  const [progress, setProgress] = useState({
    total: 0,
    processed: 0,
    generated: 0,
    approved: 0,
    failed: 0,
    results: [] as FactoryResult[],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  const fetchPendingCount = useCallback(async () => {
    const { count } = await supabase
      .from('medications')
      .select('id', { count: 'exact', head: true })
      .in('content_status', ['draft', 'pending_review'])
      .or('nursing_guide.is.null,nursing_guide.eq.{}');
    setPendingCount(count ?? 0);
    return count ?? 0;
  }, []);

  const startFactory = async () => {
    setShowConfirm(false);
    setIsRunning(true);
    stopRef.current = false;

    setProgress({ total: 0, processed: 0, generated: 0, approved: 0, failed: 0, results: [] });
    setCurrentBatch([]);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.access_token) {
      toast({ title: 'Not authenticated', variant: 'destructive' });
      setIsRunning(false);
      return;
    }

    let totalProcessed = 0;
    let totalGenerated = 0;
    let totalApproved = 0;
    let totalFailed = 0;
    const allResults: FactoryResult[] = [];

    while (!stopRef.current) {
      // Fetch next batch of medications needing content
      const { data: batch } = await supabase
        .from('medications')
        .select('id, generic_name')
        .in('content_status', ['draft', 'pending_review'])
        .or('nursing_guide.is.null,nursing_guide.eq.{}')
        .order('generic_name')
        .limit(3);

      if (!batch?.length) {
        toast({ title: '🏭 Content Factory Complete', description: 'All medications have been processed!' });
        window.dispatchEvent(new CustomEvent('content-factory-complete'));
        break;
      }

      const batchIds = batch.map(m => m.id);

      const batchNames = batch.map(m => m.generic_name);
      setCurrentBatch(batchNames);

      setProgress(prev => ({
        ...prev,
        total: (pendingCount ?? prev.total),
      }));

      try {
        // Refresh token before each batch to avoid expiration
        const { data: freshSession } = await supabase.auth.getSession();
        const freshToken = freshSession.session?.access_token;
        if (!freshToken) {
          toast({ title: 'Session expired, please log in again', variant: 'destructive' });
          break;
        }

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/batch-content-factory`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${freshToken}`,
            },
            body: JSON.stringify({
              medicationIds: batchIds,
              autoApprove,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          totalFailed += batchIds.length;
          toast({
            title: 'Batch failed',
            description: result.error || 'Unknown error',
            variant: 'destructive',
          });
          // If rate limited, stop
          if (response.status === 429) break;
          continue;
        }

        totalProcessed += result.generated + result.failed;
        totalGenerated += result.generated || 0;
        totalApproved += result.approved || 0;
        totalFailed += result.failed || 0;

        if (result.results) {
          allResults.push(...result.results);
        }

        setProgress({
          total: pendingCount ?? totalProcessed,
          processed: totalProcessed,
          generated: totalGenerated,
          approved: totalApproved,
          failed: totalFailed,
          results: allResults,
        });
      } catch (err) {
        console.error('Factory batch error:', err);
        totalFailed += batchIds.length;
        totalProcessed += batchIds.length;

        setProgress({
          total: pendingCount ?? totalProcessed,
          processed: totalProcessed,
          generated: totalGenerated,
          approved: totalApproved,
          failed: totalFailed,
          results: allResults,
        });
      }

      // Delay between batches
      await new Promise(r => setTimeout(r, 1500));
    }

    setCurrentBatch([]);
    setIsRunning(false);
    onComplete();
  };

  const handleStart = async () => {
    const count = await fetchPendingCount();
    if (count === 0) {
      toast({ title: 'No medications need content', description: 'All medications already have nursing guides.' });
      return;
    }
    setPendingCount(count);
    setShowConfirm(true);
  };

  const progressPercent = progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : 0;

  return (
    <div className="space-y-4">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-primary" />
            Content Factory
          </CardTitle>
          <CardDescription>
            Automatically generate nursing guides, clinical details, patient education, and safety info for all medications missing content. High-alert and controlled substances always require manual review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Switch
                id="auto-approve"
                checked={autoApprove}
                onCheckedChange={setAutoApprove}
                disabled={isRunning}
              />
              <Label htmlFor="auto-approve" className="text-sm">
                Auto-approve non-high-alert medications
              </Label>
            </div>

            {isRunning ? (
              <Button
                variant="destructive"
                onClick={() => {
                  stopRef.current = true;
                  toast({ title: 'Stopping...', description: 'Will stop after current batch completes.' });
                }}
                className="gap-2"
              >
                <Square className="w-4 h-4" />
                Stop Factory
              </Button>
            ) : (
              <Button onClick={handleStart} className="gap-2">
                <Play className="w-4 h-4" />
                Start Content Factory
              </Button>
            )}
          </div>

          {/* Progress */}
          {(isRunning || progress.processed > 0) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isRunning ? 'Processing...' : 'Complete'}
                </span>
                <span className="font-medium">{progress.processed} / {progress.total || '?'}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />

              {/* Currently processing */}
              {isRunning && currentBatch.length > 0 && (
                <div className="flex items-start gap-2 text-sm bg-muted/50 rounded-md p-2.5">
                  <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">Now processing:</span>
                    <div className="font-medium mt-0.5">
                      {currentBatch.map((name, i) => (
                        <span key={i}>
                          {name}{i < currentBatch.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>{progress.generated} generated</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>{progress.approved} approved</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>{progress.generated - progress.approved} pending review</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>{progress.failed} failed</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Results */}
          {progress.results.length > 0 && (
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground mb-2">Recent Results</p>
              {progress.results.slice(-20).reverse().map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-muted/50">
                  {r.success ? (
                    r.approved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  )}
                  <span className="truncate">{r.name}</span>
                  {r.approved && <Badge variant="secondary" className="text-[10px] px-1.5">approved</Badge>}
                  {r.success && !r.approved && <Badge variant="outline" className="text-[10px] px-1.5">needs review</Badge>}
                  {r.error && <span className="text-xs text-red-500 truncate">{r.error}</span>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5" />
              Start Content Factory
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will generate comprehensive content for <strong>{pendingCount}</strong> medications
                using AI.
              </p>
              {autoApprove ? (
                <p className="text-amber-600 dark:text-amber-400">
                  ⚡ Non-high-alert medications will be <strong>auto-approved</strong>.
                  High-alert and controlled substances will require manual review.
                </p>
              ) : (
                <p>All generated content will be set to "pending review" for manual approval.</p>
              )}
              <p className="text-xs text-muted-foreground">
                This may take several minutes depending on the number of medications.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={startFactory}>
              <Play className="w-4 h-4 mr-2" />
              Start Processing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
