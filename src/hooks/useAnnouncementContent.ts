import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnnouncementContent {
  message: string;
  linkText: string;
  linkUrl: string;
  showIcon: boolean;
  iconType: 'trophy' | 'sparkles' | 'star' | 'bell' | 'info';
  backgroundColor: string;
  animated: boolean;
}

const defaultAnnouncementContent: AnnouncementContent = {
  message: 'Award Winner! Best Emerging Nursing & Medical Administration Solution 2025 - USA',
  linkText: 'Get Started Free',
  linkUrl: '/auth?signup=true',
  showIcon: true,
  iconType: 'trophy',
  backgroundColor: 'accent',
  animated: false,
};

export const useAnnouncementContent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['announcement-content'],
    queryFn: async () => {
      const { data: page } = await supabase
        .from('marketing_pages')
        .select('id')
        .eq('slug', 'landing')
        .single();

      if (!page) return null;

      const { data: section } = await supabase
        .from('marketing_sections')
        .select('content, is_visible')
        .eq('page_id', page.id)
        .eq('section_key', 'announcement')
        .single();

      return section;
    },
    staleTime: 5 * 60 * 1000,
  });

  const content: AnnouncementContent = {
    ...defaultAnnouncementContent,
    ...(data?.content as Partial<AnnouncementContent> || {}),
  };

  return {
    content,
    isVisible: data?.is_visible ?? true,
    isLoading,
  };
};
