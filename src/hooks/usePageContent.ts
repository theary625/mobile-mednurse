import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageSection {
  section_key: string;
  content: Record<string, any>;
  is_visible: boolean;
  display_order: number;
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string;
  sections: PageSection[];
}

// Default content for each page type
export const defaultPageContent: Record<string, Record<string, any>> = {
  // Landing page defaults
  landing: {
    announcement: {
      message: 'Award Winner! Best Emerging Nursing & Medical Administration Solution 2025 - USA',
      linkText: 'Get Started Free',
      linkUrl: '/auth?signup=true',
      showIcon: true,
      iconType: 'trophy',
      backgroundColor: 'accent',
      animated: false,
    },
    video: {
      videoUrl: '',
      posterUrl: '',
      headline: 'See MedNurse',
      headlineAccent: 'in action',
      description: 'Watch how nurses are using MedNurse to streamline their clinical workflow and deliver safer patient care.',
      ctaText: 'Start Membership',
      ctaLink: '/auth',
      autoplay: true,
      loop: true,
      showControls: true,
    },
    visionMission: {
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
    },
    trustBadges: {
      badges: [
        { icon: 'calculator', title: '50+ Clinical Tools', description: 'Dosage calculators & more' },
        { icon: 'pill', title: 'Evidence-Based', description: 'Clinically reviewed content' },
        { icon: 'clock', title: '24/7 Access', description: 'Always available at bedside' },
        { icon: 'users', title: 'Built for Nurses', description: 'By healthcare professionals' },
      ],
      animateOnHover: true,
    },
    stickyDownloadBar: {
      title: 'Download MedNurse Free',
      subtitle: '50,000+ nurses trust us',
      buttonText: 'Get Started',
      buttonHref: '/auth',
    },
  },
  // Header and Footer defaults
  header: {
    logo: {
      altText: 'MedNurse Logo',
    },
    solutionsDropdown: {
      items: [
        { label: 'Medication Error Prevention', href: '/medication-error-prevention', description: 'Reduce risk at ordering, prep, and administration' },
        { label: 'Bedside Guidance', href: '/bedside-guidance', description: 'Fast answers for safe decisions at point of care' },
        { label: 'IV Infusion Safety', href: '/iv-infusion-safety', description: 'Compatibility, monitoring, and infusion best practices' },
        { label: 'Patient Education', href: '/patient-education', description: 'Clear language to support adherence and understanding' },
        { label: 'Hospital Compliance', href: '/hospital-compliance', description: 'Support training and safety standards across units' },
      ],
    },
    resourcesDropdown: {
      items: [
        { label: 'Clinical Insights', href: '/blog', description: 'Practical guidance for real bedside decisions' },
        { label: 'Medication Safety Updates', href: '/blog', description: 'High-impact safety topics and common error patterns' },
        { label: 'Nursing Education', href: '/blog', description: 'Learning content for students to advanced practice' },
        { label: 'Compliance Guidance', href: '/blog', description: 'Support training readiness and documentation standards' },
        { label: 'All Posts', href: '/blog', description: 'Browse the full library' },
      ],
    },
    askEdith: {
      label: 'Ask Edith AI',
      description: 'Clinical guidance when you need it',
    },
    ctaButtons: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      demo: 'Request Demo',
      dashboard: 'Dashboard',
    },
  },
  footer: {
    brand: {
      tagline: 'Empowering healthcare professionals with evidence-based medication safety education and clinical tools.',
    },
    socialLinks: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    solutionsColumn: {
      title: 'Solutions',
      links: [
        { label: 'Error Prevention', href: '/medication-error-prevention' },
        { label: 'Bedside Guidance', href: '/bedside-guidance' },
        { label: 'IV Infusion Safety', href: '/iv-infusion-safety' },
        { label: 'Patient Education', href: '/patient-education' },
      ],
    },
    productColumn: {
      title: 'Product',
      links: [
        { label: 'Safety Tools', href: '/nursing-safety-tools' },
        { label: 'Pricing', href: '/plans' },
        { label: 'Hospital Compliance', href: '/hospital-compliance' },
        { label: 'Create Account', href: '/auth' },
        { label: 'Recertme', href: 'https://recertme.com', external: true },
      ],
    },
    companyColumn: {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press & Media', href: '/press' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    trustColumn: {
      title: 'Trust',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Security', href: '/security' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Editorial Standards', href: '/editorial' },
      ],
    },
    contact: {
      email: 'hello@mednurse.com',
      phone: '1-800-MEDNURSE',
    },
    award: {
      altText: 'Healthcare & Pharmaceutical Awards 2025 Winner',
      label: 'Award Winner 2025',
    },
    copyright: {
      text: '© {year} MedNurse. All rights reserved.',
    },
  },
  // Page defaults
  about: {
    hero: {
      headline: 'About MedNurse',
      subheadline: 'Building safer healthcare through innovation',
      description: 'MedNurse was founded by nurses, for nurses, with a mission to reduce medication errors and improve patient safety.',
    },
    mission: {
      title: 'Our Mission',
      content: 'To empower healthcare professionals with the tools they need to provide safe, effective patient care.',
    },
    team: {
      title: 'Our Team',
      description: 'A dedicated team of healthcare professionals and technologists.',
    },
  },
  plans: {
    hero: {
      headline: 'Choose Your Plan',
      subheadline: 'Flexible pricing for individuals and organizations',
    },
    pricing: {
      title: 'Pricing Plans',
      description: 'Find the right plan for your needs',
    },
  },
  contact: {
    hero: {
      headline: 'Contact Us',
      subheadline: 'We\'d love to hear from you',
    },
    form: {
      title: 'Send us a message',
      description: 'Fill out the form below and we\'ll get back to you shortly.',
    },
  },
  faq: {
    hero: {
      headline: 'Frequently Asked Questions',
      subheadline: 'Find answers to common questions',
    },
  },
  'schedule-demo': {
    hero: {
      headline: 'Schedule a Demo',
      subheadline: 'See MedNurse in action',
    },
  },
  press: {
    hero: {
      headline: 'Press & Media',
      subheadline: 'Latest news and media resources',
    },
  },
  'ask-edith': {
    hero: {
      headline: 'Ask Edith AI',
      subheadline: 'Your intelligent nursing assistant',
      description: 'Get instant answers to clinical questions powered by AI.',
    },
  },
  privacy: {
    hero: {
      headline: 'Privacy Policy',
      subheadline: 'How we protect your data',
    },
  },
  terms: {
    hero: {
      headline: 'Terms of Service',
      subheadline: 'Our terms and conditions',
    },
  },
  security: {
    hero: {
      headline: 'Security',
      subheadline: 'How we keep your data safe',
    },
  },
  'medication-error-prevention': {
    hero: {
      headline: 'Medication Error Prevention',
      subheadline: 'Comprehensive strategies to reduce medication errors',
    },
    content: {
      title: 'Why Medication Safety Matters',
      description: 'Learn about the importance of medication safety in healthcare.',
    },
  },
  'bedside-guidance': {
    hero: {
      headline: 'Bedside Guidance',
      subheadline: 'Real-time clinical decision support at the point of care',
    },
  },
  'nursing-safety-tools': {
    hero: {
      headline: 'Nursing Safety Tools',
      subheadline: 'Essential tools for safe nursing practice',
    },
  },
  'iv-infusion-safety': {
    hero: {
      headline: 'IV Infusion Safety',
      subheadline: 'Best practices for safe IV administration',
    },
  },
  'patient-education': {
    hero: {
      headline: 'Patient Education',
      subheadline: 'Resources to educate patients about their medications',
    },
  },
  'hospital-compliance': {
    hero: {
      headline: 'Hospital Compliance',
      subheadline: 'Meeting regulatory requirements for medication safety',
    },
  },
};

