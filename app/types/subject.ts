export interface Subject {
  _id: string;
  subjectName: string;
  subjectCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectDto {
  subjectName: string;
  subjectCode: string;
}

export interface UpdateSubjectDto {
  subjectName?: string;
  subjectCode?: string;
}
