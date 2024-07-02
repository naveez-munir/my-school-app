import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { MenuItem as MenuItemType } from "./types";
import { icons } from "./icons";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MenuItemProps {
  item: MenuItemType;
  onClose: () => void;
  isCollapsed?: boolean;
}

// Short label mapping for collapsed mode
const getShortLabel = (label: string): string => {
  const shortLabels: Record<string, string> = {
    'Dashboard': 'Dashboard',
    'Students': 'Students',
    'Teachers': 'Teachers',
    'Classes': 'Classes',
    'Courses': 'Courses',
    'Staff': 'Staff',
    'Leave Management': 'Leave',
    'Staff Leave': 'Staff',
    'Student Leaves': 'Students',
    'Exams': 'Exams',
    'Timetable': 'Timetable',
    'Fee Management': 'Fees',
    'Fee Collection': 'Collection',
    'Fee Structure': 'Structure',
    'Accounts': 'Accounts',
    'Salary': 'Salary',
    'Expenses': 'Expenses',
    'Management': 'Manage',
    'Attendance': 'Attend.',
    'Daily Diary': 'Diary',
    'Profile': 'Profile',
    'Salary Details': 'Salary',
    'Academic Result Section': 'Results',
    'Leave Section': 'Leave',
    'Tenants': 'Tenants',
    'Tenant Configuration': 'Config',
  };

  return shortLabels[label] || (label.length > 8 ? label.slice(0, 8) : label);
};

const MenuItem = ({ item, onClose, isCollapsed = false }: MenuItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const hasChildren = item.children && item.children.length > 0;

  const isActive = (path: string): boolean => {
    // Exact match
    if (location.pathname === path) return true;

    // For /dashboard, only match exact path, not child routes
    if (path === '/dashboard') return false;

    // For other paths, match child routes
    return location.pathname.startsWith(path + '/');
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

  // Collapsed mode: Vertical layout with icon + short label
  if (isCollapsed) {
    return (
      <div className="mb-1">
        <button
          onClick={() =>
            hasChildren ? toggleExpand() : handleNavigation(item.path)
          }
          className={`flex flex-col w-full items-center justify-center gap-1 p-2 rounded-lg transition-colors relative
            ${
              active
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
          <IconComponent size={24} />
          <span className="text-xs leading-tight text-center">
            {getShortLabel(item.label)}
          </span>

          {/* Indicator for expandable items */}
          {hasChildren && (
            <div className="absolute top-1 right-1">
              {expanded ? (
                <ChevronDown size={12} className="opacity-70" />
              ) : (
                <ChevronRight size={12} className="opacity-70" />
              )}
            </div>
          )}
        </button>

        {/* Submenu in collapsed mode */}
        {hasChildren && expanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => {
              const ChildIconComponent =
                icons[child.icon as keyof typeof icons] || icons.settings;

              return (
                <button
                  key={child.path}
                  onClick={() => handleNavigation(child.path)}
                  className={`flex flex-col w-full items-center justify-center gap-1 p-2 rounded-lg transition-colors
                    ${
                      isActive(child.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  <ChildIconComponent size={20} />
                  <span className="text-[10px] leading-tight text-center">
                    {getShortLabel(child.label)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Expanded mode: Horizontal layout (original)
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
