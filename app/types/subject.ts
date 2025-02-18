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
