// CE (Continuing Education) Types

export interface CECourse {
  id: string;
  title: string;
  description: string | null;
  category: string;
  ce_credits: number;
  duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url: string | null;
  objectives: string[] | null;
  is_published: boolean;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

export interface CELesson {
  id: string;
  course_id: string;
  title: string;
  content: string | null;
  lesson_order: number;
  duration_minutes: number;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CEQuiz {
  id: string;
  course_id: string;
  title: string;
  questions: QuizQuestion[];
  passing_score: number;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correct_answer: string; // option id
  explanation?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface CEUserProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string | null;
  completed_at: string | null;
  quiz_score: number | null;
  quiz_passed: boolean;
  quiz_attempts: number;
  started_at: string;
  created_at: string;
  updated_at: string;
}

export interface CECertificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  ce_credits_earned: number;
  issued_at: string;
  created_at: string;
}

export interface CourseWithProgress extends CECourse {
  progress: {
    lessonsCompleted: number;
    totalLessons: number;
    quizPassed: boolean;
    hasCertificate: boolean;
    percentComplete: number;
  };
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseCategory = 'Safety' | 'Medications' | 'Calculations' | 'Skills' | 'General';

export const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
};

export const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: 'bg-success-glow text-success',
  intermediate: 'bg-warning/10 text-warning',
  advanced: 'bg-destructive/10 text-destructive'
};
