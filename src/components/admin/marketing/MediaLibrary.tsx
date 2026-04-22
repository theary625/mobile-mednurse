import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Film, Layers } from 'lucide-react';
import BatchImageUploader from './BatchImageUploader';
import BatchVideoUploader from './BatchVideoUploader';
import { useMarketingAssets } from '@/hooks/useMarketingContent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X, Trash2, Check } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface MediaLibraryProps {
  onSelect?: (url: string, type: 'image' | 'video') => void;
  className?: string;
}

const MediaLibrary = ({ onSelect, className }: MediaLibraryProps) => {
  const [tab, setTab] = useState<'images' | 'videos'>('images');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: images, isLoading: imagesLoading } = useMarketingAssets('image');
  const { data: videos, isLoading: videosLoading } = useMarketingAssets('video');
  const queryClient = useQueryClient();

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDeleting(true);
    const idsToDelete = Array.from(selectedIds);
    
    try {
      const { error } = await supabase
        .from('marketing_assets')
        .delete()
        .in('id', idsToDelete);
      
      if (error) throw error;
      
      toast.success(`${idsToDelete.length} asset(s) deleted`);
      setSelectedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['marketing-assets'] });
    } catch (error) {
      toast.error('Failed to delete assets');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadComplete = (urls: string[]) => {
    queryClient.invalidateQueries({ queryKey: ['marketing-assets'] });
  };

  return (
    <div className={className}>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'images' | 'videos')}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="images" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Film className="w-4 h-4" />
              Videos
            </TabsTrigger>
          </TabsList>
          
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} selected
              </span>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                <X className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isDeleting}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedIds.size} asset(s)?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The files will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <TabsContent value="images" className="space-y-6">
          {/* Batch Uploader */}
          <BatchImageUploader onUploadComplete={handleUploadComplete} />

          {/* Gallery */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Image Library ({images?.length || 0})
            </h4>
            {imagesLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : images && images.length > 0 ? (
              <ScrollArea className="h-64">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pr-4">
                  {images.map((asset) => (
                    <div
                      key={asset.id}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer group"
                      style={{
                        borderColor: selectedIds.has(asset.id) ? 'hsl(var(--primary))' : 'transparent',
                      }}
                      onClick={() => onSelect?.(asset.file_url, 'image')}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        toggleSelection(asset.id);
                      }}
                    >
                      <img
                        src={asset.file_url}
                        alt={asset.alt_text || asset.file_name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(asset.id);
                        }}
                      >
                        {selectedIds.has(asset.id) ? (
                          <Check className="w-3 h-3 text-primary" />
                        ) : (
                          <div className="w-2 h-2 rounded-full border border-muted-foreground" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No images uploaded yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          {/* Batch Uploader */}
          <BatchVideoUploader onUploadComplete={handleUploadComplete} />

          {/* Gallery */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Video Library ({videos?.length || 0})
            </h4>
            {videosLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : videos && videos.length > 0 ? (
              <ScrollArea className="h-64">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pr-4">
                  {videos.map((asset) => (
                    <div
                      key={asset.id}
                      className="relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer group bg-black"
                      style={{
                        borderColor: selectedIds.has(asset.id) ? 'hsl(var(--primary))' : 'transparent',
                      }}
                      onClick={() => onSelect?.(asset.file_url, 'video')}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        toggleSelection(asset.id);
                      }}
                    >
                      <video
                        src={asset.file_url}
                        className="w-full h-full object-contain"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Film className="w-8 h-8 text-white/80" />
                      </div>
                      <button
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(asset.id);
                        }}
                      >
                        {selectedIds.has(asset.id) ? (
                          <Check className="w-3 h-3 text-primary" />
                        ) : (
                          <div className="w-2 h-2 rounded-full border border-muted-foreground" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No videos uploaded yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaLibrary;
