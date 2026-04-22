import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VisionMissionContent {
  sectionBadge: string;
  sectionTitle: string;
  visionBadge: string;
  visionTitle: string;
  visionDescription: string;
  visionIcon: 'eye' | 'lightbulb' | 'star' | 'target' | 'compass';
  missionBadge: string;
  missionTitle: string;
  missionDescription: string;
  missionIcon: 'target' | 'rocket' | 'heart' | 'shield' | 'users';
  footerNote: string;
  animateOnScroll: boolean;
}

const defaultContent: VisionMissionContent = {
  sectionBadge: 'Our Purpose',
  sectionTitle: 'Driven by Purpose, Guided by Science',
  visionBadge: 'Our Vision',
  visionTitle: 'A World Where Every Medication Dose is Safe',
  visionDescription: 'We envision a healthcare system where medication errors are virtually eliminated, where every nurse feels confident in their practice, and where patients receive the safest possible care.',
  visionIcon: 'eye',
  missionBadge: 'Our Mission',
  missionTitle: 'Empowering Nurses Through Education & Technology',
  missionDescription: 'To provide healthcare professionals with accessible, evidence-based education and intuitive clinical tools that transform medication safety from a challenge into a strength.',
  missionIcon: 'target',
  footerNote: "Together, we're building a safer future for healthcare — one dose at a time.",
  animateOnScroll: true,
};

export const useVisionMissionContent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['vision-mission-content'],
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
        .eq('section_key', 'visionMission')
        .single();

      return section;
    },
    staleTime: 5 * 60 * 1000,
  });

  const content: VisionMissionContent = {
    ...defaultContent,
    ...(data?.content as Partial<VisionMissionContent> || {}),
  };

  return {
    content,
    isVisible: data?.is_visible ?? true,
    isLoading,
  };
};
