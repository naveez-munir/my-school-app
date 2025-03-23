import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { GuardianRelationship, type Guardian } from '~/types/student';
interface GuardianFormFieldsProps {
  data: Guardian;
  onChange: <K extends keyof Guardian>(
    field: K,
    value: Guardian[K]
  ) => void;
}

export function GuardianFormFields({ data, onChange }: GuardianFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TextInput 
        label="Guardian Name"
        value={data.name}
        onChange={(value) => onChange('name', value)}
        required
      />

      <TextInput 
        label="CNI Number"
        value={data.cniNumber}
        onChange={(value) => onChange('cniNumber', value)}
        required
      />

      <SelectInput<typeof GuardianRelationship>
        label="Relationship"
        value={data.relationship}
        onChange={(value) => onChange('relationship', value)}
        options={GuardianRelationship}
        placeholder="Select Relationship"
        required
      />

      <TextInput 
        label="Phone"
        value={data.phone || ''}
        onChange={(value) => onChange('phone', value)}
        type="tel"
        required
      />
      
      <TextInput 
        label="Email"
        value={data.email || ''}
        onChange={(value) => onChange('email', value)}
        type="email"
      />
    </div>
  );
}
