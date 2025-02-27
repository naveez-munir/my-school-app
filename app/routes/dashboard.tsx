import { useEffect, useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';
import Sidebar from '~/components/common/ui/menu/Sidebar';

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
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
