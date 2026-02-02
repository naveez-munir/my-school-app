import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type CreateStaffRequest,
  type UpdateStaffRequest,
  type StaffDetailResponse,
  EmploymentStatus,
  UserRole
} from '~/types/staff';
import { Gender, BloodGroup } from '~/types/teacher';
import { FormActions } from '~/components/common/form/FormActions';
import { TabNavigation } from './TabNavigation';
import { PersonalInfoTab } from './PersonalInfoTab';
import { EmploymentDetailsTab } from './EmploymentDetailsTab';
import { EducationExperienceTab } from './EducationExperienceTab';
import { DocumentsTab } from './DocumentsTab';
import { EmergencyContactTab } from './EmergencyContactTab';
import { createStaffSchema, type CreateStaffFormData } from '~/utils/validation/staffValidation';
import { useFormTabNavigation } from '~/hooks/useFormTabNavigation';

interface StaffFormProps {
  initialData?: StaffDetailResponse;
  onSubmit: (data: CreateStaffRequest | UpdateStaffRequest) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function StaffForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel
}: StaffFormProps) {
  const [activeTab, setActiveTab] = useState('personal');

  // Helper function to prepare initial form data
  const getInitialFormData = (staff?: StaffDetailResponse): CreateStaffFormData => {
    return {
      // Required fields
      cniNumber: staff?.cniNumber || '',
      firstName: staff?.firstName || '',
      lastName: staff?.lastName || '',
      gender: (staff?.gender as Gender) || Gender.Male,
      joiningDate: staff?.joiningDate ? new Date(staff.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      employmentStatus: (staff?.employmentStatus as EmploymentStatus) || EmploymentStatus.ACTIVE,
      designation: (staff?.designation as UserRole) || UserRole.ADMIN,
      department: staff?.department || null,
      qualifications: staff?.qualifications || [],
      skills: staff?.skills || [],
      responsibilities: staff?.responsibilities || [],

      // Optional fields
      email: staff?.email || null,
      bloodGroup: (staff?.bloodGroup as BloodGroup) || null,
      photoUrl: staff?.photoUrl || null,
      phone: staff?.phone || null,
      address: staff?.address || null,
      leavingDate: staff?.leavingDate ? new Date(staff.leavingDate).toISOString().split('T')[0] : null,
      jobDescription: staff?.jobDescription || null,
      reportingTo: staff?.reportingTo || null,
      educationHistory: staff?.educationHistory || [],
      experience: staff?.experience?.map(exp => ({
        ...exp,
        fromDate: new Date(exp.fromDate).toISOString().split('T')[0],
        toDate: exp.toDate ? new Date(exp.toDate).toISOString().split('T')[0] : null,
      })) || [],
      documents: staff?.documents || [],
      emergencyContact: staff?.emergencyContact || null
    };
  };

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: getInitialFormData(initialData),
  });

  const formData = watch();

  const educationFieldArray = useFieldArray({
    control,
    name: 'educationHistory',
  });

  const experienceFieldArray = useFieldArray({
    control,
    name: 'experience',
  });

  // Map form fields to their respective tabs
  const tabFieldMapping: Record<string, (keyof CreateStaffFormData)[]> = {
    personal: ['cniNumber', 'firstName', 'lastName', 'gender', 'email', 'phone', 'address', 'bloodGroup', 'photoUrl', 'joiningDate', 'leavingDate'],
    employment: ['employmentStatus', 'designation', 'department', 'qualifications', 'skills', 'responsibilities', 'jobDescription', 'reportingTo'],
    education: ['educationHistory', 'experience'],
    documents: ['documents'],
    emergency: ['emergencyContact']
  };

  // Use reusable hook for error navigation
  const { createErrorHandler } = useFormTabNavigation<CreateStaffFormData>({
    tabFieldMapping,
    activeTab,
    setActiveTab,
    tabLabels: {
      personal: 'Personal Information',
      employment: 'Employment Details',
      education: 'Education & Experience',
      documents: 'Documents',
      emergency: 'Emergency Contact'
    }
  });

  const onFormSubmit = (validatedData: CreateStaffFormData) => {
    // Convert form data to CreateStaffRequest format
    // Handle nullable fields by converting null to undefined
    const submissionData: CreateStaffRequest = {
      ...validatedData,
      email: validatedData.email ?? undefined,
      bloodGroup: validatedData.bloodGroup ?? undefined,
      photoUrl: validatedData.photoUrl ?? undefined,
      phone: validatedData.phone ?? undefined,
      address: validatedData.address ?? undefined,
      department: validatedData.department ?? undefined,
      jobDescription: validatedData.jobDescription ?? undefined,
      reportingTo: validatedData.reportingTo ?? undefined,
      joiningDate: new Date(validatedData.joiningDate),
      leavingDate: validatedData.leavingDate ? new Date(validatedData.leavingDate) : undefined,
      educationHistory: validatedData.educationHistory?.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
        certificateUrl: edu.certificateUrl ?? undefined,
      })),
      experience: validatedData.experience?.map(exp => ({
        institution: exp.institution,
        position: exp.position,
        fromDate: new Date(exp.fromDate),
        toDate: exp.toDate ? new Date(exp.toDate) : undefined,
        description: exp.description ?? undefined,
        experienceLatterUrl: exp.experienceLatterUrl ?? undefined,
      })),
      emergencyContact: validatedData.emergencyContact ? {
        name: validatedData.emergencyContact.name ?? undefined,
        relationship: validatedData.emergencyContact.relationship ?? undefined,
        phone: validatedData.emergencyContact.phone ?? undefined,
        address: validatedData.emergencyContact.address ?? undefined,
      } : undefined,
    };
    onSubmit(submissionData);
  };

  // Handle form submission with error navigation using reusable hook
  const handleFormSubmitWithValidation = handleFormSubmit(
    onFormSubmit,
    createErrorHandler
  );

  const handleUpdate = (field: keyof CreateStaffFormData, value: any) => {
    setValue(field, value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleFormSubmitWithValidation} className="space-y-6">
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'personal' && (
        <PersonalInfoTab
          control={control}
          errors={errors}
          photoUrl={formData.photoUrl || ''}
          isSubmitting={isLoading}
          onPhotoChange={(url) => setValue('photoUrl', url, { shouldValidate: true })}
          staffId={initialData?.id}
        />
      )}

      {activeTab === 'employment' && (
        <EmploymentDetailsTab
          control={control}
          errors={errors}
          isSubmitting={isLoading}
          handleAddQualification={() => {
            const current = formData.qualifications || [];
            setValue('qualifications', [...current, ''], { shouldValidate: true });
          }}
          handleUpdateQualification={(index: number, value: string) => {
            const current = formData.qualifications || [];
            const updated = [...current];
            updated[index] = value;
            setValue('qualifications', updated, { shouldValidate: true });
          }}
          handleRemoveQualification={(index: number) => {
            const current = formData.qualifications || [];
            setValue('qualifications', current.filter((_, i) => i !== index), { shouldValidate: true });
          }}
          handleAddSkill={() => {
            const current = formData.skills || [];
            setValue('skills', [...current, ''], { shouldValidate: true });
          }}
          handleUpdateSkill={(index: number, value: string) => {
            const current = formData.skills || [];
            const updated = [...current];
            updated[index] = value;
            setValue('skills', updated, { shouldValidate: true });
          }}
          handleRemoveSkill={(index: number) => {
            const current = formData.skills || [];
            setValue('skills', current.filter((_, i) => i !== index), { shouldValidate: true });
          }}
          handleAddResponsibility={() => {
            const current = formData.responsibilities || [];
            setValue('responsibilities', [...current, ''], { shouldValidate: true });
          }}
          handleUpdateResponsibility={(index: number, value: string) => {
            const current = formData.responsibilities || [];
            const updated = [...current];
            updated[index] = value;
            setValue('responsibilities', updated, { shouldValidate: true });
          }}
          handleRemoveResponsibility={(index: number) => {
            const current = formData.responsibilities || [];
            setValue('responsibilities', current.filter((_, i) => i !== index), { shouldValidate: true });
          }}
          qualifications={formData.qualifications || []}
          skills={formData.skills || []}
          responsibilities={formData.responsibilities || []}
        />
      )}

      {activeTab === 'education' && (
        <EducationExperienceTab
          control={control}
          errors={errors}
          educationFieldArray={educationFieldArray}
          experienceFieldArray={experienceFieldArray}
          isSubmitting={isLoading}
          staffId={initialData?.id}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentsTab
          data={formData.documents || []}
          staffId={initialData?.id}
          onUpdate={(value) => handleUpdate('documents', value)}
        />
      )}

      {activeTab === 'emergency' && (
        <EmergencyContactTab
          emergencyContact={formData.emergencyContact || {}}
          setEmergencyContact={(value) => setValue('emergencyContact', value, { shouldValidate: true })}
          isSubmitting={isLoading}
        />
      )}

      <div className="mt-6">
        <FormActions
          mode={initialData ? 'edit' : 'create'}
          entityName="Staff Member"
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}

