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
  Users, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  Languages, 
  Heart,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const relatedPages = [
  {
    title: "Bedside Guidance",
    description: "Real-time clinical information to answer patient questions.",
    href: "/bedside-guidance",
  },
  {
    title: "Hospital Compliance",
    description: "Meet patient education requirements for accreditation.",
    href: "/hospital-compliance",
  },
  {
    title: "Medication Error Prevention",
    description: "How patient education contributes to medication safety.",
    href: "/medication-error-prevention",
  },
];

const PatientEducation = () => {
  return (
    <SEOPageLayout
      title="Patient Education for Medications"
      description="Tools to help nurses educate patients about their medications. Discharge teaching, medication instructions, and family communication resources."
      keywords="patient medication education, medication teaching for patients, discharge medication instructions, patient drug education"
      canonicalUrl="/patient-education"
      breadcrumbLabel="Patient Education"
    >
      <SEOHero
        badge="Patient Teaching"
        title="Patient Education for"
        highlightedText="Medications"
        description="Effective patient education improves adherence, reduces readmissions, and prevents medication errors at home. MedNurse gives you the tools to teach confidently."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Access Education Tools <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/bedside-guidance">
            <Button size="lg" variant="outline">
              Bedside Guidance
            </Button>
          </Link>
        </div>
      </SEOHero>

      {/* Quick Answer */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-8">
        <QuickAnswer title="Why is patient medication education important?">
          Patient medication education improves adherence by 3x, reduces 30-day readmissions by 25%, and prevents medication errors at home. When patients understand why they take medications, how to take them correctly, and what side effects to watch for, health outcomes improve dramatically. MedNurse provides plain-language teaching tools and printable instructions.
        </QuickAnswer>
      </div>

      {/* Why Patient Education Matters */}
      <ContentSection
        title="Why Medication Education Matters"
        background="muted"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nearly 50% of patients don't take their medications as prescribed. Poor 
              understanding is a leading cause. When patients understand their medications—
              why they take them, how to take them, and what to watch for—outcomes improve 
              dramatically.
            </p>
            <ul className="space-y-4">
              {[
                "Patients who understand their meds are 3x more likely to adhere",
                "Effective discharge teaching reduces 30-day readmissions by 25%",
                "Clear instructions prevent medication errors at home",
                "Educated patients recognize side effects earlier",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard value="50%" label="Don't take meds as prescribed" />
            <StatCard value="25%" label="Reduction in readmissions" />
            <StatCard value="3x" label="Improvement in adherence" />
            <StatCard value="$300B" label="Annual cost of non-adherence" />
          </div>
        </div>
      </ContentSection>

      {/* Education Features */}
      <ContentSection
        title="Patient Education Features"
        description="Tools designed for clear, effective medication teaching."
        centered
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={BookOpen}
            title="Plain Language Summaries"
            description="Medication information written at 5th-grade reading level. No medical jargon, just clear explanations."
          />
          <FeatureCard
            icon={MessageCircle}
            title="Teaching Points"
            description="Key points to cover with each medication. What to take, when, with food or not, and what to avoid."
          />
          <FeatureCard
            icon={FileText}
            title="Printable Instructions"
            description="Patient-friendly handouts you can print or share digitally. Large text, clear formatting."
          />
          <FeatureCard
            icon={Languages}
            title="Multi-Language Support"
            description="Education materials available in Spanish, Chinese, Vietnamese, and more common languages."
          />
          <FeatureCard
            icon={Users}
            title="Family Education Tips"
            description="Guidance on involving family members and caregivers in medication management."
          />
          <FeatureCard
            icon={Heart}
            title="Side Effect Counseling"
            description="What side effects to expect, what's concerning, and when to call the doctor."
          />
        </div>
      </ContentSection>

      {/* Discharge Teaching */}
      <ContentSection
        title="Discharge Medication Teaching"
        background="muted"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
              The Discharge Teaching Challenge
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Discharge is the highest-risk time for medication errors. Patients are 
              overwhelmed, nurses are rushed, and there's too much information to cover. 
              MedNurse streamlines discharge teaching so nothing gets missed.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-2">New Medications</h4>
                <p className="text-muted-foreground text-sm">
                  Complete teaching on purpose, dose, timing, food interactions, and storage.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-2">Changed Medications</h4>
                <p className="text-muted-foreground text-sm">
                  Clear explanation of what changed and why. Helps prevent confusion with home meds.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-2">Stopped Medications</h4>
                <p className="text-muted-foreground text-sm">
                  Ensure patients understand which medications they should no longer take.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4">
              Discharge Teaching Checklist
            </h3>
            <ul className="space-y-3">
              {[
                "Review each medication's purpose",
                "Demonstrate proper administration technique",
                "Discuss common side effects to expect",
                "Explain warning signs requiring medical attention",
                "Confirm patient can read medication labels",
                "Discuss drug-drug and drug-food interactions",
                "Review storage requirements",
                "Confirm patient has pharmacy access",
                "Provide written instructions",
                "Use teach-back method to verify understanding",
              ].map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ContentSection>

      {/* Teaching Techniques */}
      <ContentSection
        title="Effective Teaching Techniques"
        description="Evidence-based strategies for patient medication education."
        centered
      >
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-card rounded-2xl border border-border">
            <h3 className="font-semibold text-lg text-foreground mb-3">Teach-Back Method</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Ask patients to explain back what you've taught them in their own words. 
              This confirms understanding and reveals gaps.
            </p>
            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-sm text-foreground italic">
                "Just to make sure I explained this clearly, can you tell me how you'll 
                take this medication at home?"
              </p>
            </div>
          </div>
          <div className="p-6 bg-card rounded-2xl border border-border">
            <h3 className="font-semibold text-lg text-foreground mb-3">Chunk and Check</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Provide information in small chunks, checking understanding before moving on. 
              Avoid information overload.
            </p>
            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-sm text-foreground italic">
                "Let's start with your blood pressure medication. Do you have any 
                questions about this one before we move on?"
              </p>
            </div>
          </div>
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
        title="Improve Your Patient Education"
        description="Access plain-language medication information, printable handouts, and teaching resources to improve patient outcomes."
      />
    </SEOPageLayout>
  );
};

export default PatientEducation;
