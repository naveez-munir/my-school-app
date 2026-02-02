import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Subject } from '~/types/subject';
import type { Class, CreateClassDto } from '~/types/class';
import MultiSelect from '../common/form/inputs/MultiSelect';
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

  // Get selected subjects as full objects for MultiSelect
  const selectedSubjects = subjects.filter(subject =>
    formData.classSubjects?.includes(subject._id)
  );

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
        <FormField
          name="classSubjects"
          control={control}
          errors={errors}
          render={(field) => (
            <MultiSelect<Subject>
              items={subjects}
              value={selectedSubjects}
              onChange={(selected) => {
                const subjectIds = selected.map(s => s._id);
                field.onChange(subjectIds);
              }}
              displayKey="subjectName"
              valueKey="_id"
              label="Subjects"
              placeholder="Select subjects..."
              disabled={isLoading}
              showTags={true}
            />
          )}
        />
      )}

      <FormActions
        isLoading={isLoading}
        mode={mode}
        entityName="Class"
      />
    </form>
  );
}
