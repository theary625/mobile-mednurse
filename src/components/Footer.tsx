import { Linkedin, Instagram, Mail, Phone, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useFooterSettings, defaultFooterSettings } from "@/hooks/useSiteSettings";
import awardBadge from "@/assets/mednurse-award-badge-2025.jpg";
import footerLogoHeart from "@/assets/mednurse-footer-logo-new-heart.png";
import mednurseIcon from "@/assets/mednurse-icon-logo.png";

const Footer = () => {
  const { data: footerSettings } = useFooterSettings();
  
  // Use CMS data with fallback to defaults
  const brand = footerSettings?.brand || defaultFooterSettings.brand;
  const socialLinks = footerSettings?.socialLinks || defaultFooterSettings.socialLinks;
  const columns = footerSettings?.columns || defaultFooterSettings.columns;
  const contact = footerSettings?.contact || defaultFooterSettings.contact;
  const award = footerSettings?.award || defaultFooterSettings.award;
  const copyrightText = (footerSettings?.copyright || defaultFooterSettings.copyright)
    .replace('{year}', new Date().getFullYear().toString());

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.1a8.16 8.16 0 0 0 4.76 1.52v-3.4c-.34 0-.68-.04-1-.1Z" />
    </svg>
  );

  const socialIcons = [
    { icon: Linkedin, href: socialLinks.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
    { icon: TikTokIcon, href: socialLinks.tiktok, label: "TikTok" },
  ];

  return (
    <footer id="contact" className="bg-primary-dark text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-10 mb-10">
          {/* Logo Section - spans 2 columns */}
          <div className="lg:col-span-2 space-y-2">
            <Link to="/" className="inline-block">
              <img 
                src={footerLogoHeart} 
                alt="MedNurse Logo" 
                className="h-28 w-auto transition-transform duration-300 hover:scale-105" 
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {brand.tagline}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialIcons.map((social) => {
                const href = social.href || '#';
                return (
                <a 
                  key={social.label} 
                  href={href} 
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all" 
                  aria-label={social.label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <social.icon className="w-4 h-4" />
                </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-4 gap-6 lg:gap-8">
            {/* Solutions Column */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">{columns.solutions.title}</h4>
              <ul className="space-y-3">
                {columns.solutions.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">{columns.product.title}</h4>
              <ul className="space-y-3">
                {columns.product.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">{columns.company.title}</h4>
              <ul className="space-y-3">
                {columns.company.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Column */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">{columns.trust.title}</h4>
              <ul className="space-y-3">
                {columns.trust.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright with Icon */}
            <div className="flex items-center gap-2 order-3 md:order-1">
              <img 
                src={mednurseIcon} 
                alt="MedNurse" 
                className="h-6 w-6 rounded-full transition-transform duration-300 hover:scale-110 hover:rotate-6"
                loading="lazy"
              />
              <p className="text-sm text-white/60">
                {copyrightText}
              </p>
            </div>

            {/* Award Badge */}
            <div className="flex items-center gap-3 order-1 md:order-2">
              <img 
                src={awardBadge} 
                alt={award.altText}
                className="h-10 w-auto rounded opacity-90 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <span className="text-xs text-amber-400/80 flex items-center gap-1">
                <Award className="w-3 h-3" />
                {award.label}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-white/70 order-2 md:order-3">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">{contact.email}</span>
              </a>
              <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">{contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
