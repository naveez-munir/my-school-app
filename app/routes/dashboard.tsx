import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { 
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Settings,
  Bell,
} from 'lucide-react';

type MenuItem = {
  name: 'home' | 'students' | 'teachers' | 'courses' | 'management' | 'attendance' | 'settings';
  label: string;
  path: string;
};

const MENU_ITEMS: MenuItem[] = [
  { name: 'home', label: 'Home', path: '/dashboard' },
  { name: 'students', label: 'Students', path: '/dashboard/students' },
  { name: 'teachers', label: 'Teachers', path: '/dashboard/teachers' },
  { name: 'courses', label: 'Courses', path: '/dashboard/courses' },
  { name: 'management', label: 'management', path: '/dashboard/management' },
  { name: 'attendance', label: 'Attendance', path: '/dashboard/attendance' },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const getMenuIcon = (name: MenuItem['name'], size: number = 20) => {
    const icons = {
      home: Home,
      students: Users,
      teachers: Users,
      courses: BookOpen,
      management: Calendar,
      attendance: ClipboardCheck,
      settings: Settings
    };

    const IconComponent = icons[name];
    return <IconComponent size={size} />;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (!isAuthenticated) {
    navigate('/login');
  }
}, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-56 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">School Admin</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={24} color='black' />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="flex w-full items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {getMenuIcon(item.name)}
              <span>{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t">
            <button
              onClick={() => handleNavigation('/dashboard/settings')}
              className="flex w-full items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {getMenuIcon('settings')}
              <span>Settings</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`lg:ml-56 min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={24} color='black'/>
            </button>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell size={20} color='black'/>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-700">School Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
//TODO need to refactor this
