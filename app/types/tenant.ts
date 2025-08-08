export enum TenantStatus {
  Active = "active",
  Inactive = "inactive",
}

export interface TenantThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  favicon: string;
}

export interface TenantBrandingSettings {
  schoolName: string;
  schoolAddress: string;
  contactInfo: string;
  website: string;
}

export interface TenantFeatureSettings {
  enableOnlinePayments: boolean;
  enableParentPortal: boolean;
  enableStudentPortal: boolean;
  enableNotifications: boolean;
  enableReports: boolean;
}

export interface TenantAcademicSettings {
  academicYearStart: string;
  academicYearEnd: string;
  gradingSystem: string;
  timeZone: string;
}

export interface TenantSettings {
  theme: TenantThemeSettings;
  branding: TenantBrandingSettings;
  features: TenantFeatureSettings;
  academic: TenantAcademicSettings;
}

export interface LeaveSettings {
  sickLeaveAllowance: number;
  casualLeaveAllowance: number;
  earnedLeaveAllowance: number;
  maxConsecutiveLeaves: number;
  requireApproval: boolean;
  approvalWorkflow: string;
  allowLeaveEncashment: boolean;
  notificationRecipients: string[];
}

export interface TenantLeavePolicy {
  teacherLeaveSettings: LeaveSettings;
  staffLeaveSettings: LeaveSettings;
  leaveYearStart: { month: number; day: number };
  leaveYearEnd: { month: number; day: number };
  holidayList: Array<{ name: string; date: string; type: string }>;
  weeklyOffDays: number[];
  allowCarryForward: boolean;
  maxCarryForwardDays: number;
}

export interface Tenant {
  _id: string;
  name: string;
  databaseName: string;
  status: TenantStatus;
  maxStudents: number;
  maxTeachers: number;
  maxStaff: number;
  settings?: TenantSettings;
  leavePolicy?: TenantLeavePolicy;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantDto {
  name: string;
  databaseName: string;
  status?: TenantStatus;
  maxStudents?: number;
  maxTeachers?: number;
  maxStaff?: number;
  settings?: Partial<TenantSettings>;
  leavePolicy?: Partial<TenantLeavePolicy>;
  adminEmail: string;
  adminCnic: string;
  adminPassword: string;
}

export interface UpdateTenantDto extends Partial<CreateTenantDto> {}

export interface TenantStatistics {
  totalTenants: number;
  activeTenants: number;
  inactiveTenants: number;
  capacity: {
    totalStudentCapacity: number;
    totalTeacherCapacity: number;
    totalStaffCapacity: number;
    avgStudentCapacity: number;
    avgTeacherCapacity: number;
    avgStaffCapacity: number;
  };
  healthStatus: {
    activePercentage: string;
    inactivePercentage: string;
  };
}

export interface TenantsTableProps {
  data: Tenant[];
  onEdit?: (tenant: Tenant) => void;
  onDelete?: (id: string) => void;
}

export interface TenantFiltersProps {
  onSearch: (filters: Partial<CreateTenantDto>) => void;
  onReset: () => void;
}