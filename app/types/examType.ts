// Types for the exam type module

// The base ExamType interface
export interface ExamType {
  _id: string;
  name: string;
  weightAge: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO for creating a new exam type
export interface CreateExamTypeDto {
  name: string;
  weightAge: number;
  isActive?: boolean;
}

// DTO for updating an exam type
export interface UpdateExamTypeDto {
  name?: string;
  weightAge?: number;
  isActive?: boolean;
}

// State type for Redux
export interface ExamTypeState {
  examTypes: ExamType[];
  currentExamType: ExamType | null;
  loading: boolean;
  error: string | null;
}

// Table meta type for actions
export interface ExamTypeTableMetaType {
  onEdit: (examType: ExamType) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}
