import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send, Linkedin, Instagram } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNewsletterContent } from "@/hooks/useNewsletterContent";
import { useFooterSettings } from "@/hooks/useSiteSettings";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.1a8.16 8.16 0 0 0 4.76 1.52v-3.4c-.34 0-.68-.04-1-.1Z" />
  </svg>
);

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { content, isVisible } = useNewsletterContent();
  const { data: footerSettings } = useFooterSettings();

  const socialLinks = [
    { icon: Linkedin, href: footerSettings?.socialLinks?.linkedin || '#', label: "LinkedIn" },
    { icon: Instagram, href: footerSettings?.socialLinks?.instagram || '#', label: "Instagram" },
    { icon: TikTokIcon, href: footerSettings?.socialLinks?.tiktok || '#', label: "TikTok" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim() });
    
    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already subscribed",
          description: "This email is already on our list!",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "You're subscribed!",
        description: "Welcome to the MedNurse community.",
      });
      setEmail("");
    }
    
    setIsSubmitting(false);
  };

  if (!isVisible) return null;

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-primary to-primary-light">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-primary-foreground mb-3">
          {content.title}
        </h3>
        <p className="text-white/85 text-lg mb-8">
          {content.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={content.placeholder}
            className="flex-1 px-5 py-4 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? "Subscribing..." : content.buttonText}
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <span className="text-white/70 text-sm">{content.followText}</span>
          {socialLinks.map((social) => {
            const href = social.href || '#';
            return (
              <a
                key={social.label}
                href={href}
                aria-label={social.label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        <p className="text-sm text-white/60">
          {content.privacyText}{" "}
          <Link to={content.privacyLink} className="underline text-white/80 hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
