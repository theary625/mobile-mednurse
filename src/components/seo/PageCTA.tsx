import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

interface PageCTAProps {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

const PageCTA = ({
  title = "Ready to Improve Medication Safety?",
  description = "Join thousands of healthcare professionals using MedNurse to prevent medication errors and improve patient outcomes.",
  primaryText = "Get Started Free",
  primaryHref = "/auth?signup=true",
  secondaryText = "View Plans",
  secondaryHref = "/plans",
}: PageCTAProps) => {
  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
          {title}
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={primaryHref}>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent-dark text-accent-foreground gap-2 px-8"
            >
              <Download className="w-5 h-5" />
              {primaryText}
            </Button>
          </Link>
          <Link to={secondaryHref}>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            >
              {secondaryText}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PageCTA;
