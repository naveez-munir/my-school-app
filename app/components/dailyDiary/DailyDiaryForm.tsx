import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { BasicInfoForm } from "./form/BasicInfoForm";
import { SubjectTasksForm } from "./form/SubjectTasksForm";
import { AttachmentsForm } from "./form/AttachmentsForm";
import type { 
  CreateDailyDiaryRequest, 
  DailyDiaryResponse,
  SubjectTaskRequest,
  AttachmentRequest
} from "~/types/dailyDiary";

// Define a local type that matches the state structure
interface SubjectTaskState {
  subject: string;
  task: string;
  dueDate: string | undefined;
  additionalNotes: string | undefined;
}

interface DailyDiaryFormData {
  classId: string;
  date: string;
  title: string;
  description: string;
  subjectTasks: SubjectTaskState[];
}

interface DailyDiaryFormProps {
  initialData?: DailyDiaryResponse;
  onSubmit: (data: CreateDailyDiaryRequest) => void;
  isLoading: boolean;
}

export function DailyDiaryForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: DailyDiaryFormProps) {
  // Form state with explicit typing
  console.log('>>>>>query Data', initialData?.classId)
  const [formData, setFormData] = useState<DailyDiaryFormData>({
    classId: initialData?.classId.id || '',
    date: initialData 
      ? (typeof initialData.date === 'string' 
          ? initialData.date.split('T')[0] 
          : new Date(initialData.date).toISOString().split('T')[0])
      : new Date().toISOString().split('T')[0],
    title: initialData?.title || '',
    description: initialData?.description || '',
    subjectTasks: initialData?.subjectTasks.map(task => ({
      subject: task.subject.id,
      task: task.task,
      dueDate: task.dueDate || undefined,
      additionalNotes: task.additionalNotes || undefined
    })) || []
  });
  
  const [attachments, setAttachments] = useState<AttachmentRequest[]>(
    initialData?.attachments.map(a => ({
      title: a.title,
      fileUrl: a.fileUrl,
      fileType: a.fileType
    })) || []
  );

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.classId || !formData.date || !formData.title) {
      setError('Please fill in all required fields');
      return;
    }

    const submitData: CreateDailyDiaryRequest = {
      ...formData,
      attachments
    };

    onSubmit(submitData);
  };

  // Update form data handlers with type-safe updates
  const updateBasicInfo = (basicInfo: Partial<DailyDiaryFormData>) => {
    setFormData(prev => ({ ...prev, ...basicInfo }));
  };

  const updateSubjectTasks = (tasks: SubjectTaskRequest[]) => {
    setFormData(prev => ({
      ...prev, 
      subjectTasks: tasks.map(task => ({
        subject: task.subject,
        task: task.task,
        dueDate: task.dueDate || undefined,
        additionalNotes: task.additionalNotes || undefined
      }))
    }));
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      {/* Basic Info Section */}
      <BasicInfoForm 
        data={formData} 
        onChange={updateBasicInfo} 
      />
      
      {/* Subject Tasks Section */}
      <SubjectTasksForm 
        tasks={formData.subjectTasks} 
        onChange={updateSubjectTasks} 
      />
      
      {/* Attachments Section */}
      <AttachmentsForm
        attachments={attachments} 
        onChange={setAttachments} 
      />
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Entry' : 'Create Entry'}
        </button>
      </div>
    </form>
  );
}
