import { jwtDecode } from 'jwt-decode';
import { UserRoleEnum } from '~/types/user';

export interface UserRole {
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
  role?: string;
  permissions?: string[];
}

export interface DecodedToken {
  userId?: string;
  sub: string;
  role?: string;
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
  permissions?: string[];
  [key: string]: any;
}

export interface AuthData {
  token: string;
  tenantName: string;
  expiry: number;
  userRole?: UserRole;
}

export const getAuthData = (): AuthData | null => {
  try {
    const authDataStr = localStorage.getItem('authData');
    if (!authDataStr) return null;
    
    const authData = JSON.parse(authDataStr);
    const now = new Date().getTime();

    if (authData.expiry && now > authData.expiry) {
      localStorage.removeItem('authData');
      return null;
    }
    
    return authData;
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return null;
  }
};

export const getUserRole = (): UserRole | null => {
  const authData = getAuthData();
  if (!authData) return null;

  if (authData.userRole) {
    return authData.userRole;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(authData.token);

    const userRole: UserRole = {
      isSuperAdmin: decodedToken.isSuperAdmin || false,
      isAdmin: decodedToken.isAdmin || false,
      role: decodedToken.role,
      permissions: decodedToken.permissions || []
    };

    storeUserRole(userRole);
    
    return userRole;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserId = (): string | null => {
  try {
    const authData = getAuthData();
    if (!authData?.token) return null;

    const decodedToken = jwtDecode<DecodedToken>(authData.token);
    return decodedToken.userId || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

export const storeUserRole = (userRole: UserRole): void => {
  const authData = getAuthData();
  if (!authData) return;
  
  authData.userRole = userRole;
  localStorage.setItem('authData', JSON.stringify(authData));
};

export const isSuperAdmin = (): boolean => {
  const userRole = getUserRole();
  return userRole?.role === 'super_admin';
};

export const isAdmin = (): boolean => {
  const userRole = getUserRole();
  const adminRoles = [
    UserRoleEnum.ADMIN, 
    UserRoleEnum.TENANT_ADMIN,
    UserRoleEnum.SUPER_ADMIN,
    UserRoleEnum.PRINCIPAL
  ];

  return !!userRole?.role && adminRoles.includes(userRole.role as UserRoleEnum);
};

export const hasPermission = (permission: string): boolean => {
  const userRole = getUserRole();
  return userRole?.permissions?.includes(permission) || false;
};

export const storeAuthData = (
  token: string, 
  tenantName: string, 
  userRole?: UserRole
): void => {
  const expirationTime = new Date();
  expirationTime.setDate(expirationTime.getDate() + 1);
  
  const authData: AuthData = {
    token,
    tenantName,
    expiry: expirationTime.getTime(),
    userRole
  };
  
  localStorage.setItem('authData', JSON.stringify(authData));
};

export const logout = (): void => {
  localStorage.removeItem('authData');
  window.location.href = '/login';
};
