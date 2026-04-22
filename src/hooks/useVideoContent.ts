import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VideoContent {
  videoUrl: string;
  posterUrl: string;
  headline: string;
  headlineAccent: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  autoplay: boolean;
  loop: boolean;
  showControls: boolean;
}

const defaultVideoContent: VideoContent = {
  videoUrl: '',
  posterUrl: '',
  headline: 'See MedNurse',
  headlineAccent: 'in action',
  description: 'Watch how nurses are using MedNurse to streamline their clinical workflow and deliver safer patient care.',
  ctaText: 'Start Membership',
  ctaLink: '/auth',
  autoplay: true,
  loop: true,
  showControls: true,
};

export const useVideoContent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['video-content'],
    queryFn: async () => {
      // Get landing page
      const { data: page } = await supabase
        .from('marketing_pages')
        .select('id')
        .eq('slug', 'landing')
        .single();

      if (!page) return null;

      // Get video section
      const { data: section } = await supabase
        .from('marketing_sections')
        .select('content, is_visible')
        .eq('page_id', page.id)
        .eq('section_key', 'video')
        .single();

      return section;
    },
    staleTime: 5 * 60 * 1000,
  });

  const content: VideoContent = {
    ...defaultVideoContent,
    ...(data?.content as Partial<VideoContent> || {}),
  };

  return {
    content,
    isVisible: data?.is_visible ?? true,
    isLoading,
  };
};
