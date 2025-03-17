import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { FormActions } from '~/components/common/form/FormActions';
import { 
  type CreateStaffRequest, 
  type UpdateStaffRequest, 
  type StaffDetailResponse,
  type EmergencyContact,
  type EducationHistory,
  type Experience,
  type Document,
  UserRole,
  EmploymentStatus
} from '~/types/staff';

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
  }, [initialData, isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all data for submission
    const dataToSubmit: CreateStaffRequest = {
      ...formData,
      educationHistory,
      experience,
      documents,
      emergencyContact
    };
    
    onSubmit(dataToSubmit);
  };

  const handleInputChange = (field: keyof CreateStaffRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const genderOptions = {
    'Male': 'Male',
    'Female': 'Female',
    'Other': 'Other'
  };

  const bloodGroupOptions = {
    'A+': 'A+',
    'A-': 'A-',
    'B+': 'B+',
    'B-': 'B-',
    'AB+': 'AB+',
    'AB-': 'AB-',
    'O+': 'O+',
    'O-': 'O-'
  };

  const employmentStatusOptions = {
    'Active': 'Active',
    'OnLeave': 'On Leave',
    'Resigned': 'Resigned',
    'Terminated': 'Terminated'
  };

  const designationOptions = {
    [UserRole.ADMIN]: 'Admin',
    [UserRole.PRINCIPAL]: 'Principal',
    [UserRole.ACCOUNTANT]: 'Accountant',
    [UserRole.LIBRARIAN]: 'Librarian',
    [UserRole.DRIVER]: 'Driver',
    [UserRole.SECURITY]: 'Security',
    [UserRole.CLEANER]: 'Cleaner',
    [UserRole.TENANT_ADMIN]: 'Tenant Admin'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          {initialData ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h3>
        
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Information
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'employment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('employment')}
          >
            Employment Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'education' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('education')}
          >
            Education & Experience
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'emergency' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('emergency')}
          >
            Emergency Contact
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange('firstName', value)}
                  required
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange('lastName', value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="CNI Number"
                  value={formData.cniNumber}
                  onChange={(value) => handleInputChange('cniNumber', value)}
                  required
                  disabled={isSubmitting}
                />
                
                <SelectInput
                  label="Gender"
                  value={formData.gender}
                  options={genderOptions}
                  onChange={(value) => handleInputChange('gender', value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(value) => handleInputChange('email', value)}
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Phone"
                  value={formData.phone || ''}
                  onChange={(value) => handleInputChange('phone', value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="Blood Group"
                  value={formData.bloodGroup || ''}
                  options={bloodGroupOptions}
                  onChange={(value) => handleInputChange('bloodGroup', value)}
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Photo URL"
                  value={formData.photoUrl || ''}
                  onChange={(value) => handleInputChange('photoUrl', value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <TextInput
                  label="Address"
                  value={formData.address || ''}
                  onChange={(value) => handleInputChange('address', value)}
                  disabled={isSubmitting}
                />
              </div>
              </div>
          )}

          {/* Employment Details Tab */}
          {activeTab === 'employment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('joiningDate', new Date(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leaving Date
                  </label>
                  <input
                    type="date"
                    value={formData.leavingDate ? new Date(formData.leavingDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('leavingDate', new Date(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    disabled={isSubmitting}
                  />
                </div>
                
                <SelectInput
                  label="Employment Status"
                  value={formData.employmentStatus}
                  options={employmentStatusOptions}
                  onChange={(value) => handleInputChange('employmentStatus', value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="Designation"
                  value={formData.designation}
                  options={designationOptions}
                  onChange={(value) => handleInputChange('designation', value)}
                  required
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Department"
                  value={formData.department || ''}
                  onChange={(value) => handleInputChange('department', value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <TextInput
                  label="Job Description"
                  value={formData.jobDescription || ''}
                  onChange={(value) => handleInputChange('jobDescription', value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <TextInput
                  label="Reporting To"
                  value={formData.reportingTo || ''}
                  onChange={(value) => handleInputChange('reportingTo', value)}
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Qualifications */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                  <button
                    type="button"
                    onClick={handleAddQualification}
                    className="flex items-center text-blue-600 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
                
                {(formData.qualifications || []).length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No qualifications added</div>
                ) : (
                  formData.qualifications?.map((qualification, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TextInput
                        value={qualification}
                        onChange={(value) => handleUpdateQualification(index, value)}
                        disabled={isSubmitting}
                        label='Qualification'
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveQualification(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {/* Skills */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="flex items-center text-blue-600 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
                
                {(formData.skills || []).length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No skills added</div>
                ) : (
                  formData.skills?.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TextInput
                        value={skill}
                        onChange={(value) => handleUpdateSkill(index, value)}
                        disabled={isSubmitting}
                        label='Skill'
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {/* Responsibilities */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                  <button
                    type="button"
                    onClick={handleAddResponsibility}
                    className="flex items-center text-blue-600 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
                
                {(formData.responsibilities || []).length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No responsibilities added</div>
                ) : (
                  formData.responsibilities?.map((responsibility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TextInput
                        value={responsibility}
                        onChange={(value) => handleUpdateResponsibility(index, value)}
                        disabled={isSubmitting}
                        label='Responsibility'
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Education & Experience Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Education History</h4>
                  <button
                    type="button"
                    onClick={() => setEducationHistory([...educationHistory, {
                      institution: '',
                      degree: '',
                      fieldOfStudy: '',
                      startDate: new Date(),
                      endDate: undefined,
                      grade: '',
                      description: ''
                    }])}
                    className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Education
                  </button>
                </div>
                
                {educationHistory.length === 0 ? (
                  <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                    No education history added.
                  </div>
                ) : (
                  educationHistory.map((education, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">Education #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...educationHistory];
                            updated.splice(index, 1);
                            setEducationHistory(updated);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <TextInput
                          label="Institution"
                          value={education.institution}
                          onChange={(value) => {
                            const updated = [...educationHistory];
                            updated[index] = { ...updated[index], institution: value };
                            setEducationHistory(updated);
                          }}
                          required
                          disabled={isSubmitting}
                        />
                        
                        <TextInput
                          label="Degree"
                          value={education.degree}
                          onChange={(value) => {
                            const updated = [...educationHistory];
                            updated[index] = { ...updated[index], degree: value };
                            setEducationHistory(updated);
                          }}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <TextInput
                          label="Field of Study"
                          value={education.fieldOfStudy || ''}
                          onChange={(value) => {
                            const updated = [...educationHistory];
                            updated[index] = { ...updated[index], fieldOfStudy: value };
                            setEducationHistory(updated);
                          }}
                          disabled={isSubmitting}
                        />
                        
                        <TextInput
                          label="Grade"
                          value={education.grade || ''}
                          onChange={(value) => {
                            const updated = [...educationHistory];
                            updated[index] = { ...updated[index], grade: value };
                            setEducationHistory(updated);
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={education.startDate ? new Date(education.startDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const updated = [...educationHistory];
                              updated[index] = { ...updated[index], startDate: new Date(e.target.value) };
                              setEducationHistory(updated);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const updated = [...educationHistory];
                              updated[index] = { ...updated[index], endDate: new Date(e.target.value) };
                              setEducationHistory(updated);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={education.description || ''}
                          onChange={(e) => {
                            const updated = [...educationHistory];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setEducationHistory(updated);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          rows={3}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Work Experience</h4>
                  <button
                    type="button"
                    onClick={() => setExperience([...experience, {
                      company: '',
                      position: '',
                      startDate: new Date(),
                      endDate: undefined,
                      location: '',
                      description: ''
                    }])}
                    className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Experience
                  </button>
                </div>
                
                {experience.length === 0 ? (
                  <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                    No work experience added.
                  </div>
                ) : (
                  experience.map((exp, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">Experience #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...experience];
                            updated.splice(index, 1);
                            setExperience(updated);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <TextInput
                          label="Company"
                          value={exp.company}
                          onChange={(value) => {
                            const updated = [...experience];
                            updated[index] = { ...updated[index], company: value };
                            setExperience(updated);
                          }}
                          required
                          disabled={isSubmitting}
                        />
                        
                        <TextInput
                          label="Position"
                          value={exp.position}
                          onChange={(value) => {
                            const updated = [...experience];
                            updated[index] = { ...updated[index], position: value };
                            setExperience(updated);
                          }}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[index] = { ...updated[index], startDate: new Date(e.target.value) };
                              setExperience(updated);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const updated = [...experience];
                              updated[index] = { ...updated[index], endDate: new Date(e.target.value) };
                              setExperience(updated);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <TextInput
                          label="Location"
                          value={exp.location || ''}
                          onChange={(value) => {
                            const updated = [...experience];
                            updated[index] = { ...updated[index], location: value };
                            setExperience(updated);
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setExperience(updated);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          rows={3}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">Documents</h4>
                <button
                  type="button"
                  onClick={() => setDocuments([...documents, {
                    title: '',
                    type: '',
                    url: '',
                    uploadDate: new Date(),
                    expiryDate: undefined,
                    description: ''
                  }])}
                  className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Document
                </button>
              </div>
              
              {documents.length === 0 ? (
                <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                  No documents added.
                </div>
              ) : (
                documents.map((doc, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Document #{index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...documents];
                          updated.splice(index, 1);
                          setDocuments(updated);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <TextInput
                        label="Title"
                        value={doc.title}
                        onChange={(value) => {
                          const updated = [...documents];
                          updated[index] = { ...updated[index], title: value };
                          setDocuments(updated);
                        }}
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Type"
                        value={doc.type}
                        onChange={(value) => {
                          const updated = [...documents];
                          updated[index] = { ...updated[index], type: value };
                          setDocuments(updated);
                        }}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="mb-2">
                      <TextInput
                        label="Document URL"
                        value={doc.url}
                        onChange={(value) => {
                          const updated = [...documents];
                          updated[index] = { ...updated[index], url: value };
                          setDocuments(updated);
                        }}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Upload Date
                        </label>
                        <input
                          type="date"
                          value={doc.uploadDate ? new Date(doc.uploadDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const updated = [...documents];
                            updated[index] = { ...updated[index], uploadDate: new Date(e.target.value) };
                            setDocuments(updated);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={doc.expiryDate ? new Date(doc.expiryDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const updated = [...documents];
                            updated[index] = { ...updated[index], expiryDate: new Date(e.target.value) };
                            setDocuments(updated);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={doc.description || ''}
                        onChange={(e) => {
                          const updated = [...documents];
                          updated[index] = { ...updated[index], description: e.target.value };
                          setDocuments(updated);
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Emergency Contact Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <h4 className="text-md font-medium">Emergency Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Name"
                  value={emergencyContact.name || ''}
                  onChange={(value) => setEmergencyContact(prev => ({ ...prev, name: value }))}
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Relationship"
                  value={emergencyContact.relationship || ''}
                  onChange={(value) => setEmergencyContact(prev => ({ ...prev, relationship: value }))}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Phone"
                  value={emergencyContact.phone || ''}
                  onChange={(value) => setEmergencyContact(prev => ({ ...prev, phone: value }))}
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Address"
                  value={emergencyContact.address || ''}
                  onChange={(value) => setEmergencyContact(prev => ({ ...prev, address: value }))}
                  disabled={isSubmitting}
                />
              </div>
            </div>
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
