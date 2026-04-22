import { Button } from "@/components/ui/button";
import { Check, Building2, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PricingFAQ from "@/components/PricingFAQ";
import LandingChatbot from "@/components/LandingChatbot";
import PlansHero from "@/components/plans/PlansHero";

const institutionPlans = [
{
  name: "University",
  icon: GraduationCap,
  price: "Custom",
  period: "pricing",
  description: "Designed for nursing schools and students with educational discounts.",
  features: [
  "Everything in Plus",
  "Bulk student licensing",
  "Learning modules",
  "Quiz & assessment tools",
  "Faculty dashboard",
  "Integration with LMS",
  "Priority support"],

  popular: true,
  cta: "Contact Sales"
},
{
  name: "Hospital & Enterprise",
  icon: Building2,
  price: "Custom",
  period: "pricing",
  description: "Enterprise solutions for hospitals and healthcare organizations.",
  features: [
  "Everything in University",
  "Unlimited users",
  "Custom formulary integration",
  "Admin analytics dashboard",
  "SSO & security compliance",
  "Dedicated account manager",
  "24/7 priority support"],

  popular: false,
  cta: "Get a Quote"
}];


const Plans = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PlansHero />

      {/* Individual Membership Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground italic mb-4">
              Individual Membership
            </h2>
            <p className="text-lg text-muted-foreground">
              Full access for individual nurses. No locked features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Card */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-2">Monthly</h3>
              <p className="text-muted-foreground mb-6">
                Full access membership. Cancel anytime.
              </p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">$12.99</span>
                <span className="text-muted-foreground ml-2">per month</span>
              </div>

              <Button className="w-full mb-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full" size="lg">
                Start monthly
              </Button>

              <div className="border-t border-border pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Everything included. No locked features.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Location-based safety reminders & 5 Rights prompts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">Medication guidance, allergy checks, and pain reassessment alerts.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Annual Card */}
            <div className="relative bg-card rounded-2xl p-8 border-2 border-primary">
              <div className="absolute -top-3 right-6">
                <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                  Best value
                </span>
              </div>

              <h3 className="text-2xl font-semibold text-foreground mb-2">Annual</h3>
              <p className="text-muted-foreground mb-6">
                Full access for a year. Two months free vs monthly.
              </p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">$129</span>
                <span className="text-muted-foreground ml-2">per year</span>
              </div>

              <Button className="w-full mb-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full" size="lg">
                Start annual
              </Button>

              <div className="border-t border-border pt-6">
                <h4 className="font-semibold text-foreground mb-3">Why subscription</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Medication safety is ongoing. Practices evolve, nurses rotate units, and fatigue impacts recall. MedNurse is built to support safe administration over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institution Plans Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">Institution Plans</h2>
            <p className="text-muted-foreground">Custom solutions for universities and healthcare organizations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {institutionPlans.map((plan) =>
            <div
              key={plan.name}
              className={`relative bg-card rounded-3xl p-8 border transition-all duration-300 hover:shadow-xl ${
              plan.popular ?
              "border-accent shadow-lg" :
              "border-border hover:border-primary/30"}`
              }>

                {plan.popular &&
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
              }
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                plan.popular ? "bg-accent/10" : "bg-primary/10"}`
                }>
                    <plan.icon className={`w-6 h-6 ${plan.popular ? "text-accent" : "text-primary"}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.period}</span>
                </div>

                <p className="text-muted-foreground mb-6">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) =>
                <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                )}
                </ul>

                <Button
                variant={plan.popular ? "accent" : "outline"}
                className="w-full gap-2"
                size="lg">

                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* University social proof logos */}
                {plan.name === "University" &&
              <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center mb-4">Trusted by leading institutions</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                  { name: "Johns Hopkins", initials: "JHU" },
                  { name: "Duke University", initials: "DU" },
                  { name: "UCLA", initials: "UCLA" },
                  { name: "Penn State", initials: "PSU" },
                  { name: "NYU", initials: "NYU" },
                  { name: "Stanford", initials: "SU" }].
                  map((uni) =>
                  <div
                    key={uni.name}
                    className="bg-muted/50 rounded-lg p-2 flex items-center justify-center"
                    title={uni.name}>

                          <span className="text-xs font-bold text-muted-foreground">{uni.initials}</span>
                        </div>
                  )}
                    </div>
                  </div>
              }
              </div>
            )}
          </div>
        </div>
      </section>

      <PricingFAQ />

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-4">Explore Institutional Partnership

          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Our team is here to help you find the perfect solution for your needs. 
            Schedule a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/schedule-demo">
              <Button variant="default" size="lg" className="gap-2">
                Schedule a Demo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <LandingChatbot />
    </div>);

};

export default Plans;