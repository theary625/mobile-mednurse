import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Play,
  Square,
  Zap,
  RefreshCw,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fdaLabelsApi } from '@/lib/api/fda-labels';

interface SyncResult {
  id: string;
  name: string;
  success: boolean;
  error?: string;
  not_found?: boolean;
  fields?: string[];
}

const formatEta = (seconds: number): string => {
  if (seconds < 60) return `~${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `~${m}m ${s}s` : `~${m}m`;
};

const OpenFDALabelSync = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);
  const [onlyMissingData, setOnlyMissingData] = useState(true);
  const [batchSize, setBatchSize] = useState(10);
  const [results, setResults] = useState<SyncResult[]>([]);
  const [stats, setStats] = useState({ succeeded: 0, failed: 0, notFound: 0, remaining: 0, processed: 0 });
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [batchNum, setBatchNum] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [canResume, setCanResume] = useState(false);
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null);
  const stopRef = useRef(false);

  // Pre-fetch total count on mount and when filter changes
  useEffect(() => {
    const fetchCount = async () => {
      setTotalCount(null);
      const result = await fdaLabelsApi.getOpenFDASyncCount({ onlyMissingData });
      if (result.success && result.totalCount !== undefined) {
        setTotalCount(result.totalCount);
      }
    };
    fetchCount();
  }, [onlyMissingData]);

  // Compute ETA while running
  useEffect(() => {
    if (!isRunning || !startTime || stats.processed === 0) {
      setEtaSeconds(null);
      return;
    }
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = stats.processed / elapsed;
    if (rate > 0 && stats.remaining > 0) {
      setEtaSeconds(Math.round(stats.remaining / rate));
    } else {
      setEtaSeconds(null);
    }
  }, [isRunning, startTime, stats.processed, stats.remaining]);

  const totalKnown = totalCount ?? (stats.processed + stats.remaining);
  const progressPct = totalKnown > 0 ? Math.min(100, Math.round((stats.processed / totalKnown) * 100)) : 0;
  const totalBatches = totalKnown > 0 ? Math.ceil(totalKnown / batchSize) : null;

  const runLoop = async (startOffset: number, initialStats: typeof stats) => {
    stopRef.current = false;
    setIsRunning(true);
    setShouldStop(false);
    setIsComplete(false);

    let offset = startOffset;
    let totalSucceeded = initialStats.succeeded;
    let totalFailed = initialStats.failed;
    let totalNotFound = initialStats.notFound;
    let batch = Math.ceil(startOffset / batchSize);

    try {
      while (!stopRef.current) {
        batch++;
        setBatchNum(batch);

        const response = await fdaLabelsApi.batchOpenFDASync({ batchSize, offset, onlyMissingData });

        if (!response.success) throw new Error(response.error || 'Batch failed');

        if (!response.results || response.results.length === 0) {
          setIsComplete(true);
          toast({ title: 'Sync Complete', description: `All medications processed` });
          break;
        }

        const batchResults = response.results as SyncResult[];
        totalSucceeded += response.succeeded || 0;
        totalFailed += (response.failed || 0) - (response.notFound || 0);
        totalNotFound += response.notFound || 0;
        offset = response.nextOffset || offset + batchSize;

        setResults(prev => [...batchResults, ...prev].slice(0, 200));
        setStats({
          succeeded: totalSucceeded,
          failed: totalFailed,
          notFound: totalNotFound,
          remaining: response.remaining || 0,
          processed: offset,
        });
        setCurrentOffset(offset);

        if ((response.remaining || 0) <= 0) {
          setIsComplete(true);
          toast({ title: 'Sync Complete', description: `Processed ${offset} medications` });
          break;
        }

        await new Promise(r => setTimeout(r, 300));
      }
    } catch (err) {
      toast({
        title: 'Sync Error',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
      if (stopRef.current) {
        setCanResume(offset > 0);
      }
      stopRef.current = false;
    }
  };

  const handleStart = async () => {
    setResults([]);
    setStats({ succeeded: 0, failed: 0, notFound: 0, remaining: 0, processed: 0 });
    setCurrentOffset(0);
    setBatchNum(0);
    setCanResume(false);
    setStartTime(Date.now());
    await runLoop(0, { succeeded: 0, failed: 0, notFound: 0, remaining: 0, processed: 0 });
  };

  const handleResume = async () => {
    setStartTime(Date.now());
    await runLoop(currentOffset, stats);
  };

  const handleStop = () => {
    stopRef.current = true;
    setShouldStop(true);
    toast({ title: 'Stopping…', description: 'Will stop after current batch completes' });
  };

  const handleReset = () => {
    setResults([]);
    setStats({ succeeded: 0, failed: 0, notFound: 0, remaining: 0, processed: 0 });
    setCurrentOffset(0);
    setBatchNum(0);
    setIsComplete(false);
    setCanResume(false);
    setStartTime(null);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            OpenFDA Direct Sync
            {totalCount !== null && !isRunning && (
              <Badge variant="secondary" className="ml-auto text-xs font-normal">
                {totalCount.toLocaleString()} need syncing
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Pulls structured label data (dosing, safety, pharmacokinetics, adverse reactions, drug interactions)
            directly from the free OpenFDA API — no scraping, no AI tokens, instant results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Only missing data toggle */}
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <Switch
                id="only-missing"
                checked={onlyMissingData}
                onCheckedChange={v => { setOnlyMissingData(v); handleReset(); }}
                disabled={isRunning}
              />
              <Label htmlFor="only-missing" className="text-sm cursor-pointer">
                Only medications with missing data
              </Label>
            </div>

            {/* Batch size */}
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <Label className="text-sm whitespace-nowrap">Batch size:</Label>
              <div className="flex gap-1">
                {[5, 10, 25, 50].map(size => (
                  <Button
                    key={size}
                    variant={batchSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBatchSize(size)}
                    disabled={isRunning}
                    className="h-7 px-2 text-xs"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!isRunning ? (
              <>
                <Button onClick={handleStart} className="flex-1" disabled={totalCount === null}>
                  {totalCount === null ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {totalCount !== null
                    ? `Start Full Sync (${totalCount.toLocaleString()})`
                    : 'Loading…'}
                </Button>
                {canResume && (
                  <Button variant="outline" onClick={handleResume} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Resume from {currentOffset.toLocaleString()}
                  </Button>
                )}
                {results.length > 0 && (
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </>
            ) : (
              <Button variant="destructive" onClick={handleStop} className="flex-1">
                <Square className="w-4 h-4 mr-2" />
                {shouldStop ? 'Stopping…' : 'Stop'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {(isRunning || stats.processed > 0) && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {isRunning ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Batch {batchNum}{totalBatches ? ` of ~${totalBatches}` : ''}
                  </span>
                ) : isComplete ? 'Complete ✓' : 'Paused'}
              </span>
              <span className="font-medium tabular-nums">
                {stats.processed.toLocaleString()} / {totalKnown.toLocaleString()} ({progressPct}%)
              </span>
            </div>

            <Progress value={progressPct} className="h-2" />

            {/* ETA */}
            {isRunning && etaSeconds !== null && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatEta(etaSeconds)} remaining
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-lg font-bold text-primary tabular-nums">{stats.succeeded.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Synced</div>
              </div>
              <div className="p-2 rounded-lg bg-secondary border border-border">
                <div className="text-lg font-bold text-foreground tabular-nums">{stats.notFound.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Not Found</div>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-lg font-bold text-destructive tabular-nums">{stats.failed.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>

            {stats.remaining > 0 && !isRunning && (
              <p className="text-xs text-muted-foreground text-center">
                ~{stats.remaining.toLocaleString()} medications remaining
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results list — capped at 200 */}
      {results.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              Results
              <Badge variant="outline" className="text-xs font-normal">
                {results.length === 200 ? 'showing latest 200' : results.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px]">
              <div className="space-y-1 p-3">
                {results.map((r, i) => (
                  <div
                    key={`${r.id}-${i}`}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-0.5 shrink-0">
                      {r.success ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : r.not_found ? (
                        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      {r.success && r.fields && r.fields.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {r.fields.map(f => (
                            <Badge key={f} variant="secondary" className="text-xs py-0">
                              {f.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {!r.success && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {r.not_found ? 'Not found in OpenFDA' : r.error}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpenFDALabelSync;
