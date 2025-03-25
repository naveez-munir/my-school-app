import type { ReactNode } from "react";

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export enum BloodGroup {
  "A+" = "A+",
  "A-" = "A-",
  "B+" = "B+",
  "B-" = "B-",
  "O+" = "O+",
  "O-" = "O-",
  "AB+" = "AB+",
  "AB-" = "AB-",
}

export enum GradeLevel {
  Grade1 = "1st",
  Grade2 = "2nd",
  Grade3 = "3rd",
  Grade4 = "4th",
  Grade5 = "5th",
  Grade6 = "6th",
  Grade7 = "7th",
  Grade8 = "8th",
  Grade9 = "9th",
  Grade10 = "10th",
  Grade11 = "11th",
  Grade12 = "12th",
}

export enum GuardianRelationship {
  Father = "Father",
  Mother = "Mother",
  Guardian = "Guardian",
  Other = "Other",
}

export enum StudentStatus {
  Active = "Active",
  Inactive = "Inactive",
  Graduated = "Graduated",
  Expelled = "Expelled",
  Withdrawn = "Withdrawn",
}

export enum ExitStatus {
  Completed = "Completed",
  Migrated = "Migrated",
  Expelled = "Expelled",
  Withdrawn = "Withdrawn",
  None = "None",
}

export enum DocumentType {
  BirthCertificate = "Birth Certificate",
  CNIC = "CNIC",
  PreviousSchoolRecords = "Previous School Records",
  MedicalRecords = "Medical Records",
  VaccinationRecords = "Vaccination Records",
  TransferCertificate = "Transfer Certificate",
  Other = "Other",
}

export interface Guardian {
  name: string;
  cniNumber: string;
  relationship: GuardianRelationship;
  phone: string | null;
  email?: string | null;
}

export interface StudentDocument {
  documentType: string;
  documentUrl: string;
  uploadDate?: string | Date;
}

export interface Student {
  _id: string;
  cniNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  photoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string;
  guardian: Guardian;
  gradeLevel: string;
  class?: string | null;
  rollNumber?: string;
  enrollmentDate: string;
  admissionDate: string;
  status?: StudentStatus;
  exitStatus?: ExitStatus | null;
  exitDate?: string | null;
  exitRemarks?: string | null;
  documents?: StudentDocument[];
  attendancePercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  cniNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup | null;
  photoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string;
  guardian: Guardian;
  gradeLevel: string;
  class?: string | null;
  rollNumber?: string;
  enrollmentDate?: string | null;
  admissionDate: string;
  status?: StudentStatus;
}

export interface UpdateAcademicInfoDto {
  class?: string | null;
  rollNumber?: string | null;
  gradeLevel?: string;
  enrollmentDate?: string | null;
}

export interface UpdatePersonalInfoDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup | null;
  photoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string;
}

export interface UpdateGuardianInfoDto {
  guardian?: Guardian;
  guardianId?: string;
}

export interface AddDocumentDto {
  documentType: string;
  documentUrl: string;
}

export interface UpdateStatusDto {
  status: StudentStatus;
  exitStatus?: ExitStatus | null;
  exitDate?: string | null;
  exitRemarks?: string | null;
}

export interface UpdateAttendanceDto {
  percentage: number;
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

export interface StudentResponse {
  id: string;
  name: string;
  gradeLevel: string;
  classId: string;
  className: string;
  guardianName: string;
  photoUrl: string;
  status: boolean;
  rollNumber: string;
}

export interface BasicInfoFormProps {
  data?: Partial<UpdatePersonalInfoDto>;
  onSubmit: (data: UpdatePersonalInfoDto) => void;
  isLoading?: boolean;
}

export interface GuardianInfoFormProps {
  data?: Partial<UpdateGuardianInfoDto>;
  onSubmit: (data: UpdateGuardianInfoDto) => void;
  isLoading?: boolean;
}

export interface AcademicInfoFormProps {
  data?: Partial<UpdateAcademicInfoDto>;
  onSubmit: (data: UpdateAcademicInfoDto) => void;
  isLoading?: boolean;
}

export interface DocumentsFormProps {
  data?: Partial<Student>;
  onSubmit: (data: AddDocumentDto) => void;
  onRemoveDocument?: (index: number) => void;
  isLoading?: boolean;
}

export interface StatusFormProps {
  data?: Partial<UpdateStatusDto>;
  onSubmit: (data: UpdateStatusDto) => void;
  isLoading?: boolean;
}

export interface AttendanceFormProps {
  data?: { percentage?: number };
  onSubmit: (data: UpdateAttendanceDto) => void;
  isLoading?: boolean;
}

export interface StudentRegistrationFormProps {
  data?: Partial<CreateStudentDto>;
  onSubmit: (data: CreateStudentDto) => void;
  isLoading?: boolean;
}

export interface AttendanceRecord {
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  remark?: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export interface StudentState {
  students: StudentResponse[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;
}

export interface StudentFormState
  extends Omit<
    CreateStudentDto,
    "dateOfBirth" | "enrollmentDate" | "admissionDate"
  > {
  dateOfBirth: string;
  enrollmentDate: string;
  admissionDate: string;
}

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

export interface StudentsTableProps {
  data: StudentResponse[];
  onView: (student: StudentResponse) => void;
  onDelete: (id: string) => void;
}

export interface TableMetaType {
  onView: (student: StudentResponse) => void;
  onDelete: (id: string) => void;
}
export interface StudentFormLayoutProps {
  student: any;
  isLoadingStudent: boolean;
  isSubmitting: boolean;
  title: string;
  description?: string | ReactNode;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  studentId?: string;
}

export interface GuardianInfoStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
}
export interface GuardianFormFieldsProps {
  data: Guardian;
  onChange: <K extends keyof Guardian>(field: K, value: Guardian[K]) => void;
}
export interface BasicInfoStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
}
