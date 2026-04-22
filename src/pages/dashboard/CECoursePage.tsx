import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Play,
  FileText,
  Trophy,
  Lock,
  Gift,
  DollarSign
} from 'lucide-react';
import { useCECourse, useCELessons, useCEQuiz } from '@/hooks/useCECourses';
import { useCourseProgress, useCourseCertificate, useIssueCertificate } from '@/hooks/useCEProgress';
import QuizComponent from '@/components/ce/QuizComponent';
import { difficultyLabels, difficultyColors } from '@/types/ce';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CECoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showQuiz, setShowQuiz] = useState(false);

  const { data: course, isLoading: courseLoading } = useCECourse(courseId);
  const { data: lessons, isLoading: lessonsLoading } = useCELessons(courseId);
  const { data: quiz } = useCEQuiz(courseId);
  const { data: progress } = useCourseProgress(courseId);
  const { data: certificate } = useCourseCertificate(courseId);
  const issueCertificate = useIssueCertificate();

  // Calculate progress
  const completedLessonIds = new Set(
    progress?.filter(p => p.lesson_id && p.completed_at).map(p => p.lesson_id)
  );
  const allLessonsCompleted = lessons && lessons.length > 0 && 
    lessons.every(l => completedLessonIds.has(l.id));
  const quizProgress = progress?.find(p => p.lesson_id === null);
  const quizPassed = quizProgress?.quiz_passed || false;

  const percentComplete = lessons && lessons.length > 0
    ? Math.round((completedLessonIds.size / lessons.length) * 100)
    : 0;

  const handleLessonClick = (lessonId: string) => {
    navigate(`/dashboard/ce/course/${courseId}/lesson/${lessonId}`);
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    if (passed && course && !certificate) {
      try {
        await issueCertificate.mutateAsync({
          courseId: course.id,
          ceCredits: course.ce_credits
        });
        toast({
          title: "Congratulations! 🎉",
          description: `You earned ${course.ce_credits} CE credit${course.ce_credits !== 1 ? 's' : ''}! Your certificate is ready.`,
        });
      } catch (error) {
        console.error('Failed to issue certificate:', error);
      }
    }
    setShowQuiz(false);
  };

  if (courseLoading || lessonsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="space-y-3">
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button variant="outline" onClick={() => navigate('/dashboard/ce')} className="mt-4">
          Back to CE Courses
        </Button>
      </div>
    );
  }

  if (showQuiz && quiz) {
    return (
      <QuizComponent
        quiz={quiz}
        courseTitle={course.title}
        onComplete={handleQuizComplete}
        onBack={() => setShowQuiz(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/dashboard/ce')}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to CE Courses
      </Button>

      {/* Course Header */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-primary/40" />
            </div>
          )}
          {certificate && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-success text-success-foreground shadow-lg">
                <Trophy className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{course.category}</Badge>
            <Badge className={cn(difficultyColors[course.difficulty_level])}>
              {difficultyLabels[course.difficulty_level]}
            </Badge>
            {course.is_free ? (
              <Badge className="bg-[#5856d6] text-white">
                <Gift className="w-3 h-3 mr-1" />
                Free
              </Badge>
            ) : (
              <Badge className="bg-[#ff9500] text-white">
                <DollarSign className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{course.duration_minutes} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>{course.ce_credits} CE Credit{course.ce_credits !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{lessons?.length || 0} Lessons</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">{percentComplete}%</span>
            </div>
            <Progress value={percentComplete} className="h-3 rounded-full" />
          </div>

          {/* Objectives */}
          {course.objectives && course.objectives.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-2">Learning Objectives</h3>
              <ul className="space-y-1.5">
                {course.objectives.map((obj, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lessons List */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Course Content
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {lessons && lessons.length > 0 ? (
            <div className="divide-y divide-border/50">
              {lessons.map((lesson, idx) => {
                const isCompleted = completedLessonIds.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      isCompleted ? "bg-success-glow text-success" : "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{lesson.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {lesson.duration_minutes} min
                      </p>
                    </div>
                    <Play className="w-5 h-5 text-primary" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No lessons available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Section */}
      {quiz && (
        <Card className={cn(
          "border-border/50 shadow-soft rounded-2xl overflow-hidden",
          quizPassed && "border-success/30 bg-success-glow/20"
        )}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                quizPassed ? "bg-success-glow" : allLessonsCompleted ? "bg-primary-glow" : "bg-muted"
              )}>
                {quizPassed ? (
                  <Trophy className="w-6 h-6 text-success" />
                ) : allLessonsCompleted ? (
                  <FileText className="w-6 h-6 text-primary" />
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Course Assessment</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {quizPassed 
                    ? `Passed with ${quizProgress?.quiz_score}%! Your certificate is ready.`
                    : allLessonsCompleted
                      ? `Complete the quiz (${quiz.passing_score}% to pass) to earn your CE credits.`
                      : 'Complete all lessons to unlock the assessment quiz.'}
                </p>
                {quizProgress && !quizPassed && quizProgress.quiz_attempts > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last attempt: {quizProgress.quiz_score}% ({quizProgress.quiz_attempts} attempt{quizProgress.quiz_attempts !== 1 ? 's' : ''})
                  </p>
                )}
              </div>
              <Button
                onClick={() => setShowQuiz(true)}
                disabled={!allLessonsCompleted}
                variant={quizPassed ? "outline" : "default"}
                className="rounded-xl"
              >
                {quizPassed ? 'Retake Quiz' : 'Start Quiz'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificate Section */}
      {certificate && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary-glow via-card to-card shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Certificate Earned!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Certificate #{certificate.certificate_number} • {certificate.ce_credits_earned} CE Credits
                </p>
              </div>
              <Button variant="outline" className="rounded-xl" onClick={() => navigate('/dashboard/ce/transcript')}>
                View Transcript
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CECoursePage;
