export interface Subject {
  _id: string;
  subjectName: string;
  subjectCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectDto {
  subjectName: string;
  subjectCode: string;
}
export type CreateSubjectDto = SubjectDto;
export type UpdateSubjectDto = Partial<SubjectDto>;

export interface SubjectFiltersProps {
  onSearch: (filters: Partial<SubjectDto>) => void;
}

export interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectDto) => void;
  initialData?: SubjectDto;
}

export interface SubjectFilters {
  subjectName?: string;
  subjectCode?: string;
}

export interface SubjectState {
  subjects: Subject[];
  currentSubject: Subject | null;
  loading: boolean;
  error: string | null;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface TableMetaType {
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

export interface SubjectsTableProps {
  data: Subject[];
  pageCount: number;
  onPaginationChange: (pageIndex: number) => void;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}
export interface SubjectFiltersProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}
