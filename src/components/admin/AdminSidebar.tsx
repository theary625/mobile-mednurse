import { useState } from "react";
import SidebarHeader from "@/components/shared/SidebarHeader";
import AdminNavItem from "./AdminNavItem";
import AdminRoleIndicator from "./AdminRoleIndicator";
import AdminFooterActions from "./AdminFooterActions";
import { type AppRole, getFilteredSections, getScreenNameByTab } from "./adminMenuItems";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userRole: AppRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ userRole, activeTab, setActiveTab }: AdminSidebarProps) => {
  const sectionGroups = getFilteredSections(userRole);
  
  // Initialize all sections as open
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sectionGroups.forEach(({ section }) => {
      initial[section.key] = true;
    });
    return initial;
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-[#fafafa] border-r border-[#f0f0f0]">
      <div className="flex flex-col h-full">
        <SidebarHeader 
          screenName={getScreenNameByTab(activeTab)} 
          linkTo="/" 
          variant="admin"
        />

        <AdminRoleIndicator userRole={userRole} />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sectionGroups.map(({ section, items }) => (
            <Collapsible
              key={section.key}
              open={openSections[section.key]}
              onOpenChange={() => toggleSection(section.key)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#86868b] uppercase tracking-wider hover:text-[#1d1d1f] transition-colors rounded-lg hover:bg-[#f0f0f0]">
                <div className="flex items-center gap-2">
                  <section.icon className="w-3.5 h-3.5" />
                  <span>{section.label}</span>
                </div>
                <ChevronDown 
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    openSections[section.key] ? "rotate-0" : "-rotate-90"
                  )} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-0.5 mt-1">
                {items.map((item) => (
                  <AdminNavItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>

        <AdminFooterActions />
      </div>
    </aside>
  );
};

export default AdminSidebar;
