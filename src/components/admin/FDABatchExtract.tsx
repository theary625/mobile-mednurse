import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { fdaLabelsApi } from '@/lib/api/fda-labels';
import { useToast } from '@/hooks/use-toast';

interface BatchResult {
  id: string;
  name: string;
  success: boolean;
  error?: string;
  fields?: string[];
}

const FDABatchExtract = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [onlyFullyMissing, setOnlyFullyMissing] = useState(true);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [totalSucceeded, setTotalSucceeded] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [currentBatch, setCurrentBatch] = useState(0);
  const stopRef = useRef(false);

  const BATCH_SIZE = 3;

  const runBatchExtraction = useCallback(async () => {
    setIsRunning(true);
    stopRef.current = false;
    setResults([]);
    setTotalProcessed(0);
    setTotalSucceeded(0);
    setTotalFailed(0);
    setCurrentBatch(0);

    let offset = 0;
    let batchNum = 0;

    while (!stopRef.current) {
      batchNum++;
      setCurrentBatch(batchNum);

      try {
        const response = await fdaLabelsApi.batchExtractFDALabels({
          batchSize: BATCH_SIZE,
          offset: 0, // Always 0 since successful ones disappear from the query
          onlyFullyMissing,
        });

        if (!response.success) {
          toast({
            title: 'Batch Error',
            description: response.error || 'Failed to process batch',
            variant: 'destructive',
          });
          break;
        }

        if (response.message === 'No more medications to process' || !response.results?.length) {
          toast({
            title: 'Batch Complete',
            description: 'All eligible medications have been processed!',
          });
          break;
        }

        setResults(prev => [...prev, ...response.results!]);
        setTotalProcessed(prev => prev + (response.totalProcessed || 0));
        setTotalSucceeded(prev => prev + (response.succeeded || 0));
        setTotalFailed(prev => prev + (response.failed || 0));
        setRemaining(response.remaining ?? null);

        // Continue to next batch regardless of failures
        // (failed items are now marked as extraction_failed and skipped)

        // Wait between batches to respect rate limits
        await new Promise(r => setTimeout(r, 3000));
      } catch (error) {
        console.error('Batch extraction error:', error);
        toast({
          title: 'Error',
          description: 'Batch extraction encountered an error',
          variant: 'destructive',
        });
        break;
      }
    }

    setIsRunning(false);
  }, [onlyFullyMissing, toast]);

  const handleStop = () => {
    stopRef.current = true;
  };

  const handleReset = () => {
    setResults([]);
    setTotalProcessed(0);
    setTotalSucceeded(0);
    setTotalFailed(0);
    setRemaining(null);
    setCurrentBatch(0);
  };

  const progressPercent = remaining !== null && totalProcessed > 0
    ? Math.round((totalProcessed / (totalProcessed + remaining)) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Batch AI Extraction
          </CardTitle>
          <CardDescription>
            Automatically extract structured clinical data from FDA label PDFs for all medications with URLs but missing data.
            Processes {BATCH_SIZE} medications per batch with rate limiting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="only-fully-missing"
                checked={onlyFullyMissing}
                onCheckedChange={setOnlyFullyMissing}
                disabled={isRunning}
              />
              <Label htmlFor="only-fully-missing" className="text-sm">
                Only fully missing (no extracted data at all)
              </Label>
            </div>
            <div className="flex gap-2">
              {results.length > 0 && !isRunning && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              )}
              {isRunning ? (
                <Button variant="destructive" size="sm" onClick={handleStop}>
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              ) : (
                <Button size="sm" onClick={runBatchExtraction}>
                  <Play className="w-4 h-4 mr-1" />
                  Start Batch Extraction
                </Button>
              )}
            </div>
          </div>

          {/* Progress */}
          {(isRunning || totalProcessed > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isRunning ? `Processing batch ${currentBatch}...` : 'Complete'}
                </span>
                <span className="font-medium">
                  {totalProcessed} processed
                  {remaining !== null && ` • ~${remaining} remaining`}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-3 h-3" /> {totalSucceeded} succeeded
                </span>
                <span className="flex items-center gap-1 text-destructive">
                  <XCircle className="w-3 h-3" /> {totalFailed} failed
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Extraction Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {results.map((result, i) => (
                  <div
                    key={`${result.id}-${i}`}
                    className={`flex items-center justify-between p-2 rounded text-sm ${
                      result.success
                        ? 'bg-green-50 dark:bg-green-950/30'
                        : 'bg-red-50 dark:bg-red-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {result.success ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive shrink-0" />
                      )}
                      <span className="truncate font-medium">{result.name}</span>
                    </div>
                    <div className="shrink-0 ml-2">
                      {result.success ? (
                        <Badge variant="secondary" className="text-xs">
                          {result.fields?.length || 0} fields
                        </Badge>
                      ) : (
                        <span className="text-xs text-destructive truncate max-w-[200px] block">
                          {result.error}
                        </span>
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

export default FDABatchExtract;
