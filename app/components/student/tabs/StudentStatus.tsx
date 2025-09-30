import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { CheckCircle, AlertCircle, Calendar, FileText } from 'lucide-react';

export function StudentStatus({student} : StudentDataProps) {

  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      <StudentSectionHeader
        title="Student Status"
        editPath="/edit/status"
        studentId={student._id}
        buttonText="Update Status"
      />

      <div className="p-6 space-y-8">
        {/* Current Status Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Current Status</h4>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
            {student.status === 'Active' ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">{student.status}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-600">{student.status}</span>
              </>
            )}
          </div>

          {student.status !== 'Active' && (
            <div className="mt-4 p-4 rounded-md bg-yellow-50 border border-yellow-200">
              <p className="text-sm text-yellow-700">
                This student is currently marked as <strong>{student.status}</strong>.
                Some features may be restricted.
              </p>
            </div>
          )}
        </div>

        {/* Exit Information Section */}
        {(student.exitStatus && student.exitStatus !== 'None') && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Exit Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Exit Status</p>
                    <p className="text-sm font-semibold text-gray-900 mt-2 break-words">{student.exitStatus}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Exit Date</p>
                    <p className="text-sm font-semibold text-gray-900 mt-2 break-words">{formatUserFriendlyDate(student.exitDate || '')}</p>
                  </div>
                </div>
              </div>

              {student.exitRemarks && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors md:col-span-2">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Exit Remarks</p>
                      <p className="text-sm font-semibold text-gray-900 mt-2 break-words whitespace-pre-line">{student.exitRemarks}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
