import type { Control, FieldErrors } from 'react-hook-form';
import { EmploymentStatus, Gender, BloodGroup } from '~/types/teacher';
import { TextInput } from '../common/form/inputs/TextInput';
import { TextArea } from '../common/form/inputs/TextArea';
import { SelectInput } from '../common/form/inputs/SelectInput';
import { DateInput } from '../common/form/inputs/DateInput';
import { FormField } from '../common/form/FormField';
import { useParams } from 'react-router';
import type { CreateTeacherFormData } from '~/utils/validation/teacherValidation';

interface BasicInfoFormProps {
  control: Control<CreateTeacherFormData>;
  errors: FieldErrors<CreateTeacherFormData>;
  assignedClassName?: string;
}

export function BasicInfoForm({ control, errors, assignedClassName }: BasicInfoFormProps) {
  const { id } = useParams();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Basic Information Fields */}
      <FormField
        name="cniNumber"
        control={control}
        errors={errors}
        render={(field) => (
          <TextInput
            label='CNI Number'
            required
            value={field.value}
            onChange={field.onChange}
            placeholder="12345-1234567-1"
          />
        )}
      />

      <FormField
        name="gender"
        control={control}
        errors={errors}
        render={(field) => (
          <SelectInput<typeof Gender>
            label="Gender"
            value={field.value}
            onChange={field.onChange}
            options={Gender}
            placeholder="Select Gender"
            required
          />
        )}
      />

      <FormField
        name="firstName"
        control={control}
        errors={errors}
        render={(field) => (
          <TextInput
            label='First Name'
            required
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <FormField
        name="lastName"
        control={control}
        errors={errors}
        render={(field) => (
          <TextInput
            label='Last Name'
            required
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <FormField
        name="email"
        control={control}
        errors={errors}
        render={(field) => (
          <TextInput
            label='Email'
            value={field.value || ''}
            onChange={field.onChange}
            type='email'
          />
        )}
      />

      <FormField
        name="phone"
        control={control}
        errors={errors}
        render={(field) => (
          <TextInput
            label='Phone'
            value={field.value || ''}
            onChange={field.onChange}
            type='tel'
            placeholder="03XXXXXXXXX"
          />
        )}
      />

      <FormField
        name="bloodGroup"
        control={control}
        errors={errors}
        render={(field) => (
          <SelectInput<typeof BloodGroup>
            label="Blood Group"
            value={field.value}
            onChange={field.onChange}
            options={BloodGroup}
            placeholder="Select Blood Group"
          />
        )}
      />

      <FormField
        name="joiningDate"
        control={control}
        errors={errors}
        render={(field) => (
          <DateInput
            label='Joining Date'
            value={field.value}
            onChange={field.onChange}
            required
          />
        )}
      />

      <FormField
        name="employmentStatus"
        control={control}
        errors={errors}
        render={(field) => (
          <SelectInput<typeof EmploymentStatus>
            label="Employment Status"
            value={field.value}
            onChange={field.onChange}
            options={EmploymentStatus}
            placeholder="Select Employee status"
            required
          />
        )}
      />
      {id && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned Class
          </label>
          <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600">
            {assignedClassName || 'Not assigned'}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            To change class assignment, use the Class Management section
          </p>
        </div>
      )}

      <div className="col-span-1 md:col-span-2">
        <FormField
          name="address"
          control={control}
          errors={errors}
          render={(field) => (
            <TextArea
              label='Address'
              value={field.value || ''}
              onChange={field.onChange}
              rows={3}
            />
          )}
        />
      </div>
    </div>
  );
}
