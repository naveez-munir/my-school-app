// components/form/GuardianInfoStep.tsx
import { useState } from 'react';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { GuardianRelationship } from '~/types/student';
import type { CreateStudentDto } from '~/types/student';

interface GuardianInfoStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
}

export function GuardianInfoStep({ data, onComplete, onBack }: GuardianInfoStepProps) {
  const [formData, setFormData] = useState({
    guardian: {
      name: data.guardian?.name || '',
      cniNumber: data.guardian?.cniNumber || '',
      relationship: data.guardian?.relationship || GuardianRelationship.Father,
      phone: data.guardian?.phone || '',
      email: data.guardian?.email || '',
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput 
         label='Guardian Name'
         value={formData.guardian.name}
         onChange={(value) => setFormData(prev => ({
           ...prev,
           guardian: { ...prev.guardian, name: value }
         }))}
         required
        />

        <TextInput 
          label='CNI Number'
          value={formData.guardian.cniNumber}
          onChange={(value) => setFormData(prev => ({
            ...prev,
            guardian: { ...prev.guardian, cniNumber: value }
          }))}
          required
        />

        <SelectInput<typeof GuardianRelationship>
          label="Relationship"
          value={formData.guardian.relationship}
          onChange={(value) => setFormData(prev => ({
            ...prev,
            guardian: { ...prev.guardian, relationship: value }
          }))}
          options={GuardianRelationship}
          placeholder="Select Relationship"
          required
        />

        <TextInput 
         label='Phone'
         value={formData.guardian.phone}
         onChange={(value) => setFormData(prev => ({
           ...prev,
           guardian: { ...prev.guardian, phone: value }
         }))}
         type='tel'
         required
        />
        <TextInput 
         label='Email'
         value={formData.guardian.email}
         onChange={(value) => setFormData(prev => ({
           ...prev,
           guardian: { ...prev.guardian, email: value }
         }))}
         type='email'
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );
}
