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

export enum GradeLevel {
  Grade1 = '1st',
  Grade2 = '2nd',
  Grade3 = '3rd',
  Grade4 = '4th',
  Grade5 = '5th',
  Grade6 = '6th',
  Grade7 = '7th',
  Grade8 = '8th',
  Grade9 = '9th',
  Grade10 = '10th',
  Grade11 = '11th',
  Grade12 = '12th'
}

export enum GuardianRelationship {
  Father = 'Father',
  Mother = 'Mother',
  Guardian = 'Guardian',
  Other = 'Other'
}

export enum StudentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Graduated = 'Graduated',
  Expelled = 'Expelled',
  Withdrawn = 'Withdrawn'
}

export enum ExitStatus {
  Completed = 'Completed',
  Migrated = 'Migrated',
  Expelled = 'Expelled',
  Withdrawn = 'Withdrawn',
  None = 'None'
}

// Enhanced Document type for the Documents tab
export interface StudentDocument {
  documentType: string;
  documentUrl: string;
  uploadDate?: string | Date;
}

// Possible document types for dropdown
export enum DocumentType {
  BirthCertificate = 'Birth Certificate',
  CNIC = 'CNIC',
  PreviousSchoolRecords = 'Previous School Records',
  MedicalRecords = 'Medical Records',
  VaccinationRecords = 'Vaccination Records',
  TransferCertificate = 'Transfer Certificate',
  Other = 'Other'
}

export interface Guardian {
  name: string;
  cniNumber: string;
  relationship: GuardianRelationship;
  phone: string;
  email?: string;
}

export interface Student {
  _id: string;
  cniNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  photoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  guardian: Guardian;
  gradeLevel: string;
  class?: string; // class ID
  rollNumber?: string;
  enrollmentDate: string; // ISO date string
  admissionDate: string; // ISO date string
  status?: StudentStatus;
  exitStatus?: ExitStatus;
  exitDate?: string; // ISO date string
  exitRemarks?: string;
  documents?: StudentDocument[];
  attendancePercentage?: number;
  createdAt: string;
  updatedAt: string;
}

// For the Attendance tab
export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remark?: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

// DTOs for API requests
export interface CreateStudentDto {
  cniNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  bloodGroup?: BloodGroup;
  photoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  guardian: Guardian;
  gradeLevel: string;
  class?: string; // class ID
  rollNumber?: string;
  enrollmentDate: string; // ISO date string
  admissionDate: string; // ISO date string
  documents?: StudentDocument[];
  attendancePercentage?: number;
  status?: StudentStatus;
  exitStatus?: ExitStatus;
  exitDate?: string;
  exitRemarks?: string;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {
  exitStatus?: ExitStatus;
  exitDate?: string; // ISO date string
  exitRemarks?: string;
  status?: StudentStatus;
}

export interface SearchStudentDto {
  firstName?: string;
  lastName?: string;
  cniNumber?: string;
  guardianCnic?: string;
  gradeLevel?: string;
  status?: StudentStatus;
  section?: string;
}

// Component Props Interfaces
export interface StudentsTableProps {
  data: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentDto) => void;
  initialData?: Student;
}

export interface StudentFiltersProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

// Redux State Interface
export interface StudentState {
  students: StudentResponse[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;
}

// Form State Interface
export interface StudentFormState extends Omit<CreateStudentDto, 'dateOfBirth' | 'enrollmentDate' | 'admissionDate'> {
  dateOfBirth: string;
  enrollmentDate: string;
  admissionDate: string;
}

// Form Validation Errors
export interface StudentFormErrors {
  cniNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  guardian?: {
    name?: string;
    cniNumber?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  gradeLevel?: string;
  enrollmentDate?: string;
  admissionDate?: string;
  [key: string]: any;
}

export interface TableMetaType {
  onEdit: (subject: StudentResponse) => void;
  onDelete: (id: string) => void;
}

export interface StudentResponse {
  id: string,
  name: string,
  gradeLevel: string,
  classId: string,
  className: string,
  guardianName: string,
  photoUrl: string,
  status: boolean,
  rollNumber: string
}

// Component props interfaces for form steps
export interface BasicInfoStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
}

export interface GuardianInfoStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
}

export interface AcademicInfoStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
}

export interface DocumentsStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export interface AttendanceRecordsProps {
  data: Partial<CreateStudentDto>;
  onBack: () => void;
  studentId?: string;
}

// For the PhotoUpload component
export interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (url: string) => void;
}

