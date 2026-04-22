import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Link, Loader2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUploadMarketingAsset, useMarketingAssets } from '@/hooks/useMarketingContent';
import { ImageCropper } from '@/components/ImageCropper';

interface ImageUploaderProps {
  onUpload: (url: string, altText?: string) => void;
  currentUrl?: string | null;
  maxSizeMB?: number;
  showCrop?: boolean;
  showAltText?: boolean;
  showGallery?: boolean;
  bucket?: string;
  className?: string;
}

const ImageUploader = ({
  onUpload,
  currentUrl,
  maxSizeMB = 10,
  showCrop = true,
  showAltText = true,
  showGallery = false,
  className,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [externalUrl, setExternalUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadMarketingAsset();
  const { data: existingAssets } = useMarketingAssets('image');

  const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return 'Invalid format. Accepted: JPEG, PNG, GIF, WebP';
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Maximum: ${maxSizeMB}MB`;
    }
    return null;
  }, [maxSizeMB]);

  const handleFileSelect = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    
    if (showCrop) {
      setShowCropper(true);
    } else {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const result = await uploadMutation.mutateAsync({ 
        file, 
        altText: altText || undefined 
      });
      
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(result.url);
      onUpload(result.url, altText || undefined);
      toast.success('Image uploaded successfully');
    } catch (err) {
      setPreviewUrl(null);
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false);
    
    // Convert blob to file
    const file = new File([croppedBlob], selectedFile?.name || 'cropped.jpg', {
      type: 'image/jpeg',
    });
    
    await uploadFile(file);
    setSelectedFile(null);
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
    
    try {
      new URL(externalUrl);
    } catch {
      toast.error('Invalid URL format');
      return;
    }

    setPreviewUrl(externalUrl);
    onUpload(externalUrl, altText || undefined);
    setExternalUrl('');
    toast.success('Image URL added');
  };

  const handleGallerySelect = (url: string) => {
    setPreviewUrl(url);
    onUpload(url);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setAltText('');
    onUpload('');
  };

  const tabCount = 2 + (showGallery ? 1 : 0);

  return (
    <div className={cn('space-y-4', className)}>
      {previewUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-muted border group">
            <img
              src={previewUrl}
              alt={altText || 'Preview'}
              className="w-full h-auto max-h-64 object-contain"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowZoom(true)}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {showAltText && (
            <div className="space-y-2">
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                placeholder="Describe the image for accessibility"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
          )}
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className={cn('grid w-full', tabCount === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="w-4 h-4" />
              URL
            </TabsTrigger>
            {showGallery && (
              <TabsTrigger value="gallery" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Gallery
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="upload" className="mt-4 space-y-4">
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
                <div className="space-y-2">
                  <Loader2 className="w-10 h-10 mx-auto text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading image...</p>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">
                    Drop image here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, GIF, WebP • Max {maxSizeMB}MB
                  </p>
                </>
              )}
            </div>
            
            {showAltText && (
              <div className="space-y-2">
                <Label htmlFor="upload-alt-text">Alt Text</Label>
                <Input
                  id="upload-alt-text"
                  placeholder="Describe the image for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="url" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
              />
            </div>
            
            {showAltText && (
              <div className="space-y-2">
                <Label htmlFor="url-alt-text">Alt Text</Label>
                <Input
                  id="url-alt-text"
                  placeholder="Describe the image for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>
            )}
            
            <Button onClick={handleExternalUrl} className="w-full">
              Add Image
            </Button>
          </TabsContent>
          
          {showGallery && (
            <TabsContent value="gallery" className="mt-4">
              {existingAssets && existingAssets.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {existingAssets.map((asset) => (
                    <button
                      key={asset.id}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                      onClick={() => handleGallerySelect(asset.file_url)}
                    >
                      <img
                        src={asset.file_url}
                        alt={asset.alt_text || asset.file_name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No images in gallery yet</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      )}

      {/* Image Cropper Dialog */}
      {selectedFile && (
        <ImageCropper
          imageFile={selectedFile}
          open={showCropper}
          onClose={() => {
            setShowCropper(false);
            setSelectedFile(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Zoom Dialog */}
      <Dialog open={showZoom} onOpenChange={setShowZoom}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <img
              src={previewUrl}
              alt={altText || 'Full preview'}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
