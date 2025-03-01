import { useEffect, useState } from 'react';
import type { SubjectDto, SubjectModalProps } from '~/types/subject';
import { TextInput } from '../common/form/inputs/TextInput';
import { FormActions } from '../common/form/FormActions';

export function SubjectModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  isSubmitting = false 
}: SubjectModalProps) {
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
  }, [initialData, isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          {initialData ? 'Edit Course' : 'Add New Course'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <TextInput
              label="Subject Name"
              value={formData.subjectName}
              onChange={(value) => setFormData(prev => ({ ...prev, subjectName: value }))}
              required
              placeholder="Enter subject name"
              disabled={isSubmitting}
            />
            
            <TextInput
              label="Subject Code"
              value={formData.subjectCode}
              onChange={(value) => setFormData(prev => ({ ...prev, subjectCode: value }))}
              required
              placeholder="Enter subject code"
              disabled={isSubmitting}
            />
          </div>

          <div className="mt-6">
            <FormActions
              mode={initialData ? 'edit' : 'create'}
              entityName="Course"
              onCancel={onClose}
              isLoading={isSubmitting}
              onSubmit={undefined}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
