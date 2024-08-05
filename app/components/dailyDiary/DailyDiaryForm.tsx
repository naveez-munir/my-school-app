import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { BasicInfoForm } from "./form/BasicInfoForm";
import { AttachmentsForm } from "./form/AttachmentsForm";
import { SubjectTasksForm } from "./form/SubjectTasksForm";
import type {
  CreateDailyDiaryRequest,
  DailyDiaryResponse,
  AttachmentRequest
} from "~/types/dailyDiary";

// Define a local type that matches the state structure
interface SubjectTaskState {
  subject: string;
  task: string;
  dueDate?: string;
  additionalNotes?: string;
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
  defaultClassId?: string;
  showSubjectTasks?: boolean;
  onSubmit: (data: CreateDailyDiaryRequest) => void;
  isLoading: boolean;
}

export function DailyDiaryForm({
  initialData,
  defaultClassId,
  showSubjectTasks = false,
  onSubmit,
  isLoading
}: DailyDiaryFormProps) {
  // Form state with explicit typing
  console.log('>>>>>query Data', initialData?.classId)
  const [formData, setFormData] = useState<DailyDiaryFormData>({
    classId: initialData?.classId.id || defaultClassId || '',
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
      dueDate: task.dueDate,
      additionalNotes: task.additionalNotes
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

  const updateSubjectTasks = (tasks: SubjectTaskState[]) => {
    setFormData(prev => ({ ...prev, subjectTasks: tasks }));
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
        disabled={!!defaultClassId}
      />

      {/* Subject Tasks Section - Only for Class Teachers */}
      {showSubjectTasks && (
        <SubjectTasksForm
          tasks={formData.subjectTasks}
          onChange={updateSubjectTasks}
          classId={formData.classId}
        />
      )}

      {/* Attachments Section */}
      <AttachmentsForm
        attachments={attachments}
        onChange={setAttachments}
      />

      {!showSubjectTasks && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Subject tasks can be added after creating the diary entry. Any teacher can add tasks for their subjects.
          </p>
        </div>
      )}
      
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
