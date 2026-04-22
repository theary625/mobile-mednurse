import { useLandingContent } from './useLandingContent';

export interface NewsletterContent {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  privacyText: string;
  privacyLink: string;
  followText: string;
}

const defaultNewsletterContent: NewsletterContent = {
  title: 'Join 50,000+ Healthcare Professionals',
  subtitle: 'Get weekly insights, CE opportunities, and medication safety updates.',
  placeholder: 'Enter your email address',
  buttonText: 'Subscribe',
  privacyText: 'We respect your privacy.',
  privacyLink: '/privacy',
  followText: 'Follow us:',
};

export const useNewsletterContent = () => {
  const { data, isLoading } = useLandingContent('newsletter');
  
  const content: NewsletterContent = data?.content 
    ? {
        title: (data.content as any).title || defaultNewsletterContent.title,
        subtitle: (data.content as any).subtitle || defaultNewsletterContent.subtitle,
        placeholder: (data.content as any).placeholder || defaultNewsletterContent.placeholder,
        buttonText: (data.content as any).buttonText || defaultNewsletterContent.buttonText,
        privacyText: (data.content as any).privacyText || defaultNewsletterContent.privacyText,
        privacyLink: (data.content as any).privacyLink || defaultNewsletterContent.privacyLink,
        followText: (data.content as any).followText || defaultNewsletterContent.followText,
      }
    : defaultNewsletterContent;

  return {
    content,
    isVisible: data?.isVisible ?? true,
    isLoading,
  };
};

export { defaultNewsletterContent };
