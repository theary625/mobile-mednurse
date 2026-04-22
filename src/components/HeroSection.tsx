import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Star, Users, Download, ArrowRight } from "lucide-react";
import edithMascot from "@/assets/edith-mascot-final.png";
import ErrorsPreventedCounter from "./ErrorsPreventedCounter";
import { useHeroContent } from "@/hooks/useHeroContent";

const safetyTips = [
  "👋 Hi! I'm Edith, your safety companion",
  "💊 Always double-check the 5 Rights!",
  "🔔 New drug alert: Check interactions first",
];

const HeroSection = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const { content, isVisible } = useHeroContent();

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % safetyTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <section className="pt-12 lg:pt-20 pb-16 lg:pb-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              <span>{content.badge}</span>
            </div>

            {/* Headline - H1 with target keyword */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
              {content.headline}{" "}
              <span className="text-primary">for Nurses</span>
            </h1>

            {/* Subtitle - Keyword rich description */}
            <p className="text-lg lg:text-xl text-muted-foreground mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {content.subheadline}
            </p>

            {/* Secondary description for SEO */}
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              {content.secondaryDescription}
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <Link to={content.primaryCtaLink}>
                <Button variant="accent" size="lg" className="gap-2 text-base w-full sm:w-auto">
                  <Download className="w-5 h-5" />
                  {content.primaryCta}
                </Button>
              </Link>
              <Link to={content.secondaryCtaLink}>
                <Button variant="hero-outline" size="lg" className="gap-2 w-full sm:w-auto">
                  {content.secondaryCta} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <a 
                href="#" 
                className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
                aria-label="Download MedNurse on App Store"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-80">Download on the</div>
                  <div className="text-sm font-semibold -mt-0.5">App Store</div>
                </div>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
                aria-label="Get MedNurse on Google Play"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-80">Get it on</div>
                  <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                </div>
              </a>
            </div>

            {/* Errors Prevented Counter */}
            <div className="mb-6">
              <ErrorsPreventedCounter />
            </div>

          </div>

          {/* Hero Image / Mascot */}
          <div className="relative flex items-end justify-center lg:justify-end">
            {/* Greeting bubble with pop animation */}
            <div
              key={tipIndex}
              className="absolute -top-3 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-4 bg-card px-5 py-3 rounded-2xl rounded-bl-sm shadow-soft animate-fade-in z-10 border border-border/50"
            >
              <span className="text-sm font-semibold text-primary">
                {safetyTips[tipIndex]}
              </span>
            </div>

            {/* Glow effect behind mascot */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 lg:w-[28rem] h-48 lg:h-64 pointer-events-none -z-10"
              style={{
                background: "radial-gradient(ellipse at center bottom, hsl(var(--accent) / 0.3) 0%, hsl(var(--primary) / 0.15) 50%, transparent 80%)",
                filter: "blur(50px)",
              }}
            />

            {/* Edith Mascot with float animation */}
            <img
              src={edithMascot}
              alt="Edith - MedNurse AI Medication Safety Companion for Nurses"
              className="w-72 lg:w-96 h-auto animate-float relative z-0"
              loading="eager"
              decoding="async"
              width="384"
              height="384"
              style={{
                filter: "drop-shadow(0 20px 40px hsl(var(--primary) / 0.2))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
