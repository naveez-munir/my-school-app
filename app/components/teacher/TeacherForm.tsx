import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmploymentStatus, Gender, type CreateTeacherDto, type Teacher } from '~/types/teacher';
import { BasicInfoForm } from './BasicInfoForm';
import { EducationForm } from './EducationForm';
import { ExperienceForm } from './ExperienceForm';
import { DocumentsForm } from './DocumentsForm';
import { createTeacherSchema, type CreateTeacherFormData } from '~/utils/validation/teacherValidation';
import { useFormTabNavigation } from '~/hooks/useFormTabNavigation';

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

  // Helper function to prepare initial form data
  const getInitialFormData = (teacher?: Teacher): CreateTeacherFormData => {
    return {
      // Required fields
      cniNumber: teacher?.cniNumber || '',
      firstName: teacher?.firstName || '',
      lastName: teacher?.lastName || '',
      gender: teacher?.gender || Gender.Male,
      employmentStatus: teacher?.employmentStatus || EmploymentStatus.Active,
      joiningDate: teacher?.joiningDate ? new Date(teacher.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      qualifications: teacher?.qualifications || [],

      // Optional fields
      email: teacher?.email || null,
      bloodGroup: teacher?.bloodGroup || null,
      photoUrl: teacher?.photoUrl || null,
      phone: teacher?.phone || null,
      address: teacher?.address || null,
      leavingDate: teacher?.leavingDate ? new Date(teacher.leavingDate).toISOString().split('T')[0] : null,
      subjects: teacher?.subjects || [],
      classTeacherOf: teacher?.classTeacherOf?._id || null,
      educationHistory: teacher?.educationHistory || [],
      experience: teacher?.experience || [],
      documents: teacher?.documents || []
    };
  };

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateTeacherFormData>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: getInitialFormData(initialData),
  });

  const formData = watch();

  // Map form fields to their respective tabs
  const tabFieldMapping: Record<string, (keyof CreateTeacherFormData)[]> = {
    basic: ['cniNumber', 'firstName', 'lastName', 'gender', 'employmentStatus', 'joiningDate', 'leavingDate', 'email', 'phone', 'address', 'bloodGroup', 'subjects', 'qualifications', 'classTeacherOf'],
    education: ['educationHistory'],
    experience: ['experience'],
    documents: ['documents', 'photoUrl']
  };

  // Use reusable hook for error navigation
  const { createErrorHandler } = useFormTabNavigation({
    tabFieldMapping,
    activeTab,
    setActiveTab,
    tabLabels: {
      basic: 'Basic Info',
      education: 'Education',
      experience: 'Experience',
      documents: 'Documents'
    }
  });

  const onFormSubmit = (validatedData: CreateTeacherFormData) => {
    // Convert form data to CreateTeacherDto format
    const submissionData: CreateTeacherDto = {
      ...validatedData,
      joiningDate: new Date(validatedData.joiningDate),
      leavingDate: validatedData.leavingDate ? new Date(validatedData.leavingDate) : undefined,
      experience: validatedData.experience?.map(exp => ({
        ...exp,
        fromDate: new Date(exp.fromDate),
        toDate: exp.toDate ? new Date(exp.toDate) : undefined,
      })),
    };
    onSubmit(submissionData);
  };

  // Handle form submission with error navigation using reusable hook
  const handleFormSubmitWithValidation = handleFormSubmit(
    onFormSubmit,
    createErrorHandler
  );

  const handleUpdate = (field: keyof CreateTeacherFormData, value: any) => {
    setValue(field, value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleFormSubmitWithValidation} className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-6 lg:space-x-8">
          {['basic', 'education', 'experience', 'documents'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as any)}
              className={`
                whitespace-nowrap py-2 sm:py-3 lg:py-4 px-1 border-b-2 text-xs sm:text-sm font-medium
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
      <div className="mt-4 sm:mt-5 lg:mt-6">
        {activeTab === 'basic' && (
          <BasicInfoForm
            control={control}
            errors={errors}
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
            photoUrl={formData.photoUrl || undefined}
            teacherId={initialData?._id || ''}
            onUpdate={(value) => handleUpdate('documents', value)}
            onPhotoChange={(url) => handleUpdate('photoUrl', url)}
          />
        )}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 lg:gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Teacher' : 'Create Teacher'}
        </button>
      </div>
    </form>
  );
}
