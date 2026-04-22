import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { Link } from "react-router-dom";

const demoFeatures = [
  "Interactive drug interaction checker with real-time alerts",
  "Personalized learning paths based on your specialty",
  "Mobile-friendly for bedside reference",
  "Earn CE credits while you learn",
];

const demoStats = [
  { value: "99.7%", label: "Accuracy Rate" },
  { value: "2M+", label: "Interactions Checked" },
  { value: "4.9★", label: "User Rating" },
];

const DemoSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-muted to-card">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Video */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-large bg-primary-dark aspect-[9/14] max-h-[500px]">
              {/* Video placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Link to="/schedule-demo" className="w-20 h-20 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/30 transition-colors group">
                  <Play className="w-8 h-8 text-primary-foreground ml-1 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
              
              {/* Video overlay text */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-sm font-medium text-foreground mb-1">See MedNurse in Action</p>
                  <p className="text-xs text-muted-foreground">2 minute demo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-glow text-accent rounded-full text-sm font-semibold mb-6">
              <Play className="w-4 h-4" />
              <span>Watch Demo</span>
            </div>

            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-primary leading-tight mb-6">
              Experience Medication Safety Like Never Before
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              See how MedNurse transforms medication safety from a compliance 
              checkbox into a seamless part of your clinical workflow.
            </p>

            <ul className="space-y-4 mb-8">
              {demoFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success-glow flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
              {demoStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-2xl lg:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
