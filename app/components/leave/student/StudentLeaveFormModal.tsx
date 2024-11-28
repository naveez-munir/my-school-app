import { useState, useEffect } from 'react';
import { Modal } from '~/components/common/Modal';
import { useCreateStudentLeave } from '~/hooks/useStudentLeaveQueries';
import { LeaveType } from '~/types/studentLeave';
import toast from 'react-hot-toast';

interface StudentLeaveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

export function StudentLeaveFormModal({ isOpen, onClose, studentId }: StudentLeaveFormModalProps) {
  const { mutate: createLeave, isPending } = useCreateStudentLeave();
  
  const [formData, setFormData] = useState({
    leaveType: LeaveType.MEDICAL,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    supportingDocumentUrl: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        leaveType: LeaveType.MEDICAL,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: '',
        supportingDocumentUrl: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      toast.error('End date cannot be earlier than start date');
      return;
    }

    if (!formData.reason.trim()) {
      toast.error('Please provide a reason for leave');
      return;
    }
    
    createLeave(
      {
        studentId,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        supportingDocumentUrl: formData.supportingDocumentUrl || undefined,
        affectedClasses: [],
      },
      {
        onSuccess: () => {
          toast.success('Leave request created successfully');
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || error?.message || 'Failed to create leave request');
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Leave Request">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1">
            Leave Type <span className="text-red-500">*</span>
          </label>
          <select
            id="leaveType"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveType })}
            required
          >
            <option value={LeaveType.MEDICAL}>Medical</option>
            <option value={LeaveType.FAMILY_EMERGENCY}>Family Emergency</option>
            <option value={LeaveType.PLANNED_ABSENCE}>Planned Absence</option>
            <option value={LeaveType.OTHER}>Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Leave <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please provide details about the reason for leave"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="supportingDocumentUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Document URL (Optional)
          </label>
          <input
            type="text"
            id="supportingDocumentUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter document URL if available"
            value={formData.supportingDocumentUrl}
            onChange={(e) => setFormData({ ...formData, supportingDocumentUrl: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

