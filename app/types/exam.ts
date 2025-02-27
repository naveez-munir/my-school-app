// Frontend interfaces for exam module

// Base interfaces matching the backend DTOs
export interface ExamType {
  id: string;
  name: string;
  weightAge: number;
}

export interface Class {
  id: string;
  className: string;
  classSection: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface ExamSubject {
  subject: Subject;
  examDate: Date;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passingMarks: number;
}

export interface ExamResponse {
  id: string;
  examType: ExamType;
  class: Class;
  subjects: ExamSubject[];
  academicYear: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  status: string;
}

// Subject schedule for creating/updating exams
export interface SubjectSchedule {
  subject: string;  // MongoDB ID
  examDate: Date | string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passingMarks: number;
}

// DTO for creating a new exam
export interface CreateExamDto {
  examType: string;  // MongoDB ID
  classId: string;   // MongoDB ID
  subjects: SubjectSchedule[];
  academicYear: string;
  startDate: Date | string;
  endDate: Date | string;
  description?: string;
  status?: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared';
}

// DTO for updating an exam
export interface UpdateExamDto {
  examType?: string;
  classId?: string;
  subjects?: SubjectSchedule[];
  academicYear?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  description?: string;
  status?: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared';
}

// DTO for querying exams
export interface ExamQueryDto {
  academicYear?: string;
  classId?: string;
  status?: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared';
}

// State type for Redux
export interface ExamState {
  exams: ExamResponse[];
  upcomingExams: ExamResponse[];
  currentExam: ExamResponse | null;
  loading: boolean;
  error: string | null;
}
