// components/form/DocumentsStep.tsx
import { useState, useRef } from 'react';
import type { CreateStudentDto } from '~/types/student';
import { PhotoUpload } from './PhotoUpload';

interface DocumentsStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export function DocumentsStep({ data, onComplete, onBack, isLastStep }: DocumentsStepProps) {
  const [formData, setFormData] = useState({
    photoUrl: data.photoUrl || '',
    documents: [], // Add document type if needed
  });

  const handlePhotoChange = (url: string) => {
    setFormData(prev => ({ ...prev, photoUrl: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Student Photo</h3>
          <p className="mt-1 text-sm ">
            Upload a clear, recent photo of the student.
          </p>
          <div className="mt-4">
            <PhotoUpload
              currentPhoto={formData.photoUrl}
              onPhotoChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* Add document upload section if needed */}
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
          {isLastStep ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  );
}
