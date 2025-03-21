import type { LeaveBalanceResponse, EmployeeType } from '~/types/staffLeave';
import { EmployeeTypeLabels } from './LeaveDetailModal';

interface LeaveBalanceDetailProps {
  balance: LeaveBalanceResponse;
  loading?: boolean;
}

export function LeaveBalanceDetail({ balance, loading = false }: LeaveBalanceDetailProps) {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Leave Balance for {balance.year}
        </h3>
        <span className="text-sm font-medium text-gray-600">
          {balance.employeeName ? balance.employeeName : 'Employee'} ({EmployeeTypeLabels[balance.employeeType]})
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Sick Leave Card */}
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700">Sick Leave</span>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
              {balance.sickLeaveRemaining} / {balance.sickLeaveAllocation}
            </span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, (balance.sickLeaveRemaining / balance.sickLeaveAllocation) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-blue-700">
            <span>Used: {balance.sickLeaveUsed}</span>
            <span>Remaining: {balance.sickLeaveRemaining}</span>
          </div>
        </div>
        
        {/* Casual Leave Card */}
        <div className="bg-green-50 p-4 rounded-md border border-green-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-green-700">Casual Leave</span>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              {balance.casualLeaveRemaining} / {balance.casualLeaveAllocation}
            </span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-green-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, (balance.casualLeaveRemaining / balance.casualLeaveAllocation) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-green-700">
            <span>Used: {balance.casualLeaveUsed}</span>
            <span>Remaining: {balance.casualLeaveRemaining}</span>
          </div>
        </div>
        
        {/* Earned Leave Card */}
        <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-amber-700">Earned Leave</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
              {balance.earnedLeaveRemaining} / {balance.earnedLeaveAllocation}
            </span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-amber-200 rounded-full h-2.5">
              <div 
                className="bg-amber-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, (balance.earnedLeaveRemaining / balance.earnedLeaveAllocation) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-amber-700">
            <span>Used: {balance.earnedLeaveUsed}</span>
            <span>Remaining: {balance.earnedLeaveRemaining}</span>
          </div>
        </div>
      </div>
      
      {/* Unpaid Leave Info */}
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Unpaid Leave Used</span>
          <span className="text-sm font-medium text-gray-700">{balance.unpaidLeaveUsed} days</span>
        </div>
      </div>
    </div>
  );
}
