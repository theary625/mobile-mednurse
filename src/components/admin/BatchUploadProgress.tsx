import { X, Check, AlertCircle, Loader2, RefreshCw, Pause, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BatchUploadItem } from '@/hooks/useBatchUpload';

interface BatchUploadProgressProps {
  items: BatchUploadItem[];
  isProcessing: boolean;
  overallProgress: number;
  pendingCount: number;
  successCount: number;
  errorCount: number;
  uploadingCount: number;
  onRemoveItem: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onStartUpload: () => void;
  onPauseUpload: () => void;
  onCancelUpload: () => void;
  onRetryFailed: () => void;
  className?: string;
}

const BatchUploadProgress = ({
  items,
  isProcessing,
  overallProgress,
  pendingCount,
  successCount,
  errorCount,
  uploadingCount,
  onRemoveItem,
  onClearCompleted,
  onClearAll,
  onStartUpload,
  onPauseUpload,
  onCancelUpload,
  onRetryFailed,
  className,
}: BatchUploadProgressProps) => {
  if (items.length === 0) return null;

  const getStatusIcon = (status: BatchUploadItem['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'retrying':
        return <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: BatchUploadItem['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-muted';
      case 'uploading':
        return 'bg-primary/10';
      case 'retrying':
        return 'bg-amber-500/10';
      case 'success':
        return 'bg-emerald-500/10';
      case 'error':
        return 'bg-destructive/10';
    }
  };

  return (
    <div className={cn('rounded-xl border bg-card shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold">Batch Upload</h3>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {pendingCount} pending
              </Badge>
            )}
            {uploadingCount > 0 && (
              <Badge variant="default" className="text-xs bg-primary">
                {uploadingCount} uploading
              </Badge>
            )}
            {successCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600">
                {successCount} done
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} failed
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {errorCount > 0 && !isProcessing && (
            <Button variant="outline" size="sm" onClick={onRetryFailed} className="h-8 text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry Failed
            </Button>
          )}
          {successCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearCompleted} className="h-8 text-xs">
              Clear Done
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClearAll} className="h-8 w-8">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      {isProcessing && (
        <div className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Overall Progress</span>
            <span className="text-xs font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      )}

      {/* Items List */}
      <ScrollArea className="max-h-64">
        <div className="p-2 space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-colors',
                getStatusColor(item.status)
              )}
            >
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                {item.error && (
                  <p className="text-xs text-destructive truncate">{item.error}</p>
                )}
                {item.status === 'uploading' && (
                  <Progress value={item.progress} className="h-1 mt-1" />
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {(item.file.size / 1024 / 1024).toFixed(1)}MB
              </span>
              {(item.status === 'pending' || item.status === 'error') && !isProcessing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 p-3 border-t bg-muted/20">
        {isProcessing ? (
          <>
            <Button variant="outline" size="sm" onClick={onPauseUpload}>
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
            <Button variant="destructive" size="sm" onClick={onCancelUpload}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            {pendingCount > 0 && (
              <Button size="sm" onClick={onStartUpload}>
                <Play className="w-4 h-4 mr-1" />
                Upload {pendingCount} File{pendingCount > 1 ? 's' : ''}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BatchUploadProgress;
