import { useState } from "react";
import { GuardianRelationship, type Guardian } from "~/types/student";
import type { GuardianInfoStepProps } from "~/types/student";
import { GuardianFormFields } from "./GuardianFormFields";

export function GuardianInfoStep({
  data,
  onComplete,
  onBack,
}: GuardianInfoStepProps) {
  const [formData, setFormData] = useState({
    guardian: {
      name: data.guardian?.name || "",
      cniNumber: data.guardian?.cniNumber || "",
      relationship: data.guardian?.relationship || GuardianRelationship.Father,
      phone: data.guardian?.phone || "",
      email: data.guardian?.email || null,
    } as Guardian,
  });

  const updateGuardianField = <K extends keyof Guardian>(
    field: K,
    value: Guardian[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      guardian: {
        ...prev.guardian,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <GuardianFormFields
        data={formData.guardian}
        onChange={updateGuardianField}
      />

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
