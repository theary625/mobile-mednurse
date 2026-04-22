import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhyMedNurseSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
              Why Choose MedNurse
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
              The #1 Medication Safety Platform for{" "}
              <span className="text-primary">Nurses</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              MedNurse was built by nurses who understand the challenges of bedside medication 
              administration. Every feature is designed to fit the reality of nursing practice: 
              time pressure, interruptions, and the need for instant, reliable information.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Unlike generic drug reference apps, MedNurse focuses specifically on what nurses 
              need at the point of care. From high-alert medication warnings to IV compatibility 
              checking, our tools address the most common sources of medication errors in nursing.
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                "Evidence-based content reviewed by pharmacists",
                "Mobile-first design for bedside use",
                "Offline access for areas with poor WiFi",
                "HIPAA compliant and secure",
                "Updated daily with the latest safety information",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link to="/about">
                <Button variant="outline" className="gap-2">
                  Learn About Us <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/nursing-safety-tools">
                <Button variant="default" className="gap-2">
                  Explore Our Tools <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-2xl border border-border text-center">
              <div className="font-serif text-4xl lg:text-5xl font-semibold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground text-sm">Nurses Trust MedNurse</div>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border text-center">
              <div className="font-serif text-4xl lg:text-5xl font-semibold text-accent mb-2">40%</div>
              <div className="text-muted-foreground text-sm">Reduction in Med Errors</div>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border text-center">
              <div className="font-serif text-4xl lg:text-5xl font-semibold text-success mb-2">4.9</div>
              <div className="text-muted-foreground text-sm">App Store Rating</div>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border text-center">
              <div className="font-serif text-4xl lg:text-5xl font-semibold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground text-sm">Always Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMedNurseSection;
