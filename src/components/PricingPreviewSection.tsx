import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with essential tools",
    features: [
      "Basic drug lookups",
      "Safety alerts",
      "Limited calculators",
      "Community access",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "Everything you need for clinical practice",
    features: [
      "Unlimited drug database",
      "IV compatibility tools",
      "All clinical calculators",
      "Unlimited CE credits",
      "Offline mode",
      "Priority support",
    ],
    cta: "Start Membership",
    variant: "accent" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For hospitals and healthcare organizations",
    features: [
      "Everything in Pro",
      "Admin dashboard",
      "EHR integration",
      "Staff CE tracking",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const PricingPreviewSection = () => {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-accent-glow text-accent rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            Pricing
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Choose the plan that fits your needs. Simple, transparent pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-primary text-primary-foreground border-primary shadow-accent"
                  : "bg-card border-border hover:shadow-medium"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className={`text-4xl font-bold ${plan.popular ? "text-primary-foreground" : "text-primary"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mb-6 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-accent" : "text-success"}`} />
                    <span className={plan.popular ? "text-primary-foreground/90" : "text-foreground"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? "secondary" : "outline"}
                className={`w-full ${plan.popular ? "bg-background text-primary hover:bg-background/90" : ""}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Compare plans link */}
        <div className="text-center mt-10">
          <Link 
            to="/plans" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Compare all features
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPreviewSection;
