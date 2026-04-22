import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FeaturesContent {
  sectionTitle: string;
  sectionSubtitle: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
}

const defaultFeaturesContent: FeaturesContent = {
  sectionTitle: 'Everything You Need for Safer Practices',
  sectionSubtitle: 'A comprehensive platform designed by nurses, for nurses.',
  feature1Title: 'Clinical Decision Support',
  feature1Description: 'Real-time drug interaction checks and dosage calculators right at the point of care.',
  feature2Title: 'Location-Based Safety',
  feature2Description: 'Smart reminders based on your clinical setting—5 Rights checks, allergy alerts, and pain reassessment prompts.',
  feature3Title: 'Smart Insights',
  feature3Description: 'Personalized learning recommendations based on your specialty and experience.',
};

export const useLandingContent = (sectionKey: string) => {
  return useQuery({
    queryKey: ['landing-content', sectionKey],
    queryFn: async () => {
      // First get the landing page
      const { data: page, error: pageError } = await supabase
        .from('marketing_pages')
        .select('id')
        .eq('slug', 'landing')
        .single();

      if (pageError || !page) {
        return null;
      }

      // Then get the specific section
      const { data: section, error: sectionError } = await supabase
        .from('marketing_sections')
        .select('content, is_visible')
        .eq('page_id', page.id)
        .eq('section_key', sectionKey)
        .single();

      if (sectionError || !section) {
        return null;
      }

      return {
        content: section.content,
        isVisible: section.is_visible,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useFeaturesContent = () => {
  const { data, isLoading } = useLandingContent('features');
  
  const content: FeaturesContent = data?.content 
    ? {
        sectionTitle: (data.content as any).sectionTitle || defaultFeaturesContent.sectionTitle,
        sectionSubtitle: (data.content as any).sectionSubtitle || defaultFeaturesContent.sectionSubtitle,
        feature1Title: (data.content as any).feature1Title || defaultFeaturesContent.feature1Title,
        feature1Description: (data.content as any).feature1Description || defaultFeaturesContent.feature1Description,
        feature2Title: (data.content as any).feature2Title || defaultFeaturesContent.feature2Title,
        feature2Description: (data.content as any).feature2Description || defaultFeaturesContent.feature2Description,
        feature3Title: (data.content as any).feature3Title || defaultFeaturesContent.feature3Title,
        feature3Description: (data.content as any).feature3Description || defaultFeaturesContent.feature3Description,
      }
    : defaultFeaturesContent;

  return {
    content,
    isVisible: data?.isVisible ?? true,
    isLoading,
  };
};

export { defaultFeaturesContent };
