import { useEffect, useState } from 'react';
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

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffRequest | UpdateStaffRequest) => void;
  initialData?: StaffDetailResponse;
  isSubmitting?: boolean;
}

export function StaffModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  isSubmitting = false 
}: StaffModalProps) {
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

  useEffect(() => {
    if (isOpen) {
      setActiveTab('personal');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

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
    isSubmitting,
    handleInputChange
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          {initialData ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h3>
        
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <form onSubmit={handleSubmit}>
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
              isSubmitting={isSubmitting}
            />
          )}
          
          {activeTab === 'documents' && (
            <DocumentsTab 
              documents={documents}
              setDocuments={setDocuments}
              isSubmitting={isSubmitting}
            />
          )}
          
          {activeTab === 'emergency' && (
            <EmergencyContactTab 
              emergencyContact={emergencyContact}
              setEmergencyContact={setEmergencyContact}
              isSubmitting={isSubmitting}
            />
          )}

          <div className="mt-6">
            <FormActions
              mode={initialData ? 'edit' : 'create'}
              entityName="Staff Member"
              onCancel={onClose}
              isLoading={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
