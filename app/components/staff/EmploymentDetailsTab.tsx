import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { type CreateStaffRequest, UserRole } from '~/types/staff';
import { ListItemManager } from './ListItemManager';

interface EmploymentDetailsTabProps {
  formData: CreateStaffRequest;
  isSubmitting: boolean;
  handleInputChange: (field: keyof CreateStaffRequest, value: any) => void;
  handleAddQualification: () => void;
  handleUpdateQualification: (index: number, value: string) => void;
  handleRemoveQualification: (index: number) => void;
  handleAddSkill: () => void;
  handleUpdateSkill: (index: number, value: string) => void;
  handleRemoveSkill: (index: number) => void;
  handleAddResponsibility: () => void;
  handleUpdateResponsibility: (index: number, value: string) => void;
  handleRemoveResponsibility: (index: number) => void;
}

export function EmploymentDetailsTab({
  formData,
  isSubmitting,
  handleInputChange,
  handleAddQualification,
  handleUpdateQualification,
  handleRemoveQualification,
  handleAddSkill,
  handleUpdateSkill,
  handleRemoveSkill,
  handleAddResponsibility,
  handleUpdateResponsibility,
  handleRemoveResponsibility
}: EmploymentDetailsTabProps) {
  const employmentStatusOptions = {
    'Active': 'Active',
    'OnLeave': 'On Leave',
    'Resigned': 'Resigned',
    'Terminated': 'Terminated'
  };

  // const designationOptions = {
  //   [UserRole.ADMIN]: 'Admin',
  //   [UserRole.PRINCIPAL]: 'Principal',
  //   [UserRole.ACCOUNTANT]: 'Accountant',
  //   [UserRole.LIBRARIAN]: 'Librarian',
  //   [UserRole.DRIVER]: 'Driver',
  //   [UserRole.SECURITY]: 'Security',
  //   [UserRole.CLEANER]: 'Cleaner',
  //   [UserRole.TENANT_ADMIN]: 'Tenant Admin'
  // };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateInput
          label="Joining Date"
          value={formData.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : ''}
          onChange={(value) => handleInputChange('joiningDate', new Date(value))}
          required
          disabled={isSubmitting}
        />
        
        <DateInput
          label="Leaving Date"
          value={formData.leavingDate ? new Date(formData.leavingDate).toISOString().split('T')[0] : ''}
          onChange={(value) => handleInputChange('leavingDate', new Date(value))}
          disabled={isSubmitting}
        />
        
        <SelectInput
          label="Employment Status"
          value={formData.employmentStatus}
          options={employmentStatusOptions}
          onChange={(value) => handleInputChange('employmentStatus', value)}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="Designation"
          value={formData.designation}
          options={UserRole}
          onChange={(value) => handleInputChange('designation', value)}
          required
          disabled={isSubmitting}
        />
        
        <TextInput
          label="Department"
          value={formData.department || ''}
          onChange={(value) => handleInputChange('department', value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <TextInput
          label="Job Description"
          value={formData.jobDescription || ''}
          onChange={(value) => handleInputChange('jobDescription', value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <TextInput
          label="Reporting To"
          value={formData.reportingTo || ''}
          onChange={(value) => handleInputChange('reportingTo', value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Responsibilities List */}
      <ListItemManager
        title="Responsibilities"
        items={formData.responsibilities || []}
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
