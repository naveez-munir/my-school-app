import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubjectDto, SubjectModalProps } from '~/types/subject';
import { TextInput } from '../common/form/inputs/TextInput';
import { FormActions } from '../common/form/FormActions';
import { FormField } from '../common/form/FormField';
import { GradeSelector } from '../common/GradeSelector';
import { createSubjectSchema, type CreateSubjectFormData } from '~/utils/validation/subjectValidation';

export function SubjectModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false
}: SubjectModalProps) {
  const { control, handleSubmit: handleFormSubmit, formState: { errors }, reset } = useForm<CreateSubjectFormData>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      subjectName: initialData?.subjectName || '',
      subjectCode: initialData?.subjectCode || '',
      gradeLevel: initialData?.gradeLevel || ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        subjectName: initialData.subjectName,
        subjectCode: initialData.subjectCode,
        gradeLevel: initialData.gradeLevel || ''
      });
    } else {
      reset({
        subjectName: '',
        subjectCode: '',
        gradeLevel: ''
      });
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = (data: CreateSubjectFormData) => {
    onSubmit(data);
  };

  const handleFormSubmitWithValidation = handleFormSubmit(onFormSubmit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-md border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          {initialData ? 'Edit Subject' : 'Add New Subject'}
        </h3>

        <form onSubmit={handleFormSubmitWithValidation}>
          <div className="space-y-4">
            <FormField
              name="subjectName"
              control={control}
              errors={errors}
              render={(field) => (
                <TextInput
                  label="Subject Name"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  placeholder="Enter subject name (e.g., Mathematics, English)"
                  disabled={isSubmitting}
                />
              )}
            />

            <FormField
              name="subjectCode"
              control={control}
              errors={errors}
              render={(field) => (
                <TextInput
                  label="Subject Code"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  placeholder="Enter subject code (e.g., MATH-101, ENG-01)"
                  disabled={isSubmitting}
                />
              )}
            />

            <FormField
              name="gradeLevel"
              control={control}
              errors={errors}
              render={(field) => (
                <GradeSelector
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          <div className="mt-6">
            <FormActions
              mode={initialData ? 'edit' : 'create'}
              entityName="Subject"
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
