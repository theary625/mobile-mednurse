import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnacknowledgedAlerts } from '@/hooks/useUnacknowledgedAlerts';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { ClinicianProfile, roleLabels } from '@/types/clinical';
import DashboardSidebar from './shared/DashboardSidebar';
import HeaderActions from './shared/HeaderActions';
import AccountSwitcher from './AccountSwitcher';

interface DashboardLayoutProps {
  children: ReactNode;
  profile: ClinicianProfile | null;
}

const DashboardLayout = ({ children, profile }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { alertCount } = useUnacknowledgedAlerts();
  
  // Use centralized profile context instead of local state
  const { avatarUrl, userInitials } = useUserProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out successfully' });
    navigate('/');
  };

  const userRole = profile ? roleLabels[profile.clinical_role] : 'User';
  const roleLabel = profile ? roleLabels[profile.clinical_role] : 'User';

  return (
    <div className="min-h-screen bg-muted flex w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border/50 bg-card flex-col fixed h-screen shadow-soft">
        <DashboardSidebar
          avatarUrl={avatarUrl}
          userInitials={userInitials}
          userRole={userRole}
          roleLabel={roleLabel}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-soft">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                <DashboardSidebar
                  avatarUrl={avatarUrl}
                  userInitials={userInitials}
                  userRole={userRole}
                  roleLabel={roleLabel}
                  onNavClick={() => setMobileOpen(false)}
                  onLogout={handleLogout}
                />
              </SheetContent>
            </Sheet>

            {/* Header Title + Account Switcher */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="font-semibold text-foreground text-sm">MedNurse</span>
              </div>
              <AccountSwitcher />
            </div>

            {/* Header Actions */}
            <HeaderActions
              avatarUrl={avatarUrl}
              userInitials={userInitials}
              userRole={userRole}
              alertCount={alertCount}
              onLogout={handleLogout}
              showDropdown={true}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
