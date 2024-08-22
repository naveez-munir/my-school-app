import { Modal } from '~/components/common/Modal';
import {
  type LeaveResponse,
  LeaveType,
  LeaveStatus,
  EmployeeType
} from '~/types/staffLeave';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

// Labels for enum values to display in UI
export const LeaveTypeLabels: Record<LeaveType, string> = {
  [LeaveType.SICK]: 'Sick Leave',
  [LeaveType.CASUAL]: 'Casual Leave',
  [LeaveType.EARNED]: 'Earned Leave',
  [LeaveType.MATERNITY]: 'Maternity Leave',
  [LeaveType.PATERNITY]: 'Paternity Leave',
  [LeaveType.UNPAID]: 'Unpaid Leave',
  [LeaveType.OTHER]: 'Other Leave'
};

export const LeaveStatusLabels: Record<LeaveStatus, string> = {
  [LeaveStatus.PENDING]: 'Pending',
  [LeaveStatus.APPROVED]: 'Approved',
  [LeaveStatus.REJECTED]: 'Rejected',
  [LeaveStatus.CANCELLED]: 'Cancelled'
};

export const EmployeeTypeLabels: Record<EmployeeType, string> = {
  [EmployeeType.TEACHER]: 'Teacher',
  [EmployeeType.STAFF]: 'Staff'
};

interface LeaveDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveResponse | null;
}

export function LeaveDetailModal({
  isOpen,
  onClose,
  leave
}: LeaveDetailModalProps) {
  if (!leave) return null;

  const getStatusClass = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case LeaveStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case LeaveStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case LeaveStatus.CANCELLED:
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Request Details"
    >
      <div className="space-y-0">
        {/* Employee & Leave Type Section */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-800">
                {leave.employeeName || 'Employee'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {EmployeeTypeLabels[leave.employeeType]}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(leave.status)}`}>
                {LeaveStatusLabels[leave.status]}
              </span>
              <p className="text-gray-500 text-sm mt-1">
                Requested on {formatUserFriendlyDate(leave.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Leave Type & Duration Section */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {LeaveTypeLabels[leave.leaveType]}
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className="text-blue-500 mr-3 text-xl">🗓️</span>
                <span className="font-medium text-gray-800">
                  {leave.numberOfDays} {leave.numberOfDays === 1 ? 'day' : 'days'}
                  {leave.isPaid ? ' (Paid)' : ' (Unpaid)'}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-500 mr-2">From:</span>
                <span className="font-medium">
                  {formatUserFriendlyDate(leave.startDate)}
                </span>
              </div>

              {leave.numberOfDays > 1 && (
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">To:</span>
                  <span className="font-medium">
                    {formatUserFriendlyDate(leave.endDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reason Section */}
        {leave.reason && (
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Reason for Leave
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="whitespace-pre-wrap text-gray-900">
                {leave.reason}
              </p>
            </div>
          </div>
        )}

        {/* Processing Details Section */}
        {leave.status !== LeaveStatus.PENDING && (
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Processing Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leave.approverName && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Approved/Rejected By</p>
                  <p className="font-medium text-gray-900">{leave.approverName}</p>
                </div>
              )}

              {leave.approvalDate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Decision Date</p>
                  <p className="font-medium text-gray-900">{formatUserFriendlyDate(leave.approvalDate)}</p>
                </div>
              )}
            </div>

            {leave.comments && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Comments</p>
                <p className="font-medium text-gray-900">{leave.comments}</p>
              </div>
            )}
          </div>
        )}

        {/* Salary Deduction Notice */}
        {leave.isDeductionApplied && (
          <div className="p-6 border-b">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
              <p className="font-medium">⚠️ Salary Deduction Applied</p>
              <p className="text-sm mt-1">Salary deduction has been applied for this leave.</p>
            </div>
          </div>
        )}

        {/* Request Information Section */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Request Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="font-medium text-gray-900">
                {formatUserFriendlyDate(leave.createdAt)}
              </p>
            </div>

            {leave.updatedAt && leave.updatedAt !== leave.createdAt && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {formatUserFriendlyDate(leave.updatedAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
