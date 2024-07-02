import { LogOut, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { SidebarProps } from "./types";
import { MENU_ITEMS } from "./menuConfig";
import MenuItem from "./MenuItem";
import { logout, getTenantName } from "~/utils/auth";
import { useEffect, useState } from "react";

const getRoleTitle = (role: string): string => {
  switch (role) {
    case "super_admin":
      return "Super Admin Portal";
    case "superAdmin":
      return "Super Admin Portal";
    case "tenant_admin":
      return "Tenant Admin Portal";
    case "admin":
      return "Admin Portal";
    case "principal":
      return "Principal Portal";
    case "teacher":
      return "Teacher Portal";
    case "student":
      return "Student Portal";
    case "guardian":
      return "Guardian Portal";
    case "parent":
      return "Parent Portal";
    case "accountant":
      return "Accountant Portal";
    case "librarian":
      return "Library Portal";
    case "driver":
      return "Transport Portal";
    case "security":
      return "Security Portal";
    case "cleaner":
      return "Maintenance Portal";
    default:
      return "Portal";
  }
};

const getShortRoleTitle = (role: string): string => {
  switch (role) {
    case "super_admin":
    case "superAdmin":
      return "Super Admin";
    case "tenant_admin":
      return "Tenant";
    case "admin":
      return "Admin";
    case "principal":
      return "Principal";
    case "teacher":
      return "Teacher";
    case "student":
      return "Student";
    case "guardian":
      return "Guardian";
    case "parent":
      return "Parent";
    case "accountant":
      return "Account";
    case "librarian":
      return "Library";
    case "driver":
      return "Transport";
    case "security":
      return "Security";
    case "cleaner":
      return "Maintain";
    default:
      return "Portal";
  }
};

const Sidebar = ({ isOpen, onClose, userRole }: SidebarProps) => {
  const [tenantName, setTenantName] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    // Load collapsed state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return true;
  });

  useEffect(() => {
    const tenant = getTenantName();
    if (tenant) {
      setTenantName(tenant);
    }
  }, []);

  const filteredMenuItems = MENU_ITEMS.filter((item) =>
    item.roles?.includes(userRole)
  );

  const handleLogout = () => {
    logout();
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newState));
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}
      <aside
        className={`
        fixed top-0 left-0 z-30 h-full bg-white shadow-lg transform transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${isCollapsed ? "w-20" : "w-64"}
      `}
      >
        {/* Header */}
        <div className="border-b">
          <div className="h-[73px] px-4 py-3 flex items-center">
            <div className="flex items-center justify-between w-full">
            {isCollapsed ? (
              // Collapsed: Vertical layout with short title
              <div className="flex-1 flex flex-col items-center">
                <h2 className="text-xs font-semibold text-blue-600 leading-tight text-center">
                  {getShortRoleTitle(userRole)}
                </h2>
                {tenantName && (
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight text-center truncate w-full">
                    {tenantName.split(' ')[0]}
                  </p>
                )}
              </div>
            ) : (
              // Expanded: Normal layout
              <div className="flex-1">
                <h2 className="text-base font-semibold text-blue-600 leading-tight">
                  {getRoleTitle(userRole)}
                </h2>
                {tenantName && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{tenantName}</p>
                )}
              </div>
            )}

            {/* Close button (mobile only) */}
            <button onClick={onClose} className="lg:hidden ml-2 flex-shrink-0">
              <X size={20} className="text-gray-500" />
            </button>

            {/* Toggle collapse button (desktop only) */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block ml-2 flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight size={18} className="text-gray-500" />
              ) : (
                <ChevronLeft size={18} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 overflow-y-auto flex-grow px-2 py-2">
          {filteredMenuItems.map((item) => (
            <MenuItem
              key={item.name}
              item={item}
              onClose={onClose}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t sticky bottom-0 bg-white ${isCollapsed ? 'px-2' : ''}`}>
          <button
            onClick={handleLogout}
            className={`flex w-full items-center rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700
              ${isCollapsed ? 'flex-col gap-1 p-2 justify-center' : 'gap-3 p-3'}
            `}
          >
            <LogOut size={isCollapsed ? 24 : 20} />
            <span className={isCollapsed ? 'text-xs leading-tight' : ''}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
