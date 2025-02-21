// components/form/GuardianInfoStep.tsx
import { useState } from 'react';
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
          <input
            type="text"
            required
            value={formData.guardian.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guardian: { ...prev.guardian, name: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CNI Number</label>
          <input
            type="text"
            required
            value={formData.guardian.cniNumber}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guardian: { ...prev.guardian, cniNumber: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Relationship</label>
          <select
            value={formData.guardian.relationship}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guardian: { ...prev.guardian, relationship: e.target.value as GuardianRelationship }
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 "
            required
          >
            {Object.values(GuardianRelationship).map(rel => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            required
            value={formData.guardian.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guardian: { ...prev.guardian, phone: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.guardian.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guardian: { ...prev.guardian, email: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 "
          />
        </div>
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
