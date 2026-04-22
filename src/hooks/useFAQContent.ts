import { useLandingContent } from './useLandingContent';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  badgeText: string;
  title: string;
  subtitle: string;
  viewAllText: string;
  viewAllLink: string;
  items: FAQItem[];
}

const defaultFAQContent: FAQContent = {
  badgeText: 'FAQ',
  title: 'Common',
  subtitle: 'Quick answers to frequently asked questions about MedNurse.',
  viewAllText: 'View all FAQs',
  viewAllLink: '/faq',
  items: [
    {
      question: 'What is MedNurse and who is it for?',
      answer: 'MedNurse is a medication safety platform for nurses and healthcare professionals. It provides drug information, interaction alerts, CE courses, and clinical tools to reduce medication errors.',
    },
    {
      question: 'How much does MedNurse cost?',
      answer: 'MedNurse Membership is $12.99/month or $129/year. One membership unlocks full access—drug lookups, CE credits, IV compatibility, clinical tools, and offline mode.',
    },
    {
      question: 'Can I earn CE credits through MedNurse?',
      answer: 'Absolutely. MedNurse offers accredited continuing education courses approved by major nursing boards. Complete your annual requirements entirely through our platform.',
    },
    {
      question: 'Is MedNurse available on mobile?',
      answer: 'Yes, available on iOS and Android with offline mode. Access critical drug information even without an internet connection.',
    },
  ],
};

export const useFAQContent = () => {
  const { data, isLoading } = useLandingContent('faq');
  
  const content: FAQContent = data?.content 
    ? {
        badgeText: (data.content as any).badgeText || defaultFAQContent.badgeText,
        title: (data.content as any).title || defaultFAQContent.title,
        subtitle: (data.content as any).subtitle || defaultFAQContent.subtitle,
        viewAllText: (data.content as any).viewAllText || defaultFAQContent.viewAllText,
        viewAllLink: (data.content as any).viewAllLink || defaultFAQContent.viewAllLink,
        items: (data.content as any).items?.length > 0 
          ? (data.content as any).items 
          : defaultFAQContent.items,
      }
    : defaultFAQContent;

  return {
    content,
    isVisible: data?.isVisible ?? true,
    isLoading,
  };
};

export { defaultFAQContent };
