import { useNavigate, useParams } from 'react-router';
import { useDiaryEntry, useDeleteDiaryEntry } from '~/hooks/useDailyDiaryQueries';
import { format } from 'date-fns';
import { Calendar, FileText, ChevronLeft, Edit2, Trash2, ExternalLink, Book } from 'lucide-react';
import type { SubjectResponse, ClassResponse, DailyDiaryResponse } from '~/types/dailyDiary';

export function DailyDiaryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: diary, isLoading, error } = useDiaryEntry(id || '');
  const deleteDiaryMutation = useDeleteDiaryEntry();

  const handleEdit = () => {
    navigate(`/dashboard/daily-diary/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this diary entry?')) {
      deleteDiaryMutation.mutateAsync(id as string).then(() => {
        navigate('/dashboard/daily-diary');
      });
    }
  };

  const handleBack = () => {
    navigate('/dashboard/daily-diary');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {(error as Error)?.message || "Diary entry not found"}
        </div>
        <button 
          onClick={handleBack}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Diary List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <button 
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Diary List
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{diary.title}</h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Basic info */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{format(new Date(diary.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Class:</span>
              <span>{diary.classId.className}</span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700">{diary.description}</p>
          </div>
        </div>

        {/* Subject tasks */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Subject Tasks</h2>
          
          {diary.subjectTasks.length === 0 ? (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              No subject tasks added for this diary entry.
            </div>
          ) : (
            <div className="space-y-4">
              {diary.subjectTasks.map((task, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <Book className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium text-gray-900">
                        {task.subject.subjectName}
                      </h3>
                    </div>
                    {task.dueDate && (
                      <div className="text-sm text-gray-500">
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-700">{task.task}</p>
                  </div>
                  
                  {task.additionalNotes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="font-medium">Additional Notes:</div>
                      <p>{task.additionalNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        {diary.attachments && diary.attachments.length > 0 && (
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attachments</h2>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {diary.attachments.map((attachment, index) => (
                <div key={index} className="border rounded-lg p-3 flex items-center">
                  <div className="bg-gray-100 rounded-lg p-2 mr-3">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{attachment.title}</div>
                    <div className="text-xs text-gray-500">{attachment.fileType}</div>
                  </div>
                  <a 
                    href={attachment.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 p-1 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
