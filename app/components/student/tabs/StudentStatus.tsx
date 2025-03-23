import { useNavigate } from 'react-router';
import type { Student } from '~/types/student';

interface StudentDataProps {
  student: Student;
}

export function StudentStatus({student} : StudentDataProps) {
  const navigate = useNavigate();

  // Format a date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Student Status</h3>
        <button 
          onClick={() => navigate(`/dashboard/students/${student._id}/edit/status`)}
          className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
        >
          Update Status
        </button>
      </div>
      
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
