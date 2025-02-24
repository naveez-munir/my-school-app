import { useEffect, useState } from 'react';
import type { SubjectDto, SubjectModalProps } from '~/types/subject';
import { TextInput } from '../common/TextInput';
import { FormActions } from '../common/FormActions';

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
            <TextInput
              label="Subject Name"
              value={formData.subjectName}
              onChange={(value) => setFormData(prev => ({ ...prev, subjectName: value }))}
              required
              placeholder="Enter subject name"
            />
            
            <TextInput
              label="Subject Code"
              value={formData.subjectCode}
              onChange={(value) => setFormData(prev => ({ ...prev, subjectCode: value }))}
              required
              placeholder="Enter subject code"
            />
          </div>

          <div className="mt-6">
            <FormActions
              mode={initialData ? 'edit' : 'create'}
              entityName="Subject"
              onCancel={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
