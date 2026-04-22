import { cn } from '@/lib/utils';
import { IVDripIcon, IVPushIcon, IVPiggybackIcon } from '@/components/icons/CustomIcons';

export type IVMethod = 'Push' | 'Infusion' | 'Piggyback';

interface IVMethodSelectorProps {
  availableMethods: IVMethod[];
  selectedMethod: IVMethod | null;
  onMethodChange: (method: IVMethod) => void;
}

const methodConfig: Record<IVMethod, {
  icon: typeof IVPushIcon;
  label: string;
  bgColor: string;
  borderColor: string;
  activeColor: string;
  textColor: string;
}> = {
  Push: {
    icon: IVPushIcon,
    label: 'Push',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-700',
    activeColor: 'bg-amber-500 text-white border-amber-500',
    textColor: 'text-amber-700 dark:text-amber-300',
  },
  Infusion: {
    icon: IVDripIcon,
    label: 'Infusion',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-700',
    activeColor: 'bg-blue-500 text-white border-blue-500',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  Piggyback: {
    icon: IVPiggybackIcon,
    label: 'Piggyback',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-700',
    activeColor: 'bg-emerald-500 text-white border-emerald-500',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
};

const IVMethodSelector = ({ 
  availableMethods, 
  selectedMethod, 
  onMethodChange 
}: IVMethodSelectorProps) => {
  if (availableMethods.length <= 1) {
    return null;
  }

  return (
    <div className="mt-3 mb-2">
      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
        IV Administration Method
      </p>
      <div className="flex gap-2 flex-wrap">
        {availableMethods.map((method) => {
          const config = methodConfig[method];
          const IconComponent = config.icon;
          const isSelected = selectedMethod === method;

          return (
            <button
              key={method}
              onClick={() => onMethodChange(method)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                "text-sm font-medium",
                isSelected 
                  ? config.activeColor
                  : cn(config.bgColor, config.borderColor, config.textColor, "hover:opacity-80")
              )}
            >
              <IconComponent size={18} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IVMethodSelector;
