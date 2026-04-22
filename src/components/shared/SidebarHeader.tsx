import { Link } from 'react-router-dom';
import mednurseLogo from '@/assets/mednurse-logo-sidebar.jpeg';

interface SidebarHeaderProps {
  screenName: string;
  linkTo?: string;
  onLogoClick?: () => void;
  variant?: 'dashboard' | 'admin';
}

const SidebarHeader = ({ 
  screenName, 
  linkTo = '/dashboard', 
  onLogoClick,
  variant = 'dashboard'
}: SidebarHeaderProps) => {
  const isAdmin = variant === 'admin';
  
  return (
    <>
      {/* Logo */}
      <div className={`border-b bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ${
        isAdmin ? 'border-[#f0f0f0]' : 'border-border/50'
      }`}>
        <Link to={linkTo} className="block" onClick={onLogoClick}>
          <img src={mednurseLogo} alt="MedNurse" className="w-full h-auto object-cover" />
        </Link>
      </div>

      {/* Screen Name */}
      <div className={`py-3 border-b ${
        isAdmin 
          ? 'px-6 border-[#f0f0f0]' 
          : 'px-5 border-border/50'
      }`}>
        <p className={`font-medium ${
          isAdmin 
            ? 'text-[13px] text-[#86868b]' 
            : 'text-sm text-muted-foreground'
        }`}>
          {screenName}
        </p>
      </div>
    </>
  );
};

export default SidebarHeader;
