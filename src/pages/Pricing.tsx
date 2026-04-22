// src/pages/Pricing.tsx
// MedNurse Membership (SEO-optimized) - Lovable (React + TS + Tailwind)

import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";

const siteUrl = "https://mednurse.com";
const pageUrl = `${siteUrl}/pricing`;
const ogImage = `${siteUrl}/og/mednurse-pricing.png`;

const faq = [
  {
    question: "What is MedNurse?",
    answer:
      "MedNurse is a standalone nursing education and medication safety platform that helps nurses access clear, structured medication guidance and clinical references during real workflows.",
  },
  {
    question: "Does MedNurse connect to the EMR or store patient data?",
    answer:
      "No. MedNurse does not connect to EMRs and does not store or process PHI. It is an independent tool built to support medication administration safety.",
  },
  {
    question: "What is included in the MedNurse Membership?",
    answer:
      "One membership includes full access to all MedNurse resources, including medication guidance, monitoring and administration references, nursing education content, and ongoing updates.",
  },
  {
    question: "How much does MedNurse cost?",
    answer:
      "MedNurse Membership is $12.99 per month, or $129 per year with two months free compared to monthly billing.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. Monthly membership can be canceled anytime.",
  },
];

function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export default function Pricing() {
  const faqSchema = buildFaqSchema();

  return (
    <>
      <Helmet>
        <title>MedNurse Membership | Medication Safety Support for Nurses</title>
        <meta
          name="description"
          content="MedNurse Membership gives nurses full access to medication safety guidance, administration references, and nursing education. $12.99/month or $129/year."
        />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="MedNurse Membership | Medication Safety Support for Nurses" />
        <meta
          property="og:description"
          content="One membership. Full access. Built for safe medication administration during real clinical workflows."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MedNurse Membership" />
        <meta
          name="twitter:description"
          content="Medication safety support for nurses. Full access. $12.99/month or $129/year."
        />
        <meta name="twitter:image" content={ogImage} />

        {/* FAQ Schema */}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        <main>
          {/* Hero */}
          <section className="bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                MedNurse Membership
              </span>

              <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-semibold text-foreground leading-tight mb-6">
                Medication Safety Support for Nurses
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                One membership. Full access. Built for safe medication administration during real
                clinical workflows.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button variant="outline" size="lg" asChild>
                  <a href="#plans">View pricing</a>
                </Button>
                <Button size="lg" asChild>
                  <a href="#plans">Start membership</a>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                No EMR integration.{" "}
                No PHI storage.{" "}
                Education-first, nurse-built.
              </p>
            </div>
          </section>

          {/* Value Props */}
          <section className="py-16 lg:py-20 bg-background">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Built for high-risk moments
                  </h3>
                  <p className="text-muted-foreground">
                    Use MedNurse when you need fast clarity before administration, without searching
                    across fragmented sources.
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    One plan with full access
                  </h3>
                  <p className="text-muted-foreground">
                    No tiers and no locked resources. Every member gets the complete MedNurse library.
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Designed to reduce cognitive overload
                  </h3>
                  <p className="text-muted-foreground">
                    Clear layouts and nurse-first structure to support safer practice under time
                    pressure.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Plans */}
          <section id="plans" className="py-16 lg:py-20 bg-secondary/30">
            <div className="max-w-4xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Monthly */}
                <div className="bg-card rounded-2xl border border-border p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Monthly</h2>
                  <p className="text-muted-foreground mb-6">
                    Full access membership. Cancel anytime.
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">$12.99</span>
                    <span className="text-muted-foreground ml-2">per month</span>
                  </div>

                  <Button className="w-full mb-6" size="lg">
                    Start monthly
                  </Button>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      Everything included. No locked features.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      Medication guidance and safety references.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      Nursing education content and updates.
                    </li>
                  </ul>
                </div>

                {/* Annual */}
                <div className="bg-primary text-primary-foreground rounded-2xl p-8 relative">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold">Annual</h2>
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                      Best value
                    </span>
                  </div>
                  <p className="text-primary-foreground/80 mb-6">
                    Full access for a year. Two months free vs monthly.
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">$129</span>
                    <span className="text-primary-foreground/80 ml-2">per year</span>
                  </div>

                  <Button variant="secondary" className="w-full mb-6 bg-background text-primary hover:bg-background/90" size="lg">
                    Start annual
                  </Button>

                  <div>
                    <p className="text-sm font-medium mb-2">Why subscription</p>
                    <p className="text-sm text-primary-foreground/80">
                      Medication safety is ongoing. Practices evolve, nurses rotate units, and fatigue
                      impacts recall. MedNurse is built to support safe administration over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Included */}
          <section className="py-16 lg:py-20 bg-background">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-4 text-center">
                What's included
              </h2>
              <p className="text-muted-foreground text-center mb-10">
                MedNurse Membership includes complete access to all resources.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Medication safety guidance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Administration and monitoring references</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Nurse-focused education content</span>
                  </li>
                </ul>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Distraction-free clinical layout</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Ongoing updates aligned with best practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">No ads and no upsells</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Trust */}
          <section className="py-16 lg:py-20 bg-secondary/30">
            <div className="max-w-4xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Designed for trust</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Nurse-led, education-first platform</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">No EMR integration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">No PHI storage or processing</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Who MedNurse is for</h2>
                  <p className="text-muted-foreground mb-6">
                    Nursing students, new graduate nurses, experienced bedside nurses, float nurses,
                    travel nurses, and clinical educators.
                  </p>
                  <Button asChild>
                    <a href="#plans">Become a member</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 lg:py-20 bg-background">
            <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-10 text-center">
              Pricing FAQ
            </h2>

            <div className="max-w-3xl mx-auto px-6 space-y-6">
              {faq.map((f, index) => (
                <div key={index} className="border-b border-border pb-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">{f.question}</h3>
                  <p className="text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-12 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-3">Bottom line</h3>
              <p className="text-muted-foreground">
                Nurses are the final safeguard before a medication reaches a patient. MedNurse exists
                to support that responsibility with clear guidance and education.
              </p>
            </div>
          </section>
        </main>

        <Footer />
        <LandingChatbot />
      </div>
    </>
  );
}
