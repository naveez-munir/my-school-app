// hooks/useStaffForm.ts
import { useState, useEffect } from 'react';
import { 
  type CreateStaffRequest, 
  type StaffDetailResponse,
  type EmergencyContact,
  type EducationHistory,
  type Experience,
  type Document,
  UserRole,
  EmploymentStatus
} from '~/types/staff';

export function useStaffForm(initialData?: StaffDetailResponse) {
  const [formData, setFormData] = useState<CreateStaffRequest>({
    firstName: '',
    lastName: '',
    cniNumber: '',
    gender: '',
    email: '',
    bloodGroup: '',
    photoUrl: '',
    phone: '',
    address: '',
    joiningDate: new Date(),
    employmentStatus: EmploymentStatus.ACTIVE,
    designation: UserRole.ADMIN,
    department: '',
    qualifications: [],
    jobDescription: '',
    reportingTo: '',
    skills: [],
    responsibilities: []
  });

  // Initialize with empty arrays for nested data
  const [educationHistory, setEducationHistory] = useState<EducationHistory[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({});

  useEffect(() => {
    if (initialData) {
      // Set main form data
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        cniNumber: initialData.cniNumber || '',
        gender: initialData.gender || '',
        email: initialData.email || '',
        bloodGroup: initialData.bloodGroup || '',
        photoUrl: initialData.photoUrl || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        joiningDate: initialData.joiningDate ? new Date(initialData.joiningDate) : new Date(),
        leavingDate: initialData.leavingDate ? new Date(initialData.leavingDate) : undefined,
        employmentStatus: initialData.employmentStatus as any || 'Active',
        designation: initialData.designation as UserRole,
        department: initialData.department || '',
        qualifications: initialData.qualifications || [],
        jobDescription: initialData.jobDescription || '',
        reportingTo: initialData.reportingTo || '',
        skills: initialData.skills || [],
        responsibilities: initialData.responsibilities || []
      });

      // Set nested data
      setEducationHistory(initialData.educationHistory || []);
      setExperience(initialData.experience || []);
      setDocuments(initialData.documents || []);
      setEmergencyContact(initialData.emergencyContact || {});
    } else {
      // Reset form when creating a new staff member
      setFormData({
        firstName: '',
        lastName: '',
        cniNumber: '',
        gender: '',
        email: '',
        bloodGroup: '',
        photoUrl: '',
        phone: '',
        address: '',
        joiningDate: new Date(),
        employmentStatus: EmploymentStatus.ACTIVE,
        designation: UserRole.ADMIN,
        department: '',
        qualifications: [],
        jobDescription: '',
        reportingTo: '',
        skills: [],
        responsibilities: []
      });
      setEducationHistory([]);
      setExperience([]);
      setDocuments([]);
      setEmergencyContact({});
    }
  }, [initialData]);

  const handleInputChange = (field: keyof CreateStaffRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Qualifications handlers
  const handleAddQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...(prev.qualifications || []), '']
    }));
  };

  const handleUpdateQualification = (index: number, value: string) => {
    const updatedQualifications = [...(formData.qualifications || [])];
    updatedQualifications[index] = value;
    setFormData(prev => ({
      ...prev,
      qualifications: updatedQualifications
    }));
  };

  const handleRemoveQualification = (index: number) => {
    const updatedQualifications = [...(formData.qualifications || [])];
    updatedQualifications.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      qualifications: updatedQualifications
    }));
  };

  // Skills handlers
  const handleAddSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), '']
    }));
  };

  const handleUpdateSkill = (index: number, value: string) => {
    const updatedSkills = [...(formData.skills || [])];
    updatedSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...(formData.skills || [])];
    updatedSkills.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  // Responsibilities handlers
  const handleAddResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...(prev.responsibilities || []), '']
    }));
  };

  const handleUpdateResponsibility = (index: number, value: string) => {
    const updatedResponsibilities = [...(formData.responsibilities || [])];
    updatedResponsibilities[index] = value;
    setFormData(prev => ({
      ...prev,
      responsibilities: updatedResponsibilities
    }));
  };

  const handleRemoveResponsibility = (index: number) => {
    const updatedResponsibilities = [...(formData.responsibilities || [])];
    updatedResponsibilities.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      responsibilities: updatedResponsibilities
    }));
  };

  return {
    formData,
    educationHistory,
    experience,
    documents,
    emergencyContact,
    handleInputChange,
    handleAddQualification,
    handleUpdateQualification,
    handleRemoveQualification,
    handleAddSkill,
    handleUpdateSkill,
    handleRemoveSkill,
    handleAddResponsibility,
    handleUpdateResponsibility,
    handleRemoveResponsibility,
    setEducationHistory,
    setExperience,
    setDocuments,
    setEmergencyContact
  };
}
