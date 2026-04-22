import { Shield, Star, Users, Download, ArrowRight, CheckCircle, Mail, Trophy, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SectionContent } from './LandingPageEditor';

interface LandingPagePreviewProps {
  content: SectionContent;
  sectionVisibility: Record<string, boolean>;
  activeSection?: string;
}

const LandingPagePreview = ({ content, sectionVisibility, activeSection }: LandingPagePreviewProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="bg-background min-h-full">
        {/* Hero Section Preview */}
        {sectionVisibility.hero && (
          <section 
            className={cn(
              "py-8 px-4 transition-all duration-200",
              activeSection === 'hero' && "ring-2 ring-primary ring-inset"
            )}
          >
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium mb-4">
                <Shield className="w-3 h-3" />
                <span>{content.hero?.badge || 'Trusted by Healthcare Pros'}</span>
              </div>
              
              <h1 className="text-xl font-semibold text-foreground leading-tight mb-3">
                {content.hero?.headline || 'Your Headline Here'}{' '}
                <span className="text-primary">for Nurses</span>
              </h1>
              
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {content.hero?.subheadline || 'Your subheadline goes here'}
              </p>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {content.hero?.secondaryDescription || 'Secondary description'}
              </p>
              
              <div className="flex flex-col gap-2 justify-center">
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  {content.hero?.primaryCta || 'Primary CTA'}
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  {content.hero?.secondaryCta || 'Secondary CTA'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center text-xs mt-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-warning fill-current" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">4.9</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">50K+ Users</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trust Section Preview */}
        {sectionVisibility.trust && (
          <section 
            className={cn(
              "py-6 px-4 bg-muted/30 transition-all duration-200",
              activeSection === 'trust' && "ring-2 ring-primary ring-inset"
            )}
          >
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full text-xs font-medium mb-3">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span className="text-primary">{content.trust?.badgeText || 'Awards 2025'}</span>
              </div>
              
              <h2 className="text-lg font-bold mb-2">
                <span className="text-primary">{content.trust?.headline || 'Award-winning'}</span>
                <span className="text-foreground"> innovation.</span>
              </h2>
              
              <p className="text-xs text-muted-foreground mb-4">
                {content.trust?.subheadline || 'Recognized for excellence'}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2 bg-background rounded-lg border text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Trophy className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-600 uppercase">{content.trust?.award1Badge || 'Winner'}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{content.trust?.award1Title || 'Award 1'}</p>
                  <p className="text-[10px] text-muted-foreground">{content.trust?.award1Subtitle || '2025'}</p>
                </div>
                <div className="p-2 bg-background rounded-lg border text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Award className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase">{content.trust?.award2Badge || 'Excellence'}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{content.trust?.award2Title || 'Award 2'}</p>
                  <p className="text-[10px] text-muted-foreground">{content.trust?.award2Subtitle || '2025'}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-foreground">{content.trust?.stat1Value || '4.9/5'}</div>
                  <div className="text-[10px] text-muted-foreground">{content.trust?.stat1Label || 'Rating'}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{content.trust?.stat2Value || '50K+'}</div>
                  <div className="text-[10px] text-muted-foreground">{content.trust?.stat2Label || 'Users'}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{content.trust?.stat3Value || '98%'}</div>
                  <div className="text-[10px] text-muted-foreground">{content.trust?.stat3Label || 'Recommend'}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{content.trust?.stat4Value || '1,200+'}</div>
                  <div className="text-[10px] text-muted-foreground">{content.trust?.stat4Label || 'Reviews'}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Solutions Section Preview */}
        {sectionVisibility.solutions && (
          <section 
            className={cn(
              "py-8 px-4 transition-all duration-200",
              activeSection === 'solutions' && "ring-2 ring-primary ring-inset"
            )}
          >
            <div className="max-w-md mx-auto text-center">
              <div className="inline-block px-2.5 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-semibold uppercase mb-3">
                {content.solutions?.badgeText || 'Complete Platform'}
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {content.solutions?.title || 'Solutions Title'} <span className="text-primary">Every Need</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {content.solutions?.subtitle || 'Solutions subtitle'}
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {(content.solutions?.cards || []).slice(0, 6).map((card, i) => (
                  <div key={i} className="p-2 bg-muted/50 rounded-lg text-left">
                    <h3 className="text-xs font-medium text-foreground mb-0.5">
                      {card.title || `Card ${i + 1}`}
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {card.description || `Description ${i + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section Preview */}
        {sectionVisibility.features && (
          <section 
            className={cn(
              "py-8 px-4 bg-muted/30 transition-all duration-200",
              activeSection === 'features' && "ring-2 ring-primary ring-inset"
            )}
          >
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {content.features?.sectionTitle || 'Features Title'}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {content.features?.sectionSubtitle || 'Features subtitle'}
              </p>
              
              <div className="grid gap-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="p-2 bg-background rounded-lg border text-left">
                    <h3 className="text-xs font-medium text-foreground mb-0.5">
                      {(content.features as any)?.[`feature${num}Title`] || `Feature ${num}`}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      {(content.features as any)?.[`feature${num}Description`] || `Description ${num}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Workflow Section Preview */}
        {sectionVisibility.workflow && (
          <section 
            className={cn(
              "py-8 px-4 transition-all duration-200",
              activeSection === 'workflow' && "ring-2 ring-primary ring-inset"
            )}
          >
            <div className="max-w-md mx-auto text-center">
              <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-medium mb-3">
                {content.workflow?.badgeText || 'How It Works'}
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {content.workflow?.title || 'Workflow Title'}{' '}
                <span className="text-primary">Safe Administration</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {content.workflow?.subtitle || 'Workflow subtitle'}
              </p>
              
              <p className="text-xs text-muted-foreground mb-3">
                {content.workflow?.bottomText || 'Takes less than 30 seconds'}
              </p>
              
              <div className="flex gap-2 justify-center">
                <Button size="sm" className="h-7 text-xs">
                  {content.workflow?.ctaText || 'Start'}
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  {content.workflow?.secondaryCtaText || 'Explore'}
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section Preview */}
        {sectionVisibility.faq && (
          <section 
            className={cn(
              "py-8 px-4 bg-muted/30 transition-all duration-200",
              activeSection === 'faq' && "ring-2 ring-primary ring-inset"
            )}
          >
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-medium mb-3">
                {content.faq?.badgeText || 'FAQ'}
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {content.faq?.title || 'Common'} <span className="text-primary">Questions</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {content.faq?.subtitle || 'FAQ subtitle'}
              </p>
              
              <div className="space-y-2">
                {(content.faq?.items || []).slice(0, 4).map((item, i) => (
                  <div key={i} className="p-2 bg-background rounded-lg border text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-xs text-foreground line-clamp-1">{item.question || `Question ${i + 1}?`}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-primary mt-3 font-medium">
                {content.faq?.viewAllText || 'View all FAQs'} →
              </p>
            </div>
          </section>
        )}

        {/* Newsletter Section Preview */}
        {sectionVisibility.newsletter && (
          <section 
            className={cn(
              "py-8 px-4 bg-primary/10 transition-all duration-200",
              activeSection === 'newsletter' && "ring-2 ring-primary ring-inset"
            )}
          >
            <div className="max-w-md mx-auto text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {content.newsletter?.title || 'Newsletter Title'}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {content.newsletter?.subtitle || 'Newsletter subtitle'}
              </p>
              
              <div className="flex gap-2 max-w-xs mx-auto">
                <Input 
                  placeholder={content.newsletter?.placeholder || 'Enter email'}
                  className="text-xs h-8"
                  disabled
                />
                <Button size="sm" className="h-8 text-xs">
                  {content.newsletter?.buttonText || 'Subscribe'}
                </Button>
              </div>
              
              <p className="text-[10px] text-muted-foreground mt-3">
                {content.newsletter?.privacyText || 'We respect your privacy.'}
              </p>
            </div>
          </section>
        )}

        {/* Footer placeholder */}
        <div className="py-4 px-4 bg-foreground/5 text-center">
          <p className="text-xs text-muted-foreground">Footer content...</p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default LandingPagePreview;
