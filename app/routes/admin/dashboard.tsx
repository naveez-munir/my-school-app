import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/dashboard";
import { Building, Users, GraduationCap, Activity, TrendingUp } from 'lucide-react';
import { useTenantStatistics } from '~/hooks/useTenantQueries';
import { getUserRole, getAuthData } from '~/utils/auth';
import Sidebar from '~/components/common/ui/menu/components/sidebar/Sidebar';
import { Header } from '~/components/common/ui/Header';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Super Admin Dashboard" },
    { name: "description", content: "System-wide tenant management overview" },
  ];
}

export default function SuperAdminDashboard() {
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

  const { data: statistics, isLoading, error } = useTenantStatistics();

  const statsCards = [
    {
      title: 'Total Tenants',
      value: statistics?.totalTenants || 0,
      icon: Building,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Tenants',
      value: statistics?.activeTenants || 0,
      icon: Activity,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Inactive Tenants',
      value: statistics?.inactiveTenants || 0,
      icon: Users,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'System Health',
      value: `${statistics?.healthStatus.activePercentage || 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const capacityStats = [
    {
      label: 'Total Student Capacity',
      value: statistics?.capacity.totalStudentCapacity || 0,
      avg: Math.round(statistics?.capacity.avgStudentCapacity || 0),
    },
    {
      label: 'Total Teacher Capacity',
      value: statistics?.capacity.totalTeacherCapacity || 0,
      avg: Math.round(statistics?.capacity.avgTeacherCapacity || 0),
    },
    {
      label: 'Total Staff Capacity',
      value: statistics?.capacity.totalStaffCapacity || 0,
      avg: Math.round(statistics?.capacity.avgStaffCapacity || 0),
    },
  ];

  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading system statistics...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading system statistics</div>
        </div>
      );
    }

    return (
      <div className="text-gray-700 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">System Overview</h2>
            <p className="text-gray-600">Manage all tenants and system-wide configurations</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Capacity Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">System Capacity Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {capacityStats.map((capacity) => (
                <div key={capacity.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{capacity.label}</h4>
                  <p className="text-3xl font-bold text-gray-900">{capacity.value}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Avg per tenant: {capacity.avg}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <a
                href="/admin/tenants"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Building className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Manage Tenants</h4>
                  <p className="text-sm text-gray-500">Create, edit, and manage tenants</p>
                </div>
              </a>
              <a
                href="/admin/tenant-config"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <GraduationCap className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Tenant Configuration</h4>
                  <p className="text-sm text-gray-500">Configure tenant settings and limits</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole as string}
      />

      <div
        className={`min-h-screen flex flex-col transition-all duration-300
          ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'}
        `}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 overflow-auto bg-gray-50">
          {renderDashboardContent()}
        </main>
      </div>
    </div>
  );
}
