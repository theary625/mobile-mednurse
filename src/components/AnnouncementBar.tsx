import { useState, useEffect } from "react";
import { X, Trophy, Sparkles, Star, Bell, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnnouncementContent } from "@/hooks/useAnnouncementContent";

const iconMap = {
  trophy: Trophy,
  sparkles: Sparkles,
  star: Star,
  bell: Bell,
  info: Info,
};

const AnnouncementBar = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { content, isVisible } = useAnnouncementContent();

  useEffect(() => {
    const dismissed = localStorage.getItem("announcement-dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleClose = () => {
    setIsDismissed(true);
    localStorage.setItem("announcement-dismissed", "true");
  };

  if (!isVisible || isDismissed) return null;

  const isExternal = content.linkUrl?.startsWith("http") || content.linkUrl?.startsWith("#");
  const IconComponent = iconMap[content.iconType] || Trophy;

  return (
    <div className={`bg-gradient-to-r from-accent via-accent to-accent-light text-accent-foreground text-center py-3 px-12 text-sm font-medium relative z-[60] ${content.animated ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {content.showIcon && <IconComponent className="w-4 h-4" />}
        <span>
          {content.message}
        </span>
        {content.linkText && content.linkUrl && (
          isExternal ? (
            <a 
              href={content.linkUrl} 
              className="inline-flex items-center gap-1 underline font-bold hover:opacity-90 ml-1"
              target={content.linkUrl.startsWith("http") ? "_blank" : undefined}
              rel={content.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {content.linkText}
            </a>
          ) : (
            <Link 
              to={content.linkUrl} 
              className="inline-flex items-center gap-1 underline font-bold hover:opacity-90 ml-1"
            >
              {content.linkText}
            </Link>
          )
        )}
      </div>
      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1"
        aria-label="Close announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
