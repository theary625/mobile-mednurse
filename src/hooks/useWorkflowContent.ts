import { useLandingContent } from './useLandingContent';

export interface WorkflowContent {
  badgeText: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  bottomText: string;
}

const defaultWorkflowContent: WorkflowContent = {
  badgeText: 'How It Works',
  title: 'From Lookup to',
  subtitle: 'See how MedNurse guides nurses through every medication administration with real-time safety checks and clinical guidance.',
  ctaText: 'Start Membership',
  ctaLink: '/auth',
  secondaryCtaText: 'Explore Features',
  secondaryCtaLink: '/nursing-safety-tools',
  bottomText: 'Takes less than 30 seconds to look up any medication',
};

export const useWorkflowContent = () => {
  const { data, isLoading } = useLandingContent('workflow');
  
  const content: WorkflowContent = data?.content 
    ? {
        badgeText: (data.content as any).badgeText || defaultWorkflowContent.badgeText,
        title: (data.content as any).title || defaultWorkflowContent.title,
        subtitle: (data.content as any).subtitle || defaultWorkflowContent.subtitle,
        ctaText: (data.content as any).ctaText || defaultWorkflowContent.ctaText,
        ctaLink: (data.content as any).ctaLink || defaultWorkflowContent.ctaLink,
        secondaryCtaText: (data.content as any).secondaryCtaText || defaultWorkflowContent.secondaryCtaText,
        secondaryCtaLink: (data.content as any).secondaryCtaLink || defaultWorkflowContent.secondaryCtaLink,
        bottomText: (data.content as any).bottomText || defaultWorkflowContent.bottomText,
      }
    : defaultWorkflowContent;

  return {
    content,
    isVisible: data?.isVisible ?? true,
    isLoading,
  };
};

export { defaultWorkflowContent };
