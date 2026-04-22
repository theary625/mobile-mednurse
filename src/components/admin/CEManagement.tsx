import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  GraduationCap,
  BookOpen,
  FileText,
  Eye,
  EyeOff,
  Clock,
  Award,
  Image as ImageIcon,
  Video,
  DollarSign,
  Gift,
  Upload,
  X,
  ChevronDown,
  Save,
  ListOrdered
} from 'lucide-react';
import { useAdminCECourses, useCreateCECourse, useUpdateCECourse, useDeleteCECourse, useCELessons, useCreateCELesson, useUpdateCELesson, useDeleteCELesson } from '@/hooks/useCECourses';
import { CECourse, CELesson, DifficultyLevel, difficultyLabels } from '@/types/ce';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  ce_credits: number;
  duration_minutes: number;
  difficulty_level: DifficultyLevel;
  objectives: string;
  is_published: boolean;
  is_free: boolean;
  thumbnail_url: string;
}

interface LessonFormData {
  title: string;
  content: string;
  duration_minutes: number;
  video_url: string;
  lesson_order: number;
}

const CEManagement = () => {
  const { toast } = useToast();
  const { data: courses, isLoading } = useAdminCECourses();
  const createCourse = useCreateCECourse();
  const updateCourse = useUpdateCECourse();
  const deleteCourse = useDeleteCECourse();
  const createLesson = useCreateCELesson();
  const updateLesson = useUpdateCELesson();
  const deleteLesson = useDeleteCELesson();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CECourse | null>(null);
  const [managingCourse, setManagingCourse] = useState<CECourse | null>(null);
  const [editingLesson, setEditingLesson] = useState<CELesson | null>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    category: 'General',
    ce_credits: 1,
    duration_minutes: 60,
    difficulty_level: 'beginner',
    objectives: '',
    is_published: false,
    is_free: false,
    thumbnail_url: ''
  });

  const [lessonFormData, setLessonFormData] = useState<LessonFormData>({
    title: '',
    content: '',
    duration_minutes: 10,
    video_url: '',
    lesson_order: 1
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'General',
      ce_credits: 1,
      duration_minutes: 60,
      difficulty_level: 'beginner',
      objectives: '',
      is_published: false,
      is_free: false,
      thumbnail_url: ''
    });
    setEditingCourse(null);
  };

  const resetLessonForm = () => {
    setLessonFormData({
      title: '',
      content: '',
      duration_minutes: 10,
      video_url: '',
      lesson_order: 1
    });
    setEditingLesson(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({ title: 'Invalid file type', description: 'Please upload a JPEG, PNG, WebP, or GIF image.', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image must be less than 5MB.', variant: 'destructive' });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `course-${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ce-assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ce-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: publicUrl });
      toast({ title: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      const courseData = {
        ...formData,
        objectives: formData.objectives.split('\n').filter(o => o.trim()),
        thumbnail_url: formData.thumbnail_url || null
      };

      if (editingCourse) {
        await updateCourse.mutateAsync({ id: editingCourse.id, ...courseData });
        toast({ title: 'Course updated successfully' });
      } else {
        await createCourse.mutateAsync(courseData);
        toast({ title: 'Course created successfully' });
      }
      
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save course', variant: 'destructive' });
    }
  };

  const handleEdit = (course: CECourse) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      category: course.category,
      ce_credits: course.ce_credits,
      duration_minutes: course.duration_minutes,
      difficulty_level: course.difficulty_level,
      objectives: course.objectives?.join('\n') || '',
      is_published: course.is_published,
      is_free: course.is_free ?? false,
      thumbnail_url: course.thumbnail_url || ''
    });
    setIsCreateOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This cannot be undone.')) return;
    
    try {
      await deleteCourse.mutateAsync(courseId);
      toast({ title: 'Course deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete course', variant: 'destructive' });
    }
  };

  const handleTogglePublish = async (course: CECourse) => {
    try {
      await updateCourse.mutateAsync({ id: course.id, is_published: !course.is_published });
      toast({ title: course.is_published ? 'Course unpublished' : 'Course published' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update course', variant: 'destructive' });
    }
  };

  const handleCreateOrUpdateLesson = async () => {
    if (!managingCourse) return;

    try {
      if (editingLesson) {
        await updateLesson.mutateAsync({
          id: editingLesson.id,
          ...lessonFormData,
          video_url: lessonFormData.video_url || null
        });
        toast({ title: 'Lesson updated successfully' });
      } else {
        await createLesson.mutateAsync({
          course_id: managingCourse.id,
          ...lessonFormData,
          video_url: lessonFormData.video_url || null
        });
        toast({ title: 'Lesson created successfully' });
      }
      
      setIsLessonDialogOpen(false);
      resetLessonForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save lesson', variant: 'destructive' });
    }
  };

  const handleEditLesson = (lesson: CELesson) => {
    setEditingLesson(lesson);
    setLessonFormData({
      title: lesson.title,
      content: lesson.content || '',
      duration_minutes: lesson.duration_minutes,
      video_url: lesson.video_url || '',
      lesson_order: lesson.lesson_order
    });
    setIsLessonDialogOpen(true);
  };

  const handleDeleteLesson = async (lesson: CELesson) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await deleteLesson.mutateAsync({ lessonId: lesson.id, courseId: lesson.course_id });
      toast({ title: 'Lesson deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete lesson', variant: 'destructive' });
    }
  };

  const categories = ['General', 'Safety', 'Medications', 'Calculations', 'Skills', 'Compliance'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1d1d1f]">CE Course Management</h2>
          <p className="text-[#86868b] text-sm mt-1">Create and manage continuing education courses</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Course Details</TabsTrigger>
                <TabsTrigger value="media">Media & Pricing</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="High-Alert Medication Safety"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Course description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={formData.difficulty_level} onValueChange={(v) => setFormData({ ...formData, difficulty_level: v as DifficultyLevel })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CE Credits</Label>
                    <Input type="number" step="0.5" min="0.5" max="10" value={formData.ce_credits} onChange={(e) => setFormData({ ...formData, ce_credits: parseFloat(e.target.value) || 1 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input type="number" min="15" max="300" value={formData.duration_minutes} onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Learning Objectives (one per line)</Label>
                  <Textarea value={formData.objectives} onChange={(e) => setFormData({ ...formData, objectives: e.target.value })} placeholder="Identify high-alert medications&#10;Apply safety protocols&#10;..." rows={4} />
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 py-4">
                {/* Thumbnail Upload */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Course Thumbnail
                  </Label>
                  <div className="flex items-start gap-4">
                    {formData.thumbnail_url ? (
                      <div className="relative group">
                        <img src={formData.thumbnail_url} alt="Thumbnail" className="w-32 h-20 object-cover rounded-lg border" />
                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setFormData({ ...formData, thumbnail_url: '' })}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-20 border-2 border-dashed border-[#d1d1d6] rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-[#86868b]" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="gap-2">
                        <Upload className="w-4 h-4" />
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      <p className="text-xs text-[#86868b]">JPEG, PNG, WebP, or GIF. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Course Pricing
                  </Label>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#fafafa]">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${formData.is_free ? 'bg-[#30d158]/10 text-[#30d158]' : 'bg-[#ff9500]/10 text-[#ff9500]'}`}>
                      {formData.is_free ? <Gift className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                      <span className="font-medium text-sm">{formData.is_free ? 'Free Course' : 'Paid Course'}</span>
                    </div>
                    <Switch checked={formData.is_free} onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })} />
                    <span className="text-sm text-[#86868b]">{formData.is_free ? 'Available to all users' : 'Requires membership'}</span>
                  </div>
                </div>

                {/* Publish Status */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                  <Label className="cursor-pointer">Publish immediately</Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleCreateOrUpdate} disabled={!formData.title || createCourse.isPending || updateCourse.isPending}>
                {editingCourse ? 'Save Changes' : 'Create Course'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-[#f0f0f0] shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-5 h-5 text-[#007aff] mx-auto mb-1" />
            <div className="text-xl font-bold text-[#1d1d1f]">{courses?.length || 0}</div>
            <p className="text-xs text-[#86868b]">Courses</p>
          </CardContent>
        </Card>
        <Card className="border-[#f0f0f0] shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <Eye className="w-5 h-5 text-[#30d158] mx-auto mb-1" />
            <div className="text-xl font-bold text-[#30d158]">{courses?.filter(c => c.is_published).length || 0}</div>
            <p className="text-xs text-[#86868b]">Published</p>
          </CardContent>
        </Card>
        <Card className="border-[#f0f0f0] shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <Gift className="w-5 h-5 text-[#5856d6] mx-auto mb-1" />
            <div className="text-xl font-bold text-[#5856d6]">{courses?.filter(c => c.is_free).length || 0}</div>
            <p className="text-xs text-[#86868b]">Free</p>
          </CardContent>
        </Card>
        <Card className="border-[#f0f0f0] shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-5 h-5 text-[#ff9500] mx-auto mb-1" />
            <div className="text-xl font-bold text-[#ff9500]">{courses?.filter(c => !c.is_free).length || 0}</div>
            <p className="text-xs text-[#86868b]">Paid</p>
          </CardContent>
        </Card>
        <Card className="border-[#f0f0f0] shadow-sm rounded-2xl">
          <CardContent className="p-4 text-center">
            <Award className="w-5 h-5 text-[#af52de] mx-auto mb-1" />
            <div className="text-xl font-bold text-[#1d1d1f]">{courses?.reduce((sum, c) => sum + c.ce_credits, 0).toFixed(1) || 0}</div>
            <p className="text-xs text-[#86868b]">Total CE</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card className="border-[#f0f0f0] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#f0f0f0] bg-[#fafafa]">
          <CardTitle className="text-[15px] font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#007aff]" />
            All Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-[#86868b]">Loading courses...</div>
          ) : courses && courses.length > 0 ? (
            <div className="divide-y divide-[#f0f0f0]">
              {courses.map((course) => (
                <CourseRow 
                  key={course.id} 
                  course={course}
                  onEdit={() => handleEdit(course)}
                  onDelete={() => handleDelete(course.id)}
                  onTogglePublish={() => handleTogglePublish(course)}
                  onManageLessons={() => setManagingCourse(course)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <GraduationCap className="w-12 h-12 text-[#86868b]/50 mx-auto mb-4" />
              <h3 className="font-medium text-[#1d1d1f] mb-1">No Courses Yet</h3>
              <p className="text-sm text-[#86868b] mb-4">Create your first CE course to get started.</p>
              <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />Add Course
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Management Dialog */}
      <Dialog open={!!managingCourse} onOpenChange={(open) => { if (!open) { setManagingCourse(null); resetLessonForm(); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-[#007aff]" />
              Manage Lessons: {managingCourse?.title}
            </DialogTitle>
          </DialogHeader>
          
          {managingCourse && (
            <LessonManager
              courseId={managingCourse.id}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onAddLesson={() => { resetLessonForm(); setIsLessonDialogOpen(true); }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Lesson Create/Edit Dialog */}
      <Dialog open={isLessonDialogOpen} onOpenChange={(open) => { setIsLessonDialogOpen(open); if (!open) resetLessonForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Lesson Title *</Label>
                <Input value={lessonFormData.title} onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })} placeholder="Introduction to High-Alert Medications" />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" min="1" value={lessonFormData.lesson_order} onChange={(e) => setLessonFormData({ ...lessonFormData, lesson_order: parseInt(e.target.value) || 1 })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video URL (optional)
              </Label>
              <Input value={lessonFormData.video_url} onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." />
              <p className="text-xs text-[#86868b]">Supports YouTube, Vimeo, or direct video URLs</p>
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input type="number" min="1" max="120" value={lessonFormData.duration_minutes} onChange={(e) => setLessonFormData({ ...lessonFormData, duration_minutes: parseInt(e.target.value) || 10 })} />
            </div>

            <div className="space-y-2">
              <Label>Lesson Content (Markdown supported)</Label>
              <Textarea value={lessonFormData.content} onChange={(e) => setLessonFormData({ ...lessonFormData, content: e.target.value })} placeholder="## Overview&#10;&#10;This lesson covers...&#10;&#10;### Key Points&#10;- Point 1&#10;- Point 2" rows={12} className="font-mono text-sm" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => { setIsLessonDialogOpen(false); resetLessonForm(); }}>Cancel</Button>
            <Button onClick={handleCreateOrUpdateLesson} disabled={!lessonFormData.title} className="gap-2">
              <Save className="w-4 h-4" />
              {editingLesson ? 'Save Lesson' : 'Create Lesson'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Course Row Component
const CourseRow = ({ course, onEdit, onDelete, onTogglePublish, onManageLessons }: {
  course: CECourse;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onManageLessons: () => void;
}) => (
  <div className="p-4 hover:bg-[#fafafa] transition-colors">
    <div className="flex items-start justify-between gap-4">
      <div className="flex gap-3 flex-1 min-w-0">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
        ) : (
          <div className="w-16 h-12 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-[#86868b]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-medium text-[#1d1d1f] truncate">{course.title}</h3>
            {course.is_published ? (
              <Badge className="bg-[#30d158]/10 text-[#30d158] border-0 text-[10px]">Published</Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">Draft</Badge>
            )}
            {course.is_free ? (
              <Badge className="bg-[#5856d6]/10 text-[#5856d6] border-0 text-[10px]">Free</Badge>
            ) : (
              <Badge className="bg-[#ff9500]/10 text-[#ff9500] border-0 text-[10px]">Paid</Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#86868b]">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{course.category}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration_minutes} min</span>
            <span className="flex items-center gap-1"><Award className="w-3 h-3" />{course.ce_credits} CE</span>
            <Badge variant="outline" className="text-[10px] py-0">{difficultyLabels[course.difficulty_level]}</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onManageLessons} className="h-8 px-2 text-[#007aff]">
          <ListOrdered className="w-4 h-4 mr-1" />Lessons
        </Button>
        <Button variant="ghost" size="icon" onClick={onTogglePublish} className="h-8 w-8">
          {course.is_published ? <EyeOff className="w-4 h-4 text-[#86868b]" /> : <Eye className="w-4 h-4 text-[#86868b]" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
          <Pencil className="w-4 h-4 text-[#86868b]" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 hover:text-[#ff3b30]">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

// Lesson Manager Component
const LessonManager = ({ courseId, onEditLesson, onDeleteLesson, onAddLesson }: {
  courseId: string;
  onEditLesson: (lesson: CELesson) => void;
  onDeleteLesson: (lesson: CELesson) => void;
  onAddLesson: () => void;
}) => {
  const { data: lessons, isLoading } = useCELessons(courseId);

  if (isLoading) return <div className="p-4 text-center text-[#86868b]">Loading lessons...</div>;

  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#86868b]">{lessons?.length || 0} lessons</p>
        <Button onClick={onAddLesson} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />Add Lesson
        </Button>
      </div>

      {lessons && lessons.length > 0 ? (
        <div className="space-y-2">
          {lessons.sort((a, b) => a.lesson_order - b.lesson_order).map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#f0f0f0] hover:border-[#007aff]/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#007aff]/10 flex items-center justify-center text-[#007aff] font-medium text-sm">
                {lesson.lesson_order}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#1d1d1f] truncate">{lesson.title}</h4>
                <div className="flex items-center gap-3 text-xs text-[#86868b]">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration_minutes} min</span>
                  {lesson.video_url && <span className="flex items-center gap-1"><Video className="w-3 h-3" />Has video</span>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onEditLesson(lesson)} className="h-8 w-8">
                <Pencil className="w-4 h-4 text-[#86868b]" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDeleteLesson(lesson)} className="h-8 w-8 hover:text-[#ff3b30]">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed border-[#e5e5e5] rounded-xl">
          <FileText className="w-8 h-8 text-[#86868b]/50 mx-auto mb-2" />
          <p className="text-[#86868b] text-sm">No lessons yet. Add your first lesson to get started.</p>
        </div>
      )}
    </div>
  );
};

export default CEManagement;