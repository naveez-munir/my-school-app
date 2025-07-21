import { useState } from "react";
import { usePaymentStats } from "~/hooks/useFeePaymentQueries";
import { formatCurrency } from "~/types/studentFee";
import { AcademicYearSelector } from "~/components/common/AcademicYearSelector";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getCurrentAcademicYear } from "~/utils/academicYearUtils";

interface PaymentDashboardProps {
  onNavigateToDailyReport: () => void;
  onNavigateToDateRangeReport: () => void;
}

export function PaymentsDashboard({ 
  onNavigateToDailyReport,
  onNavigateToDateRangeReport
}: PaymentDashboardProps) {
  const [academicYear, setAcademicYear] = useState<string>(getCurrentAcademicYear());
  
  const { data, isLoading, error } = usePaymentStats(academicYear);
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Prepare chart data for monthly collections
  const chartData = data?.byMonth 
    ? Object.entries(data.byMonth).map(([month, amount]) => ({
        month: monthNames[parseInt(month) - 1],
        amount,
      })).sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month))
    : [];
  
  // Prepare pie chart data for collection rate
  const pieChartData = data ? [
    { name: 'Collected', value: data.totalCollected },
    { name: 'Pending', value: data.pendingAmount },
    { name: 'Overdue', value: data.overdueAmount },
  ] : [];
  
  const pieColors = ['#4ade80', '#facc15', '#f87171'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fee Payments Dashboard</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={onNavigateToDailyReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Daily Report
          </button>
          <button
            onClick={onNavigateToDateRangeReport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Date Range Report
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <AcademicYearSelector
          value={academicYear}
          onChange={setAcademicYear}
          label="Academic Year"
        />
      </div>
      
      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-gray-600">Loading payment statistics...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          <p>Error loading payment statistics. Please try again.</p>
        </div>
      ) : !data ? (
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
          <p>No payment data available for the selected academic year.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Collected</h3>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(data.totalCollected)}</p>
              <div className="mt-2 text-sm text-gray-500">
                Collection Rate: {data.collectionRate.toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Amount</h3>
              <p className="text-3xl font-bold text-yellow-500">{formatCurrency(data.pendingAmount)}</p>
              <div className="mt-2 text-sm text-gray-500">
                {((data.pendingAmount / (data.totalCollected + data.pendingAmount + data.overdueAmount)) * 100).toFixed(1)}% of total
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Overdue Amount</h3>
              <p className="text-3xl font-bold text-red-500">{formatCurrency(data.overdueAmount)}</p>
              <div className="mt-2 text-sm text-gray-500">
                {((data.overdueAmount / (data.totalCollected + data.pendingAmount + data.overdueAmount)) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-base font-medium mb-4">Monthly Collections</h3>
              <div className="h-80">
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
                    <XAxis dataKey="month" />
                    <YAxis
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
                      formatter={(value: number) => [formatCurrency(value), "Amount"]}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-base font-medium mb-4">Collection Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Amount"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-base font-medium mb-4">Payment Collection Summary</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Collected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chartData.map((item) => (
                  <tr key={item.month}>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {((item.amount / data.totalCollected) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(data.totalCollected)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                    100%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
