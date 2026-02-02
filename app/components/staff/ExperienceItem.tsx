import { Trash2 } from 'lucide-react';
import type { Control, FieldErrors } from 'react-hook-form';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { DocumentUploader } from '~/components/student/form/DocumentUploader';
import { FormField } from '~/components/common/form/FormField';
import type { CreateStaffFormData } from '~/utils/validation/staffValidation';

interface ExperienceItemProps {
  index: number;
  control: Control<CreateStaffFormData>;
  errors: FieldErrors<CreateStaffFormData>;
  onRemove: () => void;
  isSubmitting: boolean;
  staffId?: string;
}

export function ExperienceItem({
  index,
  control,
  errors,
  onRemove,
  isSubmitting,
  staffId = ""
}: ExperienceItemProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-medium">Experience #{index + 1}</h5>
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
          name={`experience.${index}.institution`}
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
          name={`experience.${index}.position`}
          control={control}
          errors={errors}
          render={(fieldProps) => (
            <TextInput
              label="Position"
              value={fieldProps.value || ''}
              onChange={fieldProps.onChange}
              required
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <FormField
          name={`experience.${index}.fromDate`}
          control={control}
          errors={errors}
          render={(fieldProps) => (
            <DateInput
              label="From Date"
              value={fieldProps.value || ''}
              onChange={fieldProps.onChange}
              required
              disabled={isSubmitting}
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
              value={fieldProps.value || ''}
              onChange={fieldProps.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="mb-4">
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
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <FormField
          name={`experience.${index}.experienceLatterUrl`}
          control={control}
          errors={errors}
          render={(fieldProps) => (
            <DocumentUploader
              currentDocumentUrl={fieldProps.value || ''}
              documentType="Experience Letter"
              onDocumentChange={fieldProps.onChange}
              folder={`staff/${staffId}/experience/${index}`}
              label="Experience Letter"
            />
          )}
        />
      </div>
    </div>
  );
}
