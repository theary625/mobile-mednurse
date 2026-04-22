import { useLandingContent } from './useLandingContent';

export interface SolutionCard {
  title: string;
  description: string;
  href: string;
  color: 'primary' | 'accent' | 'success';
}

export interface SolutionsContent {
  badgeText: string;
  title: string;
  subtitle: string;
  cards: SolutionCard[];
}

const defaultSolutionsContent: SolutionsContent = {
  badgeText: 'Complete Safety Platform',
  title: 'Medication Safety Solutions for',
  subtitle: 'From bedside clinical decision support to hospital-wide compliance programs, MedNurse provides comprehensive medication safety tools designed specifically for nursing practice.',
  cards: [
    {
      title: 'Medication Error Prevention',
      description: 'Real-time drug interaction alerts and safety checks to prevent medication errors before they reach patients.',
      href: '/medication-error-prevention',
      color: 'primary',
    },
    {
      title: 'Bedside Guidance',
      description: 'Instant access to evidence-based medication information right at the point of care.',
      href: '/bedside-guidance',
      color: 'accent',
    },
    {
      title: 'Nursing Safety Tools',
      description: '40+ clinical calculators including drip rates, dosing, and assessment scales.',
      href: '/nursing-safety-tools',
      color: 'success',
    },
    {
      title: 'IV Infusion Safety',
      description: 'Specialized tools for IV compatibility, drip calculations, and high-alert medication protocols.',
      href: '/iv-infusion-safety',
      color: 'primary',
    },
    {
      title: 'Patient Education',
      description: 'Plain-language resources to help patients understand their medications and improve adherence.',
      href: '/patient-education',
      color: 'accent',
    },
    {
      title: 'Hospital Compliance',
      description: 'Meet Joint Commission and CMS medication safety requirements with documentation support.',
      href: '/hospital-compliance',
      color: 'success',
    },
  ],
};

export const useSolutionsContent = () => {
  const { data, isLoading } = useLandingContent('solutions');
  
  const content: SolutionsContent = data?.content 
    ? {
        badgeText: (data.content as any).badgeText || defaultSolutionsContent.badgeText,
        title: (data.content as any).title || defaultSolutionsContent.title,
        subtitle: (data.content as any).subtitle || defaultSolutionsContent.subtitle,
        cards: (data.content as any).cards?.length > 0 
          ? (data.content as any).cards 
          : defaultSolutionsContent.cards,
      }
    : defaultSolutionsContent;

  return {
    content,
    isVisible: data?.isVisible ?? true,
    isLoading,
  };
};

export { defaultSolutionsContent };
