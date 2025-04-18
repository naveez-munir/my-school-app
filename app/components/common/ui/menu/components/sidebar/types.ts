export type UserRole = 'superAdmin' | 'admin' | 'teacher' | 'student' | 'staff';

export interface MenuItem {
  name: string;
  label: string;
  path: string;
  icon: string;
  children?: MenuItem[];
  roles?: string[];
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}
