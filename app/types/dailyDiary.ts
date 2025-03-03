
export interface SubjectResponse {
  id: string;
  subjectName: string;
  subjectCode: string;
}

export interface ClassResponse {
  id: string;
  className: string;
  classSection: string;
  classGradeLevel: string;
}

export interface SubjectTaskResponse {
  id: string;
  subject: SubjectResponse;
  task: string;
  dueDate?: string;
  additionalNotes?: string;
}

export interface AttachmentResponse {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
}

export interface DailyDiaryResponse {
  id: string;
  classId: ClassResponse;
  date: string;
  title: string;
  description: string;
  subjectTasks: SubjectTaskResponse[];
  attachments: AttachmentResponse[];
  createdBy: string;
}

// Request types (what we send to the API)
export interface SubjectTaskRequest {
  subject: string;
  task: string;
  dueDate?: string;
  additionalNotes?: string;
}

export interface AttachmentRequest {
  title: string;
  fileUrl: string;
  fileType: string;
}

export interface CreateDailyDiaryRequest {
  classId: string;
  date: string;
  title: string;
  description: string;
  subjectTasks: SubjectTaskRequest[];
  attachments?: AttachmentRequest[];
}

export interface UpdateDailyDiaryRequest {
  classId?: string;
  date?: string;
  title?: string;
  description?: string;
  subjectTasks?: SubjectTaskRequest[];
  attachments?: AttachmentRequest[];
}

export interface DiaryQueryParams {
  startDate?: string;
  endDate?: string;
  classId?: string;
  page?: number;
  limit?: number;
}

// Helper to convert a response to a create/update request
export function prepareForEdit(diary: DailyDiaryResponse): CreateDailyDiaryRequest {
  return {
    classId: diary.classId.id,
    date: diary.date,
    title: diary.title,
    description: diary.description,
    subjectTasks: diary.subjectTasks.map(task => ({
      subject: task.subject.id,
      task: task.task,
      dueDate: task.dueDate,
      additionalNotes: task.additionalNotes
    })),
    attachments: diary.attachments.map(attachment => ({
      title: attachment.title,
      fileUrl: attachment.fileUrl,
      fileType: attachment.fileType
    }))
  };
}
