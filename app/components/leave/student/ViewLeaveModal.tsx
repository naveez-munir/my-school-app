import { type StudentLeaveResponse } from '~/types/studentLeave';
import { X } from 'lucide-react';

interface ViewLeaveModalProps {
  leave: StudentLeaveResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewLeaveModal({ leave, isOpen, onClose }: ViewLeaveModalProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 relative">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Leave Request Details</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Student Name</p>
              <p className="text-base font-semibold text-gray-900">{leave.studentName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                {leave.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Leave Type</p>
              <p className="text-base text-gray-900">{leave.leaveType.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Number of Days</p>
              <p className="text-base text-gray-900">{leave.numberOfDays}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p className="text-base text-gray-900">{new Date(leave.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p className="text-base text-gray-900">{new Date(leave.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          {leave.reason && (
            <div>
              <p className="text-sm font-medium text-gray-500">Reason</p>
              <p className="text-base text-gray-900">{leave.reason}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-base text-gray-900">{new Date(leave.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-base text-gray-900">{new Date(leave.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

