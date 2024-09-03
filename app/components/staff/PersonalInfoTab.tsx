import type { Control, FieldErrors } from 'react-hook-form';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { BloodGroup, Gender } from '~/types/teacher';
import { PhotoUpload } from '~/components/student/form/PhotoUpload';
import { FormField } from '~/components/common/form/FormField';
import type { CreateStaffFormData } from '~/utils/validation/staffValidation';

interface PersonalInfoTabProps {
  control: Control<CreateStaffFormData>;
  errors: FieldErrors<CreateStaffFormData>;
  photoUrl?: string;
  isSubmitting: boolean;
  onPhotoChange: (url: string) => void;
  staffId?: string;
}

export function PersonalInfoTab({
  control,
  errors,
  photoUrl,
  isSubmitting,
  onPhotoChange,
  staffId = ""
}: PersonalInfoTabProps) {

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Member Photo</h3>
        <div className="flex justify-center">
          <PhotoUpload
            currentPhoto={photoUrl || ''}
            onPhotoChange={onPhotoChange}
            folder={`staff/${staffId}/profile`}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="firstName"
            control={control}
            errors={errors}
            render={(field) => (
              <TextInput
                label="First Name"
                value={field.value}
                onChange={field.onChange}
                required
                disabled={isSubmitting}
                placeholder="Enter first name"
              />
            )}
          />

          <FormField
            name="lastName"
            control={control}
            errors={errors}
            render={(field) => (
              <TextInput
                label="Last Name"
                value={field.value}
                onChange={field.onChange}
                required
                disabled={isSubmitting}
                placeholder="Enter last name"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            name="cniNumber"
            control={control}
            errors={errors}
            render={(field) => (
              <TextInput
                label="CNI Number"
                value={field.value}
                onChange={field.onChange}
                required
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            name="email"
            control={control}
            errors={errors}
            render={(field) => (
              <TextInput
                label="Email"
                type="email"
                value={field.value || ''}
                onChange={field.onChange}
                disabled={isSubmitting}
                placeholder="email@example.com"
              />
            )}
          />

          <FormField
            name="phone"
            control={control}
            errors={errors}
            render={(field) => (
              <TextInput
                label="Phone"
                value={field.value || ''}
                onChange={field.onChange}
                disabled={isSubmitting}
                placeholder="+1234567890"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            name="bloodGroup"
            control={control}
            errors={errors}
            render={(field) => (
              <SelectInput<typeof BloodGroup>
                label="Blood Group"
                value={field.value || ''}
                onChange={field.onChange}
                options={BloodGroup}
                placeholder="Select Blood Group"
                disabled={isSubmitting}
              />
            )}
          />
        </div>

        <div className="mt-4">
          <FormField
            name="address"
            control={control}
            errors={errors}
            render={(field) => (
              <TextInput
                label="Address"
                value={field.value || ''}
                onChange={field.onChange}
                disabled={isSubmitting}
                placeholder="Enter address"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
