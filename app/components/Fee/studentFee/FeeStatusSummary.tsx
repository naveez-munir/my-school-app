import { formatCurrency } from '~/types/studentFee';

interface FeeStatusSummaryProps {
  summary: {
    totalPending: number;
    totalOverdue: number;
    count: number;
  };
}

export function FeeStatusSummary({ summary }: FeeStatusSummaryProps) {
  const totalAmount = summary.totalPending + summary.totalOverdue;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">Pending Amount</h3>
          <div className="rounded-full bg-yellow-100 text-yellow-800 p-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">{formatCurrency(summary.totalPending)}</p>
        <p className="text-sm text-gray-500 mt-1">Current academic year</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">Overdue Amount</h3>
          <div className="rounded-full bg-red-100 text-red-800 p-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">{formatCurrency(summary.totalOverdue)}</p>
        <p className="text-sm text-gray-500 mt-1">Requires immediate attention</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">Total Outstanding</h3>
          <div className="rounded-full bg-blue-100 text-blue-800 p-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">{formatCurrency(totalAmount)}</p>
        <p className="text-sm text-gray-500 mt-1">Across {summary.count} fees</p>
      </div>
    </div>
  );
}
