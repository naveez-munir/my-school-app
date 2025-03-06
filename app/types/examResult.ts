export interface ExamResultResponse {
  id: string;
  exam: {
    id: string;
    type: string;
    academicYear: string;
  };
  student: {
    id: string;
    name: string;
    rollNumber: string;
  };
  subjectResults: {
    subject: {
      id: string;
      name: string;
    };
    marksObtained: number;
    maxMarks: number;
    percentage: string;
    remarks?: string;
  }[];
  totalMarks: number;
  percentage: number;
  grade?: string;
  rank?: number;
  remarks?: string;
}

export interface CreateExamResultRequest {
  examId: string;
  studentId: string;
  subjectResults: {
    subject: string;
    marksObtained: number;
    maxMarks: number;
    remarks?: string;
  }[];
  remarks?: string;
}

export interface ExamResultQueryParams {
  examId?: string;
  studentId?: string;
  classId?: string;
  academicYear?: string;
  examType?: string;
}

export interface SubjectOption {
  id: string;
  name: string;
  maxMarks: number;
}

export interface ExamOption {
  id: string;
  name: string;
  type: string;
  academicYear: string;
  subjects: SubjectOption[];
}

export interface StudentOption {
  id: string;
  name: string;
  rollNumber: string;
  class?: {
    id: string;
    name: string;
  };
}

export interface ExamResultSummary {
  id: string;
  examName: string;
  examType: string;
  studentName: string;
  rollNumber: string;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
}

export interface DetailedSubjectResult {
  subject: {
    id: string;
    name: string;
  };
  marksObtained: number;
  maxMarks: number;
  percentage: string;
  passingMarks?: number;
  isPassing: boolean;
  remarks?: string;
}

export interface DetailedExamResult extends ExamResultResponse {
  detailedSubjectResults: DetailedSubjectResult[];
  isPassing: boolean;
  class?: {
    id: string;
    name: string;
  };
  examDate?: string;
  highestMarks?: number;
  lowestMarks?: number;
  averageMarks?: number;
  totalStudents?: number;
}
