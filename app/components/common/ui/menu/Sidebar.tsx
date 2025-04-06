import { useState, useEffect } from 'react';
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
  Book,
  Briefcase,
  DollarSign,
  CreditCard,
  Clock,
  FileSpreadsheet,
  UserCheck,
  ClipboardList,
  Receipt,
  PieChart,
  ListChecks,
  Building,
  Cog,
  LogOut
} from 'lucide-react';
import { isSuperAdmin, logout } from '~/utils/auth';

export type MenuItem = {
  name: string;
  label: string;
  path: string;
  icon: keyof typeof icons;
  children?: MenuItem[];
  showForSuperAdmin?: boolean;
  hideForSuperAdmin?: boolean;
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


const icons = {
  home: Home,
  users: Users,
  bookOpen: BookOpen,
  calendar: Calendar,
  clipboardCheck: ClipboardCheck,
  settings: Settings,
  graduationCap: GraduationCap,
  fileText: FileText,
  award: Award,
  book: Book,
  briefcase: Briefcase,
  dollarSign: DollarSign,
  creditCard: CreditCard,
  clock: Clock,
  fileSpreadsheet: FileSpreadsheet,
  userCheck: UserCheck,
  clipboardList: ClipboardList,
  receipt: Receipt,
  pieChart: PieChart,
  listChecks: ListChecks,
  building: Building,
  cog: Cog,
  logOut: LogOut
};

const SUPER_ADMIN_MENU_ITEMS: MenuItem[] = [
  { 
    name: 'home', 
    label: 'Dashboard', 
    path: '/admin/dashboard',
    icon: 'home'
  },
  { 
    name: 'tenants', 
    label: 'Tenants', 
    path: '/admin/tenants',
    icon: 'building',
    showForSuperAdmin: true
  },
  { 
    name: 'tenantConfig', 
    label: 'Tenant Configuration', 
    path: '/admin/tenant-config',
    icon: 'cog',
    showForSuperAdmin: true
  }
];

const TENANT_MENU_ITEMS: MenuItem[] = [
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
    name: 'staffSection', 
    label: 'Staff', 
    path: '/dashboard/staff',
    icon: 'briefcase',
  },
  { 
    name: 'leaveSection', 
    label: 'Leave Management', 
    path: '/dashboard/leave',
    icon: 'clock',
    children: [
      { 
        name: 'staff-leave', 
        label: 'Staff Leave', 
        path: '/dashboard/leave/staff',
        icon: 'userCheck'
      },
      { 
        name: 'student-leave', 
        label: 'Student Leave', 
        path: '/dashboard/leave/student',
        icon: 'users'
      }
    ]
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
    name: 'feeSection', 
    label: 'Fee Management', 
    path: '/dashboard/fee',
    icon: 'dollarSign',
    children: [
      { 
        name: 'fee-category', 
        label: 'Fee Category', 
        path: '/dashboard/fee/category',
        icon: 'fileSpreadsheet'
      },
      { 
        name: 'fee-payment', 
        label: 'Fee Payment', 
        path: '/dashboard/fee/payment',
        icon: 'creditCard'
      },
      { 
        name: 'fee-structure', 
        label: 'Fee Structure', 
        path: '/dashboard/fee/structure',
        icon: 'receipt'
      },
      { 
        name: 'student-discount', 
        label: 'Student Discount', 
        path: '/dashboard/fee/discount',
        icon: 'pieChart'
      },
      { 
        name: 'student-fee', 
        label: 'Student Fee', 
        path: '/dashboard/fee/student',
        icon: 'dollarSign'
      }
    ]
  },
  { 
    name: 'accountSection', 
    label: 'Accounts', 
    path: '/dashboard/accounts',
    icon: 'dollarSign',
    children: [
      { 
        name: 'salary-structure', 
        label: 'Salary Structure', 
        path: '/dashboard/accounts/salary-structure',
        icon: 'fileSpreadsheet'
      },
      { 
        name: 'salary', 
        label: 'Salary', 
        path: '/dashboard/accounts/salary',
        icon: 'creditCard'
      },
      { 
        name: 'expenses', 
        label: 'Expenses', 
        path: '/dashboard/accounts/expenses',
        icon: 'receipt'
      },
      { 
        name: 'payment', 
        label: 'Payment', 
        path: '/dashboard/accounts/payment',
        icon: 'dollarSign'
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
  { 
    name: 'dailyDiary', 
    label: 'Daily Diary', 
    path: '/dashboard/daily-diary',
    icon: 'book'
  },
  { 
    name: 'subjects', 
    label: 'Subjects', 
    path: '/dashboard/subjects',
    icon: 'bookOpen'
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

const renderIcon = (iconName: keyof typeof icons, isSubmenu = false) => {
  const IconComponent = icons[iconName];
  return <IconComponent size={isSubmenu ? 18 : 20} />;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [superAdmin, setSuperAdmin] = useState<boolean>(false);
  useEffect(() => {
    setSuperAdmin(isSuperAdmin());
  }, []);

  const getMenuItems = () => {
    if (superAdmin) {
      return SUPER_ADMIN_MENU_ITEMS;
    }
    return TENANT_MENU_ITEMS;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuCLose();
  };

  const handleMenuCLose = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  }

  const handleLogout = () => {
    logout();
    handleMenuCLose();
  };

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

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

  const isExpanded = (item: MenuItem): boolean => {
    if (expandedMenus[item.name]) {
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

  const menuItems = getMenuItems();
  
  return (
    <>
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
          <h2 className="text-xl font-bold text-blue-600">
            {superAdmin ? 'Super Admin' : 'School Admin'}
          </h2>
          <button 
            onClick={onClose}
            className="lg:hidden"
          >
            <X size={24} color='black' />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {menuItems.map(renderMenuItem)}
        </nav>

        <div className="p-4 pt-4 mt-2 border-t">
          {SETTINGS_ITEMS.map(renderMenuItem)}

          <div className="mt-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
