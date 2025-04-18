import { LogOut, X } from "lucide-react";
import type { SidebarProps } from "./types";
import { MENU_ITEMS } from "./menuConfig";
import MenuItem from "./MenuItem";
import { logout } from "~/utils/auth";

const getRoleTitle = (role: string): string => {
  switch (role) {
    case "superAdmin":
      return "Super Admin";
    case "admin":
      return "School Admin";
    case "teacher":
      return "Teacher Portal";
    case "student":
      return "Student Portal";
    case "staff":
      return "Staff Portal";
    default:
      return "Portal test";
  }
};

const Sidebar = ({ isOpen, onClose, userRole }: SidebarProps) => {
  const filteredMenuItems = MENU_ITEMS.filter((item) =>
    item.roles?.includes(userRole)
  );

  const handleLogout = () => {
    logout();
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}
      <aside
        className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      >
        <div className="flex items-center justify-between p-4 border-b pt-6">
          <h2 className="text-xl font-bold text-blue-600">
            {getRoleTitle(userRole)}
          </h2>
          <button onClick={onClose} className="lg:hidden">
            <X size={24} color="black" />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto flex-grow">
          {filteredMenuItems.map((item) => (
            <MenuItem key={item.name} item={item} onClose={onClose} />
          ))}
        </nav>

        <div className="p-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
