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
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingDown,
  ArrowRight 
} from "lucide-react";

const relatedPages = [
  {
    title: "Bedside Medication Guidance",
    description: "Real-time clinical decision support at the point of care.",
    href: "/bedside-guidance",
  },
  {
    title: "IV Infusion Safety",
    description: "Specialized tools to prevent IV medication errors.",
    href: "/iv-infusion-safety",
  },
  {
    title: "Hospital Compliance",
    description: "Meet Joint Commission and CMS medication safety requirements.",
    href: "/hospital-compliance",
  },
];

const MedicationErrorPrevention = () => {
  return (
    <SEOPageLayout
      title="Medication Error Prevention for Nurses"
      description="Prevent medication errors at the bedside with evidence-based clinical decision support. MedNurse helps nurses avoid drug interactions, dosing errors, and administration mistakes."
      keywords="medication error prevention, nursing medication safety, drug error prevention, medication mistakes nurses, clinical decision support"
      canonicalUrl="/medication-error-prevention"
      breadcrumbLabel="Medication Error Prevention"
    >
      <SEOHero
        badge="Patient Safety"
        title="Medication Error Prevention"
        highlightedText="for Nurses"
        description="Medication errors are a leading cause of preventable patient harm. MedNurse provides real-time clinical decision support to help nurses catch errors before they reach patients."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Start Preventing Errors <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/nursing-safety-tools">
            <Button size="lg" variant="outline">
              Explore Safety Tools
            </Button>
          </Link>
        </div>
      </SEOHero>

      {/* Quick Answer */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-8">
        <QuickAnswer title="How can nurses prevent medication errors?">
          Nurses prevent medication errors by following the "rights" of medication administration, using clinical decision support tools for drug interaction checking, verifying dosing calculations, and maintaining awareness of high-alert medications. Technology like MedNurse provides real-time alerts and evidence-based guidance to catch errors before they reach patients.
        </QuickAnswer>
      </div>

      {/* Statistics Section */}
      <ContentSection
        title="The Scale of Medication Errors"
        description="Understanding the problem is the first step to solving it."
        centered
        background="muted"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard value="7,000+" label="Deaths annually from medication errors" />
          <StatCard value="$21B" label="Annual cost of medication errors" />
          <StatCard value="1 in 5" label="Doses administered have errors" />
          <StatCard value="60%" label="Of errors are preventable" />
        </div>
      </ContentSection>

      {/* Problem Section */}
      <ContentSection
        title="Why Medication Errors Happen"
        description="Nurses face numerous challenges that increase error risk."
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Look-alike, Sound-alike Drugs</h3>
                <p className="text-muted-foreground text-sm">Over 25% of medication errors involve drugs with similar names or packaging.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
              <Clock className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Time Pressure & Interruptions</h3>
                <p className="text-muted-foreground text-sm">Nurses are interrupted every 3-5 minutes, increasing cognitive load and error risk.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
              <Users className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Complex Patient Populations</h3>
                <p className="text-muted-foreground text-sm">Patients on multiple medications require careful interaction checking.</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-border">
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
              The Human Factor
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Healthcare professionals are human. Even the most experienced nurses can make mistakes 
              under pressure, fatigue, or when faced with unfamiliar medications. The solution isn't 
              to blame individuals—it's to provide better systems and tools.
            </p>
            <p className="text-primary font-medium">
              MedNurse is that better system.
            </p>
          </div>
        </div>
      </ContentSection>

      {/* Solution Section */}
      <ContentSection
        title="How MedNurse Prevents Errors"
        description="Evidence-based tools designed specifically for bedside nurses."
        background="muted"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={ShieldAlert}
            title="Real-Time Drug Interaction Alerts"
            description="Instant warnings when medications may interact with the patient's current drug regimen."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Dosing Verification"
            description="Automatic dose range checking based on patient weight, age, and renal function."
          />
          <FeatureCard
            icon={TrendingDown}
            title="High-Alert Medication Flags"
            description="Special warnings for high-risk medications like insulin, anticoagulants, and opioids."
          />
          <FeatureCard
            icon={Clock}
            title="Administration Timing Guidance"
            description="Clear instructions on timing, food interactions, and proper administration technique."
          />
          <FeatureCard
            icon={Users}
            title="Patient-Specific Considerations"
            description="Alerts for allergies, contraindications, and special population needs."
          />
          <FeatureCard
            icon={AlertTriangle}
            title="Look-Alike Sound-Alike Warnings"
            description="Visual alerts when handling drugs that are commonly confused with others."
          />
        </div>
      </ContentSection>

      {/* Testimonial */}
      <ContentSection title="What Nurses Say" centered>
        <div className="max-w-3xl mx-auto">
          <blockquote className="relative">
            <div className="text-5xl text-primary/20 absolute -top-4 -left-4">"</div>
            <p className="text-xl lg:text-2xl text-foreground italic leading-relaxed mb-6 pl-8">
              MedNurse caught a serious drug interaction I might have missed during a hectic night shift. 
              It's like having a pharmacist in my pocket. I feel so much more confident at the bedside now.
            </p>
            <footer className="pl-8">
              <div className="font-semibold text-foreground">Sarah M., RN, BSN</div>
              <div className="text-muted-foreground text-sm">Medical-Surgical Unit, 8 years experience</div>
            </footer>
          </blockquote>
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
        title="Start Preventing Medication Errors Today"
        description="Join 50,000+ nurses using MedNurse to improve patient safety and reduce medication errors at the bedside."
      />
    </SEOPageLayout>
  );
};

export default MedicationErrorPrevention;
