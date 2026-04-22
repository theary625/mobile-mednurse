-- CE Courses table
CREATE TABLE public.ce_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  ce_credits DECIMAL(3,1) NOT NULL DEFAULT 1.0,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  thumbnail_url TEXT,
  objectives TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CE Lessons table
CREATE TABLE public.ce_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.ce_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  lesson_order INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CE Quizzes table
CREATE TABLE public.ce_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.ce_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Course Assessment',
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  passing_score INTEGER NOT NULL DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CE User Progress table
CREATE TABLE public.ce_user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.ce_courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.ce_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  quiz_score INTEGER,
  quiz_passed BOOLEAN DEFAULT false,
  quiz_attempts INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- CE Certificates table
CREATE TABLE public.ce_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.ce_courses(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  ce_credits_earned DECIMAL(3,1) NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.ce_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_certificates ENABLE ROW LEVEL SECURITY;

-- CE Courses policies
CREATE POLICY "Anyone can view published courses" ON public.ce_courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all courses" ON public.ce_courses
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- CE Lessons policies
CREATE POLICY "Anyone can view lessons of published courses" ON public.ce_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ce_courses 
      WHERE ce_courses.id = ce_lessons.course_id 
      AND ce_courses.is_published = true
    )
  );

CREATE POLICY "Admins can manage all lessons" ON public.ce_lessons
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- CE Quizzes policies
CREATE POLICY "Anyone can view quizzes of published courses" ON public.ce_quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ce_courses 
      WHERE ce_courses.id = ce_quizzes.course_id 
      AND ce_courses.is_published = true
    )
  );

CREATE POLICY "Admins can manage all quizzes" ON public.ce_quizzes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- CE User Progress policies
CREATE POLICY "Users can view own progress" ON public.ce_user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.ce_user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.ce_user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON public.ce_user_progress
  FOR SELECT USING (is_admin_or_support(auth.uid()));

-- CE Certificates policies
CREATE POLICY "Users can view own certificates" ON public.ce_certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates" ON public.ce_certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all certificates" ON public.ce_certificates
  FOR SELECT USING (is_admin_or_support(auth.uid()));

CREATE POLICY "Admins can manage certificates" ON public.ce_certificates
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_ce_lessons_course_id ON public.ce_lessons(course_id);
CREATE INDEX idx_ce_lessons_order ON public.ce_lessons(course_id, lesson_order);
CREATE INDEX idx_ce_quizzes_course_id ON public.ce_quizzes(course_id);
CREATE INDEX idx_ce_user_progress_user_id ON public.ce_user_progress(user_id);
CREATE INDEX idx_ce_user_progress_course_id ON public.ce_user_progress(course_id);
CREATE INDEX idx_ce_certificates_user_id ON public.ce_certificates(user_id);
CREATE INDEX idx_ce_certificates_number ON public.ce_certificates(certificate_number);

-- Triggers for updated_at
CREATE TRIGGER update_ce_courses_updated_at
  BEFORE UPDATE ON public.ce_courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ce_lessons_updated_at
  BEFORE UPDATE ON public.ce_lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ce_quizzes_updated_at
  BEFORE UPDATE ON public.ce_quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ce_user_progress_updated_at
  BEFORE UPDATE ON public.ce_user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();