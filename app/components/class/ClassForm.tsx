import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import type { Subject } from '~/types/subject';
import type { Class, CreateClassDto } from '~/types/class';
import GenericCombobox from '../common/form/inputs/Select';
import { TextInput } from '../common/form/inputs/TextInput';
import { FormActions } from '../common/form/FormActions';
import { FormField } from '../common/form/FormField';
import { GradeSelector } from '../common/GradeSelector';
import { createClassSchema, type CreateClassFormData } from '~/utils/validation/classValidation';

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
  const { control, handleSubmit: handleFormSubmit, formState: { errors }, watch, setValue } = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      className: initialData?.className || '',
      classSection: initialData?.classSection || '',
      classGradeLevel: initialData?.classGradeLevel || '',
      classSubjects: initialData?.classSubjects?.map(subject => subject._id) || [],
      classTeacher: initialData?.classTeacher?._id || undefined,
      classTempTeacher: initialData?.classTempTeacher?._id || undefined,
    }
  });

  const formData = watch();

  // Get selected subjects details for tags
  const selectedSubjectsDetails = subjects.filter(subject =>
    formData.classSubjects?.includes(subject._id)
  );

  // Get available subjects (not selected)
  const availableSubjects = subjects.filter(subject =>
    !formData.classSubjects?.includes(subject._id)
  );

  const handleRemoveSubject = (subjectId: string) => {
    const updatedSubjects = formData.classSubjects?.filter(id => id !== subjectId) || [];
    setValue('classSubjects', updatedSubjects, { shouldValidate: true });
  };

  const handleAddSubject = (subject: Subject | null) => {
    if (subject) {
      const updatedSubjects = [...(formData.classSubjects || []), subject._id];
      setValue('classSubjects', updatedSubjects, { shouldValidate: true });
    }
  };

  const onFormSubmit = (data: CreateClassFormData) => {
    console.log('Form validation passed, submitting data:', data);
    onSubmit(data);
  };

  const onFormError = (errors: any) => {
    console.log('Form validation failed, errors:', errors);
  };

  const handleFormSubmitWithValidation = handleFormSubmit(onFormSubmit, onFormError);

  return (
    <form onSubmit={handleFormSubmitWithValidation} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <FormField
          name="className"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Class Name"
              value={field.value}
              onChange={field.onChange}
              required
              placeholder="Enter class name (e.g., Grade 1, Class A)"
              disabled={isLoading}
            />
          )}
        />

        <FormField
          name="classSection"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Section"
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="A, B, C"
              disabled={isLoading}
            />
          )}
        />

        <FormField
          name="classGradeLevel"
          control={control}
          errors={errors}
          render={(field) => (
            <GradeSelector
              value={field.value || ''}
              onChange={field.onChange}
              label="Grade Level"
              required
              disabled={isLoading}
            />
          )}
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
