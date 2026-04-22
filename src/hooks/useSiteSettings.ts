import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface HeaderSettings {
  logo: {
    altText: string;
  };
  solutionsDropdown: NavLink[];
  resourcesDropdown: NavLink[];
  askEdith: {
    label: string;
    description: string;
  };
  ctaButtons: {
    signIn: string;
    signUp: string;
    demo: string;
    dashboard: string;
  };
}

export interface FooterSettings {
  brand: {
    tagline: string;
  };
  socialLinks: {
    linkedin: string;
    instagram: string;
    tiktok: string;
  };
  columns: {
    solutions: { title: string; links: NavLink[] };
    product: { title: string; links: NavLink[] };
    company: { title: string; links: NavLink[] };
    trust: { title: string; links: NavLink[] };
  };
  contact: {
    email: string;
    phone: string;
  };
  award: {
    altText: string;
    label: string;
  };
  copyright: string;
}

// Default header settings
export const defaultHeaderSettings: HeaderSettings = {
  logo: {
    altText: 'MedNurse Logo',
  },
  solutionsDropdown: [
    { label: 'Medication Error Prevention', href: '/medication-error-prevention', description: 'Reduce risk at ordering, prep, and administration' },
    { label: 'Bedside Guidance', href: '/bedside-guidance', description: 'Fast answers for safe decisions at point of care' },
    { label: 'IV Infusion Safety', href: '/iv-infusion-safety', description: 'Compatibility, monitoring, and infusion best practices' },
    { label: 'Patient Education', href: '/patient-education', description: 'Clear language to support adherence and understanding' },
    { label: 'Hospital Compliance', href: '/hospital-compliance', description: 'Support training and safety standards across units' },
  ],
  resourcesDropdown: [
    { label: 'Clinical Insights', href: '/blog', description: 'Practical guidance for real bedside decisions' },
    { label: 'Medication Safety Updates', href: '/blog', description: 'High-impact safety topics and common error patterns' },
    { label: 'Nursing Education', href: '/blog', description: 'Learning content for students to advanced practice' },
    { label: 'Compliance Guidance', href: '/blog', description: 'Support training readiness and documentation standards' },
    { label: 'All Posts', href: '/blog', description: 'Browse the full library' },
  ],
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
};

// Default footer settings
export const defaultFooterSettings: FooterSettings = {
  brand: {
    tagline: 'Empowering healthcare professionals with evidence-based medication safety education and clinical tools.',
  },
  socialLinks: {
    linkedin: 'https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A111831047&keywords=mednurse&origin=RICH_QUERY_TYPEAHEAD_HISTORY&position=0&searchId=0bea7b40-f20c-4f26-94ea-55d4eb3e3726&sid=VV5&spellCorrectionEnabled=true',
    instagram: 'https://www.instagram.com/themednurseapp/',
    tiktok: 'https://www.tiktok.com/@themednurseapp?is_from_webapp=1&sender_device=pc',
  },
  columns: {
    solutions: {
      title: 'Solutions',
      links: [
        { label: 'Error Prevention', href: '/medication-error-prevention' },
        { label: 'Bedside Guidance', href: '/bedside-guidance' },
        { label: 'IV Infusion Safety', href: '/iv-infusion-safety' },
        { label: 'Patient Education', href: '/patient-education' },
      ],
    },
    product: {
      title: 'Product',
      links: [
        { label: 'Safety Tools', href: '/nursing-safety-tools' },
        { label: 'Pricing', href: '/plans' },
        { label: 'Hospital Compliance', href: '/hospital-compliance' },
        { label: 'Create Account', href: '/auth' },
        { label: 'Recertme', href: 'https://recertme.com', external: true },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press & Media', href: '/press' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    trust: {
      title: 'Trust',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Security', href: '/security' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Editorial Standards', href: '/editorial' },
      ],
    },
  },
  contact: {
    email: 'hello@mednurse.com',
    phone: '1-800-MEDNURSE',
  },
  award: {
    altText: 'Healthcare & Pharmaceutical Awards 2025 Winner',
    label: 'Award Winner 2025',
  },
  copyright: '© {year} MedNurse. All rights reserved.',
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      // Fetch header page and sections
      const { data: headerPage } = await supabase
        .from('marketing_pages')
        .select('id')
        .eq('slug', 'header')
        .single();

      // Fetch footer page and sections
      const { data: footerPage } = await supabase
        .from('marketing_pages')
        .select('id')
        .eq('slug', 'footer')
        .single();

      let headerSettings: HeaderSettings = { ...defaultHeaderSettings };
      let footerSettings: FooterSettings = { ...defaultFooterSettings };

      if (headerPage) {
        const { data: headerSections } = await supabase
          .from('marketing_sections')
          .select('*')
          .eq('page_id', headerPage.id);

        if (headerSections) {
          headerSections.forEach(section => {
            const content = section.content as Record<string, any>;
            if (section.section_key === 'logo' && content) {
              headerSettings.logo = { ...headerSettings.logo, ...content };
            } else if (section.section_key === 'solutionsDropdown' && content?.items) {
              headerSettings.solutionsDropdown = content.items;
            } else if (section.section_key === 'resourcesDropdown' && content?.items) {
              headerSettings.resourcesDropdown = content.items;
            } else if (section.section_key === 'askEdith' && content) {
              headerSettings.askEdith = { ...headerSettings.askEdith, ...content };
            } else if (section.section_key === 'ctaButtons' && content) {
              headerSettings.ctaButtons = { ...headerSettings.ctaButtons, ...content };
            }
          });
        }
      }

      if (footerPage) {
        const { data: footerSections } = await supabase
          .from('marketing_sections')
          .select('*')
          .eq('page_id', footerPage.id);

        if (footerSections) {
          footerSections.forEach(section => {
            const content = section.content as Record<string, any>;
            if (section.section_key === 'brand' && content) {
              footerSettings.brand = { ...footerSettings.brand, ...content };
            } else if (section.section_key === 'socialLinks' && content) {
              footerSettings.socialLinks = { ...footerSettings.socialLinks, ...content };
            } else if (section.section_key === 'solutionsColumn' && content) {
              footerSettings.columns.solutions = { ...footerSettings.columns.solutions, ...content };
            } else if (section.section_key === 'productColumn' && content) {
              footerSettings.columns.product = { ...footerSettings.columns.product, ...content };
            } else if (section.section_key === 'companyColumn' && content) {
              footerSettings.columns.company = { ...footerSettings.columns.company, ...content };
            } else if (section.section_key === 'trustColumn' && content) {
              footerSettings.columns.trust = { ...footerSettings.columns.trust, ...content };
            } else if (section.section_key === 'contact' && content) {
              footerSettings.contact = { ...footerSettings.contact, ...content };
            } else if (section.section_key === 'award' && content) {
              footerSettings.award = { ...footerSettings.award, ...content };
            } else if (section.section_key === 'copyright' && content?.text) {
              footerSettings.copyright = content.text;
            }
          });
        }
      }

      return {
        header: headerSettings,
        footer: footerSettings,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useHeaderSettings = () => {
  const { data, isLoading, error } = useSiteSettings();
  return {
    data: data?.header || defaultHeaderSettings,
    isLoading,
    error,
  };
};

export const useFooterSettings = () => {
  const { data, isLoading, error } = useSiteSettings();
  return {
    data: data?.footer || defaultFooterSettings,
    isLoading,
    error,
  };
};
