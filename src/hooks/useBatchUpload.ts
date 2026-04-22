import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BatchUploadItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'retrying';
  progress: number;
  url?: string;
  error?: string;
  retryCount: number;
}

export interface BatchUploadOptions {
  chunkSize?: number;
  maxRetries?: number;
  retryDelay?: number;
  onItemComplete?: (item: BatchUploadItem) => void;
  onAllComplete?: (results: BatchUploadItem[]) => void;
  endpoint: string;
  getFormData?: (file: File, altText?: string) => FormData;
}

const defaultGetFormData = (file: File, altText?: string): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  if (altText) formData.append('alt_text', altText);
  return formData;
};

export const useBatchUpload = (options: BatchUploadOptions) => {
  const {
    chunkSize = 3,
    maxRetries = 3,
    retryDelay = 2000,
    onItemComplete,
    onAllComplete,
    endpoint,
    getFormData = defaultGetFormData,
  } = options;

  const [items, setItems] = useState<BatchUploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPausedRef = useRef(false);

  const generateId = () => Math.random().toString(36).substring(2, 10);

  const addFiles = useCallback((files: File[], altTexts?: Record<string, string>) => {
    const newItems: BatchUploadItem[] = files.map((file) => ({
      id: generateId(),
      file,
      status: 'pending',
      progress: 0,
      retryCount: 0,
    }));
    setItems((prev) => [...prev, ...newItems]);
    return newItems.map((item) => item.id);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setItems((prev) => prev.filter((item) => item.status !== 'success'));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setOverallProgress(0);
  }, []);

  const uploadSingleFile = async (
    item: BatchUploadItem,
    session: { access_token: string },
    signal: AbortSignal
  ): Promise<BatchUploadItem> => {
    const formData = getFormData(item.file);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
        signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      return {
        ...item,
        status: 'success',
        progress: 100,
        url: result.url,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { ...item, status: 'pending', progress: 0 };
      }
      throw error;
    }
  };

  const processChunk = async (
    chunk: BatchUploadItem[],
    session: { access_token: string },
    signal: AbortSignal
  ): Promise<BatchUploadItem[]> => {
    const results: BatchUploadItem[] = [];

    for (const item of chunk) {
      if (signal.aborted || isPausedRef.current) {
        results.push(item);
        continue;
      }

      // Update status to uploading
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 30 } : i))
      );

      try {
        const result = await uploadSingleFile(item, session, signal);
        results.push(result);

        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? result : i))
        );

        onItemComplete?.(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        // Check if we should retry
        if (item.retryCount < maxRetries) {
          const retryItem: BatchUploadItem = {
            ...item,
            status: 'retrying',
            retryCount: item.retryCount + 1,
            error: `Retrying (${item.retryCount + 1}/${maxRetries})...`,
          };
          
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? retryItem : i))
          );

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));

          // Retry the upload
          try {
            const retryResult = await uploadSingleFile(retryItem, session, signal);
            results.push(retryResult);
            setItems((prev) =>
              prev.map((i) => (i.id === item.id ? retryResult : i))
            );
            onItemComplete?.(retryResult);
          } catch (retryError) {
            const failedItem: BatchUploadItem = {
              ...retryItem,
              status: 'error',
              error: retryError instanceof Error ? retryError.message : 'Upload failed after retries',
            };
            results.push(failedItem);
            setItems((prev) =>
              prev.map((i) => (i.id === item.id ? failedItem : i))
            );
          }
        } else {
          const failedItem: BatchUploadItem = {
            ...item,
            status: 'error',
            error: errorMessage,
          };
          results.push(failedItem);
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? failedItem : i))
          );
        }
      }

      // Update overall progress
      const completedCount = results.filter((r) => r.status === 'success' || r.status === 'error').length;
      setOverallProgress(Math.round((completedCount / chunk.length) * 100));
    }

    return results;
  };

  const startUpload = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Not authenticated');
      return;
    }

    const pendingItems = items.filter((item) => item.status === 'pending' || item.status === 'error');
    if (pendingItems.length === 0) {
      toast.info('No files to upload');
      return;
    }

    setIsProcessing(true);
    isPausedRef.current = false;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const allResults: BatchUploadItem[] = [];

    // Process in chunks
    for (let i = 0; i < pendingItems.length; i += chunkSize) {
      if (signal.aborted || isPausedRef.current) break;

      const chunk = pendingItems.slice(i, i + chunkSize);
      const chunkResults = await processChunk(chunk, session, signal);
      allResults.push(...chunkResults);

      // Update overall progress based on all items
      const totalItems = pendingItems.length;
      const completedItems = allResults.filter(
        (r) => r.status === 'success' || r.status === 'error'
      ).length;
      setOverallProgress(Math.round((completedItems / totalItems) * 100));
    }

    setIsProcessing(false);

    const successCount = allResults.filter((r) => r.status === 'success').length;
    const errorCount = allResults.filter((r) => r.status === 'error').length;

    if (errorCount === 0) {
      toast.success(`${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully`);
    } else if (successCount === 0) {
      toast.error(`All ${errorCount} uploads failed`);
    } else {
      toast.warning(`${successCount} succeeded, ${errorCount} failed`);
    }

    onAllComplete?.(allResults);
  }, [items, chunkSize, onItemComplete, onAllComplete, endpoint, getFormData, maxRetries, retryDelay]);

  const pauseUpload = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resumeUpload = useCallback(() => {
    isPausedRef.current = false;
    startUpload();
  }, [startUpload]);

  const cancelUpload = useCallback(() => {
    abortControllerRef.current?.abort();
    isPausedRef.current = true;
    setIsProcessing(false);
    
    // Reset pending items
    setItems((prev) =>
      prev.map((item) =>
        item.status === 'uploading' || item.status === 'retrying'
          ? { ...item, status: 'pending', progress: 0 }
          : item
      )
    );
  }, []);

  const retryFailed = useCallback(() => {
    setItems((prev) =>
      prev.map((item) =>
        item.status === 'error' ? { ...item, status: 'pending', progress: 0, retryCount: 0, error: undefined } : item
      )
    );
  }, []);

  return {
    items,
    isProcessing,
    overallProgress,
    addFiles,
    removeItem,
    clearCompleted,
    clearAll,
    startUpload,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    retryFailed,
    pendingCount: items.filter((i) => i.status === 'pending').length,
    successCount: items.filter((i) => i.status === 'success').length,
    errorCount: items.filter((i) => i.status === 'error').length,
    uploadingCount: items.filter((i) => i.status === 'uploading' || i.status === 'retrying').length,
  };
};
