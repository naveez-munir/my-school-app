import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { BloodGroup, Gender } from '~/types/teacher';
import { FormField } from '~/components/common/form/FormField';
import type { CreateStaffFormData } from '~/utils/validation/staffValidation';
import { useUniquenessValidator } from '~/hooks/useUniquenessValidator';

interface PersonalInfoTabProps {
  control: Control<CreateStaffFormData>;
  errors: FieldErrors<CreateStaffFormData>;
  isSubmitting: boolean;
  staffId?: string;
  onUniquenessChange?: (hasErrors: boolean) => void;
}

export function PersonalInfoTab({
  control,
  errors,
  isSubmitting,
  staffId = "",
  onUniquenessChange
}: PersonalInfoTabProps) {
  const { checkCnic, checkEmail, checkPhone } = useUniquenessValidator(
    staffId ? { excludeId: staffId, excludeType: 'staff' } : undefined
  );

  const watchedCni = useWatch({ control, name: 'cniNumber' });
  const watchedEmail = useWatch({ control, name: 'email' });
  const watchedPhone = useWatch({ control, name: 'phone' });

  const uniquenessErrors = useMemo(() => {
    return {
      cniNumber: watchedCni ? checkCnic(watchedCni, 'staff').message : '',
      email: watchedEmail ? checkEmail(watchedEmail, 'staff').message : '',
      phone: watchedPhone ? checkPhone(watchedPhone, 'staff').message : '',
    };
  }, [watchedCni, watchedEmail, watchedPhone, checkCnic, checkEmail, checkPhone]);

  const hasUniquenessErrors = !!(uniquenessErrors.cniNumber || uniquenessErrors.email || uniquenessErrors.phone);

  useEffect(() => {
    onUniquenessChange?.(hasUniquenessErrors);
  }, [hasUniquenessErrors, onUniquenessChange]);

  return (
    <div className="space-y-6">
      <div>
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
          <div>
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
            {uniquenessErrors.cniNumber && (
              <p className="mt-1 text-sm text-red-600">{uniquenessErrors.cniNumber}</p>
            )}
          </div>

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
          <div>
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
            {uniquenessErrors.email && (
              <p className="mt-1 text-sm text-red-600">{uniquenessErrors.email}</p>
            )}
          </div>

          <div>
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
            {uniquenessErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{uniquenessErrors.phone}</p>
            )}
          </div>
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
