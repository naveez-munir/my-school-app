import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MonthlyFeeData {
  month: string;
  collected: number;
  pending: number;
}

interface FeeCollectionChartProps {
  data: MonthlyFeeData[];
  isLoading?: boolean;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function FeeCollectionChart({ data, isLoading }: FeeCollectionChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      month: item.month,
      collected: item.collected,
      pending: item.pending,
      total: item.collected + item.pending
    }));
  }, [data]);

  const hasPendingData = useMemo(() => {
    return data.some(item => item.pending > 0);
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Fee Collection (Last 6 Months)</h3>
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-sm sm:text-base text-gray-600">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Fee Collection (Last 6 Months)</h3>
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <p className="text-sm sm:text-base text-gray-500">No fee collection data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Fee Collection (Last 6 Months)</h3>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10 }}
              className="sm:text-xs"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              className="sm:text-xs"
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value;
              }}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Bar dataKey="collected" fill="#10b981" name="Collected" />
            {hasPendingData && <Bar dataKey="pending" fill="#facc15" name="Pending" />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

