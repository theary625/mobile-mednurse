import { type LucideIcon } from "lucide-react";

interface AdminNavItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  isActive: boolean;
  onClick: () => void;
}

const AdminNavItem = ({ id, label, icon: Icon, badge, isActive, onClick }: AdminNavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ease-in-out ${
        isActive
          ? 'bg-white text-[#1d1d1f] shadow-sm'
          : 'text-[#6e6e73] hover:bg-[#C62828] hover:text-white hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-[#007aff]' : 'text-[#86868b]'}`} />
        <span className={`text-[15px] tracking-[-0.01em] ${isActive ? 'font-medium' : 'font-normal'}`}>
          {label}
        </span>
      </div>
      {badge && (
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#30d158]/10 text-[#30d158]">
          {badge}
        </span>
      )}
    </button>
  );
};

export default AdminNavItem;
