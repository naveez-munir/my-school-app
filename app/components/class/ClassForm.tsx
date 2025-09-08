import { useState } from 'react';
import { X } from 'lucide-react';
import type { Subject } from '~/types/subject';
import type { Class, CreateClassDto } from '~/types/class';
import GenericCombobox from '../common/form/inputs/Select';
import { TextInput } from '../common/form/inputs/TextInput';
import { FormActions } from '../common/form/FormActions';
import { GradeSelector } from '../common/GradeSelector';

interface ClassFormProps {
  initialData?: Class;
  onSubmit: (data: CreateClassDto) => void;
  subjects: Subject[];
  isLoading: boolean;
  mode: 'create' | 'edit';
}

export function ClassForm({
  initialData,
  onSubmit,
  subjects,
  isLoading,
  mode
}: ClassFormProps) {
  const [formData, setFormData] = useState<CreateClassDto>({
    className: initialData?.className || '',
    classSection: initialData?.classSection || '',
    classGradeLevel: initialData?.classGradeLevel || '',
    classSubjects: initialData?.classSubjects?.map(subject => subject._id) || []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateClassDto, string>>>({});

  // Get selected subjects details for tags
  const selectedSubjectsDetails = subjects.filter(subject => 
    formData.classSubjects?.includes(subject._id)
  );

  // Get available subjects (not selected)
  const availableSubjects = subjects.filter(subject => 
    !formData.classSubjects?.includes(subject._id)
  );

  const handleChange = (field: keyof CreateClassDto, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    const updatedSubjects = formData.classSubjects?.filter(id => id !== subjectId) || [];
    handleChange('classSubjects', updatedSubjects);
  };

  const handleAddSubject = (subject: Subject | null) => {
    if (subject) { // Check if subject is not null
      const updatedSubjects = [...(formData.classSubjects || []), subject._id];
      handleChange('classSubjects', updatedSubjects);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateClassDto, string>> = {};
    if (!formData.className.trim()) {
      newErrors.className = 'Class name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <TextInput
          label="Class Name"
          value={formData.className}
          onChange={(value) => handleChange('className', value)}
          error={errors.className}
          required
          placeholder="Enter class name"
        />
        <TextInput
          label="Section"
          value={formData.classSection || ''}
          onChange={(value) => handleChange('classSection', value)}
          error={errors.className}
          placeholder="A, B, C"
        />
        <GradeSelector
          value={formData.classGradeLevel || ''}
          onChange={(value) => handleChange('classGradeLevel', value)}
          label="Grade Level"
          required
        />
      </div>

      {/* Subjects Section */}
      {mode === 'edit' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Subjects
          </label>
          
          {/* Selected Subjects Tags */}
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedSubjectsDetails.map((subject) => (
              <div
                key={subject._id}
                className="inline-flex items-center bg-blue-50 text-blue-700 rounded-md px-2 py-1 text-sm"
              >
                <span>{subject.subjectName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(subject._id)}
                  className="ml-1 hover:text-blue-900 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {availableSubjects.length > 0 && (
            <GenericCombobox<Subject>
              items={availableSubjects}
              value={null}
              onChange={handleAddSubject}
              displayKey="subjectName"
              valueKey="_id"
              placeholder="Add subjects..."
            />
          )}
        </div>
      )}

      <FormActions
        isLoading={isLoading}
        mode={mode}
        entityName="Class"
      />
    </form>
  );
}
