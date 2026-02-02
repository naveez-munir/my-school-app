import { Trash2 } from 'lucide-react';
import type { Control, FieldErrors } from 'react-hook-form';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DocumentUploader } from '~/components/student/form/DocumentUploader';
import { FormField } from '~/components/common/form/FormField';
import type { CreateStaffFormData } from '~/utils/validation/staffValidation';

interface EducationItemProps {
  index: number;
  control: Control<CreateStaffFormData>;
  errors: FieldErrors<CreateStaffFormData>;
  onRemove: () => void;
  isSubmitting: boolean;
  staffId?: string;
}

export function EducationItem({
  index,
  control,
  errors,
  onRemove,
  isSubmitting,
  staffId = ""
}: EducationItemProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-medium">Education #{index + 1}</h5>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800"
          disabled={isSubmitting}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
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
              disabled={isSubmitting}
            />
          )}
        />

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
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="mb-4">
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
              disabled={isSubmitting}
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
              folder={`staff/${staffId}/education/${index}`}
              label="Certificate"
            />
          )}
        />
      </div>
    </div>
  );
}
