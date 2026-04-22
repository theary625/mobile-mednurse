import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, RefreshCw, FileText, Building2, Scale, Globe, Plus, Trash2, Settings, Eye, EyeOff, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAllPages, defaultPageContent } from '@/hooks/usePageContent';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ArrayFieldEditor, { type ArrayItem, type ArrayFieldType } from './ArrayFieldEditor';
import MultiPagePreview from './MultiPagePreview';

interface PageSection {
  id?: string;
  section_key: string;
  content: Record<string, any>;
  is_visible: boolean;
  display_order: number;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string;
  sections: PageSection[];
}

// Page categories for organization
const pageCategories = {
  siteSettings: {
    label: 'Site Settings',
    icon: Settings,
    slugs: ['header', 'footer'],
  },
  landing: {
    label: 'Landing Page',
    icon: Globe,
    slugs: ['landing'],
  },
  marketing: {
    label: 'Marketing',
    icon: Globe,
    slugs: ['about', 'plans', 'contact', 'schedule-demo', 'faq', 'press', 'ask-edith'],
  },
  seo: {
    label: 'SEO Content',
    icon: FileText,
    slugs: ['medication-error-prevention', 'bedside-guidance', 'nursing-safety-tools', 'iv-infusion-safety', 'patient-education', 'hospital-compliance'],
  },
  legal: {
    label: 'Legal',
    icon: Scale,
    slugs: ['privacy', 'terms', 'security'],
  },
};

// Section definitions per page
interface SectionField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'select' | 'switch' | 'image' | 'video';
  options?: { value: string; label: string }[];
}

interface SectionDefinition {
  key: string;
  label: string;
  type?: 'array' | 'fields';
  arrayFields?: ArrayFieldType[];
  fields: SectionField[];
}

