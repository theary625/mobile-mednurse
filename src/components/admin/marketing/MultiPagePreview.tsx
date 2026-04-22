import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { defaultPageContent } from '@/hooks/usePageContent';
import { Mail, Phone, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Award, ChevronRight, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MultiPagePreviewProps {
  pageSlug: string | null;
  sectionContent: Record<string, Record<string, any>>;
  sectionVisibility: Record<string, boolean>;
  activeSection?: string;
}

const MultiPagePreview = ({ pageSlug, sectionContent, sectionVisibility, activeSection }: MultiPagePreviewProps) => {
  if (!pageSlug) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Select a page to preview</p>
      </div>
    );
  }

  const getContent = (sectionKey: string, fieldName: string) => {
    return sectionContent[sectionKey]?.[fieldName] || 
           defaultPageContent[pageSlug]?.[sectionKey]?.[fieldName] || '';
  };

  const getArrayContent = (sectionKey: string) => {
    return sectionContent[sectionKey]?.items || 
           sectionContent[sectionKey]?.links ||
           defaultPageContent[pageSlug]?.[sectionKey]?.items ||
           defaultPageContent[pageSlug]?.[sectionKey]?.links || [];
  };

  // Header Preview
  if (pageSlug === 'header') {
    return (
      <ScrollArea className="h-full">
        <div className="bg-background min-h-full">
          <section className={cn(
            "py-3 px-4 border-b transition-all duration-200",
            activeSection === 'askEdith' && "ring-2 ring-primary ring-inset"
          )}>
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-6 bg-primary/20 rounded flex items-center justify-center text-[10px] text-primary font-semibold">
                  LOGO
                </div>
                <nav className="hidden md:flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground cursor-pointer hover:text-foreground">
                    Solutions ▾
                  </span>
                  <span className="text-muted-foreground cursor-pointer hover:text-foreground">
                    Resources ▾
                  </span>
                  <span className="text-primary cursor-pointer font-medium">
                    {getContent('askEdith', 'label') || 'Ask Edith AI'}
                  </span>
                </nav>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs hidden sm:flex">
                  {getContent('ctaButtons', 'signIn') || 'Sign In'}
                </Button>
                <Button size="sm" className="h-7 text-xs hidden sm:flex">
                  {getContent('ctaButtons', 'signUp') || 'Sign Up'}
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs hidden sm:flex">
                  {getContent('ctaButtons', 'demo') || 'Request Demo'}
                </Button>
                <Menu className="h-4 w-4 sm:hidden text-muted-foreground" />
              </div>
            </div>
          </section>

          {/* Solutions Dropdown Preview */}
          <section className={cn(
            "py-4 px-4 bg-muted/30 transition-all duration-200",
            activeSection === 'solutionsDropdown' && "ring-2 ring-primary ring-inset"
          )}>
            <div className="max-w-lg mx-auto">
              <h3 className="text-xs font-semibold text-foreground mb-3">Solutions Dropdown Items:</h3>
              <div className="grid grid-cols-2 gap-2">
                {(getArrayContent('solutionsDropdown') as any[]).slice(0, 6).map((item, i) => (
                  <div key={i} className="p-2 bg-background rounded border text-left">
                    <p className="text-xs font-medium text-foreground">{item?.label || `Item ${i + 1}`}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{item?.description || 'Description'}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Resources Dropdown Preview */}
          <section className={cn(
            "py-4 px-4 transition-all duration-200",
            activeSection === 'resourcesDropdown' && "ring-2 ring-primary ring-inset"
          )}>
            <div className="max-w-lg mx-auto">
              <h3 className="text-xs font-semibold text-foreground mb-3">Resources Dropdown Items:</h3>
              <div className="grid grid-cols-2 gap-2">
                {(getArrayContent('resourcesDropdown') as any[]).slice(0, 6).map((item, i) => (
                  <div key={i} className="p-2 bg-muted/50 rounded border text-left">
                    <p className="text-xs font-medium text-foreground">{item?.label || `Item ${i + 1}`}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{item?.description || 'Description'}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    );
  }

  // Footer Preview
  if (pageSlug === 'footer') {
    return (
      <ScrollArea className="h-full">
        <div className="bg-foreground text-foreground-foreground min-h-full p-4">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Brand Section */}
            <section className={cn(
              "p-3 rounded transition-all duration-200",
              activeSection === 'brand' && "ring-2 ring-primary"
            )}>
              <div className="w-20 h-5 bg-primary/30 rounded mb-2 flex items-center justify-center text-[8px] text-primary-foreground">
                LOGO
              </div>
              <p className="text-[10px] text-muted-foreground max-w-[200px]">
                {getContent('brand', 'tagline') || 'Your brand tagline here'}
              </p>
            </section>

            {/* Social Links */}
            <section className={cn(
              "p-3 rounded transition-all duration-200",
              activeSection === 'socialLinks' && "ring-2 ring-primary"
            )}>
              <h4 className="text-[10px] font-semibold text-background mb-2">Social Links</h4>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded bg-muted/20 flex items-center justify-center">
                  <Facebook className="w-3 h-3 text-background" />
                </div>
                <div className="w-6 h-6 rounded bg-muted/20 flex items-center justify-center">
                  <Twitter className="w-3 h-3 text-background" />
                </div>
                <div className="w-6 h-6 rounded bg-muted/20 flex items-center justify-center">
                  <Linkedin className="w-3 h-3 text-background" />
                </div>
                <div className="w-6 h-6 rounded bg-muted/20 flex items-center justify-center">
                  <Instagram className="w-3 h-3 text-background" />
                </div>
              </div>
            </section>

            {/* Footer Columns */}
            <div className="grid grid-cols-4 gap-3">
              {['solutionsColumn', 'productColumn', 'companyColumn', 'trustColumn'].map((colKey) => (
                <section key={colKey} className={cn(
                  "p-2 rounded transition-all duration-200",
                  activeSection === colKey && "ring-2 ring-primary"
                )}>
                  <h4 className="text-[10px] font-semibold text-background mb-2">
                    {getContent(colKey, 'title') || colKey.replace('Column', '')}
                  </h4>
                  <ul className="space-y-1">
                    {(getArrayContent(colKey) as any[]).slice(0, 4).map((link, i) => (
                      <li key={i} className="text-[9px] text-muted-foreground hover:text-background cursor-pointer flex items-center gap-1">
                        {link?.label || `Link ${i + 1}`}
                        {link?.external && <ExternalLink className="w-2 h-2" />}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {/* Contact Info */}
            <section className={cn(
              "p-3 rounded transition-all duration-200",
              activeSection === 'contact' && "ring-2 ring-primary"
            )}>
              <h4 className="text-[10px] font-semibold text-background mb-2">Contact</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Mail className="w-2.5 h-2.5" />
                  {getContent('contact', 'email') || 'hello@example.com'}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Phone className="w-2.5 h-2.5" />
                  {getContent('contact', 'phone') || '1-800-EXAMPLE'}
                </div>
              </div>
            </section>

            {/* Award Badge */}
            <section className={cn(
              "p-3 rounded transition-all duration-200",
              activeSection === 'award' && "ring-2 ring-primary"
            )}>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span className="text-[9px] text-muted-foreground">
                  {getContent('award', 'label') || 'Award Winner 2025'}
                </span>
              </div>
            </section>

            {/* Copyright */}
            <section className={cn(
              "p-3 rounded border-t border-muted/20 transition-all duration-200",
              activeSection === 'copyright' && "ring-2 ring-primary"
            )}>
              <p className="text-[9px] text-muted-foreground text-center">
                {(getContent('copyright', 'text') || '© {year} MedNurse. All rights reserved.').replace('{year}', new Date().getFullYear().toString())}
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Landing Page Preview
  if (pageSlug === 'landing') {
    return (
      <ScrollArea className="h-full">
        <div className="bg-background min-h-full">
          {/* Announcement Bar Preview */}
          {(sectionVisibility['announcement'] !== false) && (
            <section className={cn(
              "py-2 px-4 bg-accent text-accent-foreground transition-all duration-200",
              activeSection === 'announcement' && "ring-2 ring-primary ring-inset"
            )}>
              <div className="flex items-center justify-center gap-2 text-xs">
                <Award className="w-3 h-3" />
                <span>{getContent('announcement', 'message') || 'Announcement message'}</span>
                {getContent('announcement', 'linkText') && (
                  <span className="underline font-bold">{getContent('announcement', 'linkText')}</span>
                )}
              </div>
            </section>
          )}

          {/* Video Section Preview */}
          {(sectionVisibility['video'] !== false) && (
            <section className={cn(
              "py-6 px-4 bg-muted/30 transition-all duration-200",
              activeSection === 'video' && "ring-2 ring-primary ring-inset"
            )}>
              <div className="max-w-lg mx-auto grid grid-cols-2 gap-4 items-center">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-1">
                      ▶
                    </div>
                    <span className="text-[8px] text-muted-foreground">Video Preview</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-primary">{getContent('video', 'headline') || 'See MedNurse'}</h3>
                  <p className="text-xs text-accent">{getContent('video', 'headlineAccent') || 'in action'}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{getContent('video', 'description') || 'Description'}</p>
                  <div className="mt-2">
                    <span className="text-[9px] bg-accent text-accent-foreground px-2 py-1 rounded">
                      {getContent('video', 'ctaText') || 'Start Membership'}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Vision & Mission Preview */}
          {(sectionVisibility['visionMission'] !== false) && (
            <section className={cn(
              "py-6 px-4 bg-card transition-all duration-200",
              activeSection === 'visionMission' && "ring-2 ring-primary ring-inset"
            )}>
              <div className="max-w-lg mx-auto">
                <div className="text-center mb-4">
                  <span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {getContent('visionMission', 'sectionBadge') || 'Our Purpose'}
                  </span>
                  <h3 className="text-sm font-semibold text-primary mt-2">
                    {getContent('visionMission', 'sectionTitle') || 'Driven by Purpose'}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                    <div className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                      {getContent('visionMission', 'visionBadge') || 'Our Vision'}
                    </div>
                    <p className="text-[10px] font-medium">{getContent('visionMission', 'visionTitle') || 'Vision Title'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent text-accent-foreground">
                    <div className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                      {getContent('visionMission', 'missionBadge') || 'Our Mission'}
                    </div>
                    <p className="text-[10px] font-medium">{getContent('visionMission', 'missionTitle') || 'Mission Title'}</p>
                  </div>
                </div>
                <p className="text-center text-[10px] text-primary font-medium mt-3">
                  {getContent('visionMission', 'footerNote') || 'Footer note'}
                </p>
              </div>
            </section>
          )}

          {/* Trust Badges Preview */}
          {(sectionVisibility['trustBadges'] !== false) && (
            <section className={cn(
              "py-4 px-4 transition-all duration-200",
              activeSection === 'trustBadges' && "ring-2 ring-primary ring-inset"
            )}>
              <div className="max-w-lg mx-auto">
                <div className="flex flex-wrap justify-center gap-3">
                  {((sectionContent['trustBadges']?.badges || sectionContent['trustBadges']?.items || defaultPageContent.landing?.trustBadges?.badges || []) as any[]).slice(0, 4).map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded">
                      <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center text-[8px]">✓</div>
                      <div>
                        <p className="text-[9px] font-medium">{badge?.title || `Badge ${i + 1}`}</p>
                        <p className="text-[8px] text-muted-foreground">{badge?.description || 'Description'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    );
  }

  // Generic Page Preview (About, Plans, Contact, etc.)
  const sections = Object.keys(sectionContent).length > 0 
    ? Object.keys(sectionContent) 
    : Object.keys(defaultPageContent[pageSlug] || {});

  return (
    <ScrollArea className="h-full">
      <div className="bg-background min-h-full">
        {/* Page Header */}
        <div className="py-3 px-4 border-b bg-muted/30">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="w-20 h-5 bg-primary/20 rounded" />
            <div className="flex gap-2">
              <div className="w-12 h-5 bg-muted rounded" />
              <div className="w-12 h-5 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        {(sectionVisibility['hero'] !== false) && (
          <section className={cn(
            "py-8 px-4 transition-all duration-200",
            activeSection === 'hero' && "ring-2 ring-primary ring-inset"
          )}>
            <div className="max-w-lg mx-auto text-center">
              <h1 className="text-xl font-bold text-foreground mb-2">
                {getContent('hero', 'headline') || 'Page Headline'}
              </h1>
              <p className="text-sm text-muted-foreground mb-3">
                {getContent('hero', 'subheadline') || 'Page subheadline goes here'}
              </p>
              {getContent('hero', 'description') && (
                <p className="text-xs text-muted-foreground">
                  {getContent('hero', 'description')}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Additional Sections */}
        {sections.filter(s => s !== 'hero').map((sectionKey) => {
          if (sectionVisibility[sectionKey] === false) return null;
          
          return (
            <section 
              key={sectionKey}
              className={cn(
                "py-6 px-4 border-t transition-all duration-200",
                activeSection === sectionKey && "ring-2 ring-primary ring-inset"
              )}
            >
              <div className="max-w-lg mx-auto">
                <h2 className="text-sm font-semibold text-foreground mb-2 capitalize">
                  {getContent(sectionKey, 'title') || sectionKey.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                {getContent(sectionKey, 'description') && (
                  <p className="text-xs text-muted-foreground mb-3">
                    {getContent(sectionKey, 'description')}
                  </p>
                )}
                {getContent(sectionKey, 'content') && (
                  <p className="text-xs text-muted-foreground">
                    {getContent(sectionKey, 'content')}
                  </p>
                )}
              </div>
            </section>
          );
        })}

        {/* Footer placeholder */}
        <div className="py-4 px-4 bg-foreground/5 text-center mt-8">
          <p className="text-xs text-muted-foreground">Footer content...</p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default MultiPagePreview;
