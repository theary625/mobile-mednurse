import { Link } from 'react-router-dom';
import { Search, Calculator, Wrench, Bell } from 'lucide-react';
import { buttonInteractions } from '@/lib/buttonStyles';

const actions = [
  { 
    label: 'MedCheck', 
    icon: Search, 
    path: '/dashboard/meds',
    iconBg: 'bg-primary-glow',
    iconColor: 'text-primary',
    hoverBg: 'hover:bg-primary-glow'
  },
  { 
    label: 'Calculate', 
    icon: Calculator, 
    path: '/dashboard/calculate',
    iconBg: 'bg-success-glow',
    iconColor: 'text-success',
    hoverBg: 'hover:bg-success-glow'
  },
  { 
    label: 'Toolbox', 
    icon: Wrench, 
    path: '/dashboard/toolbox',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    hoverBg: 'hover:bg-warning/10'
  },
  { 
    label: 'Alerts', 
    icon: Bell, 
    path: '/dashboard/alerts',
    iconBg: 'bg-accent-glow',
    iconColor: 'text-accent',
    hoverBg: 'hover:bg-accent-glow'
  },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link key={action.path} to={action.path}>
          <div className={`group p-5 flex flex-col items-center gap-4 bg-card border border-border/50 rounded-2xl shadow-soft hover:shadow-medium ${buttonInteractions.card} ${action.hoverBg}`}>
            <div className={`w-14 h-14 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className={`w-7 h-7 ${action.iconColor}`} />
            </div>
            <span className="font-semibold text-foreground">{action.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
