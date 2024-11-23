import { DollarSign, TrendingUp } from 'lucide-react';

interface FinancialSummaryCardProps {
  monthlyRevenue: number;
  pendingAmount: number;
  collectionRate: number;
  onViewDetails?: () => void;
  isLoading?: boolean;
}

export function FinancialSummaryCard({
  monthlyRevenue,
  pendingAmount,
  collectionRate,
  onViewDetails,
  isLoading = false
}: FinancialSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Financial Overview</h3>
        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-6 sm:h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : (
        <>
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Monthly Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
              {formatCurrency(monthlyRevenue)}
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-yellow-50 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600">Pending</span>
              <span className="text-xs sm:text-sm font-semibold text-yellow-600">
                {formatCurrency(pendingAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs sm:text-sm text-gray-600">Collection Rate</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-green-600">
                {collectionRate.toFixed(1)}%
              </span>
            </div>
          </div>

          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="mt-3 sm:mt-4 w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Details →
            </button>
          )}
        </>
      )}
    </div>
  );
}

