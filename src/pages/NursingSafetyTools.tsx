import SEOPageLayout from "@/components/seo/SEOPageLayout";
import SEOHero from "@/components/seo/SEOHero";
import ContentSection, { FeatureCard, StatCard } from "@/components/seo/ContentSection";
import RelatedPages from "@/components/seo/RelatedPages";
import PageCTA from "@/components/seo/PageCTA";
import QuickAnswer from "@/components/seo/QuickAnswer";
import ClinicalSafetyFrameworkSchema from "@/components/seo/ClinicalSafetyFrameworkSchema";
import TrustBadges from "@/components/TrustBadges";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  FlaskConical, 
  Syringe, 
  Scale, 
  Activity, 
  Droplets,
  ArrowRight,
  Brain,
  Baby,
  Stethoscope,
  BookOpen,
  ClipboardCheck,
  Workflow,
  ShieldCheck
} from "lucide-react";
import { BrandHeartIcon as Heart } from "@/components/icons/MedicalSystemIcons";

const relatedPages = [
  {
    title: "IV Infusion Safety",
    description: "Specialized tools to prevent IV medication errors.",
    href: "/iv-infusion-safety",
  },
  {
    title: "Medication Error Prevention",
    description: "Learn how our tools help prevent medication errors.",
    href: "/medication-error-prevention",
  },
  {
    title: "Bedside Guidance",
    description: "Real-time clinical decision support at point of care.",
    href: "/bedside-guidance",
  },
];

const toolCategories = [
  {
    title: "Dosing Calculators",
    description: "Weight-based and renal-adjusted dosing made easy",
    icon: Calculator,
    tools: ["Creatinine Clearance", "Weight-Based Dosing", "Pediatric Dosing", "Renal Adjustment"],
  },
  {
    title: "IV & Infusion Tools",
    description: "Safe IV medication preparation and administration",
    icon: Syringe,
    tools: ["Drip Rate Calculator", "IV Compatibility Checker", "Reconstitution Guide", "Dilution Calculator"],
  },
  {
    title: "Clinical Scores",
    description: "Evidence-based assessment tools",
    icon: Activity,
    tools: ["Glasgow Coma Scale", "NIHSS Stroke Scale", "CHA₂DS₂-VASc", "Wells Criteria"],
  },
  {
    title: "Conversion Tools",
    description: "Unit conversions for medication safety",
    icon: Scale,
    tools: ["Weight Conversion", "Temperature Conversion", "Opioid Equivalence", "Steroid Equivalence"],
  },
];

