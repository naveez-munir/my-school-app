import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUpdateLeaveBalance } from '~/hooks/useLeaveBalance';
import type { LeaveBalance, UpdateLeaveBalanceDto } from '~/services/leaveBalanceApi';

interface EditLeaveBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveBalance: LeaveBalance;
}

export function EditLeaveBalanceModal({
  isOpen,
  onClose,
  leaveBalance,
}: EditLeaveBalanceModalProps) {
  const updateMutation = useUpdateLeaveBalance();

  const [formData, setFormData] = useState<UpdateLeaveBalanceDto>({
    sickLeaveAllocation: leaveBalance.sickLeaveAllocation,
    casualLeaveAllocation: leaveBalance.casualLeaveAllocation,
    earnedLeaveAllocation: leaveBalance.earnedLeaveAllocation,
    sickLeaveUsed: leaveBalance.sickLeaveUsed,
    casualLeaveUsed: leaveBalance.casualLeaveUsed,
    earnedLeaveUsed: leaveBalance.earnedLeaveUsed,
    unpaidLeaveUsed: leaveBalance.unpaidLeaveUsed,
  });

  useEffect(() => {
    setFormData({
      sickLeaveAllocation: leaveBalance.sickLeaveAllocation,
      casualLeaveAllocation: leaveBalance.casualLeaveAllocation,
      earnedLeaveAllocation: leaveBalance.earnedLeaveAllocation,
      sickLeaveUsed: leaveBalance.sickLeaveUsed,
      casualLeaveUsed: leaveBalance.casualLeaveUsed,
      earnedLeaveUsed: leaveBalance.earnedLeaveUsed,
      unpaidLeaveUsed: leaveBalance.unpaidLeaveUsed,
    });
  }, [leaveBalance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (formData.sickLeaveUsed ?? 0) > (formData.sickLeaveAllocation ?? 0) ||
      (formData.casualLeaveUsed ?? 0) > (formData.casualLeaveAllocation ?? 0) ||
      (formData.earnedLeaveUsed ?? 0) > (formData.earnedLeaveAllocation ?? 0)
    ) {
      toast.error('Used leave cannot exceed allocated leave');
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: leaveBalance.id, data: formData });
      toast.success('Leave balance updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update leave balance');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Leave Balance - {leaveBalance.year}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">🤒 Sick Leave</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allocation
                  </label>
                  <input
                    type="number"
                    value={formData.sickLeaveAllocation ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sickLeaveAllocation: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Used
                  </label>
                  <input
                    type="number"
                    value={formData.sickLeaveUsed ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sickLeaveUsed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">🏖️ Casual Leave</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allocation
                  </label>
                  <input
                    type="number"
                    value={formData.casualLeaveAllocation ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        casualLeaveAllocation: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Used
                  </label>
                  <input
                    type="number"
                    value={formData.casualLeaveUsed ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        casualLeaveUsed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3">⭐ Earned Leave</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allocation
                  </label>
                  <input
                    type="number"
                    value={formData.earnedLeaveAllocation ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        earnedLeaveAllocation: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Used
                  </label>
                  <input
                    type="number"
                    value={formData.earnedLeaveUsed ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        earnedLeaveUsed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-3">💸 Unpaid Leave</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days Used
                </label>
                <input
                  type="number"
                  value={formData.unpaidLeaveUsed ?? 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unpaidLeaveUsed: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
