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
  Shield, 
  FileCheck, 
  ClipboardCheck, 
  Award, 
  Scale, 
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2
} from "lucide-react";

const relatedPages = [
  {
    title: "Medication Error Prevention",
    description: "Reduce medication errors to meet safety requirements.",
    href: "/medication-error-prevention",
  },
  {
    title: "IV Infusion Safety",
    description: "IV safety protocols that meet regulatory standards.",
    href: "/iv-infusion-safety",
  },
  {
    title: "Patient Education",
    description: "Meet patient teaching requirements for discharge.",
    href: "/patient-education",
  },
];

const complianceAreas = [
  {
    title: "Joint Commission NPSG",
    description: "Medication safety National Patient Safety Goals",
    items: [
      "Medication reconciliation",
      "High-alert medication management",
      "Look-alike/sound-alike drug protocols",
      "Patient identification verification",
    ],
  },
  {
    title: "CMS Conditions of Participation",
    description: "Federal requirements for hospital participation",
    items: [
      "Medication administration records",
      "Adverse drug event reporting",
      "Pharmacy oversight requirements",
      "Patient education documentation",
    ],
  },
  {
    title: "State Board of Nursing",
    description: "State-specific nursing practice requirements",
    items: [
      "Scope of practice compliance",
      "Continuing education requirements",
      "Medication administration rights",
      "Documentation standards",
    ],
  },
];

const HospitalCompliance = () => {
  return (
    <SEOPageLayout
      title="Hospital Medication Safety Compliance"
      description="Meet Joint Commission, CMS, and state medication safety requirements. MedNurse helps hospitals maintain compliance with medication safety standards and regulations."
      keywords="hospital medication safety compliance, Joint Commission medication safety, CMS medication requirements, medication safety regulations"
      canonicalUrl="/hospital-compliance"
      breadcrumbLabel="Hospital Compliance"
    >
      <SEOHero
        badge="Regulatory Compliance"
        title="Hospital Medication"
        highlightedText="Safety Compliance"
        description="Medication safety isn't just good practice—it's required. MedNurse helps your organization meet and exceed regulatory requirements while actually improving patient safety."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/plans">
            <Button size="lg" className="gap-2">
              View Enterprise Plans <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </Link>
        </div>
      </SEOHero>

      {/* Quick Answer */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-8">
        <QuickAnswer title="What are hospital medication safety compliance requirements?">
          Hospitals must meet medication safety requirements from the Joint Commission (NPSGs), CMS Conditions of Participation, and state nursing boards. These include medication reconciliation, high-alert medication protocols, proper labeling, documentation standards, and adverse event reporting. MedNurse helps organizations demonstrate compliance while improving actual safety outcomes.
        </QuickAnswer>
      </div>

      {/* Regulatory Landscape */}
      <ContentSection
        title="The Regulatory Landscape"
        description="Multiple regulatory bodies require robust medication safety programs."
        background="muted"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {complianceAreas.map((area) => (
            <div
              key={area.title}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-semibold text-lg text-foreground mb-2">{area.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{area.description}</p>
              <ul className="space-y-2">
                {area.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* How MedNurse Helps */}
      <ContentSection
        title="How MedNurse Supports Compliance"
        description="Tools and documentation that directly address regulatory requirements."
        centered
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={ClipboardCheck}
            title="Medication Safety Checklists"
            description="Pre-built checklists aligned with Joint Commission NPSGs for medication administration."
          />
          <FeatureCard
            icon={FileCheck}
            title="Documentation Support"
            description="Structured documentation that meets CMS requirements for medication administration records."
          />
          <FeatureCard
            icon={Shield}
            title="High-Alert Protocols"
            description="Built-in protocols for high-alert medications that meet ISMP and Joint Commission standards."
          />
          <FeatureCard
            icon={Award}
            title="Continuing Education"
            description="CE courses that help nurses meet state board requirements for medication competency."
          />
          <FeatureCard
            icon={Lock}
            title="HIPAA Compliance"
            description="Secure, HIPAA-compliant platform with audit trails and access controls."
          />
          <FeatureCard
            icon={Building2}
            title="Organization-Wide Reporting"
            description="Analytics and reporting tools to demonstrate compliance to surveyors."
          />
        </div>
      </ContentSection>

      {/* Joint Commission Focus */}
      <ContentSection
        title="Joint Commission NPSG Alignment"
        background="muted"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
              National Patient Safety Goals for Medications
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The Joint Commission's National Patient Safety Goals (NPSGs) specifically address 
              medication safety. MedNurse features are designed to help your organization meet 
              these requirements.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    NPSG.03.04.01
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mt-3 mb-2">Medication Labeling</h4>
                <p className="text-muted-foreground text-sm">
                  MedNurse supports proper medication labeling with clear display of drug names, 
                  concentrations, and expiration information.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    NPSG.03.05.01
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mt-3 mb-2">Anticoagulation Safety</h4>
                <p className="text-muted-foreground text-sm">
                  Specialized anticoagulation protocols, dosing calculators, and monitoring 
                  reminders support safe anticoagulant management.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    NPSG.03.06.01
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mt-3 mb-2">Medication Reconciliation</h4>
                <p className="text-muted-foreground text-sm">
                  Drug interaction checking and patient medication education tools support 
                  accurate medication reconciliation at transitions of care.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <Scale className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-semibold text-xl text-foreground mb-4">
              Survey-Ready Documentation
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When surveyors arrive, you need to demonstrate your medication safety program. 
              MedNurse Enterprise provides:
            </p>
            <ul className="space-y-3">
              {[
                "Usage analytics showing staff engagement",
                "Documentation of safety alerts acknowledged",
                "High-alert medication protocol adherence",
                "Continuing education completion records",
                "Medication safety committee reports",
                "Near-miss and error trend analysis",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ContentSection>


      {/* Stats */}
      <ContentSection
        title="Compliance Outcomes"
        centered
        background="muted"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard value="100%" label="Joint Commission survey pass rate" />
          <StatCard value="45%" label="Reduction in medication events" />
          <StatCard value="93%" label="Staff compliance with protocols" />
          <StatCard value="0" label="Data breaches since launch" />
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
        title="Ensure Your Organization's Compliance"
        description="Learn how MedNurse Enterprise can help your hospital meet medication safety requirements while improving patient outcomes."
        primaryText="Request Enterprise Demo"
        primaryHref="/contact"
        secondaryText="View Plans"
        secondaryHref="/plans"
      />
    </SEOPageLayout>
  );
};

export default HospitalCompliance;
