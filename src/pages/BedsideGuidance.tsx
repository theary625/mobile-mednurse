import SEOPageLayout from "@/components/seo/SEOPageLayout";
import SEOHero from "@/components/seo/SEOHero";
import ContentSection, { FeatureCard, StatCard } from "@/components/seo/ContentSection";
import RelatedPages from "@/components/seo/RelatedPages";
import PageCTA from "@/components/seo/PageCTA";
import QuickAnswer from "@/components/seo/QuickAnswer";
import TrustBadges from "@/components/TrustBadges";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Search, 
  BookOpen, 
  Calculator, 
  Pill, 
  Stethoscope,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const relatedPages = [
  {
    title: "Medication Error Prevention",
    description: "Learn how MedNurse prevents medication errors before they happen.",
    href: "/medication-error-prevention",
  },
  {
    title: "Nursing Safety Tools",
    description: "Explore our complete suite of clinical calculators and safety tools.",
    href: "/nursing-safety-tools",
  },
  {
    title: "Patient Education",
    description: "Tools to help educate patients about their medications.",
    href: "/patient-education",
  },
];

const BedsideGuidance = () => {
  return (
    <SEOPageLayout
      title="Bedside Medication Guidance Software"
      description="Real-time clinical decision support at the point of care. MedNurse provides instant medication information, dosing guidance, and safety checks right at the bedside."
      keywords="bedside medication guidance, clinical decision support, point of care drug reference, nursing drug app, bedside drug reference"
      canonicalUrl="/bedside-guidance"
      breadcrumbLabel="Bedside Guidance"
    >
      <SEOHero
        badge="Point of Care"
        title="Bedside Medication"
        highlightedText="Guidance Software"
        description="The clinical information you need, exactly when you need it. MedNurse delivers instant, evidence-based medication guidance directly at the point of care."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Try Free for 7 Days <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/plans">
            <Button size="lg" variant="outline">
              See Pricing
            </Button>
          </Link>
        </div>
      </SEOHero>

      {/* Quick Answer */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-8">
        <QuickAnswer title="What is bedside medication guidance?">
          Bedside medication guidance is clinical decision support that provides instant access to drug information at the point of care. It includes drug lookups, dosing calculators, IV compatibility checks, and administration instructions—available on mobile devices so nurses can get answers in seconds while caring for patients.
        </QuickAnswer>
      </div>

      {/* What is Bedside Guidance */}
      <ContentSection
        title="What is Bedside Medication Guidance?"
        description="Clinical decision support that works the way nurses work."
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Bedside medication guidance means having instant access to critical drug information 
              at the exact moment you need it—while preparing medications, during administration, 
              or when patients ask questions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Unlike bulky reference books or slow desktop systems, MedNurse is designed for the 
              reality of nursing: interruptions, time pressure, and the need for immediate answers. 
              Our mobile-first approach ensures you have guidance in your pocket, ready whenever 
              you need it.
            </p>
            <ul className="space-y-3">
              {[
                "Access drug information in under 3 seconds",
                "Works offline for areas with poor connectivity",
                "Updated daily with latest safety information",
                "Designed by nurses, for nurses",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl p-8 border border-border">
            <Smartphone className="w-16 h-16 text-primary mb-6" />
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
              Mobile-First Design
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              MedNurse is built for how nurses actually work. Quick searches, 
              large touch targets, night mode for dark units, and one-handed 
              operation mean you can find what you need without slowing down.
            </p>
          </div>
        </div>
      </ContentSection>

      {/* Features */}
      <ContentSection
        title="Guidance Features"
        description="Everything you need for safe medication administration."
        centered
        background="muted"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Search}
            title="Instant Drug Lookup"
            description="Search by generic name, brand name, or even partial spelling. Find any medication in seconds."
          />
          <FeatureCard
            icon={Calculator}
            title="Dosing Calculators"
            description="Weight-based dosing, renal adjustments, and pediatric calculations built right in."
          />
          <FeatureCard
            icon={Pill}
            title="IV Compatibility"
            description="Check Y-site compatibility and know which medications can run together safely."
          />
          <FeatureCard
            icon={BookOpen}
            title="Administration Guide"
            description="Step-by-step administration instructions, reconstitution, and stability information."
          />
          <FeatureCard
            icon={Stethoscope}
            title="Monitoring Parameters"
            description="Know what to assess before, during, and after medication administration."
          />
          <FeatureCard
            icon={Smartphone}
            title="Offline Access"
            description="Core drug information available offline for units with poor WiFi coverage."
          />
        </div>
      </ContentSection>

      {/* Use Case Scenarios */}
      <ContentSection
        title="Real-World Scenarios"
        description="See how bedside guidance works in practice."
      >
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Unfamiliar Medication
                </h3>
                <p className="text-muted-foreground mb-4">
                  You're about to administer a new chemotherapy agent you've never given before.
                </p>
                <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                  <p className="text-foreground">
                    <strong>MedNurse Solution:</strong> Instantly access vesicant precautions, 
                    proper dilution, infusion rate, and pre-medications. Review the complete 
                    administration checklist before you begin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Patient Question
                </h3>
                <p className="text-muted-foreground mb-4">
                  A patient asks why they need to take their new blood pressure medication at bedtime.
                </p>
                <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                  <p className="text-foreground">
                    <strong>MedNurse Solution:</strong> Pull up patient education points that 
                    explain the medication's mechanism and why evening dosing improves 
                    effectiveness. Share the information confidently.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  IV Compatibility Check
                </h3>
                <p className="text-muted-foreground mb-4">
                  You have two medications running and need to add a third. Can they all run together?
                </p>
                <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                  <p className="text-foreground">
                    <strong>MedNurse Solution:</strong> Use the compatibility checker to verify 
                    Y-site compatibility. Get clear guidance on what can run together and what 
                    needs separate lines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* Statistics */}
      <ContentSection
        title="The Impact of Bedside Guidance"
        centered
        background="muted"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard value="73%" label="Reduction in medication lookups" />
          <StatCard value="<3s" label="Average time to find information" />
          <StatCard value="92%" label="Nurse satisfaction rating" />
          <StatCard value="24/7" label="Always available support" />
        </div>
      </ContentSection>

      <RelatedPages pages={relatedPages} />

      {/* Trust Badges */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <TrustBadges />
        </div>
      </section>
      
      <PageCTA 
        title="Get Guidance at the Bedside"
        description="Download MedNurse and have clinical decision support in your pocket during every shift."
      />
    </SEOPageLayout>
  );
};

export default BedsideGuidance;
