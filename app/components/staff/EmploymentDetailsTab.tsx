import type { Control, FieldErrors } from 'react-hook-form';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { UserRole, EmploymentStatus } from '~/types/staff';
import { ListItemManager } from './ListItemManager';
import { FormField } from '~/components/common/form/FormField';
import type { CreateStaffFormData } from '~/utils/validation/staffValidation';

interface EmploymentDetailsTabProps {
  control: Control<CreateStaffFormData>;
  errors: FieldErrors<CreateStaffFormData>;
  isSubmitting: boolean;
  handleAddQualification: () => void;
  handleUpdateQualification: (index: number, value: string) => void;
  handleRemoveQualification: (index: number) => void;
  handleAddSkill: () => void;
  handleUpdateSkill: (index: number, value: string) => void;
  handleRemoveSkill: (index: number) => void;
  handleAddResponsibility: () => void;
  handleUpdateResponsibility: (index: number, value: string) => void;
  handleRemoveResponsibility: (index: number) => void;
  qualifications: string[];
  skills: string[];
  responsibilities: string[];
}

export function EmploymentDetailsTab({
  control,
  errors,
  isSubmitting,
  handleAddQualification,
  handleUpdateQualification,
  handleRemoveQualification,
  handleAddSkill,
  handleUpdateSkill,
  handleRemoveSkill,
  handleAddResponsibility,
  handleUpdateResponsibility,
  handleRemoveResponsibility,
  qualifications,
  skills,
  responsibilities
}: EmploymentDetailsTabProps) {
  const departmentOptions = {
    'Teaching': 'Teaching',
    'Administration': 'Administration',
    'Accounts': 'Accounts',
    'Library': 'Library',
    'Transport': 'Transport',
    'Security': 'Security',
    'Maintenance': 'Maintenance',
    'Other': 'Other'
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          name="joiningDate"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Joining Date"
              type="date"
              value={field.value}
              onChange={field.onChange}
              required
              disabled={isSubmitting}
            />
          )}
        />

        <FormField
          name="leavingDate"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Leaving Date"
              type="date"
              value={field.value || ''}
              onChange={field.onChange}
              disabled={isSubmitting}
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
              required
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="designation"
          control={control}
          errors={errors}
          render={(field) => (
            <SelectInput<typeof UserRole>
              label="Designation"
              value={field.value}
              onChange={field.onChange}
              options={UserRole}
              required
              disabled={isSubmitting}
            />
          )}
        />

        <FormField
          name="department"
          control={control}
          errors={errors}
          render={(field) => (
            <SelectInput
              label="Department"
              value={field.value || ''}
              onChange={field.onChange}
              options={departmentOptions}
              placeholder="Select Department"
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div>
        <FormField
          name="jobDescription"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Job Description"
              value={field.value || ''}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div>
        <FormField
          name="reportingTo"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Reporting To"
              value={field.value || ''}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* Responsibilities List */}
      <ListItemManager
        title="Responsibilities"
        items={responsibilities}
        onAdd={handleAddResponsibility}
        onUpdate={handleUpdateResponsibility}
        onRemove={handleRemoveResponsibility}
        labelText="Responsibility"
        isSubmitting={isSubmitting}
        emptyText="No responsibilities added"
      />
    </div>
  );
}
