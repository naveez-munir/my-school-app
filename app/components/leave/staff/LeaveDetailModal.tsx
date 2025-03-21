import { Modal } from '~/components/common/Modal';
import { 
  type LeaveResponse, 
  LeaveType, 
  LeaveStatus, 
  EmployeeType 
} from '~/types/staffLeave';

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

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
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {LeaveTypeLabels[leave.leaveType]}
              </h3>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(leave.status)}`}>
                {LeaveStatusLabels[leave.status]}
              </span>
            </div>
            <div className="mt-2 text-md font-medium text-gray-900">
              {leave.numberOfDays} day{leave.numberOfDays !== 1 ? 's' : ''}
              {leave.isPaid ? ' (Paid)' : ' (Unpaid)'}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Employee</p>
            <p className="text-sm font-medium text-gray-900">{leave.employeeName || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Employee Type</p>
            <p className="text-sm font-medium text-gray-900">{EmployeeTypeLabels[leave.employeeType]}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(leave.startDate)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(leave.endDate)}</p>
          </div>

          {leave.reason && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Reason</p>
              <p className="text-sm font-medium text-gray-900">{leave.reason}</p>
            </div>
          )}

          {leave.status !== LeaveStatus.PENDING && (
            <>
              {leave.approverName && (
                <div>
                  <p className="text-sm text-gray-500">Approved/Rejected By</p>
                  <p className="text-sm font-medium text-gray-900">{leave.approverName}</p>
                </div>
              )}
              
              {leave.approvalDate && (
                <div>
                  <p className="text-sm text-gray-500">Decision Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(leave.approvalDate)}</p>
                </div>
              )}
              
              {leave.comments && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Comments</p>
                  <p className="text-sm font-medium text-gray-900">{leave.comments}</p>
                </div>
              )}
            </>
          )}

          {leave.isDeductionApplied && (
            <div className="col-span-2 mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
              Salary deduction has been applied for this leave.
            </div>
          )}

          <div className="col-span-2 border-t pt-3 mt-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Created At:</span>
              <span>{formatDate(leave.createdAt)}</span>
            </div>
            {leave.updatedAt && leave.updatedAt !== leave.createdAt && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Last Updated:</span>
                <span>{formatDate(leave.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
