import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { getUserRole, getAuthData } from '~/utils/auth';
import Sidebar from '~/components/common/ui/menu/components/sidebar/Sidebar';
import { Header } from '~/components/common/ui/Header';

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    // Sync with sidebar's localStorage state
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return true;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const authData = getAuthData();
    if (!authData || !authData.token) {
      navigate('/login');
      return;
    }
    const role = getUserRole();
    setUserRole(role?.role as string);
  }, [navigate]);

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sidebar-collapsed');
        setIsSidebarCollapsed(saved === 'true');
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Poll for changes in the same tab (since storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole as string}
      />

      <div
        className={`min-h-screen flex flex-col transition-all duration-300
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
