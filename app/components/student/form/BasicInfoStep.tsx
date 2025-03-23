import { useState, useEffect } from 'react';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { Gender, BloodGroup, GradeLevel } from '~/types/student';
import type { CreateStudentDto} from '~/types/student';

interface BasicInfoStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
}

export function BasicInfoStep({ data, onComplete, onBack }: BasicInfoStepProps) {

  const getInitialFormData =(data: Partial<CreateStudentDto>) =>  {
    return {firstName: data.firstName || '',
      lastName: data.lastName || '',
      cniNumber: data.cniNumber || '',
      dateOfBirth: data.dateOfBirth || '',
      admissionDate: data.admissionDate || '',
      gender: data.gender || Gender.Male,
      bloodGroup: data.bloodGroup || undefined,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || '',
      rollNumber: data.rollNumber || '',
      gradeLevel: data.gradeLevel || '',
    };
  }

  const [formData, setFormData] = useState(() => getInitialFormData(data));

  useEffect(() => {
    setFormData(getInitialFormData(data));
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChange={(value) => handleChange('firstName', value)}
          required
        />

        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChange={(value) => handleChange('lastName', value)}
          required
        />

        <TextInput
          label="CNI Number"
          value={formData.cniNumber}
          onChange={(value) => handleChange('cniNumber', value)}
          required
        />

        <DateInput
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(value) => handleChange('dateOfBirth', value)}
          required
        />
        <SelectInput<typeof Gender>
         label="Gender"
         value={formData.gender}
         onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
         options={Gender}
         placeholder="Select Gender"
         required
        />

        <SelectInput<typeof BloodGroup>
          label="Blood Group"
          value={formData.bloodGroup}
          onChange={(value) => setFormData(prev => ({ ...prev, bloodGroup: value }))}
          options={BloodGroup}
          placeholder="Select Blood Group"
          required
        />

        <TextInput
          label="Phone"
          value={formData.phone || ''}
          onChange={(value) => handleChange('phone', value)}
          type="tel"
        />

        <TextInput
          label="Email"
          value={formData.email || ''}
          onChange={(value) => handleChange('email', value)}
          type="email"
        />

        <div className="md:col-span-2">
          <TextArea
            label="Address"
            value={formData.address}
            onChange={(value) => handleChange('address', value)}
            rows={3}
          />
        </div>

        <DateInput
          label="Admission Date"
          value={formData.admissionDate}
          onChange={(value) => handleChange('admissionDate', value)}
          required
        />
        <SelectInput<typeof GradeLevel>
          label="Grade Level"
          value={formData.gradeLevel as GradeLevel}
          onChange={(value) => setFormData(prev => ({ ...prev, gradeLevel: value }))}
          options={GradeLevel}
          placeholder="Select Blood Group"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Back
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
