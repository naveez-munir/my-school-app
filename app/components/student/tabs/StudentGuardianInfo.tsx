import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';

export function StudentGuardianInfo({student} : StudentDataProps) {

  return (
    <div className="bg-white shadow rounded-lg">
      <StudentSectionHeader 
        title="Guardian Information" 
        editPath="/edit/guardian" 
        studentId={student._id} 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Guardian Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.guardian.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.guardian.relationship}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CNI Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.guardian.cniNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.guardian.phone || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.guardian.email || 'Not provided'}</dd>
              </div>
            </dl>
          </div>

          {/* You could add additional information or features here like:
           * - List of other students with the same guardian
           * - Guardian contact history
           * - Emergency contact information
           */}
        </div>
      </div>
    </div>
  );
}
