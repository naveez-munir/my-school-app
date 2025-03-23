import { useNavigate } from 'react-router';
import type { Student } from '~/types/student';

interface StudentDataProps {
  student: Student;
}

export function StudentOverview({student} : StudentDataProps) {
  const navigate = useNavigate();

  // Format a date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Student Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Personal Information Summary */}
        <div className="border rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Personal Information</h4>
            <button 
              onClick={() => navigate(`/dashboard/students/${student._id}/edit/personal`)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-500 text-sm">Name:</span>
              <p className="font-medium">{student.firstName} {student.lastName}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">CNI Number:</span>
              <p>{student.cniNumber}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Date of Birth:</span>
              <p>{formatDate(student.dateOfBirth)}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Gender:</span>
              <p>{student.gender}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Blood Group:</span>
              <p>{student.bloodGroup || 'Not specified'}</p>
            </div>
          </div>
        </div>
        
        {/* Contact Information Summary */}
        <div className="border rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Contact Information</h4>
            <button 
              onClick={() => navigate(`/dashboard/students/${student._id}/edit/personal`)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-500 text-sm">Phone:</span>
              <p>{student.phone || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Email:</span>
              <p>{student.email || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Address:</span>
              <p>{student.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        {/* Academic Information Summary */}
        <div className="border rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Academic Information</h4>
            <button 
              onClick={() => navigate(`/dashboard/students/${student._id}/edit/academic`)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-500 text-sm">Grade Level:</span>
              <p>{student.gradeLevel}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Class:</span>
              <p>{student.class || 'Not assigned'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Roll Number:</span>
              <p>{student.rollNumber || 'Not assigned'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Enrollment Date:</span>
              <p>{formatDate(student.enrollmentDate)}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Admission Date:</span>
              <p>{formatDate(student.admissionDate)}</p>
            </div>
          </div>
        </div>
        
        {/* Guardian Information Summary */}
        <div className="border rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Guardian Information</h4>
            <button 
              onClick={() => navigate(`/dashboard/students/${student._id}/edit/guardian`)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-500 text-sm">Name:</span>
              <p className="font-medium">{student.guardian.name}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Relationship:</span>
              <p>{student.guardian.relationship}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">CNI Number:</span>
              <p>{student.guardian.cniNumber}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Phone:</span>
              <p>{student.guardian.phone || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Email:</span>
              <p>{student.guardian.email || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        {/* Status Information Summary */}
        <div className="border rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Status Information</h4>
            <button 
              onClick={() => navigate(`/dashboard/students/${student._id}/edit/status`)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-500 text-sm">Current Status:</span>
              <p className={`font-medium ${
                student.status === 'Active' ? 'text-green-600' : 'text-red-600'
              }`}>
                {student.status}
              </p>
            </div>
            {student.exitStatus && student.exitStatus !== 'None' && (
              <>
                <div>
                  <span className="text-gray-500 text-sm">Exit Status:</span>
                  <p>{student.exitStatus}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Exit Date:</span>
                  <p>{formatDate(student.exitDate || '')}</p>
                </div>
                {student.exitRemarks && (
                  <div>
                    <span className="text-gray-500 text-sm">Exit Remarks:</span>
                    <p className="text-sm text-gray-600">{student.exitRemarks}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Documents Summary */}
        <div className="border rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Documents</h4>
            <button 
              onClick={() => navigate(`/dashboard/students/${student._id}/edit/documents`)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Manage
            </button>
          </div>
          
          <div>
            {student.documents && student.documents.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">{student.documents.length} document(s) uploaded</p>
                <ul className="text-sm list-disc list-inside">
                  {student.documents.slice(0, 3).map((doc, index) => (
                    <li key={index}>{doc.documentType}</li>
                  ))}
                  {student.documents.length > 3 && (
                    <li className="text-blue-600">
                      {student.documents.length - 3} more document(s)...
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
