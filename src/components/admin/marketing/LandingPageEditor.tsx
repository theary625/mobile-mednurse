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
import { Loader2, Save, Eye, RefreshCw, RotateCcw, Sparkles, Target, MessageSquare, HelpCircle, PanelLeftClose, PanelLeft, MapPin, Info, Users } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import LandingPagePreview from './LandingPagePreview';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface SectionContent {
  hero?: {
    headline: string;
    subheadline: string;
    secondaryDescription: string;
    primaryCta: string;
    primaryCtaLink: string;
    secondaryCta: string;
    secondaryCtaLink: string;
    badge: string;
  };
  trust?: {
    badgeText: string;
    headline: string;
    subheadline: string;
    award1Title: string;
    award1Subtitle: string;
    award1Badge: string;
    award2Title: string;
    award2Subtitle: string;
    award2Badge: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
  };
  solutions?: {
    badgeText: string;
    title: string;
    subtitle: string;
    cards: Array<{
      title: string;
      description: string;
      href: string;
      color: 'primary' | 'accent' | 'success';
    }>;
  };
  features?: {
    sectionTitle: string;
    sectionSubtitle: string;
    feature1Title: string;
    feature1Description: string;
    feature2Title: string;
    feature2Description: string;
    feature3Title: string;
    feature3Description: string;
  };
  workflow?: {
    badgeText: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    bottomText: string;
  };
  faq?: {
    badgeText: string;
    title: string;
    subtitle: string;
    viewAllText: string;
    viewAllLink: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  newsletter?: {
    title: string;
    subtitle: string;
    buttonText: string;
    placeholder: string;
    privacyText: string;
    privacyLink: string;
    followText: string;
  };
}

const defaultContent: SectionContent = {
  hero: {
    headline: 'The Medication Safety Platform',
    subheadline: 'Prevent medication errors with real-time drug interaction alerts, IV compatibility checking, and evidence-based clinical tools—all designed for bedside nursing practice.',
    secondaryDescription: 'MedNurse empowers nurses with instant access to dosing calculators, high-alert medication protocols, and patient education resources.',
    primaryCta: 'Download Free',
    primaryCtaLink: '/auth?signup=true',
    secondaryCta: 'Explore Tools',
    secondaryCtaLink: '/nursing-safety-tools',
    badge: 'Trusted by 50,000+ Healthcare Professionals',
  },
  trust: {
    badgeText: 'Healthcare & Pharmaceutical Awards 2025',
    headline: 'Award-winning',
    subheadline: 'MedNurse has been recognized for excellence in nursing technology and patient safety innovation.',
    award1Title: 'Best Emerging Nursing & Medical Administration Solution',
    award1Subtitle: '2025 — USA',
    award1Badge: 'Winner',
    award2Title: 'Excellence Award in Bedside Medical Safety',
    award2Subtitle: '2025 — Patient Safety Innovation',
    award2Badge: 'Excellence',
    stat1Value: '4.9/5',
    stat1Label: 'Rating',
    stat2Value: '50K+',
    stat2Label: 'Active Users',
    stat3Value: '98%',
    stat3Label: 'Would Recommend',
    stat4Value: '1,200+',
    stat4Label: '5-Star Reviews',
  },
  solutions: {
    badgeText: 'Complete Safety Platform',
    title: 'Medication Safety Solutions for',
    subtitle: 'From bedside clinical decision support to hospital-wide compliance programs.',
    cards: [
      { title: 'Medication Error Prevention', description: 'Real-time drug interaction alerts and safety checks.', href: '/medication-error-prevention', color: 'primary' },
      { title: 'Bedside Guidance', description: 'Instant access to evidence-based medication information.', href: '/bedside-guidance', color: 'accent' },
      { title: 'Nursing Safety Tools', description: '40+ clinical calculators including drip rates and dosing.', href: '/nursing-safety-tools', color: 'success' },
      { title: 'IV Infusion Safety', description: 'IV compatibility, drip calculations, and high-alert protocols.', href: '/iv-infusion-safety', color: 'primary' },
      { title: 'Patient Education', description: 'Plain-language resources for patient medication understanding.', href: '/patient-education', color: 'accent' },
      { title: 'Hospital Compliance', description: 'Meet Joint Commission and CMS medication safety requirements.', href: '/hospital-compliance', color: 'success' },
    ],
  },
  features: {
    sectionTitle: 'Everything You Need for Safer Practices',
    sectionSubtitle: 'A comprehensive platform designed by nurses, for nurses.',
    feature1Title: 'Clinical Decision Support',
    feature1Description: 'Real-time drug interaction checks and dosage calculators right at the point of care.',
    feature2Title: 'Location-Based Safety',
    feature2Description: 'Smart reminders based on your clinical setting—5 Rights checks, allergy alerts, and pain reassessment prompts.',
    feature3Title: 'Smart Insights',
    feature3Description: 'Personalized learning recommendations based on your specialty and experience.',
  },
  workflow: {
    badgeText: 'How It Works',
    title: 'From Lookup to',
    subtitle: 'See how MedNurse guides nurses through every medication administration.',
    ctaText: 'Start Membership',
    ctaLink: '/auth',
    secondaryCtaText: 'Explore Features',
    secondaryCtaLink: '/nursing-safety-tools',
    bottomText: 'Takes less than 30 seconds to look up any medication',
  },
  faq: {
    badgeText: 'FAQ',
    title: 'Common',
    subtitle: 'Quick answers to frequently asked questions about MedNurse.',
    viewAllText: 'View all FAQs',
    viewAllLink: '/faq',
    items: [
      { question: 'What is MedNurse and who is it for?', answer: 'MedNurse is a medication safety platform for nurses and healthcare professionals.' },
      { question: 'How much does MedNurse cost?', answer: 'MedNurse Membership is $12.99/month or $129/year.' },
      { question: 'Can I earn CE credits through MedNurse?', answer: 'Absolutely. MedNurse offers accredited continuing education courses.' },
      { question: 'Is MedNurse available on mobile?', answer: 'Yes, available on iOS and Android with offline mode.' },
    ],
  },
  newsletter: {
    title: 'Join 50,000+ Healthcare Professionals',
    subtitle: 'Get weekly insights, CE opportunities, and medication safety updates.',
    buttonText: 'Subscribe',
    placeholder: 'Enter your email address',
    privacyText: 'We respect your privacy.',
    privacyLink: '/privacy',
    followText: 'Follow us:',
  },
};

const LandingPageEditor = () => {
  const [content, setContent] = useState<SectionContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showPreview, setShowPreview] = useState(true);
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
    hero: true,
    trust: true,
    solutions: true,
    features: true,
    workflow: true,
    faq: true,
    newsletter: true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      const { data: page, error: pageError } = await supabase
        .from('marketing_pages')
        .select('*')
        .eq('slug', 'landing')
        .single();

      if (pageError && pageError.code !== 'PGRST116') {
        throw pageError;
      }

      if (page) {
        const { data: sections, error: sectionsError } = await supabase
          .from('marketing_sections')
          .select('*')
          .eq('page_id', page.id);

        if (sectionsError) throw sectionsError;

        const parsedContent: SectionContent = { ...defaultContent };
        const visibility: Record<string, boolean> = { ...sectionVisibility };
        
        sections?.forEach((section) => {
          const key = section.section_key as keyof SectionContent;
          if (key && section.content) {
            parsedContent[key] = section.content as any;
            visibility[key] = section.is_visible;
          }
        });

        setContent(parsedContent);
        setSectionVisibility(visibility);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load landing page content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      setSaving(true);

      let pageId: string;
      const { data: existingPage } = await supabase
        .from('marketing_pages')
        .select('id')
        .eq('slug', 'landing')
        .single();

      if (existingPage) {
        pageId = existingPage.id;
      } else {
        const { data: newPage, error: createError } = await supabase
          .from('marketing_pages')
          .insert({
            slug: 'landing',
            title: 'Landing Page',
            description: 'Main marketing landing page',
            status: 'published',
          })
          .select()
          .single();

        if (createError) throw createError;
        pageId = newPage.id;
      }

      const sectionKeys = Object.keys(content) as (keyof SectionContent)[];
      
      for (const key of sectionKeys) {
        const sectionContent = content[key];
        if (!sectionContent) continue;

        const { data: existingSection } = await supabase
          .from('marketing_sections')
          .select('id')
          .eq('page_id', pageId)
          .eq('section_key', key)
          .single();

        if (existingSection) {
          await supabase
            .from('marketing_sections')
            .update({
              content: sectionContent,
              is_visible: sectionVisibility[key] ?? true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSection.id);
        } else {
          await supabase
            .from('marketing_sections')
            .insert({
              page_id: pageId,
              section_key: key,
              content: sectionContent,
              is_visible: sectionVisibility[key] ?? true,
              display_order: sectionKeys.indexOf(key),
            });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['landing-content'] });
      
      toast({
        title: 'Saved',
        description: 'Landing page content updated successfully',
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (section: keyof SectionContent, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateSolutionCard = (index: number, field: string, value: string) => {
    setContent((prev) => {
      const cards = [...(prev.solutions?.cards || [])];
      cards[index] = { ...cards[index], [field]: value };
      return {
        ...prev,
        solutions: { ...prev.solutions!, cards },
      };
    });
  };

  const updateFAQItem = (index: number, field: string, value: string) => {
    setContent((prev) => {
      const items = [...(prev.faq?.items || [])];
      items[index] = { ...items[index], [field]: value };
      return {
        ...prev,
        faq: { ...prev.faq!, items },
      };
    });
  };

  const toggleVisibility = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetToDefaults = () => {
    setContent(defaultContent);
    setSectionVisibility({
      hero: true,
      trust: true,
      solutions: true,
      features: true,
      workflow: true,
      faq: true,
      newsletter: true,
    });
    toast({
      title: 'Reset Complete',
      description: 'Content has been reset to defaults. Click Save to apply.',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const editorContent = (
    <div className="space-y-6 h-full overflow-auto p-1">
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="bg-muted p-1 h-auto flex flex-wrap gap-1 w-full">
          <TabsTrigger value="hero" className="gap-2 data-[state=active]:bg-background">
            <Sparkles className="h-4 w-4" />
            Medication Safety Platform
          </TabsTrigger>
          <TabsTrigger value="trust" className="gap-2 data-[state=active]:bg-background">
            <Target className="h-4 w-4" />
            Award-Winning
          </TabsTrigger>
          <TabsTrigger value="solutions" className="gap-2 data-[state=active]:bg-background">
            <Target className="h-4 w-4" />
            Safety Solutions
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2 data-[state=active]:bg-background">
            <MapPin className="h-4 w-4" />
            Safer Practices
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2 data-[state=active]:bg-background">
            <Target className="h-4 w-4" />
            Safe Administration
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-2 data-[state=active]:bg-background">
            <Users className="h-4 w-4" />
            Testimonials
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2 data-[state=active]:bg-background">
            <HelpCircle className="h-4 w-4" />
            Common Questions
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="gap-2 data-[state=active]:bg-background">
            <MessageSquare className="h-4 w-4" />
            Stay Updated
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Editor */}
        <TabsContent value="hero" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>The Medication Safety Platform</CardTitle>
                <CardDescription>Hero section with main headline and call-to-action buttons</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="hero-visible" className="text-sm text-muted-foreground">Visible</Label>
                <Switch
                  id="hero-visible"
                  checked={sectionVisibility.hero}
                  onCheckedChange={() => toggleVisibility('hero')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input
                  value={content.hero?.badge || ''}
                  onChange={(e) => updateContent('hero', 'badge', e.target.value)}
                  placeholder="Trusted by 50,000+ Healthcare Professionals"
                />
              </div>
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input
                  value={content.hero?.headline || ''}
                  onChange={(e) => updateContent('hero', 'headline', e.target.value)}
                  placeholder="The Medication Safety Platform"
                />
              </div>
              <div className="space-y-2">
                <Label>Subheadline</Label>
                <Textarea
                  value={content.hero?.subheadline || ''}
                  onChange={(e) => updateContent('hero', 'subheadline', e.target.value)}
                  placeholder="Prevent medication errors..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Description</Label>
                <Textarea
                  value={content.hero?.secondaryDescription || ''}
                  onChange={(e) => updateContent('hero', 'secondaryDescription', e.target.value)}
                  placeholder="MedNurse empowers nurses..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary CTA Text</Label>
                  <Input
                    value={content.hero?.primaryCta || ''}
                    onChange={(e) => updateContent('hero', 'primaryCta', e.target.value)}
                    placeholder="Download Free"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary CTA Link</Label>
                  <Input
                    value={content.hero?.primaryCtaLink || ''}
                    onChange={(e) => updateContent('hero', 'primaryCtaLink', e.target.value)}
                    placeholder="/auth"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Secondary CTA Text</Label>
                  <Input
                    value={content.hero?.secondaryCta || ''}
                    onChange={(e) => updateContent('hero', 'secondaryCta', e.target.value)}
                    placeholder="Explore Tools"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA Link</Label>
                  <Input
                    value={content.hero?.secondaryCtaLink || ''}
                    onChange={(e) => updateContent('hero', 'secondaryCtaLink', e.target.value)}
                    placeholder="/nursing-safety-tools"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Section Editor */}
        <TabsContent value="trust" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Award-Winning Innovation</CardTitle>
                <CardDescription>Award badges and social proof statistics</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="trust-visible" className="text-sm text-muted-foreground">Visible</Label>
                <Switch
                  id="trust-visible"
                  checked={sectionVisibility.trust}
                  onCheckedChange={() => toggleVisibility('trust')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content.trust?.badgeText || ''}
                    onChange={(e) => updateContent('trust', 'badgeText', e.target.value)}
                    placeholder="Healthcare & Pharmaceutical Awards 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input
                    value={content.trust?.headline || ''}
                    onChange={(e) => updateContent('trust', 'headline', e.target.value)}
                    placeholder="Award-winning"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subheadline</Label>
                <Textarea
                  value={content.trust?.subheadline || ''}
                  onChange={(e) => updateContent('trust', 'subheadline', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Award 1</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={content.trust?.award1Title || ''}
                      onChange={(e) => updateContent('trust', 'award1Title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={content.trust?.award1Subtitle || ''}
                      onChange={(e) => updateContent('trust', 'award1Subtitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input
                      value={content.trust?.award1Badge || ''}
                      onChange={(e) => updateContent('trust', 'award1Badge', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Award 2</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={content.trust?.award2Title || ''}
                      onChange={(e) => updateContent('trust', 'award2Title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={content.trust?.award2Subtitle || ''}
                      onChange={(e) => updateContent('trust', 'award2Subtitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input
                      value={content.trust?.award2Badge || ''}
                      onChange={(e) => updateContent('trust', 'award2Badge', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Statistics</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="space-y-2">
                      <Label>Stat {num}</Label>
                      <Input
                        value={(content.trust as any)?.[`stat${num}Value`] || ''}
                        onChange={(e) => updateContent('trust', `stat${num}Value`, e.target.value)}
                        placeholder="Value"
                        className="mb-1"
                      />
                      <Input
                        value={(content.trust as any)?.[`stat${num}Label`] || ''}
                        onChange={(e) => updateContent('trust', `stat${num}Label`, e.target.value)}
                        placeholder="Label"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solutions Section Editor - Now with 6 cards */}
        <TabsContent value="solutions" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Medication Safety Solutions</CardTitle>
                <CardDescription>6 feature cards linking to SEO pages</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="solutions-visible" className="text-sm text-muted-foreground">Visible</Label>
                <Switch
                  id="solutions-visible"
                  checked={sectionVisibility.solutions}
                  onCheckedChange={() => toggleVisibility('solutions')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content.solutions?.badgeText || ''}
                    onChange={(e) => updateContent('solutions', 'badgeText', e.target.value)}
                    placeholder="Complete Safety Platform"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={content.solutions?.title || ''}
                    onChange={(e) => updateContent('solutions', 'title', e.target.value)}
                    placeholder="Medication Safety Solutions for"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Section Subtitle</Label>
                <Textarea
                  value={content.solutions?.subtitle || ''}
                  onChange={(e) => updateContent('solutions', 'subtitle', e.target.value)}
                  rows={2}
                />
              </div>
              
              {content.solutions?.cards?.map((card, index) => (
                <div key={index} className="border-t pt-4">
                  <h4 className="font-medium mb-3">Card {index + 1}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={card.title || ''}
                        onChange={(e) => updateSolutionCard(index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link</Label>
                      <Input
                        value={card.href || ''}
                        onChange={(e) => updateSolutionCard(index, 'href', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <select
                        value={card.color || 'primary'}
                        onChange={(e) => updateSolutionCard(index, 'color', e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="primary">Primary</option>
                        <option value="accent">Accent</option>
                        <option value="success">Success</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Label>Description</Label>
                    <Input
                      value={card.description || ''}
                      onChange={(e) => updateSolutionCard(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section Editor */}
        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Everything You Need for Safer Practices</CardTitle>
                <CardDescription>Platform features with location-based safety</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="features-visible" className="text-sm text-muted-foreground">Visible</Label>
                <Switch
                  id="features-visible"
                  checked={sectionVisibility.features}
                  onCheckedChange={() => toggleVisibility('features')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={content.features?.sectionTitle || ''}
                    onChange={(e) => updateContent('features', 'sectionTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Input
                    value={content.features?.sectionSubtitle || ''}
                    onChange={(e) => updateContent('features', 'sectionSubtitle', e.target.value)}
                  />
                </div>
              </div>
              
              {[1, 2, 3].map((num) => (
                <div key={num} className="border-t pt-4">
                  <h4 className="font-medium mb-3">Feature {num}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={(content.features as any)?.[`feature${num}Title`] || ''}
                        onChange={(e) => updateContent('features', `feature${num}Title`, e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={(content.features as any)?.[`feature${num}Description`] || ''}
                        onChange={(e) => updateContent('features', `feature${num}Description`, e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Section Editor */}
        <TabsContent value="workflow" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>From Lookup to Safe Administration</CardTitle>
                <CardDescription>How it works diagram and CTAs</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="workflow-visible" className="text-sm text-muted-foreground">Visible</Label>
                <Switch
                  id="workflow-visible"
                  checked={sectionVisibility.workflow}
                  onCheckedChange={() => toggleVisibility('workflow')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content.workflow?.badgeText || ''}
                    onChange={(e) => updateContent('workflow', 'badgeText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.workflow?.title || ''}
                    onChange={(e) => updateContent('workflow', 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                  value={content.workflow?.subtitle || ''}
                  onChange={(e) => updateContent('workflow', 'subtitle', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Bottom Text</Label>
                <Input
                  value={content.workflow?.bottomText || ''}
                  onChange={(e) => updateContent('workflow', 'bottomText', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary CTA Text</Label>
                  <Input
                    value={content.workflow?.ctaText || ''}
                    onChange={(e) => updateContent('workflow', 'ctaText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary CTA Link</Label>
                  <Input
                    value={content.workflow?.ctaLink || ''}
                    onChange={(e) => updateContent('workflow', 'ctaLink', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Secondary CTA Text</Label>
                  <Input
                    value={content.workflow?.secondaryCtaText || ''}
                    onChange={(e) => updateContent('workflow', 'secondaryCtaText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA Link</Label>
                  <Input
                    value={content.workflow?.secondaryCtaLink || ''}
                    onChange={(e) => updateContent('workflow', 'secondaryCtaLink', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab - Info Only */}
        <TabsContent value="testimonials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials Section</CardTitle>
              <CardDescription>Customer quotes and reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Testimonials are managed separately in the <strong>Testimonials</strong> tab in the admin sidebar. 
                  This allows for individual testimonial management with images, ratings, and feature page assignments.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Section Editor - Now with items */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Common Questions</CardTitle>
                <CardDescription>Frequently asked questions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="faq-visible" className="text-sm text-muted-foreground">Visible</Label>
                <Switch
                  id="faq-visible"
                  checked={sectionVisibility.faq}
                  onCheckedChange={() => toggleVisibility('faq')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content.faq?.badgeText || ''}
                    onChange={(e) => updateContent('faq', 'badgeText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.faq?.title || ''}
                    onChange={(e) => updateContent('faq', 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content.faq?.subtitle || ''}
                  onChange={(e) => updateContent('faq', 'subtitle', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>View All Text</Label>
                  <Input
                    value={content.faq?.viewAllText || ''}
                    onChange={(e) => updateContent('faq', 'viewAllText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>View All Link</Label>
                  <Input
                    value={content.faq?.viewAllLink || ''}
                    onChange={(e) => updateContent('faq', 'viewAllLink', e.target.value)}
                  />
                </div>
              </div>

              {content.faq?.items?.map((item, index) => (
                <div key={index} className="border-t pt-4">
                  <h4 className="font-medium mb-3">FAQ Item {index + 1}</h4>
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={item.question || ''}
                      onChange={(e) => updateFAQItem(index, 'question', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 mt-2">
                    <Label>Answer</Label>
                    <Textarea
                      value={item.answer || ''}
                      onChange={(e) => updateFAQItem(index, 'answer', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Newsletter Section Editor */}
        <TabsContent value="newsletter" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stay Updated with MedNurse</CardTitle>
                <CardDescription>Email signup call-to-action</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="newsletter-visible" className="text-sm text-muted-foreground">Visible</Label>
                <Switch
                  id="newsletter-visible"
                  checked={sectionVisibility.newsletter}
                  onCheckedChange={() => toggleVisibility('newsletter')}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.newsletter?.title || ''}
                  onChange={(e) => updateContent('newsletter', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content.newsletter?.subtitle || ''}
                  onChange={(e) => updateContent('newsletter', 'subtitle', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={content.newsletter?.buttonText || ''}
                    onChange={(e) => updateContent('newsletter', 'buttonText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Input Placeholder</Label>
                  <Input
                    value={content.newsletter?.placeholder || ''}
                    onChange={(e) => updateContent('newsletter', 'placeholder', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Privacy Text</Label>
                  <Input
                    value={content.newsletter?.privacyText || ''}
                    onChange={(e) => updateContent('newsletter', 'privacyText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Privacy Link</Label>
                  <Input
                    value={content.newsletter?.privacyLink || ''}
                    onChange={(e) => updateContent('newsletter', 'privacyLink', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Follow Text</Label>
                  <Input
                    value={content.newsletter?.followText || ''}
                    onChange={(e) => updateContent('newsletter', 'followText', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            Edit your landing page content without touching code
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Hide Preview
              </>
            ) : (
              <>
                <PanelLeft className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchContent}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Defaults
        </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/', '_blank')}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Full Preview
          </Button>
          <Button
            onClick={saveContent}
            disabled={saving}
            size="sm"
            className="gap-2 bg-foreground hover:bg-foreground/90 text-background"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden bg-background" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
        {showPreview ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={55} minSize={35}>
              <div className="h-full overflow-auto p-4">
                {editorContent}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={45} minSize={25}>
              <div className="h-full flex flex-col bg-muted/30">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Live Preview</span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <LandingPagePreview content={content} sectionVisibility={sectionVisibility} />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full overflow-auto p-4">
            {editorContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageEditor;
