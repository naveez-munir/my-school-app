import { useState } from 'react';
import { EmploymentStatus, Gender, type CreateTeacherDto, type Teacher } from '~/types/teacher';
import { BasicInfoForm } from './BasicInfoForm';
import { EducationForm } from './EducationForm';
import { ExperienceForm } from './ExperienceForm';
import { DocumentsForm } from './DocumentsForm';

interface TeacherFormProps {
  initialData?: Teacher;
  onSubmit: (data: CreateTeacherDto) => void;
  isLoading: boolean;
}

export function TeacherForm({
  initialData,
  onSubmit,
  isLoading
}: TeacherFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'education' | 'experience' | 'documents'>('basic');
  const [formData, setFormData] = useState<CreateTeacherDto>({
    // Required fields
    cniNumber: initialData?.cniNumber || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    gender: initialData?.gender || Gender.Male,
    employmentStatus: initialData?.employmentStatus || EmploymentStatus.Active,
    joiningDate: initialData?.joiningDate || new Date(),
    qualifications: initialData?.qualifications || [],

    // Optional fields
    email: initialData?.email,
    bloodGroup: initialData?.bloodGroup,
    photoUrl: initialData?.photoUrl,
    phone: initialData?.phone,
    address: initialData?.address,
    leavingDate: initialData?.leavingDate,
    subjects: initialData?.subjects || [],
    classTeacherOf: initialData?.classTeacherOf?._id,
    educationHistory: initialData?.educationHistory || [],
    experience: initialData?.experience || [],
    documents: initialData?.documents || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleUpdate = (field: keyof CreateTeacherDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['basic', 'education', 'experience', 'documents'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as any)}
              className={`
                py-4 px-1 border-b-2 text-sm font-medium
                ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Form Sections */}
      <div className="mt-6">
        {activeTab === 'basic' && (
          <BasicInfoForm
            data={formData}
            onUpdate={handleUpdate}
            assignedClassName={initialData?.classTeacherOf?.className}
          />
        )}
        {activeTab === 'education' && (
          <EducationForm
            data={formData.educationHistory!}
            qualification={formData.qualifications}
            onUpdate={(value) => handleUpdate('educationHistory', value)}
          />
        )}
        {activeTab === 'experience' && (
          <ExperienceForm
            data={formData.experience!}
            onUpdate={(value) => handleUpdate('experience', value)}
          />
        )}
        {activeTab === 'documents' && (
          <DocumentsForm
            data={formData.documents!}
            photoUrl={formData.photoUrl}
            teacherId={initialData?._id || ''}
            onUpdate={(value) => handleUpdate('documents', value)}
            onPhotoChange={(url) => handleUpdate('photoUrl', url)}
          />
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Teacher' : 'Create Teacher'}
        </button>
      </div>
    </form>
  );
}
