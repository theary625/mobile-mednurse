import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CECourse, CELesson, CEQuiz, QuizQuestion } from '@/types/ce';
import { Json } from '@/integrations/supabase/types';

// Fetch all published courses
export const useCECourses = () => {
  return useQuery({
    queryKey: ['ce-courses'],
    queryFn: async (): Promise<CECourse[]> => {
      const { data, error } = await supabase
        .from('ce_courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(course => ({
        ...course,
        ce_credits: Number(course.ce_credits),
        difficulty_level: course.difficulty_level as CECourse['difficulty_level']
      }));
    }
  });
};

// Fetch a single course by ID
export const useCECourse = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['ce-course', courseId],
    queryFn: async (): Promise<CECourse | null> => {
      if (!courseId) return null;
      
      const { data, error } = await supabase
        .from('ce_courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return {
        ...data,
        ce_credits: Number(data.ce_credits),
        difficulty_level: data.difficulty_level as CECourse['difficulty_level']
      };
    },
    enabled: !!courseId
  });
};

// Fetch lessons for a course
export const useCELessons = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['ce-lessons', courseId],
    queryFn: async (): Promise<CELesson[]> => {
      if (!courseId) return [];
      
      const { data, error } = await supabase
        .from('ce_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId
  });
};

// Fetch quiz for a course
export const useCEQuiz = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['ce-quiz', courseId],
    queryFn: async (): Promise<CEQuiz | null> => {
      if (!courseId) return null;
      
      const { data, error } = await supabase
        .from('ce_quizzes')
        .select('*')
        .eq('course_id', courseId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No quiz found
        throw error;
      }
      
      return {
        ...data,
        questions: (data.questions as unknown as QuizQuestion[]) || []
      };
    },
    enabled: !!courseId
  });
};

// Admin: Fetch all courses (including unpublished)
export const useAdminCECourses = () => {
  return useQuery({
    queryKey: ['admin-ce-courses'],
    queryFn: async (): Promise<CECourse[]> => {
      const { data, error } = await supabase
        .from('ce_courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(course => ({
        ...course,
        ce_credits: Number(course.ce_credits),
        difficulty_level: course.difficulty_level as CECourse['difficulty_level']
      }));
    }
  });
};

// Admin: Create course
export const useCreateCECourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (course: Omit<Partial<CECourse>, 'id' | 'created_at' | 'updated_at'> & { title: string }) => {
      const { data, error } = await supabase
        .from('ce_courses')
        .insert({
          title: course.title,
          description: course.description,
          category: course.category,
          ce_credits: course.ce_credits,
          duration_minutes: course.duration_minutes,
          difficulty_level: course.difficulty_level,
          thumbnail_url: course.thumbnail_url,
          objectives: course.objectives,
          is_published: course.is_published,
          is_free: course.is_free ?? false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ce-courses'] });
      queryClient.invalidateQueries({ queryKey: ['ce-courses'] });
    }
  });
};

// Admin: Update course
export const useUpdateCECourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CECourse> & { id: string }) => {
      const { data, error } = await supabase
        .from('ce_courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-ce-courses'] });
      queryClient.invalidateQueries({ queryKey: ['ce-courses'] });
      queryClient.invalidateQueries({ queryKey: ['ce-course', variables.id] });
    }
  });
};

// Admin: Delete course
export const useDeleteCECourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('ce_courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ce-courses'] });
      queryClient.invalidateQueries({ queryKey: ['ce-courses'] });
    }
  });
};

// Admin: Create lesson
export const useCreateCELesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lesson: Omit<Partial<CELesson>, 'id' | 'created_at' | 'updated_at'> & { course_id: string; title: string }) => {
      const { data, error } = await supabase
        .from('ce_lessons')
        .insert({
          course_id: lesson.course_id,
          title: lesson.title,
          content: lesson.content,
          lesson_order: lesson.lesson_order,
          duration_minutes: lesson.duration_minutes,
          video_url: lesson.video_url
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ce-lessons', variables.course_id] });
    }
  });
};

// Admin: Update lesson
export const useUpdateCELesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CELesson> & { id: string }) => {
      const { data, error } = await supabase
        .from('ce_lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ce-lessons', data.course_id] });
    }
  });
};

// Admin: Delete lesson
export const useDeleteCELesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ lessonId, courseId }: { lessonId: string; courseId: string }) => {
      const { error } = await supabase
        .from('ce_lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ['ce-lessons', courseId] });
    }
  });
};

// Admin: Update quiz
export const useUpdateCEQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ courseId, quiz }: { courseId: string; quiz: Partial<CEQuiz> }) => {
      // Try to update first, if not found, insert
      const { data: existing } = await supabase
        .from('ce_quizzes')
        .select('id')
        .eq('course_id', courseId)
        .single();

      const questionsJson = quiz.questions as unknown as Json;

      if (existing) {
        const { data, error } = await supabase
          .from('ce_quizzes')
          .update({ 
            title: quiz.title,
            passing_score: quiz.passing_score,
            questions: questionsJson
          })
          .eq('course_id', courseId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('ce_quizzes')
          .insert({ 
            course_id: courseId, 
            title: quiz.title || 'Course Assessment',
            passing_score: quiz.passing_score || 80,
            questions: questionsJson
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ce-quiz', variables.courseId] });
    }
  });
};
