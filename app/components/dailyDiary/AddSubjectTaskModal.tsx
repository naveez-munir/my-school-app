import { useState } from 'react';
import { Modal } from '~/components/common/Modal';
import { SubjectSelector } from '~/components/common/SubjectSelector';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import type { AddSubjectTaskRequest } from '~/types/dailyDiary';

interface AddSubjectTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: AddSubjectTaskRequest) => Promise<void>;
  isLoading: boolean;
  classId?: string;
}

export function AddSubjectTaskModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  classId
}: AddSubjectTaskModalProps) {
  const [formData, setFormData] = useState<AddSubjectTaskRequest>({
    subject: '',
    task: '',
    dueDate: '',
    additionalNotes: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.subject || !formData.task) {
      setError('Subject and task are required');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ subject: '', task: '', dueDate: '', additionalNotes: '' });
      onClose();
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  const handleClose = () => {
    setFormData({ subject: '', task: '', dueDate: '', additionalNotes: '' });
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Subject Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <SubjectSelector
          value={formData.subject}
          onChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
          required
          classId={classId}
        />

        <TextInput
          label="Task"
          value={formData.task}
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
            {isLoading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
