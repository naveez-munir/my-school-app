import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatDate } from '~/utils/dateUtils';


export function StudentPersonalInfo({student} : StudentDataProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <StudentSectionHeader
        title="Personal Information" 
        editPath="/edit/personal" 
        studentId={student._id} 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
            <dl className="mt-2 space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.firstName} {student.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CNI Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.cniNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(student.dateOfBirth)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.gender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.bloodGroup || 'Not specified'}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
            <dl className="mt-2 space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.phone || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.email || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.address || 'Not provided'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
