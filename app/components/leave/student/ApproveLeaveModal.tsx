import { useState } from 'react';
import { useApproveStudentLeave } from '~/hooks/useStudentLeaveQueries';
import { type StudentLeaveResponse, LeaveStatus } from '~/types/studentLeave';
import toast from 'react-hot-toast';

interface ApproveLeaveModalProps {
  leave: StudentLeaveResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function ApproveLeaveModal({ leave, isOpen, onClose }: ApproveLeaveModalProps) {
  const [comments, setComments] = useState('');
  const { mutate: approveLeave, isPending } = useApproveStudentLeave();
  
  if (!isOpen) return null;
  
  const handleApprove = (status: LeaveStatus.APPROVED | LeaveStatus.REJECTED) => {
    approveLeave(
      { 
        id: leave._id, 
        data: { status, comments } 
      },
      {
        onSuccess: () => {
          toast.success(status === LeaveStatus.APPROVED ? 'Leave approved successfully' : 'Leave rejected successfully');
          onClose();
        },
        onError: (error) => {
          toast.error(`Failed to process leave request: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Review Leave Request</h2>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Student</p>
              <p className="text-sm">{leave.studentId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Leave Type</p>
              <p className="text-sm">{leave.leaveType.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p className="text-sm">{new Date(leave.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p className="text-sm">{new Date(leave.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Days</p>
              <p className="text-sm">{leave.numberOfDays}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Requested By</p>
              <p className="text-sm">{leave.requestedByParent}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Reason</p>
            <p className="text-sm">{leave.reason || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Comments</p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your comments here..."
              rows={3}
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => handleApprove(LeaveStatus.REJECTED)}
            disabled={isPending}
          >
            Reject Leave
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onClick={() => handleApprove(LeaveStatus.APPROVED)}
            disabled={isPending}
          >
            Approve Leave
          </button>
        </div>
        
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
