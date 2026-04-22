import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, BookOpen, Clock, Search, TrendingUp, Filter } from 'lucide-react';
import { useCECourses, useCELessons } from '@/hooks/useCECourses';
import { useUserCEProgress, useUserCertificates, useTotalCECredits } from '@/hooks/useCEProgress';
import CourseCard from '@/components/ce/CourseCard';
import { CECourse } from '@/types/ce';
import { ClinicianProfile } from '@/types/clinical';

interface CEHubPageProps {
  profile: ClinicianProfile | null;
}

const CEHubPage = ({ profile }: CEHubPageProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: courses, isLoading: coursesLoading } = useCECourses();
  const { data: progress } = useUserCEProgress();
  const { data: certificates } = useUserCertificates();
  const totalCredits = useTotalCECredits();

  // Calculate progress for each course
  const coursesWithProgress = useMemo(() => {
    if (!courses) return [];

    return courses.map(course => {
      const courseProgress = progress?.filter(p => p.course_id === course.id) || [];
      const lessonProgress = courseProgress.filter(p => p.lesson_id !== null);
      const completedLessons = lessonProgress.filter(p => p.completed_at !== null).length;
      const quizProgress = courseProgress.find(p => p.lesson_id === null);
      const hasCertificate = certificates?.some(c => c.course_id === course.id) || false;

      // For now, estimate total lessons based on duration (we'll improve this)
      const estimatedLessons = Math.ceil(course.duration_minutes / 10);
      const totalLessons = estimatedLessons;

      const percentComplete = hasCertificate 
        ? 100 
        : quizProgress?.quiz_passed 
          ? 95 
          : totalLessons > 0 
            ? (completedLessons / totalLessons) * 90 
            : 0;

      return {
        ...course,
        progress: {
          lessonsCompleted: completedLessons,
          totalLessons,
          quizPassed: quizProgress?.quiz_passed || false,
          hasCertificate,
          percentComplete
        }
      };
    });
  }, [courses, progress, certificates]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(courses?.map(c => c.category) || []);
    return Array.from(cats).sort();
  }, [courses]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return coursesWithProgress.filter(course => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          course.title.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && course.category !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed' && !course.progress.hasCertificate) return false;
        if (statusFilter === 'in-progress' && (course.progress.percentComplete === 0 || course.progress.hasCertificate)) return false;
        if (statusFilter === 'new' && course.progress.percentComplete > 0) return false;
      }

      return true;
    });
  }, [coursesWithProgress, searchQuery, categoryFilter, statusFilter]);

  // Stats
  const completedCount = coursesWithProgress.filter(c => c.progress.hasCertificate).length;
  const inProgressCount = coursesWithProgress.filter(c => c.progress.percentComplete > 0 && !c.progress.hasCertificate).length;

  const handleCourseClick = (course: CECourse) => {
    navigate(`/dashboard/ce/course/${course.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-glow text-primary rounded-full text-sm font-medium mb-3">
            <Award className="w-4 h-4" />
            <span>Continuing Education</span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">CE Courses</h1>
          <p className="text-muted-foreground mt-2">
            Earn CE credits to maintain your nursing license
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-glow flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{totalCredits.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground mt-1">Total Credits</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-success-glow flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-success" />
            </div>
            <div className="text-3xl font-bold text-success">{completedCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-warning" />
            </div>
            <div className="text-3xl font-bold text-warning">{inProgressCount}</div>
            <p className="text-sm text-muted-foreground mt-1">In Progress</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">{courses?.length || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {coursesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="border-border/50 shadow-soft rounded-2xl overflow-hidden animate-pulse">
              <div className="h-36 bg-muted" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No Courses Found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? "Try adjusting your filters to find courses."
                : "Check back soon for new CE courses!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              progress={course.progress}
              onClick={() => handleCourseClick(course)}
            />
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary-glow via-card to-card shadow-soft rounded-2xl overflow-hidden">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">About CE Credits</h4>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Complete courses and pass the assessment quiz (80% or higher) to earn CE credits. 
              Certificates can be downloaded and submitted to your state board for license renewal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CEHubPage;
