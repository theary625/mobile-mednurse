import { useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBatchUpload } from '@/hooks/useBatchUpload';
import BatchUploadProgress from '@/components/admin/BatchUploadProgress';
import { toast } from 'sonner';

interface BatchImageUploaderProps {
  onUploadComplete?: (urls: string[]) => void;
  maxSizeMB?: number;
  className?: string;
}

const BatchImageUploader = ({
  onUploadComplete,
  maxSizeMB = 10,
  className,
}: BatchImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const uploadEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-marketing-asset`;

  const batchUpload = useBatchUpload({
    endpoint: uploadEndpoint,
    chunkSize: 3,
    maxRetries: 3,
    retryDelay: 2000,
    onAllComplete: (results) => {
      const successUrls = results
        .filter((r) => r.status === 'success' && r.url)
        .map((r) => r.url!);
      if (successUrls.length > 0) {
        onUploadComplete?.(successUrls);
      }
    },
  });

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      Array.from(files).forEach((file) => {
        if (!acceptedFormats.includes(file.type)) {
          errors.push(`${file.name}: Invalid format`);
          return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          errors.push(`${file.name}: Too large (max ${maxSizeMB}MB)`);
          return;
        }
        validFiles.push(file);
      });

      if (errors.length > 0) {
        toast.error(`${errors.length} file(s) rejected`, {
          description: errors.slice(0, 3).join(', ') + (errors.length > 3 ? '...' : ''),
        });
      }

      return validFiles;
    },
    [maxSizeMB]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        batchUpload.addFiles(validFiles);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [validateFiles, batchUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        batchUpload.addFiles(validFiles);
      }
    },
    [validateFiles, batchUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          'hover:border-primary/50 hover:bg-primary/5',
          batchUpload.isProcessing && 'pointer-events-none opacity-50'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Drop images here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, GIF, WebP • Max {maxSizeMB}MB each • Select multiple
            </p>
          </div>
          <Button variant="secondary" size="sm" className="mt-2">
            <FolderOpen className="w-4 h-4 mr-2" />
            Select Files
          </Button>
        </div>
      </div>

      {/* Progress Panel */}
      <BatchUploadProgress
        items={batchUpload.items}
        isProcessing={batchUpload.isProcessing}
        overallProgress={batchUpload.overallProgress}
        pendingCount={batchUpload.pendingCount}
        successCount={batchUpload.successCount}
        errorCount={batchUpload.errorCount}
        uploadingCount={batchUpload.uploadingCount}
        onRemoveItem={batchUpload.removeItem}
        onClearCompleted={batchUpload.clearCompleted}
        onClearAll={batchUpload.clearAll}
        onStartUpload={batchUpload.startUpload}
        onPauseUpload={batchUpload.pauseUpload}
        onCancelUpload={batchUpload.cancelUpload}
        onRetryFailed={batchUpload.retryFailed}
      />
    </div>
  );
};

export default BatchImageUploader;
