import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLandingContent } from "@/hooks/useLandingContent";

const defaultContent = {
  title: 'Download MedNurse Free',
  subtitle: '50,000+ nurses trust us',
  buttonText: 'Get Started',
  buttonHref: '/auth',
};

const StickyDownloadBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { data } = useLandingContent('stickyDownloadBar');

  const content = {
    ...defaultContent,
    ...(data?.content as Partial<typeof defaultContent> || {}),
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || data?.isVisible === false) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up">
      <div className="bg-primary/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-primary-foreground text-sm font-medium truncate">
            {content.title}
          </p>
          <p className="text-primary-foreground/70 text-xs">
            {content.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={content.buttonHref}>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-background text-primary hover:bg-background/90 gap-1.5"
            >
              <Download className="w-4 h-4" />
              {content.buttonText}
            </Button>
          </Link>
          <button 
            onClick={handleDismiss}
            className="p-1.5 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyDownloadBar;
