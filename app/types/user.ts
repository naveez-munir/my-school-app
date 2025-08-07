export enum UserRoleEnum {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  PRINCIPAL = 'principal',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  ACCOUNTANT = 'accountant',
  LIBRARIAN = 'librarian',
  DRIVER = 'driver',
  SECURITY = 'security',
  CLEANER = 'cleaner',
  GUARDIAN = 'guardian'
}

export interface User {
  _id: string;
  id: string;
  name: string;
  email?: string;
  cnic: string;
  role: UserRoleEnum;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  entityId: string;
  email?: string;
  password: string;
  role: UserRoleEnum;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRoleEnum;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const roleLabels: Record<UserRoleEnum, string> = {
  [UserRoleEnum.SUPER_ADMIN]: 'Super Admin',
  [UserRoleEnum.TENANT_ADMIN]: 'Tenant Admin',
  [UserRoleEnum.PRINCIPAL]: 'Principal',
  [UserRoleEnum.ADMIN]: 'Admin',
  [UserRoleEnum.TEACHER]: 'Teacher',
  [UserRoleEnum.STUDENT]: 'Student',
  [UserRoleEnum.PARENT]: 'Parent',
  [UserRoleEnum.ACCOUNTANT]: 'Accountant',
  [UserRoleEnum.LIBRARIAN]: 'Librarian',
  [UserRoleEnum.DRIVER]: 'Driver',
  [UserRoleEnum.SECURITY]: 'Security',
  [UserRoleEnum.CLEANER]: 'Cleaner',
  [UserRoleEnum.GUARDIAN]: 'Guardian',
};
