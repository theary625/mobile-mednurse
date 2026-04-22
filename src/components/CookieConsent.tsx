import { useState, useEffect } from "react";
import { X, Cookie, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
    }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(selectedOptions));
    setIsVisible(false);
  };

  const toggleOption = (option: "analytics" | "marketing") => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-[9998]" />
      
      {/* Popup */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-40px)] max-w-lg bg-card rounded-3xl shadow-large animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-primary-foreground">
              Cookie Preferences
            </h3>
            <p className="text-white/80 text-sm">
              Customize your experience
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We use cookies to enhance your experience, analyze traffic, and for marketing purposes. 
            Learn more in our{" "}
            <a href="#" className="text-primary underline font-medium">
              Privacy Policy
            </a>
            .
          </p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {/* Necessary - always on */}
            <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-muted-foreground flex items-center justify-center">
                <Check className="w-4 h-4 text-card" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground">Necessary</h4>
                <p className="text-xs text-muted-foreground">Essential for the website to function</p>
              </div>
              <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-muted-foreground text-card rounded-full">
                Required
              </span>
            </div>

            {/* Analytics */}
            <button
              onClick={() => toggleOption("analytics")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                selectedOptions.analytics
                  ? "border-primary bg-primary-glow"
                  : "border-transparent bg-muted hover:border-border"
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                selectedOptions.analytics
                  ? "bg-primary border-primary"
                  : "bg-card border-border"
              }`}>
                {selectedOptions.analytics && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-sm text-foreground">Analytics</h4>
                <p className="text-xs text-muted-foreground">Help us improve with usage data</p>
              </div>
            </button>

            {/* Marketing */}
            <button
              onClick={() => toggleOption("marketing")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                selectedOptions.marketing
                  ? "border-primary bg-primary-glow"
                  : "border-transparent bg-muted hover:border-border"
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                selectedOptions.marketing
                  ? "bg-primary border-primary"
                  : "bg-card border-border"
              }`}>
                {selectedOptions.marketing && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-sm text-foreground">Marketing</h4>
                <p className="text-xs text-muted-foreground">Personalized content & ads</p>
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
            <Button
              variant="success"
              className="flex-1 bg-success hover:bg-success/90"
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
