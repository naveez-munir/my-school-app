import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { useDiaryEntry, useDeleteDiaryEntry, useAddSubjectTask, useUpdateSubjectTask, useDeleteSubjectTask } from '~/hooks/useDailyDiaryQueries';
import { useDailyDiaryPermissions } from '~/hooks/useDailyDiaryPermissions';
import { getUserRole } from '~/utils/auth';
import { UserRoleEnum } from '~/types/user';
import { format } from 'date-fns';
import { Calendar, FileText, ChevronLeft, Edit2, Trash2, ExternalLink, Plus } from 'lucide-react';
import { AddSubjectTaskModal } from './AddSubjectTaskModal';
import { EditSubjectTaskModal } from './EditSubjectTaskModal';
import { SubjectTaskCard } from './SubjectTaskCard';
import DeletePrompt from '~/components/common/DeletePrompt';
import type { DailyDiaryResponse, SubjectTaskResponse, AddSubjectTaskRequest, UpdateSubjectTaskRequest } from '~/types/dailyDiary';

interface DailyDiaryDetailProps {
  readOnly?: boolean;
  backUrl?: string;
}

export function DailyDiaryDetail({ readOnly: propReadOnly, backUrl }: DailyDiaryDetailProps = {}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const userRole = getUserRole();
  const isGuardianOrStudent = useMemo(() => {
    return userRole?.role === UserRoleEnum.GUARDIAN ||
           userRole?.role === UserRoleEnum.PARENT ||
           userRole?.role === UserRoleEnum.STUDENT;
  }, [userRole]);

  const readOnly = propReadOnly || isGuardianOrStudent;
  const { data: diary, isLoading, error } = useDiaryEntry(id || '');
  const deleteDiaryMutation = useDeleteDiaryEntry();
  const addTaskMutation = useAddSubjectTask();
  const updateTaskMutation = useUpdateSubjectTask();
  const deleteTaskMutation = useDeleteSubjectTask();

  const permissions = useDailyDiaryPermissions(diary);

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SubjectTaskResponse | null>(null);
  const [isDeleteDiaryModalOpen, setIsDeleteDiaryModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<SubjectTaskResponse | null>(null);

  const handleEdit = () => {
    navigate(`/dashboard/daily-diary/${id}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteDiaryModalOpen(true);
  };

  const confirmDeleteDiary = () => {
    if (!id) return;
    deleteDiaryMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Diary entry deleted successfully');
        navigate('/dashboard/daily-diary');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to delete diary entry');
        setIsDeleteDiaryModalOpen(false);
      }
    });
  };

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else if (isGuardianOrStudent) {
      navigate(-1);
    } else {
      navigate('/dashboard/daily-diary');
    }
  };

  const handleAddTask = async (taskData: AddSubjectTaskRequest) => {
    if (!id) return;
    try {
      await addTaskMutation.mutateAsync({ diaryId: id, taskData });
      toast.success('Task added successfully');
      setIsAddTaskModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add task');
    }
  };

  const handleEditTask = (task: SubjectTaskResponse) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updateData: UpdateSubjectTaskRequest) => {
    if (!id) return;
    try {
      await updateTaskMutation.mutateAsync({ diaryId: id, taskId, updateData });
      toast.success('Task updated successfully');
      setIsEditTaskModalOpen(false);
      setSelectedTask(null);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = (task: SubjectTaskResponse) => {
    setTaskToDelete(task);
    setIsDeleteTaskModalOpen(true);
  };

  const confirmDeleteTask = () => {
    if (!id || !taskToDelete) return;
    deleteTaskMutation.mutate(
      { diaryId: id, taskId: taskToDelete.id },
      {
        onSuccess: () => {
          toast.success('Task deleted successfully');
          setIsDeleteTaskModalOpen(false);
          setTaskToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to delete task');
          setIsDeleteTaskModalOpen(false);
          setTaskToDelete(null);
        }
      }
    );
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
      <div className="py-6 px-4 sm:px-6 lg:px-8">
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
    <div className="py-6 px-4 sm:px-6 lg:px-8">
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
        
        {!readOnly && (
          <div className="flex space-x-3">
            {permissions.canEditDiary && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
            {permissions.canDeleteDiary && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
          </div>
        )}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Subject Tasks</h2>
            {!readOnly && permissions.canAddSubjectTask && (
              <button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </button>
            )}
          </div>

          {diary.subjectTasks.length === 0 ? (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              No subject tasks added for this diary entry.
            </div>
          ) : (
            <div className="space-y-4">
              {diary.subjectTasks.map((task) => (
                <SubjectTaskCard
                  key={task.id}
                  task={task}
                  canEdit={!readOnly && permissions.canEditTask(task)}
                  canDelete={!readOnly && permissions.canDeleteTask(task)}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task)}
                />
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

      <AddSubjectTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleAddTask}
        isLoading={addTaskMutation.isPending}
        classId={diary.classId.id}
      />

      <EditSubjectTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmit={handleUpdateTask}
        isLoading={updateTaskMutation.isPending}
      />

      <DeletePrompt
        isOpen={isDeleteDiaryModalOpen}
        onClose={() => setIsDeleteDiaryModalOpen(false)}
        onConfirm={confirmDeleteDiary}
        itemName="diary entry"
      />

      <DeletePrompt
        isOpen={isDeleteTaskModalOpen}
        onClose={() => {
          setIsDeleteTaskModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDeleteTask}
        itemName="task"
      />
    </div>
  );
}
