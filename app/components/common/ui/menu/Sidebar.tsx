import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router'
import { 
  ChevronDown, 
  ChevronRight,
  X,
  Home,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Settings,
  GraduationCap,
  FileText,
  Award,
} from 'lucide-react';

export type MenuItem = {
  name: string;
  label: string;
  path: string;
  icon: keyof typeof icons;
  children?: MenuItem[];
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map of icon names to their components
const icons = {
  home: Home,
  users: Users,
  bookOpen: BookOpen,
  calendar: Calendar,
  clipboardCheck: ClipboardCheck,
  settings: Settings,
  graduationCap: GraduationCap,
  fileText: FileText,
  award: Award
};

// Define menu structure here for easy maintenance
const MENU_ITEMS: MenuItem[] = [
  { 
    name: 'home', 
    label: 'Home', 
    path: '/dashboard',
    icon: 'home'
  },
  { 
    name: 'students', 
    label: 'Students', 
    path: '/dashboard/students',
    icon: 'users'
  },
  { 
    name: 'teachers', 
    label: 'Teachers', 
    path: '/dashboard/teachers',
    icon: 'users'
  },
  { 
    name: 'classes', 
    label: 'Classes', 
    path: '/dashboard/classes',
    icon: 'bookOpen'
  },
  { 
    name: 'courses', 
    label: 'Courses', 
    path: '/dashboard/courses',
    icon: 'bookOpen'
  },
  { 
    name: 'exams', 
    label: 'Examination', 
    path: '/dashboard/exams',
    icon: 'graduationCap',
    children: [
      { 
        name: 'exam-types', 
        label: 'Exam Types', 
        path: '/dashboard/exam-types',
        icon: 'award'
      },
      { 
        name: 'exams-list', 
        label: 'Exams', 
        path: '/dashboard/exams',
        icon: 'graduationCap'
      },
      { 
        name: 'results', 
        label: 'Results', 
        path: '/dashboard/exams/results',
        icon: 'fileText'
      }
    ]
  },
  { 
    name: 'management', 
    label: 'Management', 
    path: '/dashboard/management',
    icon: 'calendar'
  },
  { 
    name: 'attendance', 
    label: 'Attendance', 
    path: '/dashboard/attendance',
    icon: 'clipboardCheck'
  },
];

const SETTINGS_ITEMS: MenuItem[] = [
  { 
    name: 'settings', 
    label: 'Settings', 
    path: '/dashboard/settings',
    icon: 'settings'
  }
];

// Render an icon from our icon map with consistent sizing
const renderIcon = (iconName: keyof typeof icons, isSubmenu = false) => {
  const IconComponent = icons[iconName];
  return <IconComponent size={isSubmenu ? 18 : 20} />;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const handleNavigation = (path: string) => {
    navigate(path);
    
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Check if current path or any child path is active
  const isActive = (item: MenuItem): boolean => {
    if (location.pathname === item.path) {
      return true;
    }
    
    if (item.children) {
      return item.children.some(child => 
        location.pathname === child.path || 
        (child.path !== '/dashboard/exams' && location.pathname.startsWith(child.path))
      );
    }
    
    return false;
  };

  // Check if submenu should be expanded
  const isExpanded = (item: MenuItem): boolean => {
    if (expandedMenus[item.name]) {
      return true;
    }
    
    if (item.children) {
      // Auto-expand if a child is active
      return item.children.some(child => 
        location.pathname === child.path || 
        (child.path !== '/dashboard/exams' && location.pathname.startsWith(child.path))
      );
    }
    
    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item);
    const expanded = isExpanded(item);
    
    return (
      <div key={item.path} className="mb-1">
        <button
          onClick={() => hasChildren ? toggleSubmenu(item.name) : handleNavigation(item.path)}
          className={`flex w-full items-center justify-between p-3 rounded-lg transition-colors
            ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
        >
          <div className="flex items-center gap-3">
            {renderIcon(item.icon)}
            <span>{item.label}</span>
          </div>
          
          {hasChildren && (
            expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
        </button>
        
        {/* Submenu */}
        {hasChildren && expanded && (
          <div className="pl-4 mt-1 space-y-1">
            {item.children?.map(child => (
              <button
                key={child.path}
                onClick={() => handleNavigation(child.path)}
                className={`flex w-full items-center gap-3 p-2 rounded-lg transition-colors
                  ${location.pathname === child.path || 
                    (child.path !== '/dashboard/exams' && location.pathname.startsWith(child.path)) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                {renderIcon(child.icon, true)}
                <span>{child.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}
    
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-4 border-b pt-6">
          <h2 className="text-xl font-bold text-blue-600">School Admin</h2>
          <button 
            onClick={onClose}
            className="lg:hidden"
          >
            <X size={24} color='black' />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="p-4 space-y-1">
          {MENU_ITEMS.map(renderMenuItem)}
        </nav>
        
        {/* Settings Menu (Separated) */}
        <div className="p-4 pt-4 mt-2 border-t">
          {SETTINGS_ITEMS.map(renderMenuItem)}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
