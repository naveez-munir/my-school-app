
import { Types } from 'mongoose';
import type { Subject } from './subject';
import type { Teacher } from './teacher';

export interface Class {
  _id: string;
  className: string;
  classSection?: string;
  classGradeLevel?: string;
  classTeacher?: Teacher;
  classTempTeacher?: Teacher;
  classSubjects?: Subject[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassDto {
  className: string;
  classSection?: string;
  classGradeLevel?: string;
  classTeacher?: string;
  classTempTeacher?: string;
  classSubjects?: string[];
}

export interface UpdateClassDto extends Partial<CreateClassDto> {}

export interface ClassFiltersProps {
  onSearch: (filters: Partial<CreateClassDto>) => void;
}

export interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassDto) => void;
  initialData?: Class;
}

export interface ClassesTableProps {
  data: Class[];
  onEdit: (classItem: Class) => void;  // Changed from 'class' to 'classItem'
  onDelete: (id: string) => void;
}

export interface TableMetaType {
  onEdit: (classItem: Class) => void;  // Changed from 'class' to 'classItem'
  onDelete: (id: string) => void;
}

export interface ClassState {
  classes: ClassResponse[];
  currentClass: Class | null;
  loading: boolean;
  error: string | null;
}

export interface ClassResponse {
  id: string;
  className: string;
  classSection: string;
  classGradeLevel: string;
  teacherName?: string;
  tempTeacherName?: string;
  subjectCount: number; 

}
