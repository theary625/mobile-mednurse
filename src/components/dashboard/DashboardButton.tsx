import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface DashboardButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  to?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  showChevron?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<Variant, string> = {
  primary: cn(
    "bg-gradient-to-b from-[#3D5A80] via-[#34506F] to-[#2C4560]",
    "text-white shadow-[0_8px_20px_rgba(44,69,96,0.30),inset_0_1px_0_rgba(255,255,255,0.1)]",
    "ring-1 ring-[#2C4560]/50",
    "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(44,69,96,0.45)]",
    "active:translate-y-0.5 active:shadow-[0_4px_12px_rgba(44,69,96,0.25)]"
  ),
  secondary: cn(
    "bg-[#F8F8F9] text-[#3D4852]",
    "shadow-[0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-[#E2E4E8]",
    "hover:-translate-y-0.5 hover:bg-[#F0F1F3] hover:ring-[#D8DADF] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]",
    "active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(0,0,0,0.03)]"
  ),
  outline: cn(
    "bg-transparent text-muted-foreground",
    "border border-border",
    "hover:-translate-y-0.5 hover:text-foreground hover:border-border/80",
    "active:translate-y-0"
  ),
  ghost: cn(
    "bg-black/5 text-black/60",
    "ring-1 ring-black/5",
    "hover:-translate-y-0.5 hover:bg-black/10",
    "active:translate-y-0"
  ),
};

const chevronStyles: Record<Variant, string> = {
  primary: "bg-white/15 ring-1 ring-white/20 group-hover:bg-white/25",
  secondary: "bg-white ring-1 ring-[#E2E4E8] group-hover:ring-[#D8DADF]",
  outline: "bg-muted/50 ring-1 ring-border",
  ghost: "bg-white/80 ring-1 ring-black/5",
};

const chevronIconColors: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-[#6B7280]",
  outline: "text-muted-foreground",
  ghost: "text-black/50",
};

const DashboardButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, DashboardButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    to, 
    onClick, 
    icon: Icon,
    showChevron = true, 
    className,
    disabled = false,
    type = 'button',
  }, ref) => {
    const baseStyles = cn(
      "group flex h-[52px] items-center justify-between gap-4",
      "rounded-2xl px-5 text-[15px] font-semibold",
      "transition-all duration-150",
      "disabled:opacity-50 disabled:pointer-events-none",
      variantStyles[variant],
      className
    );

    const content = (
      <>
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {children}
        </span>
        {showChevron && (
          <span className={cn(
            "grid h-8 w-8 place-items-center rounded-xl transition-colors",
            chevronStyles[variant]
          )}>
            <ChevronRight className={cn("h-4 w-4", chevronIconColors[variant])} />
          </span>
        )}
      </>
    );

    if (to) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          className={baseStyles}
          onClick={onClick}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={baseStyles}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }
);

DashboardButton.displayName = 'DashboardButton';

export default DashboardButton;
