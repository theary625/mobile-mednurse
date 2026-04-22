import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, ArrowLeft, Check, Maximize2, Minimize2 } from 'lucide-react';

interface ImageCropperProps {
  imageFile?: File | null;
  imageUrl?: string | null;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

export const ImageCropper = ({ imageFile, imageUrl, open, onClose, onCropComplete }: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewMode, setPreviewMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [framing, setFraming] = useState(0.5); // 0 = tight, 1 = wide

  const CANVAS_SIZE = 280;
  const OUTPUT_SIZE = 400;
  const MIN_CROP_RADIUS = CANVAS_SIZE / 2 - 60; // Tight framing
  const MAX_CROP_RADIUS = CANVAS_SIZE / 2 - 10; // Wide framing
  const cropRadius = MIN_CROP_RADIUS + (MAX_CROP_RADIUS - MIN_CROP_RADIUS) * framing;

  // Load image when file or URL changes
  useEffect(() => {
    if (!imageFile && !imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      // Reset position and calculate initial scale to fit image
      const minScale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
      setScale(minScale * 1.1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    };

    if (imageFile) {
      img.src = URL.createObjectURL(imageFile);
      return () => {
        URL.revokeObjectURL(img.src);
      };
    } else if (imageUrl) {
      img.src = imageUrl;
    }
  }, [imageFile, imageUrl]);

  // Draw image on canvas
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Fill background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Calculate scaled dimensions
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    // Enable high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Save context, translate to center, rotate, then draw
    ctx.save();
    ctx.translate(CANVAS_SIZE / 2 + position.x, CANVAS_SIZE / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
    ctx.restore();

    // Draw circular overlay
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, cropRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Draw border ring
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, cropRadius, 0, Math.PI * 2);
    ctx.stroke();
  }, [image, scale, position, rotation, cropRadius]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleReset = () => {
    if (!image) return;
    const minScale = Math.max(CANVAS_SIZE / image.width, CANVAS_SIZE / image.height);
    setScale(minScale * 1.1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setFraming(0.5);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const generatePreview = () => {
    if (!image) return;

    // Create output canvas at higher resolution
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = OUTPUT_SIZE;
    outputCanvas.height = OUTPUT_SIZE;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    // Scale output to fill the output canvas based on current crop radius
    const outputCropRadius = OUTPUT_SIZE / 2;
    const radiusScale = outputCropRadius / cropRadius;

    // Calculate scaled dimensions for output
    const scaledWidth = image.width * scale * radiusScale;
    const scaledHeight = image.height * scale * radiusScale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill with transparent background
    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Draw circular clip that fills the entire output canvas
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, outputCropRadius, 0, Math.PI * 2);
    ctx.clip();

    // Draw image with rotation, scaling position by the same ratio
    ctx.save();
    ctx.translate(OUTPUT_SIZE / 2 + position.x * radiusScale, OUTPUT_SIZE / 2 + position.y * radiusScale);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
    ctx.restore();

    // Generate preview URL
    const dataUrl = outputCanvas.toDataURL('image/jpeg', 0.9);
    setPreviewUrl(dataUrl);
    setPreviewMode(true);
  };

  const handleConfirm = () => {
    if (!previewUrl) return;
    
    // Convert data URL to blob
    fetch(previewUrl)
      .then(res => res.blob())
      .then(blob => {
        onCropComplete(blob);
        setPreviewMode(false);
        setPreviewUrl(null);
      });
  };

  const handleBackToEdit = () => {
    setPreviewMode(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{previewMode ? 'Preview Your Photo' : 'Crop Profile Photo'}</DialogTitle>
        </DialogHeader>

        {previewMode ? (
          // Preview Mode
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Does this look right?
            </p>

            <div 
              className="rounded-full overflow-hidden border-4 border-primary/20 shadow-lg"
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
            >
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              This is how your profile photo will appear
            </p>
          </div>
        ) : (
          // Edit Mode
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Drag to reposition, use slider to zoom
            </p>

            <div
              className="relative cursor-move rounded-full overflow-hidden"
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="bg-muted"
              />
            </div>

            <div className="flex items-center gap-3 w-full max-w-xs">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.1}
                max={3}
                step={0.01}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-3 w-full max-w-xs">
              <Minimize2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[framing]}
                onValueChange={([value]) => setFraming(value)}
                min={0}
                max={1}
                step={0.01}
                className="flex-1"
              />
              <Maximize2 className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRotateLeft} className="gap-1">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRotateRight} className="gap-1">
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 ml-2">
                Reset
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {previewMode ? (
            <>
              <Button variant="outline" onClick={handleBackToEdit} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Edit
              </Button>
              <Button onClick={handleConfirm} className="gap-2">
                <Check className="w-4 h-4" />
                Confirm & Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={generatePreview}>
                Preview
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
