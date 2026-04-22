import { type AppRole } from "./adminMenuItems";

interface AdminRoleIndicatorProps {
  userRole: AppRole;
}

const AdminRoleIndicator = ({ userRole }: AdminRoleIndicatorProps) => {
  return (
    <div className="px-6 py-5 border-b border-[#f0f0f0]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#007aff] flex items-center justify-center">
          <span className="text-white text-sm font-semibold uppercase">
            {userRole.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-[13px] text-[#86868b]">Signed in as</p>
          <p className="text-[15px] font-medium text-[#1d1d1f] capitalize">{userRole}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminRoleIndicator;
