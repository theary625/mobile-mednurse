import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CEUserProgress, CECertificate } from '@/types/ce';

// Fetch user's progress for all courses
export const useUserCEProgress = () => {
  return useQuery({
    queryKey: ['ce-user-progress'],
    queryFn: async (): Promise<CEUserProgress[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('ce_user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    }
  });
};

// Fetch user's progress for a specific course
export const useCourseProgress = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['ce-course-progress', courseId],
    queryFn: async (): Promise<CEUserProgress[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !courseId) return [];

      const { data, error } = await supabase
        .from('ce_user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId
  });
};

// Mark a lesson as started
export const useStartLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, lessonId }: { courseId: string; lessonId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ce_user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ce-course-progress', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['ce-user-progress'] });
    }
  });
};

// Mark a lesson as completed
export const useCompleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, lessonId }: { courseId: string; lessonId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ce_user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ce-course-progress', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['ce-user-progress'] });
    }
  });
};

// Submit quiz attempt
export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      courseId, 
      score, 
      passed 
    }: { 
      courseId: string; 
      score: number; 
      passed: boolean 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current quiz progress
      const { data: existing } = await supabase
        .from('ce_user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .is('lesson_id', null)
        .single();

      const attempts = (existing?.quiz_attempts || 0) + 1;

      const { data, error } = await supabase
        .from('ce_user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: null,
          quiz_score: score,
          quiz_passed: passed,
          quiz_attempts: attempts,
          completed_at: passed ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ce-course-progress', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['ce-user-progress'] });
    }
  });
};

// Generate certificate number
const generateCertificateNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'MN-CE-';
  let result = prefix;
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Issue certificate
export const useIssueCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, ceCredits }: { courseId: string; ceCredits: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ce_certificates')
        .insert({
          user_id: user.id,
          course_id: courseId,
          certificate_number: generateCertificateNumber(),
          ce_credits_earned: ceCredits
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ce-certificates'] });
      queryClient.invalidateQueries({ queryKey: ['ce-certificate', variables.courseId] });
    }
  });
};

// Fetch all user certificates
export const useUserCertificates = () => {
  return useQuery({
    queryKey: ['ce-certificates'],
    queryFn: async (): Promise<CECertificate[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('ce_certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(cert => ({
        ...cert,
        ce_credits_earned: Number(cert.ce_credits_earned)
      }));
    }
  });
};

// Fetch certificate for a specific course
export const useCourseCertificate = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['ce-certificate', courseId],
    queryFn: async (): Promise<CECertificate | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !courseId) return null;

      const { data, error } = await supabase
        .from('ce_certificates')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return {
        ...data,
        ce_credits_earned: Number(data.ce_credits_earned)
      };
    },
    enabled: !!courseId
  });
};

// Get total CE credits earned
export const useTotalCECredits = () => {
  const { data: certificates } = useUserCertificates();
  
  const total = certificates?.reduce((sum, cert) => sum + cert.ce_credits_earned, 0) || 0;
  return total;
};
