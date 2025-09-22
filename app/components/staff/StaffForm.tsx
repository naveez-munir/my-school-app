import { useState } from 'react';
import { 
  type CreateStaffRequest, 
  type UpdateStaffRequest, 
  type StaffDetailResponse,
} from '~/types/staff';
import { FormActions } from '~/components/common/form/FormActions';
import { TabNavigation } from './TabNavigation';
import { PersonalInfoTab } from './PersonalInfoTab';
import { EmploymentDetailsTab } from './EmploymentDetailsTab';
import { EducationExperienceTab } from './EducationExperienceTab';
import { DocumentsTab } from './DocumentsTab';
import { EmergencyContactTab } from './EmergencyContactTab';
import { useStaffForm } from './useStaffForm';

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
  
  const {
    formData,
    educationHistory,
    experience,
    documents,
    emergencyContact,
    handleInputChange,
    handleUpdateQualification,
    handleAddQualification,
    handleRemoveQualification,
    handleUpdateSkill,
    handleAddSkill,
    handleRemoveSkill,
    handleUpdateResponsibility,
    handleAddResponsibility,
    handleRemoveResponsibility,
    setEducationHistory,
    setExperience,
    setDocuments,
    setEmergencyContact
  } = useStaffForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit: CreateStaffRequest = {
      ...formData,
      educationHistory,
      experience,
      documents,
      emergencyContact
    };
    
    onSubmit(dataToSubmit);
  };

  const tabProps = {
    formData,
    isSubmitting: isLoading,
    handleInputChange
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {activeTab === 'personal' && (
        <PersonalInfoTab {...tabProps} />
      )}

      {activeTab === 'employment' && (
        <EmploymentDetailsTab 
          {...tabProps}
          handleAddQualification={handleAddQualification}
          handleUpdateQualification={handleUpdateQualification}
          handleRemoveQualification={handleRemoveQualification}
          handleAddSkill={handleAddSkill}
          handleUpdateSkill={handleUpdateSkill}
          handleRemoveSkill={handleRemoveSkill}
          handleAddResponsibility={handleAddResponsibility}
          handleUpdateResponsibility={handleUpdateResponsibility}
          handleRemoveResponsibility={handleRemoveResponsibility}
        />
      )}
      
      {activeTab === 'education' && (
        <EducationExperienceTab 
          educationHistory={educationHistory}
          setEducationHistory={setEducationHistory}
          experience={experience}
          setExperience={setExperience}
          isSubmitting={isLoading}
        />
      )}
      
      {activeTab === 'documents' && (
        <DocumentsTab 
          documents={documents}
          setDocuments={setDocuments}
          isSubmitting={isLoading}
        />
      )}
      
      {activeTab === 'emergency' && (
        <EmergencyContactTab 
          emergencyContact={emergencyContact}
          setEmergencyContact={setEmergencyContact}
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

