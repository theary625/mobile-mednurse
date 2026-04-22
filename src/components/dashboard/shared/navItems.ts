import { 
  Home, 
  Pill, 
  Calculator, 
  BriefcaseMedical, 
  Bell, 
  BookOpen, 
  User,
  AlertTriangle,
  Syringe,
  Heart,
  Users,
  MessageCircle,
  Award,
  LucideIcon
} from 'lucide-react';
import { PregnantWomanIcon, ElderlyPersonIcon, PediatricIcon } from '@/components/icons/CustomIcons';
import { ComponentType, SVGProps } from 'react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
}

export interface NavSection {
  title: string;
  icon?: LucideIcon;
  items: NavItem[];
}

export const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/dashboard/meds', label: 'MedCheck', icon: Pill },
  { path: '/dashboard/interactions', label: 'Interactions', icon: AlertTriangle },
  { path: '/dashboard/iv-reference', label: 'IV Reference', icon: Syringe },
  { path: '/dashboard/calculate', label: 'Calculate', icon: Calculator },
  { path: '/dashboard/toolbox', label: 'Toolbox', icon: BriefcaseMedical },
  { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { path: '/dashboard/ce', label: 'CE Courses', icon: Award },
  { path: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { path: '/dashboard/profile', label: 'Profile', icon: User },
];

export const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { path: '/dashboard', label: 'Home', icon: Home },
      { path: '/dashboard/ask-edith', label: 'Ask Edith', icon: MessageCircle },
      { path: '/dashboard/meds', label: 'MedCheck', icon: Pill },
      { path: '/dashboard/interactions', label: 'Interactions', icon: AlertTriangle },
      { path: '/dashboard/iv-reference', label: 'IV Reference', icon: Syringe },
      { path: '/dashboard/calculate', label: 'Calculate', icon: Calculator },
      { path: '/dashboard/toolbox', label: 'Toolbox', icon: BriefcaseMedical },
    ],
  },
  {
    title: 'Special Populations',
    icon: Users,
    items: [
      { path: '/dashboard/pediatrics', label: 'Pediatrics', icon: PediatricIcon },
      { path: '/dashboard/geriatrics', label: 'Geriatrics', icon: ElderlyPersonIcon },
      { path: '/dashboard/obstetrics', label: 'Obstetrics', icon: PregnantWomanIcon },
    ],
  },
  {
    title: 'Activity',
    items: [
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
      { path: '/dashboard/ce', label: 'CE Courses', icon: Award },
      { path: '/dashboard/favorites', label: 'Favorites', icon: Heart },
      { path: '/dashboard/profile', label: 'Profile', icon: User },
    ],
  },
];
