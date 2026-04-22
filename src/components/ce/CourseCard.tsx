import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Award, BookOpen, CheckCircle2, Gift, DollarSign } from 'lucide-react';
import { CECourse, difficultyLabels, difficultyColors } from '@/types/ce';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: CECourse;
  progress?: {
    lessonsCompleted: number;
    totalLessons: number;
    quizPassed: boolean;
    hasCertificate: boolean;
    percentComplete: number;
  };
  onClick?: () => void;
}

const CourseCard = ({ course, progress, onClick }: CourseCardProps) => {
  const isCompleted = progress?.hasCertificate;
  const isInProgress = progress && progress.percentComplete > 0 && !isCompleted;

  return (
    <Card 
      className={cn(
        "border-border/50 shadow-soft rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group",
        "hover:shadow-medium hover:-translate-y-0.5",
        isCompleted && "border-success/30 bg-success-glow/30"
      )}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {isCompleted && (
            <Badge className="bg-success text-success-foreground shadow-sm">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
          {isInProgress && !isCompleted && (
            <Badge variant="secondary" className="shadow-sm">
              In Progress
            </Badge>
          )}
        </div>

        {/* Free/Paid Badge */}
        <div className="absolute top-3 left-3">
          {course.is_free ? (
            <Badge className="bg-[#5856d6] text-white shadow-sm">
              <Gift className="w-3 h-3 mr-1" />
              Free
            </Badge>
          ) : (
            <Badge className="bg-[#ff9500] text-white shadow-sm">
              <DollarSign className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Category & Difficulty */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {course.category}
          </Badge>
          <Badge className={cn("text-xs", difficultyColors[course.difficulty_level])}>
            {difficultyLabels[course.difficulty_level]}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{course.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>{course.ce_credits} CE Credit{course.ce_credits !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {progress && progress.percentComplete > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{Math.round(progress.percentComplete)}%</span>
            </div>
            <Progress 
              value={progress.percentComplete} 
              className={cn(
                "h-2 rounded-full",
                isCompleted && "[&>div]:bg-success"
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