export const usePageContent = (slug: string) => {
  return useQuery({
    queryKey: ['page-content', slug],
    queryFn: async (): Promise<PageData | null> => {
      // Get the page
      const { data: page, error: pageError } = await supabase
        .from('marketing_pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (pageError || !page) {
        console.warn(`Page not found: ${slug}`);
        return null;
      }

      // Get sections for this page
      const { data: sections, error: sectionsError } = await supabase
        .from('marketing_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('display_order', { ascending: true });

      if (sectionsError) {
        console.warn(`Error fetching sections for ${slug}:`, sectionsError);
      }

      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        description: page.description,
        status: page.status,
        sections: (sections || []).map(s => ({
          section_key: s.section_key,
          content: s.content as Record<string, any>,
          is_visible: s.is_visible,
          display_order: s.display_order,
        })),
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAllPages = () => {
  return useQuery({
    queryKey: ['all-marketing-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_pages')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching pages:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const getSectionContent = (
  pageData: PageData | null | undefined,
  sectionKey: string,
  pageSlug: string
): Record<string, any> => {
  // Try to get from database first
  if (pageData?.sections) {
    const section = pageData.sections.find(s => s.section_key === sectionKey);
    if (section?.content && Object.keys(section.content).length > 0) {
      return section.content;
    }
  }

  // Fall back to defaults
  return defaultPageContent[pageSlug]?.[sectionKey] || {};
};

export const isSectionVisible = (
  pageData: PageData | null | undefined,
  sectionKey: string
): boolean => {
  if (!pageData?.sections) return true;
  const section = pageData.sections.find(s => s.section_key === sectionKey);
  return section?.is_visible ?? true;
};
