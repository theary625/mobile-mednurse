import { useLandingContent } from './useLandingContent';

export interface HeroContent {
  headline: string;
  subheadline: string;
  secondaryDescription: string;
  primaryCta: string;
  primaryCtaLink: string;
  secondaryCta: string;
  secondaryCtaLink: string;
  badge: string;
}

const defaultHeroContent: HeroContent = {
  headline: 'The Medication Safety Platform',
  subheadline: 'Prevent medication errors with real-time drug interaction alerts, IV compatibility checking, and evidence-based clinical tools—all designed for bedside nursing practice.',
  secondaryDescription: 'MedNurse empowers nurses with instant access to dosing calculators, high-alert medication protocols, and patient education resources. Reduce errors, improve outcomes, and practice with confidence.',
  primaryCta: 'Download Free',
  primaryCtaLink: '/auth?signup=true',
  secondaryCta: 'Explore Tools',
  secondaryCtaLink: '/nursing-safety-tools',
  badge: 'Trusted by 50,000+ Healthcare Professionals',
};

export const useHeroContent = () => {
  const { data, isLoading } = useLandingContent('hero');
  
  const content: HeroContent = data?.content 
    ? {
        headline: (data.content as any).headline || defaultHeroContent.headline,
        subheadline: (data.content as any).subheadline || defaultHeroContent.subheadline,
        secondaryDescription: (data.content as any).secondaryDescription || defaultHeroContent.secondaryDescription,
        primaryCta: (data.content as any).primaryCta || defaultHeroContent.primaryCta,
        primaryCtaLink: (data.content as any).primaryCtaLink || defaultHeroContent.primaryCtaLink,
        secondaryCta: (data.content as any).secondaryCta || defaultHeroContent.secondaryCta,
        secondaryCtaLink: (data.content as any).secondaryCtaLink || defaultHeroContent.secondaryCtaLink,
        badge: (data.content as any).badge || defaultHeroContent.badge,
      }
    : defaultHeroContent;

  return {
    content,
    isVisible: data?.isVisible ?? true,
    isLoading,
  };
};

export { defaultHeroContent };
