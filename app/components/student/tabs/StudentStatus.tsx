import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatDate } from '~/utils/dateUtils';

export function StudentStatus({student} : StudentDataProps) {

  return (
    <div className="bg-white shadow rounded-lg">
      <StudentSectionHeader 
        title="Student Status" 
        editPath="/edit/status" 
        studentId={student._id}
        buttonText="Update Status" 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Current Status</h4>
            <dl className="mt-2 space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className={`mt-1 text-sm font-medium ${
                  student.status === 'Active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {student.status}
                </dd>
              </div>
              
              {student.status !== 'Active' && (
                <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    This student is currently marked as <strong>{student.status}</strong>. 
                    Some features may be restricted.
                  </p>
                </div>
              )}
            </dl>
          </div>
          
          {(student.exitStatus && student.exitStatus !== 'None') && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Exit Information</h4>
              <dl className="mt-2 space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Exit Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.exitStatus}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Exit Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(student.exitDate || '')}</dd>
                </div>
                {student.exitRemarks && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Exit Remarks</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                      {student.exitRemarks}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
