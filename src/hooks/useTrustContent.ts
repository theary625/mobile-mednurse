import { useLandingContent } from './useLandingContent';

export interface TrustContent {
  badgeText: string;
  headline: string;
  subheadline: string;
  award1Title: string;
  award1Subtitle: string;
  award1Badge: string;
  award2Title: string;
  award2Subtitle: string;
  award2Badge: string;
  award3Title: string;
  award3Subtitle: string;
  award3Badge: string;
  award4Title: string;
  award4Subtitle: string;
  award4Badge: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
}

const defaultTrustContent: TrustContent = {
  badgeText: 'Healthcare & Pharmaceutical Awards',
  headline: 'Award-winning',
  subheadline: 'MedNurse has been recognized for excellence in nursing technology and patient safety innovation.',
  award1Title: 'Best Emerging Nursing & Medical Administration Solution',
  award1Subtitle: '2025 — USA',
  award1Badge: 'Winner',
  award2Title: 'Excellence Award in Bedside Medical Safety',
  award2Subtitle: '2025 — Patient Safety Innovation',
  award2Badge: 'Excellence',
  award3Title: 'Best Medical Safety Platform 2026',
  award3Subtitle: '2026 — Healthcare & Pharmaceutical Awards',
  award3Badge: 'Winner 2026',
  award4Title: 'Excellence in Clinical Innovation 2026',
  award4Subtitle: '2026 — Healthcare & Pharmaceutical Awards',
  award4Badge: 'Excellence 2026',
  stat1Value: '4.9/5',
  stat1Label: 'Rating',
  stat2Value: '50K+',
  stat2Label: 'Active Users',
  stat3Value: '98%',
  stat3Label: 'Would Recommend',
  stat4Value: '1,200+',
  stat4Label: '5-Star Reviews',
};

export const useTrustContent = () => {
  const { data, isLoading } = useLandingContent('trust');
  
  const content: TrustContent = data?.content 
    ? {
        badgeText: (data.content as any).badgeText || defaultTrustContent.badgeText,
        headline: (data.content as any).headline || defaultTrustContent.headline,
        subheadline: (data.content as any).subheadline || defaultTrustContent.subheadline,
        award1Title: (data.content as any).award1Title || defaultTrustContent.award1Title,
        award1Subtitle: (data.content as any).award1Subtitle || defaultTrustContent.award1Subtitle,
        award1Badge: (data.content as any).award1Badge || defaultTrustContent.award1Badge,
        award2Title: (data.content as any).award2Title || defaultTrustContent.award2Title,
        award2Subtitle: (data.content as any).award2Subtitle || defaultTrustContent.award2Subtitle,
        award2Badge: (data.content as any).award2Badge || defaultTrustContent.award2Badge,
        award3Title: (data.content as any).award3Title || defaultTrustContent.award3Title,
        award3Subtitle: (data.content as any).award3Subtitle || defaultTrustContent.award3Subtitle,
        award3Badge: (data.content as any).award3Badge || defaultTrustContent.award3Badge,
        award4Title: (data.content as any).award4Title || defaultTrustContent.award4Title,
        award4Subtitle: (data.content as any).award4Subtitle || defaultTrustContent.award4Subtitle,
        award4Badge: (data.content as any).award4Badge || defaultTrustContent.award4Badge,
        stat1Value: (data.content as any).stat1Value || defaultTrustContent.stat1Value,
        stat1Label: (data.content as any).stat1Label || defaultTrustContent.stat1Label,
        stat2Value: (data.content as any).stat2Value || defaultTrustContent.stat2Value,
        stat2Label: (data.content as any).stat2Label || defaultTrustContent.stat2Label,
        stat3Value: (data.content as any).stat3Value || defaultTrustContent.stat3Value,
        stat3Label: (data.content as any).stat3Label || defaultTrustContent.stat3Label,
        stat4Value: (data.content as any).stat4Value || defaultTrustContent.stat4Value,
        stat4Label: (data.content as any).stat4Label || defaultTrustContent.stat4Label,
      }
    : defaultTrustContent;

  return {
    content,
    isVisible: data?.isVisible ?? true,
    isLoading,
  };
};

export { defaultTrustContent };