const NursingSafetyTools = () => {
  return (
    <>
      <ClinicalSafetyFrameworkSchema />
      <SEOPageLayout
        title="Nursing Medication Safety Tools | Clinical Safety Framework"
        description="Comprehensive suite of clinical calculators and safety tools for nurses. Point-of-care medication guidance, evidence-based education, standardized clinical tools, and nursing workflow support."
        keywords="nursing medication tools, clinical calculators for nurses, IV drip calculator, drug dosing calculator, nursing safety tools, point-of-care medication guidance, medication safety tools, bedside clinical support, evidence-based medication education, medication safety education, clinical best practices, clinical decision support tools, standardized medication information, medication administration safety, nursing workflow tools, medication safety for nurses, clinical workflow support, clinical safety framework"
        canonicalUrl="/nursing-safety-tools"
        breadcrumbLabel="Safety Tools"
      >
      <SEOHero
        badge="Clinical Tools"
        title="Nursing Medication"
        highlightedText="Safety Tools"
        description="A complete toolkit for medication safety. From drip calculators to clinical scores, MedNurse provides the tools nurses need to deliver safe, effective care."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/iv-infusion-safety">
            <Button size="lg" variant="outline">
              IV Safety Tools
            </Button>
          </Link>
        </div>
      </SEOHero>

      {/* Quick Answer */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-8">
        <QuickAnswer title="What are nursing medication safety tools?">
          Nursing medication safety tools are clinical calculators, drug references, and decision-support applications that help nurses prevent medication errors. They include IV drip calculators, drug interaction checkers, dosing calculators, and clinical assessment scales—all designed to reduce cognitive load and standardize safe practice at the bedside.
        </QuickAnswer>
      </div>

      {/* Tool Categories */}
      <ContentSection
        title="Complete Clinical Toolkit"
        description="Everything you need for safe medication practice, organized by category."
        background="muted"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {toolCategories.map((category) => (
            <div
              key={category.title}
              className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Featured Tools */}
      <ContentSection
        title="Featured Safety Tools"
        description="Our most-used tools by nurses across all specialties."
        centered
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Droplets}
            title="IV Drip Rate Calculator"
            description="Calculate mL/hr and gtt/min for any IV medication. Supports all drip factors and infusion volumes."
          />
          <FeatureCard
            icon={FlaskConical}
            title="Drug Interaction Checker"
            description="Check for interactions between multiple medications. Color-coded severity with clinical recommendations."
          />
          <FeatureCard
            icon={Scale}
            title="Weight-Based Dosing"
            description="Calculate doses based on patient weight in kg or lbs. Supports mg/kg, mcg/kg, and units/kg."
          />
          <FeatureCard
            icon={Heart}
            title="CHA₂DS₂-VASc Score"
            description="Atrial fibrillation stroke risk calculator with treatment recommendations."
          />
          <FeatureCard
            icon={Brain}
            title="NIHSS Stroke Scale"
            description="Complete NIH Stroke Scale assessment with scoring guidance and interpretation."
          />
          <FeatureCard
            icon={Baby}
            title="Pediatric Calculations"
            description="Age-appropriate dosing with maximum dose limits and weight verification."
          />
        </div>
      </ContentSection>

      {/* Clinical Safety Framework */}
      <ContentSection
        title="Clinical Safety Framework"
        description="MedNurse delivers evidence-based medication safety through practical clinical tools designed for real-world care environments. The platform supports nurses and healthcare professionals at the point of care, where accuracy matters most."
        background="muted"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Point-of-Care Medication Guidance</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  MedNurse provides instant access to medication guidance during administration. Clinicians can quickly review critical details without leaving the bedside.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This reduces reliance on memory, minimizes interruptions, and supports safe, timely medication delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Evidence-Based Medication Safety Education</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  All MedNurse content is grounded in evidence-based standards and clinical best practices. Education is integrated directly into workflow, reinforcing correct practice during care delivery rather than after an error occurs.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This approach supports continuous learning and safer clinical decision-making.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Standardized Clinical Tools</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  MedNurse presents medication information in a consistent, structured format across drugs and use cases. Standardization reduces cognitive load and variability, especially in high-pressure clinical settings.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This improves accuracy, efficiency, and confidence during medication administration.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Workflow className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Designed for Nursing Workflows</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  MedNurse is built specifically for how nurses work. Information is fast to find, easy to interpret, and focused on what matters in the moment of care.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The result is higher adoption, fewer disruptions, and safer patient outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why This Matters callout */}
        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Why This Matters</h3>
              <p className="text-muted-foreground leading-relaxed">
                Medication errors are preventable. MedNurse helps healthcare organizations close the gap between safety standards and bedside execution by delivering trusted guidance exactly when clinicians need it.
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* Why These Tools Matter */}
      <ContentSection
        title="Why Clinical Tools Matter"
        background="muted"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Reduce Cognitive Load</h3>
              <p className="text-muted-foreground leading-relaxed">
                Mental math and manual calculations during busy shifts increase error risk. 
                Our tools automate calculations so you can focus on patient care, not arithmetic.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Standardize Practice</h3>
              <p className="text-muted-foreground leading-relaxed">
                Evidence-based tools ensure consistent practice across your unit. Every nurse 
                uses the same validated formulas and assessment criteria.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Document Confidently</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built-in documentation support helps you record assessments accurately. 
                Clinical scores include interpretation guidance for clear charting.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard value="40+" label="Clinical calculators" />
            <StatCard value="98%" label="Accuracy verified" />
            <StatCard value="15+" label="Assessment scales" />
            <StatCard value="Daily" label="Updates & reviews" />
          </div>
        </div>
      </ContentSection>

      {/* Specialty Tools */}
      <ContentSection
        title="Tools by Specialty"
        description="Specialized tools for your practice area."
        centered
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "ICU/Critical Care", count: 12 },
            { name: "Emergency", count: 10 },
            { name: "Cardiac", count: 8 },
            { name: "Neuro", count: 7 },
            { name: "Pediatrics", count: 9 },
            { name: "Oncology", count: 6 },
          ].map((specialty) => (
            <div
              key={specialty.name}
              className="p-4 bg-card rounded-xl border border-border text-center hover:border-primary/30 transition-colors"
            >
              <div className="font-semibold text-foreground text-sm mb-1">{specialty.name}</div>
              <div className="text-primary font-medium">{specialty.count} tools</div>
            </div>
          ))}
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
        title="Access Your Clinical Toolkit"
        description="Get instant access to 40+ clinical calculators and safety tools. Free to try, essential for safe practice."
      />
      </SEOPageLayout>
    </>
  );
};

export default NursingSafetyTools;
