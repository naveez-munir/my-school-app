import { useEffect, useState } from 'react';
import type { SubjectDto, SubjectModalProps } from '~/types/subject';

export function SubjectModal({ isOpen, onClose, onSubmit, initialData }: SubjectModalProps) {
  const [formData, setFormData] = useState<SubjectDto>(initialData || {
    subjectName: '',
    subjectCode: ''
  });
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ subjectName: "", subjectCode: "" });
    }
  }, [initialData, isOpen])
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-1 border-gray-200">
        <h3 className="text-lg font-medium mb-4">
          {initialData ? 'Edit Course' : 'Add New Course'}
        </h3>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject Name</label>
              <input
                type="text"
                required
                value={formData.subjectName}
                onChange={(e) => setFormData(prev => ({ ...prev, subjectName: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject Code</label>
              <input
                type="text"
                required
                value={formData.subjectCode}
                onChange={(e) => setFormData(prev => ({ ...prev, subjectCode: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
