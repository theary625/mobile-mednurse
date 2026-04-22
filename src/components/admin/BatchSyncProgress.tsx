import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, Shield } from 'lucide-react';

interface SyncResult {
  medicationId: string;
  genericName: string;
  fdaSynced: boolean;
  guideGenerated: boolean;
  validated?: boolean;
  validationScore?: number;
  reviewTier?: string;
  error?: string;
}

interface BatchSyncProgressProps {
  isProcessing: boolean;
  total: number;
  processed: number;
  results: SyncResult[];
}

const tierColors: Record<string, string> = {
  auto_approve: 'bg-green-100 text-green-700',
  quick_review: 'bg-blue-100 text-blue-700',
  full_review: 'bg-amber-100 text-amber-700',
  escalated: 'bg-red-100 text-red-700',
};

const BatchSyncProgress = ({ isProcessing, total, processed, results }: BatchSyncProgressProps) => {
  const progressPercent = total > 0 ? Math.round((processed / total) * 100) : 0;
  const successCount = results.filter(r => r.fdaSynced || r.guideGenerated).length;
  const validatedCount = results.filter(r => r.validated).length;
  const autoApprovedCount = results.filter(r => r.reviewTier === 'auto_approve').length;
  const errorCount = results.filter(r => r.error).length;

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : processed === total && total > 0 ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : null}
          <span className="font-medium">
            {isProcessing 
              ? `Processing ${processed} of ${total}...` 
              : processed === total && total > 0
                ? 'Batch sync complete'
                : 'Ready to sync'
            }
          </span>
        </div>
        <div className="flex gap-2">
          {successCount > 0 && (
            <Badge variant="secondary">
              {successCount} synced
            </Badge>
          )}
          {validatedCount > 0 && (
            <Badge variant="outline" className="bg-blue-50">
              <Shield className="w-3 h-3 mr-1" />
              {validatedCount} validated
            </Badge>
          )}
          {autoApprovedCount > 0 && (
            <Badge className="bg-green-100 text-green-700">
              {autoApprovedCount} auto-approved
            </Badge>
          )}
          {errorCount > 0 && (
            <Badge variant="destructive">
              {errorCount} failed
            </Badge>
          )}
        </div>
      </div>

      <Progress value={progressPercent} className="h-2" />

      {results.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-1">
          {results.map((result) => (
            <div 
              key={result.medicationId} 
              className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-muted"
            >
              <span className="truncate flex-1">{result.genericName || result.medicationId}</span>
              <div className="flex items-center gap-1.5 ml-2">
                {result.error ? (
                  <Badge variant="destructive" className="text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Error
                  </Badge>
                ) : (
                  <>
                    {result.fdaSynced && (
                      <Badge variant="outline" className="text-xs">
                        FDA ✓
                      </Badge>
                    )}
                    {result.guideGenerated && (
                      <Badge variant="outline" className="text-xs">
                        Guide ✓
                      </Badge>
                    )}
                    {result.validated && result.validationScore !== undefined && (
                      <Badge 
                        className={`text-xs ${result.reviewTier ? tierColors[result.reviewTier] || '' : ''}`}
                      >
                        {result.validationScore}%
                      </Badge>
                    )}
                    {result.reviewTier && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${tierColors[result.reviewTier] || ''}`}
                      >
                        {result.reviewTier.replace('_', ' ')}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchSyncProgress;
