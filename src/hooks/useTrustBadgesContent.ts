import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TrustBadge {
  icon: 'calculator' | 'pill' | 'clock' | 'users' | 'shield' | 'award' | 'check' | 'star';
  title: string;
  description: string;
}

export interface TrustBadgesContent {
  badges: TrustBadge[];
  animateOnHover: boolean;
}

const defaultContent: TrustBadgesContent = {
  badges: [
    { icon: 'calculator', title: '50+ Clinical Tools', description: 'Dosage calculators & more' },
    { icon: 'pill', title: 'Evidence-Based', description: 'Clinically reviewed content' },
    { icon: 'clock', title: '24/7 Access', description: 'Always available at bedside' },
    { icon: 'users', title: 'Built for Nurses', description: 'By healthcare professionals' },
  ],
  animateOnHover: true,
};

export const useTrustBadgesContent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trust-badges-content'],
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
        .eq('section_key', 'trustBadges')
        .single();

      return section;
    },
    staleTime: 5 * 60 * 1000,
  });

  const content: TrustBadgesContent = {
    ...defaultContent,
    ...(data?.content as Partial<TrustBadgesContent> || {}),
  };

  return {
    content,
    isVisible: data?.is_visible ?? true,
    isLoading,
  };
};
