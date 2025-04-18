import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { MenuItem as MenuItemType } from "./types";
import { icons } from "./icons";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MenuItemProps {
  item: MenuItemType;
  onClose: () => void;
}

const MenuItem = ({ item, onClose }: MenuItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const hasChildren = item.children && item.children.length > 0;

  const isActive = (path: string): boolean => {
    return (
      location.pathname === path ||
      (path !== "/dashboard/exams" && location.pathname.startsWith(path))
    );
  };

  const active =
    isActive(item.path) ||
    (hasChildren && item.children?.some((child) => isActive(child.path)));

  useState(() => {
    if (hasChildren && item.children?.some((child) => isActive(child.path))) {
      setExpanded(true);
    }
  });

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const IconComponent =
    icons[item.icon as keyof typeof icons] || icons.settings;

  return (
    <div className="mb-1">
      <button
        onClick={() =>
          hasChildren ? toggleExpand() : handleNavigation(item.path)
        }
        className={`flex w-full items-center justify-between p-3 rounded-lg transition-colors
          ${
            active
              ? "bg-blue-100 text-blue-600"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
      >
        <div className="flex items-center gap-3">
          <IconComponent size={20} />
          <span>{item.label}</span>
        </div>

        {hasChildren &&
          (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </button>

      {/* Submenu */}
      {hasChildren && expanded && (
        <div className="pl-4 mt-1 space-y-1">
          {item.children?.map((child) => {
            const ChildIconComponent =
              icons[child.icon as keyof typeof icons] || icons.settings;

            return (
              <button
                key={child.path}
                onClick={() => handleNavigation(child.path)}
                className={`flex w-full items-center gap-3 p-2 rounded-lg transition-colors
                  ${
                    isActive(child.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                <ChildIconComponent size={18} />
                <span>{child.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
