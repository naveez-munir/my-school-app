import { useState } from 'react';
import { Edit, AlertCircle } from 'lucide-react';
import { useLeaveBalance, useCreateLeaveBalance } from '~/hooks/useLeaveBalance';
import { LeaveBalanceCard } from './LeaveBalanceCard';
import { EditLeaveBalanceModal } from './EditLeaveBalanceModal';
import toast from 'react-hot-toast';

interface LeaveBalanceTabProps {
  employeeId: string;
  employeeType: 'Teacher' | 'Staff';
  isAdmin?: boolean;
}

export function LeaveBalanceTab({
  employeeId,
  employeeType,
  isAdmin = false,
}: LeaveBalanceTabProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: leaveBalance, isLoading, error } = useLeaveBalance(
    employeeId,
    employeeType,
    selectedYear
  );

  const createMutation = useCreateLeaveBalance();

  const handleCreateBalance = async () => {
    try {
      await createMutation.mutateAsync({
        employeeId,
        employeeType,
        year: selectedYear,
        sickLeaveAllocation: 12,
        casualLeaveAllocation: 12,
        earnedLeaveAllocation: 0,
      });
      toast.success('Leave balance created successfully');
    } catch (error) {
      toast.error('Failed to create leave balance');
    }
  };

  const yearOptions = [];
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    yearOptions.push(i);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading leave balance...</div>
      </div>
    );
  }

  if (error && !leaveBalance) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-900 mb-1">
              No Leave Balance Found
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              Leave balance for {selectedYear} has not been created yet.
            </p>
            {isAdmin && (
              <button
                onClick={handleCreateBalance}
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Leave Balance'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!leaveBalance) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Leave Balance</h3>
          <p className="text-sm text-gray-500">
            Track and manage leave allocations and usage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {isAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              Edit Balance
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LeaveBalanceCard
          title="Sick Leave"
          icon="🤒"
          allocated={leaveBalance.sickLeaveAllocation}
          used={leaveBalance.sickLeaveUsed}
          remaining={leaveBalance.sickLeaveRemaining}
          color="blue"
        />
        <LeaveBalanceCard
          title="Casual Leave"
          icon="🏖️"
          allocated={leaveBalance.casualLeaveAllocation}
          used={leaveBalance.casualLeaveUsed}
          remaining={leaveBalance.casualLeaveRemaining}
          color="green"
        />
        <LeaveBalanceCard
          title="Earned Leave"
          icon="⭐"
          allocated={leaveBalance.earnedLeaveAllocation}
          used={leaveBalance.earnedLeaveUsed}
          remaining={leaveBalance.earnedLeaveRemaining}
          color="purple"
        />
        <div className="p-5 rounded-lg border-2 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💸</span>
            <h3 className="font-semibold text-lg text-yellow-700">Unpaid Leave</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-700 mt-3">
            {leaveBalance.unpaidLeaveUsed}
          </p>
          <p className="text-sm text-gray-600 mt-1">days taken</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Allocated</p>
            <p className="font-semibold text-gray-900">
              {leaveBalance.sickLeaveAllocation +
                leaveBalance.casualLeaveAllocation +
                leaveBalance.earnedLeaveAllocation}{' '}
              days
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total Used</p>
            <p className="font-semibold text-gray-900">
              {leaveBalance.sickLeaveUsed +
                leaveBalance.casualLeaveUsed +
                leaveBalance.earnedLeaveUsed}{' '}
              days
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total Remaining</p>
            <p className="font-semibold text-green-600">
              {leaveBalance.sickLeaveRemaining +
                leaveBalance.casualLeaveRemaining +
                leaveBalance.earnedLeaveRemaining}{' '}
              days
            </p>
          </div>
          <div>
            <p className="text-gray-600">Unpaid</p>
            <p className="font-semibold text-yellow-600">
              {leaveBalance.unpaidLeaveUsed} days
            </p>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditLeaveBalanceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          leaveBalance={leaveBalance}
        />
      )}
    </div>
  );
}
