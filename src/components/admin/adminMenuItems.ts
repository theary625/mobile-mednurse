import { 
  Users, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  FileText, 
  Pill, 
  Mail, 
  Globe, 
  LayoutDashboard, 
  Wrench, 
  Quote, 
  History, 
  Crown,
  Building2,
  Ticket,
  Database,
  Megaphone,
  ShieldCheck,
  Headphones,
  Home,
  GraduationCap,
  ImageIcon,
  CalendarDays,
  type LucideIcon 
} from "lucide-react";
import { BrandHeartIcon } from "@/components/icons/MedicalSystemIcons";

export type AppRole = 'super_admin' | 'admin' | 'moderator' | 'support' | 'user';

export type SectionKey = 'dashboard' | 'marketing' | 'users' | 'product' | 'analytics' | 'support' | 'system';

export interface AdminMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  roles: AppRole[];
  badge?: string;
  section: SectionKey;
}

export interface AdminSection {
  key: SectionKey;
  label: string;
  icon: LucideIcon;
}

export const adminSections: AdminSection[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'marketing', label: 'Marketing', icon: Megaphone },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'product', label: 'Product', icon: Pill },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'support', label: 'Support', icon: Headphones },
  { key: 'system', label: 'System', icon: ShieldCheck },
];

export const adminMenuItems: AdminMenuItem[] = [
  // Dashboard
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'moderator', 'support'], section: 'dashboard' },
  
  // Marketing
  { id: 'landing', label: 'Landing Page', icon: Home, roles: ['super_admin', 'admin', 'moderator'], section: 'marketing' },
  { id: 'pages', label: 'Website Pages', icon: Globe, roles: ['super_admin', 'admin', 'moderator'], section: 'marketing' },
  { id: 'media', label: 'Media Library', icon: ImageIcon, roles: ['super_admin', 'admin', 'moderator'], section: 'marketing', badge: 'Batch' },
  { id: 'blog', label: 'Blog', icon: FileText, roles: ['super_admin', 'admin', 'moderator'], section: 'marketing' },
  { id: 'testimonials', label: 'Testimonials', icon: Quote, roles: ['super_admin', 'admin', 'moderator'], section: 'marketing' },
  
  // Users
  { id: 'users', label: 'Enterprise Team', icon: Building2, roles: ['super_admin', 'admin', 'moderator', 'support'], section: 'users' },
  { id: 'clients', label: 'Clients/Members', icon: BrandHeartIcon as unknown as LucideIcon, roles: ['super_admin', 'admin', 'moderator', 'support'], section: 'users' },
  { id: 'membership', label: 'Membership', icon: Crown, roles: ['super_admin', 'admin'], badge: 'New', section: 'users' },
  { id: 'coupons', label: 'Coupon Codes', icon: Ticket, roles: ['super_admin', 'admin'], section: 'users' },
  
  // Product
  { id: 'medications', label: 'Medications', icon: Pill, roles: ['super_admin', 'admin', 'moderator'], section: 'product' },
  { id: 'data-quality', label: 'Data Quality', icon: Database, roles: ['super_admin', 'admin'], section: 'product' },
  { id: 'med-data', label: 'Med Data Sync', icon: Database, roles: ['super_admin', 'admin'], section: 'product' },
  { id: 'toolbox', label: 'Toolbox', icon: Wrench, roles: ['super_admin', 'admin', 'moderator'], section: 'product' },
  { id: 'ce-courses', label: 'CE Courses', icon: GraduationCap, roles: ['super_admin', 'admin'], badge: 'New', section: 'product' },
  
  // Analytics
  { id: 'website', label: 'Website Stats', icon: Globe, roles: ['super_admin', 'admin', 'moderator'], section: 'analytics' },
  { id: 'analytics', label: 'User Analytics', icon: BarChart3, roles: ['super_admin', 'admin', 'moderator'], section: 'analytics' },
  
  // Support
  { id: 'contact', label: 'Contact', icon: Mail, roles: ['super_admin', 'admin', 'moderator', 'support'], section: 'support' },
  { id: 'support', label: 'Support Tickets', icon: MessageSquare, roles: ['super_admin', 'admin', 'moderator', 'support'], section: 'support' },
  { id: 'demo-bookings', label: 'Demo Bookings', icon: CalendarDays, roles: ['super_admin', 'admin', 'moderator', 'support'], section: 'support' },
  
  // System
  { id: 'activity', label: 'Activity Logs', icon: History, roles: ['super_admin', 'admin'], section: 'system' },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['super_admin', 'admin'], section: 'system' },
];

export const getFilteredMenuItems = (userRole: AppRole): AdminMenuItem[] => {
  return adminMenuItems.filter(item => item.roles.includes(userRole));
};

export const getFilteredSections = (userRole: AppRole): { section: AdminSection; items: AdminMenuItem[] }[] => {
  const filteredItems = getFilteredMenuItems(userRole);
  
  return adminSections
    .map(section => ({
      section,
      items: filteredItems.filter(item => item.section === section.key)
    }))
    .filter(group => group.items.length > 0);
};

export const getScreenNameByTab = (activeTab: string): string => {
  const currentItem = adminMenuItems.find(item => item.id === activeTab);
  return currentItem?.label || 'Overview';
};
