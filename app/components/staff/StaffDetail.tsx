import { useParams } from 'react-router';
import { useStaff, useAddEducation, useAddExperience, useAddDocument, useUpdateEmergencyContact } from '~/hooks/useStaffQueries';
import { CheckCircle, User, Briefcase, GraduationCap, FileText, Phone, Calendar, Mail, MapPin } from 'lucide-react';
import type { EducationHistory, Experience, Document, EmergencyContact } from '~/types/staff';

export const StaffDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    data: staff, 
    isLoading, 
    error 
  } = useStaff(id || '');
  
  const addEducationMutation = useAddEducation();
  const addExperienceMutation = useAddExperience();
  const addDocumentMutation = useAddDocument();
  const updateEmergencyContactMutation = useUpdateEmergencyContact();
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading staff details...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {(error as Error).message}</div>;
  }
  
  if (!staff) {
    return <div className="p-4 text-center">Staff member not found</div>;
  }
  
  const handleAddEducation = (education: EducationHistory) => {
    addEducationMutation.mutate({ staffId: staff.id, education });
  };
  
  const handleAddExperience = (experience: Experience) => {
    addExperienceMutation.mutate({ staffId: staff.id, experience });
  };
  
  const handleAddDocument = (document: Document) => {
    addDocumentMutation.mutate({ staffId: staff.id, document });
  };
  
  const handleUpdateEmergencyContact = (contact: EmergencyContact) => {
    updateEmergencyContactMutation.mutate({ staffId: staff.id, contact });
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header with basic info */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              {staff.photoUrl ? (
                <img
                  src={staff.photoUrl}
                  alt={`${staff.firstName} ${staff.lastName}`}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                  {/* <User className="h-10 w<User className="h-10 w-10 text-blue-600" /> */}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {staff.firstName} {staff.lastName}
              </h1>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {staff.designation}
                </span>
                
                {staff.department && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {staff.department}
                  </span>
                )}
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                  ${staff.employmentStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                    staff.employmentStatus === 'OnLeave' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}
                >
                  {staff.employmentStatus === 'OnLeave' ? 'On Leave' : staff.employmentStatus}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-500">
                {staff.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{staff.email}</span>
                  </div>
                )}
                
                {staff.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{staff.phone}</span>
                  </div>
                )}
                
                {staff.address && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{staff.address}</span>
                  </div>
                )}
                
                {staff.joiningDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined: {new Date(staff.joiningDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="col-span-1 bg-white rounded-lg border p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                <User className="h-5 w-5 inline-block mr-2 text-blue-600" />
                Personal Details
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">CNI Number</span>
                  <p className="font-medium">{staff.cniNumber}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Gender</span>
                  <p className="font-medium">{staff.gender}</p>
                </div>
                
                {staff.bloodGroup && (
                  <div>
                    <span className="text-sm text-gray-500">Blood Group</span>
                    <p className="font-medium">{staff.bloodGroup}</p>
                  </div>
                )}
              </div>
              
              {/* Emergency Contact */}
              {staff.emergencyContact && Object.keys(staff.emergencyContact).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Emergency Contact</h3>
                  
                  <div className="space-y-2">
                    {staff.emergencyContact.name && (
                      <div>
                        <span className="text-sm text-gray-500">Name</span>
                        <p className="font-medium">{staff.emergencyContact.name}</p>
                      </div>
                    )}
                    
                    {staff.emergencyContact.relationship && (
                      <div>
                        <span className="text-sm text-gray-500">Relationship</span>
                        <p className="font-medium">{staff.emergencyContact.relationship}</p>
                      </div>
                    )}
                    
                    {staff.emergencyContact.phone && (
                      <div>
                        <span className="text-sm text-gray-500">Phone</span>
                        <p className="font-medium">{staff.emergencyContact.phone}</p>
                      </div>
                    )}
                    
                    {staff.emergencyContact.address && (
                      <div>
                        <span className="text-sm text-gray-500">Address</span>
                        <p className="font-medium">{staff.emergencyContact.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Employment Details */}
            <div className="col-span-2 bg-white rounded-lg border p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                <Briefcase className="h-5 w-5 inline-block mr-2 text-blue-600" />
                Employment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Job Description</span>
                    <p className="font-medium">{staff.jobDescription || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Reporting To</span>
                    <p className="font-medium">{staff.reportingTo || 'Not specified'}</p>
                  </div>
                  
                  {staff.leavingDate && (
                    <div>
                      <span className="text-sm text-gray-500">Leaving Date</span>
                      <p className="font-medium">{new Date(staff.leavingDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  {staff.qualifications && staff.qualifications.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-md font-medium text-gray-900 mb-2">Qualifications</h3>
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        {staff.qualifications.map((qual, index) => (
                          <li key={index} className="text-gray-700">{qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {staff.skills && staff.skills.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-md font-medium text-gray-900 mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {staff.skills.map((skill, index) => (
                          <span key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {staff.responsibilities && staff.responsibilities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {staff.responsibilities.map((resp, index) => (
                      <li key={index} className="text-gray-700">{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Education History */}
          <div className="mt-6 bg-white rounded-lg border p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              <GraduationCap className="h-5 w-5 inline-block mr-2 text-blue-600" />
              Education History
            </h2>
            
            {(!staff.educationHistory || staff.educationHistory.length === 0) ? (
              <p className="text-gray-500 italic">No education history available</p>
            ) : (
              <div className="space-y-4">
                {staff.educationHistory.map((edu, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{edu.institution}</h3>
                        <p className="text-gray-700">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(edu.startDate).getFullYear()} - 
                        {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                      </div>
                    </div>
                    
                    {edu.grade && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Grade: </span>
                        <span className="font-medium">{edu.grade}</span>
                      </div>
                    )}
                    
                    {edu.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        {edu.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Work Experience */}
          <div className="mt-6 bg-white rounded-lg border p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              <Briefcase className="h-5 w-5 inline-block mr-2 text-blue-600" />
              Work Experience
            </h2>
            
            {(!staff.experience || staff.experience.length === 0) ? (
              <p className="text-gray-500 italic">No work experience available</p>
            ) : (
              <div className="space-y-4">
                {staff.experience.map((exp, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{exp.company}</h3>
                        <p className="text-gray-700">{exp.position}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(exp.startDate).toLocaleDateString()} - 
                        {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                      </div>
                    </div>
                    
                    {exp.location && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Location: </span>
                        <span className="font-medium">{exp.location}</span>
                      </div>
                    )}
                    
                    {exp.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Documents */}
          <div className="mt-6 bg-white rounded-lg border p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              <FileText className="h-5 w-5 inline-block mr-2 text-blue-600" />
              Documents
            </h2>
            
            {(!staff.documents || staff.documents.length === 0) ? (
              <p className="text-gray-500 italic">No documents available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.documents.map((doc, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.title}</h3>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View
                      </a>
                    </div>
                    
                    {doc.uploadDate && (
                      <div className="mt-2 text-xs text-gray-500">
                        Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    {doc.expiryDate && (
                      <div className="mt-1 text-xs text-gray-500">
                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    {doc.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        {doc.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
