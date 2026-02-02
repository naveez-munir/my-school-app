import { Plus, X } from 'lucide-react';
import type { Control, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import type { CreateTeacherFormData } from '~/utils/validation/teacherValidation';
import { FormField } from '../common/form/FormField';
import { TextInput } from '../common/form/inputs/TextInput';
import { DocumentUploader } from '../student/form/DocumentUploader';

interface EducationFormProps {
  control: Control<CreateTeacherFormData>;
  errors: FieldErrors<CreateTeacherFormData>;
  fieldArray: UseFieldArrayReturn<CreateTeacherFormData, 'educationHistory'>;
  qualifications: string[];
}

export function EducationForm({ control, errors, fieldArray, qualifications = [] }: EducationFormProps) {
  const { fields, append, remove } = fieldArray;

  const handleAdd = () => {
    append({
      degree: '',
      institution: '',
      year: new Date().getFullYear(),
      certificateUrl: undefined,
    });
  };

  return (
    <div className="space-y-6">
      {qualifications.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Teacher Qualifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {qualifications.map((item, index) => (
              <div key={index} className="bg-white px-3 py-1.5 rounded-full text-sm font-medium text-blue-700 border border-blue-200 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              name={`educationHistory.${index}.degree`}
              control={control}
              errors={errors}
              render={(fieldProps) => (
                <TextInput
                  label="Degree"
                  value={fieldProps.value || ''}
                  onChange={fieldProps.onChange}
                  required
                />
              )}
            />
            <FormField
              name={`educationHistory.${index}.institution`}
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
              name={`educationHistory.${index}.year`}
              control={control}
              errors={errors}
              render={(fieldProps) => (
                <TextInput
                  label="Year"
                  value={fieldProps.value?.toString() || ''}
                  onChange={(value) => fieldProps.onChange(parseInt(value) || 0)}
                  type="number"
                  required
                />
              )}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <FormField
              name={`educationHistory.${index}.certificateUrl`}
              control={control}
              errors={errors}
              render={(fieldProps) => (
                <DocumentUploader
                  currentDocumentUrl={fieldProps.value || ''}
                  documentType="Degree Certificate"
                  onDocumentChange={fieldProps.onChange}
                  folder={`teachers/education/${index}`}
                  label="Certificate"
                />
              )}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Education
      </button>
    </div>
  );
}
