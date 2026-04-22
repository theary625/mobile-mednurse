import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause,
  CheckCircle2, 
  XCircle,
  Loader2,
  Database,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SyncResult {
  medication_id: string;
  medication_name: string;
  success: boolean;
  error?: string;
  set_id?: string;
}

interface BatchStats {
  total_medications: number;
  with_fda_data: number;
  missing_fda_data: number;
}

const FDABatchImport = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<BatchStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SyncResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentMed, setCurrentMed] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      // Get total count
      const { count: total } = await supabase
        .from('medications')
        .select('*', { count: 'exact', head: true });

      // Get count with FDA data
      const { count: withFda } = await supabase
        .from('medications')
        .select('*', { count: 'exact', head: true })
        .not('fda_set_id', 'is', null);

      setStats({
        total_medications: total || 0,
        with_fda_data: withFda || 0,
        missing_fda_data: (total || 0) - (withFda || 0),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const runBatchSync = async (mode: 'missing' | 'outdated') => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    setCurrentMed('Starting...');

    try {
      // Create an AbortController with a 120 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      try {
        const { data, error } = await supabase.functions.invoke('batch-fda-sync', {
          body: { mode },
        });

        clearTimeout(timeoutId);

        if (error) throw error;

      if (data.success) {
        setResults(data.results || []);
        setProgress(100);
        setCurrentMed(null);

        toast({
          title: 'Batch Sync Complete',
          description: `${data.succeeded} succeeded, ${data.failed} failed out of ${data.total} medications`,
        });

        // Refresh stats
        fetchStats();
      } else {
        throw new Error(data.error || 'Batch sync failed');
      }
      } catch (innerError) {
        clearTimeout(timeoutId);
        throw innerError;
      }
    } catch (error) {
      console.error('Batch sync error:', error);
      const isTimeout = error instanceof Error && 
        (error.name === 'AbortError' || error.message.includes('abort') || error.message.includes('Failed to fetch'));
      
      if (isTimeout) {
        // The function is probably still running - refresh stats to check
        toast({
          title: 'Sync In Progress',
          description: 'The sync is taking longer than expected. Check back in a moment and refresh stats.',
        });
        // Wait a bit then refresh stats
        setTimeout(() => fetchStats(), 5000);
      } else {
        toast({
          title: 'Batch Sync Failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
      }
    } finally {
      setIsRunning(false);
      setCurrentMed(null);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4" />
                FDA Label Coverage
              </CardTitle>
              <CardDescription>
                Overview of medications with FDA label data
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchStats} disabled={isLoadingStats}>
              <RefreshCw className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stats.total_medications}</p>
                  <p className="text-xs text-muted-foreground">Total Medications</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{stats.with_fda_data}</p>
                  <p className="text-xs text-muted-foreground">With FDA Data</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">{stats.missing_fda_data}</p>
                  <p className="text-xs text-muted-foreground">Missing FDA Data</p>
                </div>
              </div>

              <Progress 
                value={stats.total_medications > 0 ? (stats.with_fda_data / stats.total_medications) * 100 : 0} 
                className="h-2"
              />
              <p className="text-xs text-center text-muted-foreground">
                {stats.total_medications > 0 
                  ? `${Math.round((stats.with_fda_data / stats.total_medications) * 100)}% coverage`
                  : 'No medications found'}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Batch Import Actions</CardTitle>
          <CardDescription>
            Automatically search and sync FDA labels for multiple medications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => runBatchSync('missing')}
              disabled={isRunning || (stats?.missing_fda_data === 0)}
              className="h-auto py-3 flex-col"
            >
              {isRunning ? (
                <Loader2 className="w-5 h-5 mb-1 animate-spin" />
              ) : (
                <Play className="w-5 h-5 mb-1" />
              )}
              <span className="text-sm font-medium">Sync Missing</span>
              <span className="text-xs opacity-70">
                {stats?.missing_fda_data || 0} medications
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => runBatchSync('outdated')}
              disabled={isRunning}
              className="h-auto py-3 flex-col"
            >
              {isRunning ? (
                <Loader2 className="w-5 h-5 mb-1 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5 mb-1" />
              )}
              <span className="text-sm font-medium">Update Outdated</span>
              <span className="text-xs opacity-70">Older than 90 days</span>
            </Button>
          </div>

          {/* Progress indicator */}
          {isRunning && (
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
              {currentMed && (
                <p className="text-xs text-muted-foreground truncate">
                  Current: {currentMed}
                </p>
              )}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && !isRunning && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{successCount} succeeded</span>
                </div>
                <div className="flex items-center gap-1 text-destructive">
                  <XCircle className="w-4 h-4" />
                  <span>{failCount} failed</span>
                </div>
              </div>

              <ScrollArea className="h-[200px] border rounded-md">
                <div className="p-2 space-y-1">
                  {results.map((result, index) => (
                    <div
                      key={`${result.medication_id}-${index}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {result.success ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                        )}
                        <span className="text-sm truncate">{result.medication_name}</span>
                      </div>
                      {result.success ? (
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          Synced
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs flex-shrink-0">
                          {result.error?.substring(0, 20) || 'Failed'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Batch sync processes up to 25 medications at a time to avoid timeouts.
          Run multiple times to sync more medications. If a timeout occurs, the sync continues in the background.
        </p>
      </div>
    </div>
  );
};

export default FDABatchImport;
