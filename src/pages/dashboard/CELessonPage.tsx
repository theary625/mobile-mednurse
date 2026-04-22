import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  BookOpen
} from 'lucide-react';
import { useCECourse, useCELessons } from '@/hooks/useCECourses';
import { useCourseProgress, useCompleteLesson, useStartLesson } from '@/hooks/useCEProgress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CELessonPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: course } = useCECourse(courseId);
  const { data: lessons } = useCELessons(courseId);
  const { data: progress } = useCourseProgress(courseId);
  const completeLesson = useCompleteLesson();
  const startLesson = useStartLesson();

  const currentLesson = lessons?.find(l => l.id === lessonId);
  const currentIndex = lessons?.findIndex(l => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? lessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex < (lessons?.length ?? 0) - 1 ? lessons?.[currentIndex + 1] : null;

  const lessonProgress = progress?.find(p => p.lesson_id === lessonId);
  const isCompleted = !!lessonProgress?.completed_at;

  // Mark lesson as started when viewing
  useEffect(() => {
    if (courseId && lessonId && !lessonProgress) {
      startLesson.mutate({ courseId, lessonId });
    }
  }, [courseId, lessonId, lessonProgress]);

  const handleMarkComplete = async () => {
    if (!courseId || !lessonId) return;
    
    try {
      await completeLesson.mutateAsync({ courseId, lessonId });
      toast({
        title: "Lesson completed!",
        description: nextLesson 
          ? "Great progress! Continue to the next lesson."
          : "All lessons complete! Take the quiz to earn your CE credits.",
      });
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  };

  const handleNavigate = (targetLessonId: string) => {
    navigate(`/dashboard/ce/course/${courseId}/lesson/${targetLessonId}`);
  };

  if (!currentLesson || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Lesson not found</p>
        <Button variant="outline" onClick={() => navigate(`/dashboard/ce/course/${courseId}`)} className="mt-4">
          Back to Course
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/dashboard/ce/course/${courseId}`)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Button>
        <Badge variant="outline" className="gap-1.5">
          <BookOpen className="w-3 h-3" />
          Lesson {currentIndex + 1} of {lessons?.length || 0}
        </Badge>
      </div>

      {/* Lesson Content */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardContent className="p-6 lg:p-8">
          {/* Lesson Header */}
          <div className="mb-6 pb-6 border-b border-border/50">
            <div className="flex items-center gap-2 mb-2">
              {isCompleted && (
                <Badge className="bg-success-glow text-success">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                {currentLesson.duration_minutes} min
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{currentLesson.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{course.title}</p>
          </div>

          {/* Video Player (if available) */}
          {currentLesson.video_url && (
            <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
              <video
                src={currentLesson.video_url}
                controls
                className="w-full h-full"
                poster=""
              />
            </div>
          )}

          {/* Lesson Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {currentLesson.content ? (
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Content coming soon...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mark Complete Button */}
      {!isCompleted && (
        <Card className="border-primary/30 bg-primary-glow/30 rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Finished reading?</p>
              <p className="text-sm text-muted-foreground">Mark this lesson as complete to track your progress.</p>
            </div>
            <Button 
              onClick={handleMarkComplete}
              disabled={completeLesson.isPending}
              className="rounded-xl gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {completeLesson.isPending ? 'Saving...' : 'Mark Complete'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => prevLesson && handleNavigate(prevLesson.id)}
          disabled={!prevLesson}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Lesson
        </Button>

        {nextLesson ? (
          <Button
            onClick={() => handleNavigate(nextLesson.id)}
            className="gap-2 rounded-xl"
          >
            Next Lesson
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => navigate(`/dashboard/ce/course/${courseId}`)}
            className="gap-2 rounded-xl"
          >
            Back to Course
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Lesson Navigation Pills */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">All Lessons</p>
          <div className="flex flex-wrap gap-2">
            {lessons?.map((lesson, idx) => {
              const isActive = lesson.id === lessonId;
              const lessonCompleted = progress?.some(p => p.lesson_id === lesson.id && p.completed_at);
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleNavigate(lesson.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : lessonCompleted
                        ? "bg-success-glow text-success hover:bg-success/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {idx + 1}. {lesson.title.length > 20 ? lesson.title.slice(0, 20) + '...' : lesson.title}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CELessonPage;
