import { Link, useLocation } from 'react-router-dom';
import { Shield, ChevronLeft, LogOut } from 'lucide-react';
import defaultAvatar from '@/assets/mednurse-heart-transparent.png';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navSections } from './navItems';
import SidebarHeader from '@/components/shared/SidebarHeader';

interface DashboardSidebarProps {
  avatarUrl: string | null;
  userInitials: string;
  userRole: string;
  roleLabel: string;
  onNavClick?: () => void;
  onLogout: () => void;
}

const DashboardSidebar = ({
  avatarUrl,
  userInitials,
  userRole,
  roleLabel,
  onNavClick,
  onLogout,
}: DashboardSidebarProps) => {
  const location = useLocation();

  // Get current screen name based on path
  const getScreenName = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/medications')) return 'Medications';
    if (path.includes('/interactions')) return 'Interactions';
    if (path.includes('/calculate')) return 'Calculators';
    if (path.includes('/iv-reference')) return 'IV Reference';
    if (path.includes('/toolbox')) return 'Toolbox';
    if (path.includes('/protocols')) return 'Protocols';
    if (path.includes('/alerts')) return 'Alerts';
    if (path.includes('/ask-edith')) return 'Ask Edith';
    if (path.includes('/favorites')) return 'Favorites';
    if (path.includes('/learning')) return 'Learning';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/pediatrics')) return 'Pediatrics';
    if (path.includes('/geriatrics')) return 'Geriatrics';
    if (path.includes('/obstetrics')) return 'Obstetrics';
    return 'Dashboard';
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <SidebarHeader 
        screenName={getScreenName()} 
        linkTo="/dashboard" 
        onLogoClick={onNavClick}
        variant="dashboard"
      />

      {/* User Info & Role Badge */}
      <div className="px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <Link to="/dashboard/profile" onClick={onNavClick}>
            <Avatar key={avatarUrl} className="h-10 w-10 border-2 border-primary/20 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
              <AvatarImage src={avatarUrl || defaultAvatar} alt="Profile" />
              <AvatarFallback className="bg-white">
                <img src={defaultAvatar} alt="" className="w-full h-full object-contain p-1" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link to="/dashboard/profile" onClick={onNavClick} className="hover:text-primary transition-colors">
              <p className="text-sm font-medium text-foreground truncate">
                {userRole}
              </p>
            </Link>
            <p className="text-xs text-muted-foreground">Clinical Member</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-xl">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? 'mt-4' : ''}>
            {/* Section Header */}
            <div className="flex items-center gap-2 px-4 py-2 mb-1">
              {section.icon && (
                <section.icon className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </span>
            </div>
            
            {/* Section Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavClick}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out ${
                      isActive 
                        ? 'bg-[#C62828] text-white font-medium shadow-lg shadow-[#C62828]/40 border-l-4 border-white/50' 
                        : 'text-foreground hover:bg-[#C62828] hover:text-white hover:translate-x-1 hover:shadow-md'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 transition-all duration-200 ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="px-3 py-4 border-t border-border/50 space-y-0.5">
        <Link 
          to="/" 
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all"
        >
          <ChevronLeft className="w-[18px] h-[18px]" />
          <span className="text-sm">Back to Site</span>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
          onClick={onLogout}
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
