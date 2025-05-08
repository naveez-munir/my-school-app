// Base Types
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

// Enums
export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum BloodGroup {
  'A+' = 'A+',
  'A-' = 'A-',
  'B+' = 'B+',
  'B-' = 'B-',
  'O+' = 'O+',
  'O-' = 'O-',
  'AB+' = 'AB+',
  'AB-' = 'AB-'
}

export enum DocumentTypes{
  CNIC = "CNIC",
  DegreeCertificate= "Degree Certificate",
  ExperienceLetter= "Experience Letter",
  MedicalRecords= "Medical Records",
  Contract= "Employment Contract",
  Other= "Other"
};

export enum EmploymentStatus {
  Active = 'Active',
  OnLeave = 'OnLeave',
  Resigned = 'Resigned',
  Terminated = 'Terminated'
}

// Main Teacher Interface
export interface Teacher {
  _id: string;
  cniNumber: string;
  gender: Gender;
  firstName: string;
  lastName: string;
  email?: string;
  bloodGroup?: BloodGroup;
  photoUrl?: string;
  phone?: string;
  address?: string;
  joiningDate: Date;
  leavingDate?: Date;
  employmentStatus: EmploymentStatus;
  qualifications: string[];
  subjects?: string[];
  classTeacherOf?: {
    _id: string;
    className: string;
  };
  educationHistory?: EducationHistory[];
  experience?: Experience[];
  documents?: Document[];
  userId?: string;
}

// DTOs
export interface CreateTeacherDto {
  cniNumber: string;
  gender: Gender;
  firstName: string;
  lastName: string;
  email?: string;
  bloodGroup?: BloodGroup;
  photoUrl?: string;
  phone?: string;
  address?: string;
  joiningDate: Date;
  leavingDate?: Date;
  employmentStatus: EmploymentStatus;
  qualifications: string[];
  subjects?: string[];
  classTeacherOf?: string;
  educationHistory?: EducationHistory[];
  experience?: Experience[];
  documents?: Document[];
}

export interface UpdateTeacherDto extends Partial<CreateTeacherDto> {}

export interface TeacherFilters {
  firstName?: string;
  lastName?: string;
  cniNumber?: string;
  gender?: Gender;
  employmentStatus?: EmploymentStatus;
  classTeacherOf?: string;
  qualification?: string;
}

// Response Types
export interface TeacherResponse {
  id: string;
  name: string;
  cniNumber: string;
  email?: string;
  phone?: string;
  gender: string;
  employmentStatus: string;
  photoUrl?: string;
  assignedClassName?: string;
  qualifications: string[];
  subjects?: string[];
  joiningDate: Date;
}

// State Interface
export interface TeacherState {
  teachers: TeacherResponse[];
  currentTeacher: Teacher | null;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface TeacherFormProps {
  initialData?: Teacher;
  onSubmit: (data: CreateTeacherDto) => void;
  isLoading: boolean;
}

export interface TeacherTableProps {
  data: TeacherResponse[];
  onEdit: (teacher: TeacherResponse) => void;
  onDelete: (id: string) => void;
}

export interface TeacherFiltersProps {
  onSearch: (filters: TeacherFilters) => void;
}

export interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTeacherDto) => void;
  initialData?: Teacher;
}

export interface TeacherDetailsProps {
  teacher: Teacher;
  onEdit: () => void;
  onStatusChange: (status: EmploymentStatus) => void;
}
