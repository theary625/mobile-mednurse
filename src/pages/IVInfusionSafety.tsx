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
  Syringe, 
  AlertTriangle, 
  CheckCircle, 
  Timer, 
  Beaker, 
  Shield,
  ArrowRight,
  XCircle
} from "lucide-react";

const relatedPages = [
  {
    title: "Nursing Safety Tools",
    description: "Complete suite of clinical calculators and safety tools.",
    href: "/nursing-safety-tools",
  },
  {
    title: "Medication Error Prevention",
    description: "How MedNurse helps prevent all types of medication errors.",
    href: "/medication-error-prevention",
  },
  {
    title: "Hospital Compliance",
    description: "Meet IV medication safety standards and regulations.",
    href: "/hospital-compliance",
  },
];

const IVInfusionSafety = () => {
  return (
    <SEOPageLayout
      title="Reduce IV Infusion Errors in Nursing"
      description="Specialized tools to prevent IV medication errors. IV compatibility checker, drip calculators, high-alert IV medication guidance, and infusion safety protocols."
      keywords="IV infusion safety, IV medication errors, IV compatibility checker, nursing IV calculator, reduce IV errors"
      canonicalUrl="/iv-infusion-safety"
      breadcrumbLabel="IV Infusion Safety"
    >
      <SEOHero
        badge="IV Safety"
        title="Reduce IV Infusion"
        highlightedText="Errors in Nursing"
        description="IV medications carry the highest risk for patient harm. MedNurse provides specialized tools to prevent IV errors at every step—from preparation to administration."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Access IV Safety Tools <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/nursing-safety-tools">
            <Button size="lg" variant="outline">
              All Safety Tools
            </Button>
          </Link>
        </div>
      </SEOHero>

      {/* Quick Answer */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-8">
        <QuickAnswer title="How do you reduce IV infusion errors?">
          Reduce IV infusion errors by using IV compatibility checkers before Y-site administration, calculating drip rates with validated tools, following high-alert medication protocols, and verifying concentrations during reconstitution. MedNurse provides specialized IV safety tools including compatibility checking, rate calculators, and vesicant identification.
        </QuickAnswer>
      </div>

      {/* Why IV Safety Matters */}
      <ContentSection
        title="Why IV Safety Matters Most"
        description="IV medications bypass the body's natural defenses and act immediately."
        background="muted"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-destructive/5 rounded-2xl p-6 border border-destructive/20">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    The IV Error Reality
                  </h3>
                  <p className="text-muted-foreground">
                    IV medications account for 54% of medication-related adverse events. 
                    Unlike oral medications, IV errors can't be recalled once administered. 
                    The margin for error is zero.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              From wrong rate to wrong route, IV errors occur at every stage. Complex 
              calculations, multiple compatibility requirements, and time pressure create 
              a perfect storm for mistakes. MedNurse addresses each vulnerability.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard value="54%" label="Of adverse events involve IV meds" />
            <StatCard value="61%" label="Are preventable with proper tools" />
            <StatCard value="3x" label="Higher harm potential than oral" />
            <StatCard value="$7,000" label="Average cost per IV error" />
          </div>
        </div>
      </ContentSection>

      {/* Common IV Errors */}
      <ContentSection
        title="Common IV Errors We Help Prevent"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-2xl border border-border">
            <XCircle className="w-8 h-8 text-destructive mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Wrong Rate</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Infusion rates that are too fast or too slow can cause serious harm.
            </p>
            <div className="bg-success/10 rounded-lg p-3 border border-success/20">
              <p className="text-sm text-foreground">
                <strong>MedNurse:</strong> Rate calculators with max rate warnings
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-card rounded-2xl border border-border">
            <XCircle className="w-8 h-8 text-destructive mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Incompatibility</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Y-site incompatibilities can cause precipitation or drug degradation.
            </p>
            <div className="bg-success/10 rounded-lg p-3 border border-success/20">
              <p className="text-sm text-foreground">
                <strong>MedNurse:</strong> Real-time compatibility checker
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-card rounded-2xl border border-border">
            <XCircle className="w-8 h-8 text-destructive mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Wrong Concentration</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Incorrect dilution leads to underdosing or overdosing.
            </p>
            <div className="bg-success/10 rounded-lg p-3 border border-success/20">
              <p className="text-sm text-foreground">
                <strong>MedNurse:</strong> Dilution guides with concentration checks
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-card rounded-2xl border border-border">
            <XCircle className="w-8 h-8 text-destructive mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Vesicant Extravasation</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Vesicant medications that infiltrate can cause tissue necrosis.
            </p>
            <div className="bg-success/10 rounded-lg p-3 border border-success/20">
              <p className="text-sm text-foreground">
                <strong>MedNurse:</strong> Vesicant alerts and extravasation protocols
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-card rounded-2xl border border-border">
            <XCircle className="w-8 h-8 text-destructive mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">High-Alert Errors</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Insulin, heparin, and vasopressors require extra safety checks.
            </p>
            <div className="bg-success/10 rounded-lg p-3 border border-success/20">
              <p className="text-sm text-foreground">
                <strong>MedNurse:</strong> High-alert flagging with double-check prompts
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-card rounded-2xl border border-border">
            <XCircle className="w-8 h-8 text-destructive mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Stability Issues</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Using medications past their stability window reduces effectiveness.
            </p>
            <div className="bg-success/10 rounded-lg p-3 border border-success/20">
              <p className="text-sm text-foreground">
                <strong>MedNurse:</strong> Stability times and storage requirements
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* IV Safety Features */}
      <ContentSection
        title="IV Safety Features"
        description="Purpose-built tools for IV medication safety."
        centered
        background="muted"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Beaker}
            title="IV Compatibility Checker"
            description="Instantly check Y-site compatibility between any two IV medications. Color-coded results with alternatives."
          />
          <FeatureCard
            icon={Timer}
            title="Drip Rate Calculator"
            description="Calculate mL/hr, gtt/min, and mcg/kg/min. Supports all infusion scenarios with rate limits."
          />
          <FeatureCard
            icon={Syringe}
            title="Reconstitution Guide"
            description="Step-by-step mixing instructions with diluent options and final concentrations."
          />
          <FeatureCard
            icon={Shield}
            title="High-Alert IV Protocols"
            description="Special handling protocols for high-alert IV medications with double-check reminders."
          />
          <FeatureCard
            icon={AlertTriangle}
            title="Vesicant Identification"
            description="Instant identification of vesicants and irritants with extravasation protocols."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Administration Checklist"
            description="Pre-infusion safety checklists covering line patency, allergies, and monitoring."
          />
        </div>
      </ContentSection>

      {/* High-Alert Medications */}
      <ContentSection
        title="High-Alert IV Medications"
        description="Extra safety features for the most dangerous IV medications."
      >
        <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Insulin", risk: "Hypoglycemia" },
              { name: "Heparin", risk: "Bleeding" },
              { name: "Vasopressors", risk: "Hemodynamic instability" },
              { name: "Neuromuscular Blockers", risk: "Respiratory arrest" },
              { name: "Chemotherapy", risk: "Extravasation" },
              { name: "Concentrated Electrolytes", risk: "Cardiac arrest" },
              { name: "Opioids (IV)", risk: "Respiratory depression" },
              { name: "Sedatives", risk: "Over-sedation" },
            ].map((med) => (
              <div key={med.name} className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                <div className="font-semibold text-foreground mb-1">{med.name}</div>
                <div className="text-sm text-muted-foreground">Risk: {med.risk}</div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-center mt-6">
            MedNurse provides enhanced safety checks, double-verification prompts, and 
            immediate access to reversal protocols for all high-alert IV medications.
          </p>
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
        title="Improve IV Medication Safety Today"
        description="Access specialized IV safety tools designed to prevent the most common and dangerous IV medication errors."
      />
    </SEOPageLayout>
  );
};

export default IVInfusionSafety;
