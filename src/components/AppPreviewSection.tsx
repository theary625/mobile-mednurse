import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Check, Calculator, BookOpen, Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import appLogo from "@/assets/mednurse-logo-new.png";

const AppPreviewSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              <span className="text-primary">Medication safety</span>
              <br />
              <span className="text-accent">in your pocket</span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              The #1 clinical reference app for nurses. Access drug information, 
              IV compatibility, dosage calculators, and administration guides 
              — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <Button variant="accent" size="lg" className="gap-2">
                Start Membership
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Link to="/schedule-demo">
                <Button variant="hero-outline" size="lg" className="gap-2">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-80">Download on the</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-80">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Floating IV Compatible Badge */}
            <div 
              className="absolute left-0 lg:-left-8 top-20 bg-card px-5 py-3 rounded-2xl shadow-soft z-20 border border-border/50 animate-pop"
              style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">IV Compatible</p>
                  <p className="text-muted-foreground text-xs">Heparin + NS</p>
                </div>
              </div>
            </div>

            {/* Floating Drip Rate Badge */}
            <div 
              className="absolute right-0 lg:-right-4 bottom-32 bg-card px-4 py-3 rounded-2xl shadow-soft z-20 border border-border/50 animate-pop"
              style={{ animationDelay: "0.6s", opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Drip Rate</p>
                  <p className="text-muted-foreground text-xs">125 mL/hr</p>
                </div>
              </div>
            </div>

            {/* Phone Frame */}
            <div 
              className="relative w-72 lg:w-80 animate-float"
              style={{ perspective: "1000px" }}
            >
              {/* Phone outer frame */}
              <div 
                className="bg-primary rounded-[3rem] p-3 transition-transform duration-500 hover:scale-105"
                style={{
                  transform: "rotateY(-8deg) rotateX(5deg)",
                  transformStyle: "preserve-3d",
                  boxShadow: "25px 25px 60px rgba(0,0,0,0.4), -5px -5px 20px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.1)"
                }}
              >
                {/* Phone notch area with logo */}
                <div className="bg-card rounded-t-[2.5rem] pt-8 pb-6 flex items-center justify-center">
                  <img 
                    src={appLogo} 
                    alt="MedNurse App Logo" 
                    className="w-32 h-auto object-contain"
                  />
                </div>

                {/* Phone screen content */}
                <div className="bg-card rounded-b-[2.5rem] p-4">
                  {/* Search bar */}
                  <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 mb-4">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">Search medications...</span>
                  </div>

                  {/* Feature buttons */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-xl">
                      <FileText className="w-5 h-5 text-info" />
                      <span className="text-xs font-medium text-foreground">IV Compat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-xl">
                      <Calculator className="w-5 h-5 text-info" />
                      <span className="text-xs font-medium text-foreground">Calculate</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-xl">
                      <BookOpen className="w-5 h-5 text-info" />
                      <span className="text-xs font-medium text-foreground">Guides</span>
                    </div>
                  </div>

                  {/* Recent lookups */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Recent Lookups
                    </p>
                    <div className="space-y-2">
                      {["Heparin", "Metoprolol", "Vancomycin"].map((drug) => (
                        <div 
                          key={drug} 
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-info" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{drug}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPreviewSection;
