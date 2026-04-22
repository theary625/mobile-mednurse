import { Link } from 'react-router-dom';
import { ClipboardList, Droplets, Scale, ChevronRight, Settings } from 'lucide-react';
import { ClinicalRole } from '@/types/clinical';
import { buttonInteractions } from '@/lib/buttonStyles';

interface RoleToolkitProps {
  role: ClinicalRole;
  lastActivity?: string;
}

// Simplified tool set for the new compact layout
const roleTools: Record<ClinicalRole, { title: string; description: string; icon: React.ElementType; iconBg: string; iconColor: string; path: string }[]> = {
  nursing_student: [
    { title: 'Med Administration', description: 'Quick med admin checklist', icon: ClipboardList, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', path: '/dashboard/meds' },
    { title: 'IV Drip Rate', description: 'Calculate IV drip rates', icon: Droplets, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', path: '/dashboard/calculate' },
    { title: 'Weight-Based Dosing', description: 'Weight-based medication', icon: Scale, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', path: '/dashboard/calculate' },
  ],
  nurse: [
    { title: 'Med Administration', description: 'Quick med admin checklist', icon: ClipboardList, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', path: '/dashboard/meds' },
    { title: 'IV Drip Rate', description: 'Calculate IV drip rates', icon: Droplets, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', path: '/dashboard/calculate' },
    { title: 'Weight-Based Dosing', description: 'Weight-based medication', icon: Scale, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', path: '/dashboard/calculate' },
  ],
  advanced_nurse: [
    { title: 'Med Administration', description: 'Quick med admin checklist', icon: ClipboardList, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', path: '/dashboard/meds' },
    { title: 'IV Drip Rate', description: 'Calculate IV drip rates', icon: Droplets, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', path: '/dashboard/calculate' },
    { title: 'Weight-Based Dosing', description: 'Weight-based medication', icon: Scale, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', path: '/dashboard/calculate' },
  ],
  medical_student: [
    { title: 'Med Administration', description: 'Quick med admin checklist', icon: ClipboardList, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', path: '/dashboard/meds' },
    { title: 'IV Drip Rate', description: 'Calculate IV drip rates', icon: Droplets, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', path: '/dashboard/calculate' },
    { title: 'Weight-Based Dosing', description: 'Weight-based medication', icon: Scale, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', path: '/dashboard/calculate' },
  ],
  resident: [
    { title: 'Med Administration', description: 'Quick med admin checklist', icon: ClipboardList, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', path: '/dashboard/meds' },
    { title: 'IV Drip Rate', description: 'Calculate IV drip rates', icon: Droplets, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', path: '/dashboard/calculate' },
    { title: 'Weight-Based Dosing', description: 'Weight-based medication', icon: Scale, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', path: '/dashboard/calculate' },
  ],
  attending: [
    { title: 'Med Administration', description: 'Quick med admin checklist', icon: ClipboardList, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', path: '/dashboard/meds' },
    { title: 'IV Drip Rate', description: 'Calculate IV drip rates', icon: Droplets, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', path: '/dashboard/calculate' },
    { title: 'Weight-Based Dosing', description: 'Weight-based medication', icon: Scale, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', path: '/dashboard/calculate' },
  ],
  app: [
    { title: 'Med Administration', description: 'Quick med admin checklist', icon: ClipboardList, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', path: '/dashboard/meds' },
    { title: 'IV Drip Rate', description: 'Calculate IV drip rates', icon: Droplets, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', path: '/dashboard/calculate' },
    { title: 'Weight-Based Dosing', description: 'Weight-based medication', icon: Scale, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', path: '/dashboard/calculate' },
  ],
};

const RoleToolkit = ({ role, lastActivity = '15 mins ago' }: RoleToolkitProps) => {
  const tools = roleTools[role] || roleTools.nurse;

  return (
    <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Your Toolkit</h3>
        </div>
        <Link 
          to="/dashboard/toolbox" 
          className={`text-sm text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 transition-colors ${buttonInteractions.subtle}`}
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Up-to-date protocols, calculator used {lastActivity}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <Link 
            key={tool.title} 
            to={tool.path}
            className={`flex flex-col p-4 rounded-xl border border-black/5 bg-white hover:bg-muted/50 hover:border-primary/20 group shadow-sm ${buttonInteractions.card}`}
          >
            <div className={`w-10 h-10 rounded-lg ${tool.iconBg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
              <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
            </div>
            <h4 className="font-semibold text-foreground text-sm">{tool.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoleToolkit;