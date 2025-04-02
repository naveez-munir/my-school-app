import { TextInput } from '~/components/common/form/inputs/TextInput';
import { type EmergencyContact } from '~/types/staff';

interface EmergencyContactTabProps {
  emergencyContact: EmergencyContact;
  setEmergencyContact: React.Dispatch<React.SetStateAction<EmergencyContact>>;
  isSubmitting: boolean;
}

export function EmergencyContactTab({
  emergencyContact,
  setEmergencyContact,
  isSubmitting
}: EmergencyContactTabProps) {
  const handleChange = (field: keyof EmergencyContact, value: string) => {
    setEmergencyContact(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium">Emergency Contact Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Name"
          value={emergencyContact.name || ''}
          onChange={(value) => handleChange('name', value)}
          disabled={isSubmitting}
        />
        
        <TextInput
          label="Relationship"
          value={emergencyContact.relationship || ''}
          onChange={(value) => handleChange('relationship', value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Phone"
          value={emergencyContact.phone || ''}
          onChange={(value) => handleChange('phone', value)}
          disabled={isSubmitting}
        />
        
        <TextInput
          label="Address"
          value={emergencyContact.address || ''}
          onChange={(value) => handleChange('address', value)}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
