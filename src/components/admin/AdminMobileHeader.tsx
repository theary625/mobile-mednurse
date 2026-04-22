import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarHeader from "@/components/shared/SidebarHeader";
import AdminNavItem from "./AdminNavItem";
import AdminRoleIndicator from "./AdminRoleIndicator";
import AdminFooterActions from "./AdminFooterActions";
import mednurseLogo from "@/assets/mednurse-logo-sidebar.jpeg";
import { type AppRole, getFilteredMenuItems, getScreenNameByTab } from "./adminMenuItems";

interface AdminMobileHeaderProps {
  userRole: AppRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminMobileHeader = ({ userRole, activeTab, setActiveTab }: AdminMobileHeaderProps) => {
  const [open, setOpen] = useState(false);

  const filteredItems = getFilteredMenuItems(userRole);

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    setOpen(false);
  };

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-[#f0f0f0]">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="block flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <img src={mednurseLogo} alt="MedNurse" className="w-full max-w-[140px] h-auto object-cover" />
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5 text-[#1d1d1f]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-0 bg-[#fafafa]">
            <div className="flex flex-col h-full">
              <SidebarHeader 
                screenName={getScreenNameByTab(activeTab)} 
                linkTo="/" 
                variant="admin"
              />
              <div className="flex items-center justify-end px-4 py-2">
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <AdminRoleIndicator userRole={userRole} />

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {filteredItems.map((item) => (
                  <AdminNavItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                    isActive={activeTab === item.id}
                    onClick={() => handleItemClick(item.id)}
                  />
                ))}
              </nav>

              <AdminFooterActions onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default AdminMobileHeader;
