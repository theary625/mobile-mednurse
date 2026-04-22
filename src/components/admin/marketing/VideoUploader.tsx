import { useState, useRef, useCallback } from 'react';
import { Upload, X, Play, Pause, Film, Link, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUploadMarketingAsset } from '@/hooks/useMarketingContent';

interface VideoUploaderProps {
  onUpload: (url: string, thumbnail?: string) => void;
  currentUrl?: string | null;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

const VideoUploader = ({
  onUpload,
  currentUrl,
  maxSizeMB = 50,
  acceptedFormats = ['video/mp4', 'video/webm', 'video/quicktime'],
  className,
}: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const uploadMutation = useUploadMarketingAsset();

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid format. Accepted: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Maximum: ${maxSizeMB}MB`;
    }
    return null;
  }, [acceptedFormats, maxSizeMB]);

  const handleFileSelect = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await uploadMutation.mutateAsync({ file });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Clean up object URL and use real URL
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(result.url);
      onUpload(result.url);
      toast.success('Video uploaded successfully');
    } catch (err) {
      setPreviewUrl(null);
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleExternalUrl = () => {
    if (!externalUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(externalUrl);
    } catch {
      toast.error('Invalid URL format');
      return;
    }

    setPreviewUrl(externalUrl);
    onUpload(externalUrl);
    setExternalUrl('');
    toast.success('Video URL added');
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const removeVideo = () => {
    setPreviewUrl(null);
    setIsPlaying(false);
    onUpload('');
  };

  return (
    <div className={cn('space-y-4', className)}>
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
          <video
            ref={videoRef}
            src={previewUrl}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8"
            onClick={removeVideo}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="w-4 h-4" />
              URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                uploadMutation.isPending && 'pointer-events-none opacity-50'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={acceptedFormats.join(',')}
                onChange={handleInputChange}
              />
              
              {uploadMutation.isPending ? (
                <div className="space-y-4">
                  <Loader2 className="w-10 h-10 mx-auto text-muted-foreground animate-spin" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Uploading video...</p>
                    <Progress value={uploadProgress} className="w-48 mx-auto" />
                  </div>
                </div>
              ) : (
                <>
                  <Film className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">
                    Drop video here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, WebM, MOV • Max {maxSizeMB}MB
                  </p>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                placeholder="https://example.com/video.mp4"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter a direct link to a video file
              </p>
            </div>
            <Button onClick={handleExternalUrl} className="w-full">
              Add Video
            </Button>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default VideoUploader;
