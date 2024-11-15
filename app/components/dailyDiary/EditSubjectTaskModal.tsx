import { useState, useEffect } from 'react';
import { Modal } from '~/components/common/Modal';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import type { SubjectTaskResponse, UpdateSubjectTaskRequest } from '~/types/dailyDiary';

interface EditSubjectTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: SubjectTaskResponse | null;
  onSubmit: (taskId: string, updateData: UpdateSubjectTaskRequest) => Promise<void>;
  isLoading: boolean;
}

export function EditSubjectTaskModal({
  isOpen,
  onClose,
  task,
  onSubmit,
  isLoading
}: EditSubjectTaskModalProps) {
  const [formData, setFormData] = useState<UpdateSubjectTaskRequest>({
    task: '',
    dueDate: '',
    additionalNotes: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        task: task.task,
        dueDate: task.dueDate || '',
        additionalNotes: task.additionalNotes || ''
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.task) {
      setError('Task description is required');
      return;
    }

    if (!task) {
      setError('Task data is missing');
      return;
    }

    try {
      await onSubmit(task.id, formData);
      onClose();
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Subject Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-md">
          <span className="text-sm font-medium text-gray-700">Subject: </span>
          <span className="text-sm text-gray-900">{task.subject.subjectName}</span>
        </div>

        <TextInput
          label="Task"
          value={formData.task || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, task: value }))}
          placeholder="e.g., Complete Chapter 5 exercises 1-20"
          required
        />

        <DateInput
          label="Due Date"
          value={formData.dueDate || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, dueDate: value }))}
        />

        <TextInput
          label="Additional Notes"
          value={formData.additionalNotes || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, additionalNotes: value }))}
          placeholder="Any additional information..."
        />

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
