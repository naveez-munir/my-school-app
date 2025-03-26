import { useState } from 'react';
import { Modal } from '~/components/common/Modal';
import { 
  type LeaveResponse, 
  LeaveStatus, 
  type ApproveLeaveRequest,
  EmployeeType
} from '~/types/staffLeave';
import { LeaveTypeLabels } from './LeaveDetailModal';

interface ApproveLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveResponse | null;
  onApprove: (id: string, data: ApproveLeaveRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function ApproveLeaveModal({
  isOpen,
  onClose,
  leave,
  onApprove,
  isSubmitting
}: ApproveLeaveModalProps) {
  const [comments, setComments] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<LeaveStatus.APPROVED | LeaveStatus.REJECTED>(
    LeaveStatus.APPROVED
  );
  const [approverInfo, setApproverInfo] = useState({
    approverId: '',
    approverType: EmployeeType.TEACHER
  });
  
  if (!leave) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leave.id || !approverInfo.approverId) return;
    
    try {
      await onApprove(leave.id, {
        approvedBy: approverInfo.approverId,
        approverType: approverInfo.approverType,
        status: approvalStatus,
        comments: comments.trim() || undefined
      });
      
      onClose();
    } catch (error) {
      console.error('Error approving/rejecting leave', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={approvalStatus === LeaveStatus.APPROVED ? "Approve Leave Request" : "Reject Leave Request"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Employee</p>
              <p className="text-sm font-medium text-gray-900">
                {leave.employeeName || 'Not specified'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Leave Type</p>
              <p className="text-sm font-medium text-gray-900">
                {LeaveTypeLabels[leave.leaveType]}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Days</p>
              <p className="text-sm font-medium text-gray-900">
                {leave.numberOfDays} day{leave.numberOfDays !== 1 ? 's' : ''}
              </p>
            </div>
            
            {leave.reason && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Reason</p>
                <p className="text-sm font-medium text-gray-900">{leave.reason}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Approver Information */}
        {/* TODO it should be auto attached like current logged in User no need to ask from the user */}
        {/* <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="approverType">
              Approver Type
            </label>
            <select
              id="approverType"
              value={approverInfo.approverType}
              onChange={(e) => setApproverInfo({...approverInfo, approverType: e.target.value as EmployeeType})}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value={EmployeeType.TEACHER}>Teacher</option>
              <option value={EmployeeType.STAFF}>Staff</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="approverId">
              Approver ID
            </label>
            <input
              type="text"
              id="approverId"
              value={approverInfo.approverId}
              onChange={(e) => setApproverInfo({...approverInfo, approverId: e.target.value})}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
              placeholder="Enter approver ID"
              required
            />
          </div>
        </div> */}
        
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decision
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="approvalStatus"
                value={LeaveStatus.APPROVED}
                checked={approvalStatus === LeaveStatus.APPROVED}
                onChange={() => setApprovalStatus(LeaveStatus.APPROVED)}
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Approve</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="approvalStatus"
                value={LeaveStatus.REJECTED}
                checked={approvalStatus === LeaveStatus.REJECTED}
                onChange={() => setApprovalStatus(LeaveStatus.REJECTED)}
                className="h-4 w-4 text-red-600 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Reject</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="comments">
            Comments
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            placeholder={approvalStatus === LeaveStatus.APPROVED ? 
              "Optional comments for approval" : 
              "Please provide a reason for rejection"}
          />
        </div>

        <div className="pt-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
              approvalStatus === LeaveStatus.APPROVED ? 
                'bg-green-600 hover:bg-green-700' : 
                'bg-red-600 hover:bg-red-700'
            }`}
            disabled={isSubmitting || !approverInfo.approverId}
          >
            {isSubmitting ? 'Processing...' : (approvalStatus === LeaveStatus.APPROVED ? 'Approve' : 'Reject')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
