export enum EmploymentStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'OnLeave',
  RESIGNED = 'Resigned',
  TERMINATED = 'Terminated'
}

export enum UserRole {
  ACCOUNTANT = 'ACCOUNTANT',
  LIBRARIAN = 'LIBRARIAN',
  ADMIN = 'ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  DRIVER = 'DRIVER',
  SECURITY = 'SECURITY',
  CLEANER = 'CLEANER',
  TENANT_ADMIN = 'TENANT_ADMIN'
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
  address?: string;
}

export interface EducationHistory {
  degree: string;
  institution: string;
  year: number;
  certificateUrl?: string;
}

export interface Experience {
  institution: string;
  position: string;
  fromDate: Date;
  toDate?: Date;
  description?: string;
  experienceLatterUrl?: string;
}

export interface Document {
  documentType: string;
  documentUrl: string;
  uploadDate?: Date;
}

export interface StaffBase {
  firstName: string;
  lastName: string;
  cniNumber: string;
  gender: string;
  email?: string;
  bloodGroup?: string;
  photoUrl?: string;
  phone?: string;
  address?: string;
  joiningDate: Date;
  leavingDate?: Date;
  employmentStatus: EmploymentStatus;
  designation: UserRole;
  department?: string;
  qualifications?: string[];
  jobDescription?: string;
  reportingTo?: string;
  skills?: string[];
  responsibilities?: string[];
  emergencyContact?: EmergencyContact;
  userId?: string;
}

export interface CreateStaffRequest extends StaffBase {
  educationHistory?: EducationHistory[];
  experience?: Experience[];
  documents?: Document[];
}

export interface UpdateStaffRequest extends Partial<StaffBase> {}

export interface StaffListResponse {
  id: string;
  name: string;
  cniNumber: string;
  email?: string;
  phone?: string;
  gender: string;
  employmentStatus: string;
  photoUrl?: string;
  designation: string;
  department?: string;
  qualifications: string[];
  joiningDate: Date;
}

export interface StaffDetailResponse {
  id: string;
  cniNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  email?: string;
  bloodGroup?: string;
  photoUrl?: string;
  phone?: string;
  address?: string;
  joiningDate: Date;
  leavingDate?: Date;
  employmentStatus: string;
  designation: string;
  department?: string;
  qualifications?: string[];
  jobDescription?: string;
  reportingTo?: string;
  skills?: string[];
  responsibilities?: string[];
  emergencyContact?: EmergencyContact;
  educationHistory?: EducationHistory[];
  experience?: Experience[];
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchStaffParams {
  firstName?: string;
  lastName?: string;
  cniNumber?: string;
  employmentStatus?: EmploymentStatus;
  designation?: UserRole;
  department?: string;
  gender?: string;
}

export interface UpdateStatusRequest {
  status: EmploymentStatus;
}
