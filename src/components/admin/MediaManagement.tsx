import MediaLibrary from '@/components/admin/marketing/MediaLibrary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

const MediaManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Upload, manage, and organize images and videos with batch processing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MediaLibrary />
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManagement;
