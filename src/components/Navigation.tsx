import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, ChevronDown, MessageCircle, LogIn, UserPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useHeaderSettings, defaultHeaderSettings } from "@/hooks/useSiteSettings";
import mednurseLogo from "@/assets/mednurse-logo-new.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = (items: { href: string }[]) => items.some(item => location.pathname.startsWith(item.href));
  const { data: headerSettings } = useHeaderSettings();
  
  // Use CMS data with fallback to defaults
  const solutionsDropdown = headerSettings?.solutionsDropdown || defaultHeaderSettings.solutionsDropdown;
  const resourcesDropdown = headerSettings?.resourcesDropdown || defaultHeaderSettings.resourcesDropdown;
  const askEdith = headerSettings?.askEdith || defaultHeaderSettings.askEdith;
  const ctaButtons = headerSettings?.ctaButtons || defaultHeaderSettings.ctaButtons;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-effect border-b border-border shadow-soft" : "bg-background/80 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-1">
            <img src={mednurseLogo} alt={headerSettings?.logo?.altText || "MedNurse Logo"} className="h-14 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {/* Solutions Dropdown */}
            <div className="relative" onMouseEnter={() => setIsSolutionsOpen(true)} onMouseLeave={() => setIsSolutionsOpen(false)}>
              <Link to="/solutions" className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-1 ${isDropdownActive(solutionsDropdown) || isActive("/solutions") ? "text-primary bg-primary-glow font-semibold" : "text-muted-foreground hover:text-primary hover:bg-primary-glow"}`}>
                Solutions <ChevronDown className="w-4 h-4" />
              </Link>
              {isSolutionsOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-card rounded-xl border border-border shadow-lg py-2 animate-slide-up z-50">
                  {solutionsDropdown.map((item) => (
                    <Link key={item.href} to={item.href} className="block px-4 py-3 hover:bg-primary-glow transition-colors">
                      <div className="text-sm font-semibold text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Ask Edith - Highlighted */}
            <Link 
              to="/ask-edith" 
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 ${isActive("/ask-edith") ? "text-destructive bg-destructive/10" : "text-muted-foreground bg-muted/50 hover:text-destructive hover:bg-destructive/10"}`}
            >
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-background shadow-sm ring-1 ring-border">
                <MessageCircle className="w-3.5 h-3.5" />
              </span>
              {askEdith.label}
            </Link>

            {/* Features */}
            <Link to="/nursing-safety-tools" className={`px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${isActive("/nursing-safety-tools") ? "text-primary bg-primary-glow font-semibold" : "text-muted-foreground font-medium hover:text-primary hover:bg-primary-glow"}`}>
              Features
            </Link>

            {/* Plans */}
            <Link to="/plans" className={`px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${isActive("/plans") ? "text-primary bg-primary-glow font-semibold" : "text-muted-foreground font-medium hover:text-primary hover:bg-primary-glow"}`}>
              Plans
            </Link>

            {/* Resources Dropdown */}
            <div className="relative" onMouseEnter={() => setIsResourcesOpen(true)} onMouseLeave={() => setIsResourcesOpen(false)}>
              <Link to="/resources" className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-1 ${isDropdownActive(resourcesDropdown) || isActive("/resources") ? "text-primary bg-primary-glow font-semibold" : "text-muted-foreground hover:text-primary hover:bg-primary-glow"}`}>
                Resources <ChevronDown className="w-4 h-4" />
              </Link>
              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-card rounded-xl border border-border shadow-lg py-2 animate-slide-up z-50">
                  {resourcesDropdown.map((item, index) => (
                    <div key={item.label}>
                      {index === resourcesDropdown.length - 1 && (
                        <div className="my-2 border-t border-border" />
                      )}
                      <Link to={item.href} className="block px-4 py-3 hover:bg-primary-glow transition-colors">
                        <div className="text-sm font-semibold text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <Link to="/about" className={`px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${isActive("/about") ? "text-primary bg-primary-glow font-semibold" : "text-muted-foreground font-medium hover:text-primary hover:bg-primary-glow"}`}>
              About
            </Link>

            {/* Contact */}
            <Link to="/contact" className={`px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${isActive("/contact") ? "text-primary bg-primary-glow font-semibold" : "text-muted-foreground font-medium hover:text-primary hover:bg-primary-glow"}`}>
              Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard"><Button variant="default" size="default" className="gap-2"><LayoutDashboard className="w-4 h-4" />{ctaButtons.dashboard}</Button></Link>
            ) : (
              <>
                <Link to="/auth"><Button variant="ghost" size="default" className="gap-2"><LogIn className="w-4 h-4" />{ctaButtons.signIn}</Button></Link>
                <Link to="/auth?signup=true"><Button variant="outline" size="default" className="gap-2"><UserPlus className="w-4 h-4" />{ctaButtons.signUp}</Button></Link>
                <Link to="/schedule-demo"><Button variant="default" size="default">{ctaButtons.demo}</Button></Link>
              </>
            )}
          </div>

          <button className="lg:hidden p-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-1">
              {/* Ask Edith - Featured Card */}
              <Link 
                to="/ask-edith" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-2 ${isActive("/ask-edith") ? "bg-destructive/15" : "bg-primary/10 hover:bg-primary/20"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-background shadow-sm ring-1 ring-border">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{askEdith.label}</div>
                  <div className="text-xs text-muted-foreground">{askEdith.description}</div>
                </div>
              </Link>

              {/* Solutions Accordion */}
              <details className="group">
                <summary className="px-4 py-3 text-foreground font-semibold rounded-xl hover:bg-primary-glow transition-colors cursor-pointer list-none flex items-center justify-between">
                  <Link to="/solutions" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">Solutions</Link>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-1 space-y-1 px-2 pb-2">
                  {solutionsDropdown.map((item) => (
                    <Link 
                      key={item.href} 
                      to={item.href} 
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary-glow rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>

              {/* Features */}
              <Link 
                to="/nursing-safety-tools" 
                className={`px-4 py-3 rounded-xl transition-colors ${isActive("/nursing-safety-tools") ? "text-primary bg-primary-glow font-semibold" : "text-foreground font-medium hover:bg-primary-glow"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>

              {/* Plans */}
              <Link 
                to="/plans" 
                className={`px-4 py-3 rounded-xl transition-colors ${isActive("/plans") ? "text-primary bg-primary-glow font-semibold" : "text-foreground font-medium hover:bg-primary-glow"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Plans
              </Link>

              {/* Resources Accordion */}
              <details className="group">
                <summary className="px-4 py-3 text-foreground font-semibold rounded-xl hover:bg-primary-glow transition-colors cursor-pointer list-none flex items-center justify-between">
                  <Link to="/resources" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">Resources</Link>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-1 space-y-1 px-2 pb-2">
                  {resourcesDropdown.map((item) => (
                    <Link 
                      key={item.label} 
                      to={item.href} 
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary-glow rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>

              {/* About */}
              <Link 
                to="/about" 
                className={`px-4 py-3 rounded-xl transition-colors ${isActive("/about") ? "text-primary bg-primary-glow font-semibold" : "text-foreground font-medium hover:bg-primary-glow"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Contact */}
              <Link 
                to="/contact" 
                className={`px-4 py-3 rounded-xl transition-colors ${isActive("/contact") ? "text-primary bg-primary-glow font-semibold" : "text-foreground font-medium hover:bg-primary-glow"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* CTA */}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full gap-2">
                      <LayoutDashboard className="w-4 h-4" />{ctaButtons.dashboard}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full gap-2">
                        <LogIn className="w-4 h-4" />{ctaButtons.signIn}
                      </Button>
                    </Link>
                    <Link to="/auth?signup=true" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <UserPlus className="w-4 h-4" />{ctaButtons.signUp}
                      </Button>
                    </Link>
                    <Link to="/schedule-demo" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full">{ctaButtons.demo}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
