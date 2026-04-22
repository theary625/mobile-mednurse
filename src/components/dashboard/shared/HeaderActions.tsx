import { Link } from 'react-router-dom';
import { Bell, Sun, Moon, User, Settings, LogOut } from 'lucide-react';
import defaultAvatar from '@/assets/mednurse-heart-transparent.png';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderActionsProps {
  avatarUrl: string | null;
  userInitials: string;
  userRole: string;
  alertCount?: number;
  onLogout: () => void;
  showDropdown?: boolean;
  profileLink?: string;
}

const HeaderActions = ({
  avatarUrl,
  userInitials,
  userRole,
  alertCount = 2,
  onLogout,
  showDropdown = true,
  profileLink = '/dashboard/profile',
}: HeaderActionsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-xl hover:bg-accent-glow"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Notification Bell */}
      <Link to="/dashboard/alerts">
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-accent-glow">
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-semibold shadow-accent">
              {alertCount}
            </span>
          )}
        </Button>
      </Link>

      {/* User Avatar/Dropdown */}
      {showDropdown ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-primary/20">
              <Avatar key={avatarUrl} className="h-10 w-10 border-2 border-border">
                <AvatarImage src={avatarUrl || defaultAvatar} alt="Profile" />
                <AvatarFallback className="bg-white">
                  <img src={defaultAvatar} alt="" className="w-full h-full object-contain p-1" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border border-border shadow-soft" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {userRole}
                </p>
                <p className="text-xs text-muted-foreground">
                  Clinical Platform Member
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted">
              <Link to="/dashboard/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to={profileLink}>
          <Avatar key={avatarUrl} className="h-9 w-9 border-2 border-border">
            <AvatarImage src={avatarUrl || defaultAvatar} alt="Profile" />
            <AvatarFallback className="bg-white">
              <img src={defaultAvatar} alt="" className="w-full h-full object-contain p-1" />
            </AvatarFallback>
          </Avatar>
        </Link>
      )}
    </div>
  );
};

export default HeaderActions;
