import { useEffect, useState } from 'react';
import { Menu as MenuIcon, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router';
import { getUserRole, getUserName, getTenantName, logout } from '~/utils/auth';
import { roleLabels, UserRoleEnum } from '~/types/user';

interface HeaderProps {
  onMenuClick: () => void;
}

const getPortalName = (role: string): string => {
  switch (role) {
    case UserRoleEnum.SUPER_ADMIN:
      return 'Super Admin Portal';
    case UserRoleEnum.TENANT_ADMIN:
      return 'Tenant Admin Portal';
    case UserRoleEnum.ADMIN:
      return 'Admin Portal';
    case UserRoleEnum.PRINCIPAL:
      return 'Principal Portal';
    case UserRoleEnum.TEACHER:
      return 'Teacher Portal';
    case UserRoleEnum.STUDENT:
      return 'Student Portal';
    case UserRoleEnum.GUARDIAN:
      return 'Guardian Portal';
    case UserRoleEnum.PARENT:
      return 'Parent Portal';
    case UserRoleEnum.ACCOUNTANT:
      return 'Accountant Portal';
    case UserRoleEnum.LIBRARIAN:
      return 'Library Portal';
    case UserRoleEnum.DRIVER:
      return 'Transport Portal';
    case UserRoleEnum.SECURITY:
      return 'Security Portal';
    case UserRoleEnum.CLEANER:
      return 'Maintenance Portal';
    default:
      return 'Portal';
  }
};

export function Header({ onMenuClick }: HeaderProps) {
  const [userName, setUserName] = useState<string>('User');
  const [userRole, setUserRole] = useState<string>('');
  const [portalName, setPortalName] = useState<string>('Portal');
  const [tenantName, setTenantName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = getUserName();
    const role = getUserRole();
    const tenant = getTenantName();

    if (name) {
      setUserName(name);
    }

    if (role?.role) {
      setUserRole(role.role);
      setPortalName(getPortalName(role.role));
    }

    if (tenant) {
      setTenantName(tenant);
    }
  }, []);

  const getRoleLabel = (role: string): string => {
    return roleLabels[role as UserRoleEnum] || role;
  };

  const handleViewProfile = () => {
    navigate('/dashboard/profile');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="h-[73px] flex items-center justify-between px-4 py-3">
        {/* Left Section - Menu Button & School Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <MenuIcon size={24} className="text-gray-700" />
          </button>

          {tenantName && (
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-tight">{tenantName}</h1>
            </div>
          )}
        </div>

        {/* Right Section - Notifications & User Info */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info with Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors px-2 py-1">
              {/* User Avatar */}
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              {/* User Details */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-600">{getRoleLabel(userRole)}</p>
              </div>

              {/* Dropdown Icon */}
              <ChevronDown size={16} className="hidden md:block text-gray-500" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleViewProfile}
                        className={`${
                          active ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors`}
                      >
                        <User size={16} className="mr-3" />
                        View Profile
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-red-50 text-red-600' : 'text-red-600'
                        } group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors`}
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}

