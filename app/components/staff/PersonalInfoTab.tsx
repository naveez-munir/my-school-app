import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { type CreateStaffRequest } from '~/types/staff';
import { BloodGroup, Gender } from '~/types/teacher';

interface PersonalInfoTabProps {
  formData: CreateStaffRequest;
  isSubmitting: boolean;
  handleInputChange: (field: keyof CreateStaffRequest, value: any) => void;
}

export function PersonalInfoTab({ 
  formData, 
  isSubmitting, 
  handleInputChange 
}: PersonalInfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChange={(value) => handleInputChange('firstName', value)}
          required
          disabled={isSubmitting}
        />
        
        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChange={(value) => handleInputChange('lastName', value)}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="CNI Number"
          value={formData.cniNumber}
          onChange={(value) => handleInputChange('cniNumber', value)}
          required
          disabled={isSubmitting}
        />
        
        <SelectInput
          label="Gender"
          value={formData.gender as Gender || ''}
          options={Gender}
          onChange={(value) => handleInputChange('gender', value)}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(value) => handleInputChange('email', value)}
          disabled={isSubmitting}
        />
        
        <TextInput
          label="Phone"
          value={formData.phone || ''}
          onChange={(value) => handleInputChange('phone', value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput<typeof BloodGroup>
          label="Blood Group"
          value={formData?.bloodGroup as BloodGroup || ''}
          onChange={(value) => handleInputChange('bloodGroup', value)}
          options={BloodGroup}
          placeholder="Select Blood Group"
          required
        />
        
        <TextInput
          label="Photo URL"
          value={formData.photoUrl || ''}
          onChange={(value) => handleInputChange('photoUrl', value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <TextInput
          label="Address"
          value={formData.address || ''}
          onChange={(value) => handleInputChange('address', value)}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
