import { Plus, X } from 'lucide-react';
import type { Control, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import type { CreateTeacherFormData } from '~/utils/validation/teacherValidation';
import { FormField } from '../common/form/FormField';
import { TextInput } from '../common/form/inputs/TextInput';
import { DateInput } from '../common/form/inputs/DateInput';
import { TextArea } from '../common/form/inputs/TextArea';
import { DocumentUploader } from '../student/form/DocumentUploader';

interface ExperienceFormProps {
  control: Control<CreateTeacherFormData>;
  errors: FieldErrors<CreateTeacherFormData>;
  fieldArray: UseFieldArrayReturn<CreateTeacherFormData, 'experience'>;
}

export function ExperienceForm({ control, errors, fieldArray }: ExperienceFormProps) {
  const { fields, append, remove } = fieldArray;

  const handleAdd = () => {
    append({
      institution: '',
      position: '',
      fromDate: new Date(),
      toDate: undefined,
      description: '',
      experienceLatterUrl: undefined,
    });
  };

  const formatDateValue = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="relative bg-gray-50 p-4 rounded-lg">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name={`experience.${index}.institution`}
              control={control}
              errors={errors}
              render={(fieldProps) => (
                <TextInput
                  label="Institution"
                  value={fieldProps.value || ''}
                  onChange={fieldProps.onChange}
                  required
                />
              )}
            />
            <FormField
              name={`experience.${index}.position`}
              control={control}
              errors={errors}
              render={(fieldProps) => (
                <TextInput
                  label="Position"
                  value={fieldProps.value || ''}
                  onChange={fieldProps.onChange}
                  required
                />
              )}
            />
            <FormField
              name={`experience.${index}.fromDate`}
              control={control}
              errors={errors}
              render={(fieldProps) => (
                <DateInput
                  label="From Date"
                  value={formatDateValue(fieldProps.value)}
                  onChange={fieldProps.onChange}
                  required
                />
              )}
            />
            <FormField
              name={`experience.${index}.toDate`}
              control={control}
              errors={errors}
              render={(fieldProps) => (
                <DateInput
                  label="To Date"
                  value={formatDateValue(fieldProps.value)}
                  onChange={fieldProps.onChange}
                />
              )}
            />

            <div className="md:col-span-2">
              <FormField
                name={`experience.${index}.description`}
                control={control}
                errors={errors}
                render={(fieldProps) => (
                  <TextArea
                    label="Description"
                    value={fieldProps.value || ''}
                    onChange={fieldProps.onChange}
                    rows={3}
                  />
                )}
              />
            </div>

            <FormField
              name={`experience.${index}.experienceLatterUrl`}
              control={control}
              errors={errors}
              render={(fieldProps) => (
                <DocumentUploader
                  currentDocumentUrl={fieldProps.value || ''}
                  documentType="Experience Letter"
                  onDocumentChange={fieldProps.onChange}
                  folder={`teachers/experience/${index}`}
                  label="Experience Letter"
                />
              )}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Experience
      </button>
    </div>
  );
}
