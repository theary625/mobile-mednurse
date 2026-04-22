import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'interactive' | 'elevated' | 'outline';

interface DashboardCardProps {
  children: React.ReactNode;
  variant?: Variant;
  to?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const variantStyles: Record<Variant, string> = {
  default: cn(
    "bg-card border border-border/50",
    "shadow-sm"
  ),
  interactive: cn(
    "bg-card border border-border/50",
    "shadow-sm cursor-pointer",
    "hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-primary/20",
    "active:translate-y-0 active:shadow-sm"
  ),
  elevated: cn(
    "bg-card border border-border/30",
    "shadow-[0_4px_16px_rgba(0,0,0,0.06)]",
    "hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)]",
    "active:translate-y-0 active:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
  ),
  outline: cn(
    "bg-transparent border border-border",
    "hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30",
    "active:translate-y-0"
  ),
};

const DashboardCard = forwardRef<HTMLDivElement | HTMLAnchorElement, DashboardCardProps>(
  ({ 
    children, 
    variant = 'default', 
    to, 
    onClick,
    icon: Icon,
    title,
    description,
    className,
    headerClassName,
    bodyClassName,
  }, ref) => {
    const isClickable = to || onClick;
    const resolvedVariant = isClickable && variant === 'default' ? 'interactive' : variant;
    
    const baseStyles = cn(
      "rounded-xl p-4 transition-all duration-200",
      variantStyles[resolvedVariant],
      className
    );

    const content = (
      <>
        {(Icon || title || description) && (
          <div className={cn("flex items-start gap-3 mb-3", headerClassName)}>
            {Icon && (
              <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            {(title || description) && (
              <div className="flex-1 min-w-0">
                {title && <h3 className="font-semibold text-foreground">{title}</h3>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            )}
          </div>
        )}
        <div className={bodyClassName}>{children}</div>
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
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={baseStyles}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {content}
      </div>
    );
  }
);

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