const pageSectionDefinitions: Record<string, SectionDefinition[]> = {
  landing: [
    {
      key: 'announcement',
      label: 'Announcement Bar',
      fields: [
        { name: 'message', label: 'Message', type: 'text' },
        { name: 'linkText', label: 'Link Text', type: 'text' },
        { name: 'linkUrl', label: 'Link URL', type: 'url' },
        { name: 'showIcon', label: 'Show Icon', type: 'switch' },
        { name: 'iconType', label: 'Icon', type: 'select', options: [
          { value: 'trophy', label: 'Trophy' },
          { value: 'sparkles', label: 'Sparkles' },
          { value: 'star', label: 'Star' },
          { value: 'bell', label: 'Bell' },
          { value: 'info', label: 'Info' },
        ]},
        { name: 'animated', label: 'Animate', type: 'switch' },
      ],
    },
    {
      key: 'video',
      label: 'Video Section',
      fields: [
        { name: 'videoUrl', label: 'Video URL (external)', type: 'url' },
        { name: 'posterUrl', label: 'Poster Image URL', type: 'url' },
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'headlineAccent', label: 'Headline Accent', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
        { name: 'ctaLink', label: 'CTA Button Link', type: 'url' },
        { name: 'autoplay', label: 'Autoplay', type: 'switch' },
        { name: 'loop', label: 'Loop', type: 'switch' },
        { name: 'showControls', label: 'Show Controls', type: 'switch' },
      ],
    },
    {
      key: 'visionMission',
      label: 'Vision & Mission',
      fields: [
        { name: 'sectionBadge', label: 'Section Badge', type: 'text' },
        { name: 'sectionTitle', label: 'Section Title', type: 'text' },
        { name: 'visionBadge', label: 'Vision Badge', type: 'text' },
        { name: 'visionTitle', label: 'Vision Title', type: 'text' },
        { name: 'visionDescription', label: 'Vision Description', type: 'textarea' },
        { name: 'visionIcon', label: 'Vision Icon', type: 'select', options: [
          { value: 'eye', label: 'Eye' },
          { value: 'lightbulb', label: 'Lightbulb' },
          { value: 'star', label: 'Star' },
          { value: 'target', label: 'Target' },
          { value: 'compass', label: 'Compass' },
        ]},
        { name: 'missionBadge', label: 'Mission Badge', type: 'text' },
        { name: 'missionTitle', label: 'Mission Title', type: 'text' },
        { name: 'missionDescription', label: 'Mission Description', type: 'textarea' },
        { name: 'missionIcon', label: 'Mission Icon', type: 'select', options: [
          { value: 'target', label: 'Target' },
          { value: 'rocket', label: 'Rocket' },
          { value: 'heart', label: 'Heart' },
          { value: 'shield', label: 'Shield' },
          { value: 'users', label: 'Users' },
        ]},
        { name: 'footerNote', label: 'Footer Note', type: 'text' },
        { name: 'animateOnScroll', label: 'Animate on Scroll', type: 'switch' },
      ],
    },
    {
      key: 'trustBadges',
      label: 'Trust Badges',
      type: 'array',
      arrayFields: ['icon', 'title', 'description'],
      fields: [
        { name: 'animateOnHover', label: 'Animate on Hover', type: 'switch' },
      ],
    },
    {
      key: 'stickyDownloadBar',
      label: 'Sticky Download Bar (Mobile)',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'buttonText', label: 'Button Text', type: 'text' },
        { name: 'buttonHref', label: 'Button Link', type: 'text' },
      ],
    },
  ],
  header: [
    {
      key: 'askEdith',
      label: 'Ask Edith Link',
      fields: [
        { name: 'label', label: 'Button Label', type: 'text' },
        { name: 'description', label: 'Description', type: 'text' },
      ],
    },
    {
      key: 'solutionsDropdown',
      label: 'Solutions Dropdown',
      type: 'array',
      arrayFields: ['label', 'href', 'description'],
      fields: [],
    },
    {
      key: 'resourcesDropdown',
      label: 'Resources Dropdown',
      type: 'array',
      arrayFields: ['label', 'href', 'description'],
      fields: [],
    },
    {
      key: 'ctaButtons',
      label: 'CTA Button Labels',
      fields: [
        { name: 'signIn', label: 'Sign In Button', type: 'text' },
        { name: 'signUp', label: 'Sign Up Button', type: 'text' },
        { name: 'demo', label: 'Demo Button', type: 'text' },
        { name: 'dashboard', label: 'Dashboard Button', type: 'text' },
      ],
    },
  ],
  footer: [
    {
      key: 'brand',
      label: 'Brand Section',
      fields: [
        { name: 'tagline', label: 'Tagline', type: 'textarea' },
      ],
    },
    {
      key: 'socialLinks',
      label: 'Social Media Links',
      fields: [
        { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
        { name: 'instagram', label: 'Instagram URL', type: 'url' },
        { name: 'tiktok', label: 'TikTok URL', type: 'url' },
      ],
    },
    {
      key: 'solutionsColumn',
      label: 'Solutions Column',
      type: 'array',
      arrayFields: ['label', 'href'],
      fields: [
        { name: 'title', label: 'Column Title', type: 'text' },
      ],
    },
    {
      key: 'productColumn',
      label: 'Product Column',
      type: 'array',
      arrayFields: ['label', 'href', 'external'],
      fields: [
        { name: 'title', label: 'Column Title', type: 'text' },
      ],
    },
    {
      key: 'companyColumn',
      label: 'Company Column',
      type: 'array',
      arrayFields: ['label', 'href'],
      fields: [
        { name: 'title', label: 'Column Title', type: 'text' },
      ],
    },
    {
      key: 'trustColumn',
      label: 'Trust Column',
      type: 'array',
      arrayFields: ['label', 'href'],
      fields: [
        { name: 'title', label: 'Column Title', type: 'text' },
      ],
    },
    {
      key: 'contact',
      label: 'Contact Information',
      fields: [
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'phone', label: 'Phone', type: 'text' },
      ],
    },
    {
      key: 'award',
      label: 'Award Badge',
      fields: [
        { name: 'imageUrl', label: 'Badge Image URL', type: 'url' },
        { name: 'altText', label: 'Badge Alt Text', type: 'text' },
        { name: 'label', label: 'Award Label', type: 'text' },
      ],
    },
    {
      key: 'copyright',
      label: 'Copyright',
      fields: [
        { name: 'text', label: 'Copyright Text (use {year} for dynamic year)', type: 'text' },
      ],
    },
  ],
  about: [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
    {
      key: 'mission',
      label: 'Mission Section',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'content', label: 'Content', type: 'textarea' },
      ],
    },
    {
      key: 'team',
      label: 'Team Section',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
  ],
  plans: [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
    {
      key: 'pricing',
      label: 'Pricing Section',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
  ],
  contact: [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
    {
      key: 'form',
      label: 'Form Section',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
  ],
  faq: [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  'schedule-demo': [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  press: [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  'ask-edith': [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
  ],
  privacy: [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  terms: [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  security: [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  'medication-error-prevention': [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
    {
      key: 'content',
      label: 'Main Content',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
  ],
  'bedside-guidance': [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  'nursing-safety-tools': [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  'iv-infusion-safety': [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  'patient-education': [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
  'hospital-compliance': [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'subheadline', label: 'Subheadline', type: 'text' },
      ],
    },
  ],
};

const MultiPageEditor = () => {
  const { toast } = useToast();
  const { data: allPages, isLoading: loadingPages, refetch: refetchPages } = useAllPages();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('marketing');
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, Record<string, any>>>({});
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [activeSection, setActiveSection] = useState<string | undefined>(undefined);

  // Get pages for current category
  const categoryPages = allPages?.filter(page => 
    pageCategories[selectedCategory as keyof typeof pageCategories]?.slugs.includes(page.slug)
  ) || [];

  // Load page data when selected
  useEffect(() => {
    if (selectedPageSlug) {
      loadPageData(selectedPageSlug);
    }
  }, [selectedPageSlug]);

  const loadPageData = async (slug: string) => {
    setLoading(true);
    try {
      const page = allPages?.find(p => p.slug === slug);
      if (!page) {
        toast({
          title: 'Page not found',
          variant: 'destructive',
        });
        return;
      }

      // Fetch sections
      const { data: sections, error } = await supabase
        .from('marketing_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const pageDataResult: PageData = {
        id: page.id,
        slug: page.slug,
        title: page.title,
        description: page.description,
        status: page.status,
        sections: (sections || []).map(s => ({
          id: s.id,
          section_key: s.section_key,
          content: s.content as Record<string, any>,
          is_visible: s.is_visible,
          display_order: s.display_order,
        })),
      };

      setPageData(pageDataResult);

      // Initialize section content and visibility
      const content: Record<string, Record<string, any>> = {};
      const visibility: Record<string, boolean> = {};
      const definitions = pageSectionDefinitions[slug] || [];

      definitions.forEach(def => {
        const existingSection = pageDataResult.sections.find(s => s.section_key === def.key);
        content[def.key] = existingSection?.content || defaultPageContent[slug]?.[def.key] || {};
        visibility[def.key] = existingSection?.is_visible ?? true;
      });

      setSectionContent(content);
      setSectionVisibility(visibility);
    } catch (error) {
      console.error('Error loading page:', error);
      toast({
        title: 'Error loading page',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (sectionKey: string, fieldName: string, value: string) => {
    setSectionContent(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldName]: value,
      },
    }));
  };

  const handleVisibilityChange = (sectionKey: string, visible: boolean) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionKey]: visible,
    }));
  };

  const handleSave = async () => {
    if (!pageData || !selectedPageSlug) return;

    setSaving(true);
    try {
      const definitions = pageSectionDefinitions[selectedPageSlug] || [];

      for (const def of definitions) {
        const existingSection = pageData.sections.find(s => s.section_key === def.key);
        const content = sectionContent[def.key] || {};
        const isVisible = sectionVisibility[def.key] ?? true;

        if (existingSection?.id) {
          // Update existing section
          const { error } = await supabase
            .from('marketing_sections')
            .update({
              content,
              is_visible: isVisible,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSection.id);

          if (error) throw error;
        } else {
          // Create new section
          const { error } = await supabase
            .from('marketing_sections')
            .insert({
              page_id: pageData.id,
              section_key: def.key,
              content,
              is_visible: isVisible,
              display_order: definitions.indexOf(def),
            });

          if (error) throw error;
        }
      }

      toast({
        title: 'Saved successfully',
        description: `${pageData.title} has been updated.`,
      });

      // Reload page data
      await loadPageData(selectedPageSlug);
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: 'Error saving',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (!selectedPageSlug) return;
    
    const defaults = defaultPageContent[selectedPageSlug] || {};
    const definitions = pageSectionDefinitions[selectedPageSlug] || [];
    
    const content: Record<string, Record<string, any>> = {};
    const visibility: Record<string, boolean> = {};
    
    definitions.forEach(def => {
      content[def.key] = defaults[def.key] || {};
      visibility[def.key] = true;
    });

    setSectionContent(content);
    setSectionVisibility(visibility);

    toast({
      title: 'Reset Complete',
      description: 'Content has been reset to defaults. Click Save to apply.',
    });
  };

  if (loadingPages) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const editorContent = (
    <div className="space-y-6 h-full overflow-auto p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Website Pages</h2>
          <p className="text-sm text-muted-foreground">Manage content across all website pages</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchPages()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {selectedPageSlug && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="gap-2"
              >
                Reset Defaults
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-muted/50">
          {Object.entries(pageCategories).map(([key, cat]) => (
            <TabsTrigger key={key} value={key} className="gap-2">
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(pageCategories).map(catKey => (
          <TabsContent key={catKey} value={catKey} className="mt-4">
            <div className="grid grid-cols-12 gap-6">
              {/* Page List */}
              <div className="col-span-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Pages</CardTitle>
                    <CardDescription>Select a page to edit</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-1 p-4 pt-0">
                        {categoryPages.map(page => (
                          <button
                            key={page.id}
                            onClick={() => setSelectedPageSlug(page.slug)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              selectedPageSlug === page.slug
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <div className="font-medium text-sm">{page.title}</div>
                            <div className={`text-xs ${
                              selectedPageSlug === page.slug
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}>
                              /{page.slug}
                            </div>
                          </button>
                        ))}
                        {categoryPages.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No pages in this category
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Page Editor */}
              <div className="col-span-8">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : selectedPageSlug && pageData ? (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4 pr-4">
                      {/* Page Title */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>{pageData.title}</CardTitle>
                              <CardDescription>/{pageData.slug}</CardDescription>
                            </div>
                            <Badge variant={pageData.status === 'published' ? 'default' : 'secondary'}>
                              {pageData.status}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>

                      {/* Sections */}
                      {(pageSectionDefinitions[selectedPageSlug] || []).map(section => (
                        <Card 
                          key={section.key}
                          className={activeSection === section.key ? 'ring-2 ring-primary' : ''}
                          onMouseEnter={() => setActiveSection(section.key)}
                          onMouseLeave={() => setActiveSection(undefined)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{section.label}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`visible-${section.key}`} className="text-sm text-muted-foreground">
                                  Visible
                                </Label>
                                <Switch
                                  id={`visible-${section.key}`}
                                  checked={sectionVisibility[section.key] ?? true}
                                  onCheckedChange={(checked) => handleVisibilityChange(section.key, checked)}
                                />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Regular fields */}
                            {section.fields.map(field => (
                              <div key={field.name} className="space-y-2">
                                <Label htmlFor={`${section.key}-${field.name}`}>
                                  {field.label}
                                </Label>
                                {field.type === 'textarea' ? (
                                  <Textarea
                                    id={`${section.key}-${field.name}`}
                                    value={sectionContent[section.key]?.[field.name] || ''}
                                    onChange={(e) => handleFieldChange(section.key, field.name, e.target.value)}
                                    rows={3}
                                  />
                                ) : field.type === 'select' && field.options ? (
                                  <Select
                                    value={sectionContent[section.key]?.[field.name] || field.options[0]?.value || ''}
                                    onValueChange={(value) => handleFieldChange(section.key, field.name, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : field.type === 'switch' ? (
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      id={`${section.key}-${field.name}`}
                                      checked={sectionContent[section.key]?.[field.name] ?? true}
                                      onCheckedChange={(checked) => handleFieldChange(section.key, field.name, checked as unknown as string)}
                                    />
                                  </div>
                                ) : (
                                  <Input
                                    id={`${section.key}-${field.name}`}
                                    type={field.type === 'url' ? 'url' : 'text'}
                                    value={sectionContent[section.key]?.[field.name] || ''}
                                    onChange={(e) => handleFieldChange(section.key, field.name, e.target.value)}
                                  />
                                )}
                              </div>
                            ))}
                            
                            {/* Array field editor */}
                            {section.type === 'array' && section.arrayFields && (
                              <div className="space-y-2">
                                <Label>{section.arrayFields.includes('icon') ? 'Badges' : 'Links'}</Label>
                                <ArrayFieldEditor
                                  items={(sectionContent[section.key]?.items || sectionContent[section.key]?.links || sectionContent[section.key]?.badges || []) as ArrayItem[]}
                                  onChange={(items) => {
                                    setSectionContent(prev => ({
                                      ...prev,
                                      [section.key]: {
                                        ...prev[section.key],
                                        items: items,
                                        links: items,
                                        badges: items,
                                      },
                                    }));
                                  }}
                                  fields={section.arrayFields}
                                  itemLabel={section.arrayFields.includes('icon') ? 'Badge' : 'Link'}
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}

                      {(pageSectionDefinitions[selectedPageSlug] || []).length === 0 && (
                        <Card>
                          <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">
                              No editable sections defined for this page yet.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <Card>
                    <CardContent className="py-20 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select a page from the list to edit its content
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  return (
    <div className="h-[calc(100vh-12rem)]">
      {showPreview ? (
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
          <ResizablePanel defaultSize={60} minSize={40}>
            {editorContent}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Live Preview</span>
                </div>
                {selectedPageSlug && (
                  <Badge variant="outline" className="text-xs">
                    /{selectedPageSlug}
                  </Badge>
                )}
              </div>
              <div className="flex-1 overflow-hidden bg-muted/10">
                <MultiPagePreview
                  pageSlug={selectedPageSlug}
                  sectionContent={sectionContent}
                  sectionVisibility={sectionVisibility}
                  activeSection={activeSection}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        editorContent
      )}
    </div>
  );
};

export default MultiPageEditor;
