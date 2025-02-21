// components/form/BasicInfoStep.tsx
import { useState, useEffect } from 'react';
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
      gender: data.gender || Gender.Male,
      bloodGroup: data.bloodGroup || undefined,
      phone: data.phone || '',
      email: data.email || '',
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

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CNI Number</label>
          <input
            type="text"
            required
            value={formData.cniNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, cniNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as Gender }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {Object.values(Gender).map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select
            value={formData.bloodGroup}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              bloodGroup: e.target.value as BloodGroup 
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select Blood Group</option>
            {Object.values(BloodGroup).map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Roll Number</label>
          <input
            type="text"
            value={formData.rollNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Grade Level</label>
          <select
            value={formData.gradeLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, gradeLevel: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select Grade</option>
            {Object.values(GradeLevel).map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
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
