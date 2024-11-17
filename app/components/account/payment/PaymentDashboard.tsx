import { useState, useMemo } from 'react';
import { usePayments } from '~/hooks/usePayment';
import { formatCurrency } from '~/utils/currencyUtils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  calculatePaymentStats,
  calculatePercentageChange,
  getDailySummary,
  getTypeDistribution,
  getModeDistribution,
  getStatusDistribution,
  getMonthDateRange,
  getPreviousMonth,
  getMonthName
} from '~/utils/paymentStatsCalculator';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

export function PaymentDashboard() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [compareWithLastMonth, setCompareWithLastMonth] = useState(false);

  // Get date ranges
  const currentMonthRange = useMemo(
    () => getMonthDateRange(selectedMonth, selectedYear),
    [selectedMonth, selectedYear]
  );

  const previousMonthData = useMemo(
    () => getPreviousMonth(selectedMonth, selectedYear),
    [selectedMonth, selectedYear]
  );

  const previousMonthRange = useMemo(
    () => getMonthDateRange(previousMonthData.month, previousMonthData.year),
    [previousMonthData]
  );

  // Fetch current month payments
  const { data: currentPayments = [], isLoading: isLoadingCurrent } = usePayments({
    fromDate: currentMonthRange.fromDate,
    toDate: currentMonthRange.toDate
  });

  // Fetch previous month payments (only if compare is enabled)
  const { data: previousPayments = [], isLoading: isLoadingPrevious } = usePayments(
    {
      fromDate: previousMonthRange.fromDate,
      toDate: previousMonthRange.toDate
    },
    { enabled: compareWithLastMonth }
  );

  // Calculate statistics
  const currentStats = useMemo(
    () => calculatePaymentStats(currentPayments),
    [currentPayments]
  );

  const previousStats = useMemo(
    () => compareWithLastMonth ? calculatePaymentStats(previousPayments) : undefined,
    [compareWithLastMonth, previousPayments]
  );

  const percentageChange = useMemo(
    () => compareWithLastMonth && previousStats
      ? calculatePercentageChange(currentStats, previousStats)
      : undefined,
    [compareWithLastMonth, currentStats, previousStats]
  );

  // Get chart data
  const dailySummary = useMemo(() => getDailySummary(currentPayments), [currentPayments]);
  const typeDistribution = useMemo(() => getTypeDistribution(currentPayments), [currentPayments]);
  const modeDistribution = useMemo(() => getModeDistribution(currentPayments), [currentPayments]);
  const statusDistribution = useMemo(() => getStatusDistribution(currentPayments), [currentPayments]);

  // Chart colors
  const typeColors = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981'];
  const modeColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316'];
  const statusColors = {
    COMPLETED: '#10b981',
    PENDING: '#facc15',
    FAILED: '#ef4444',
    REFUNDED: '#6b7280'
  };

  const isLoading = isLoadingCurrent || (compareWithLastMonth && isLoadingPrevious);

  // Render percentage change badge
  const renderPercentageBadge = (change?: number) => {
    if (!change || !compareWithLastMonth) return null;

    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className={`flex items-center text-sm ${colorClass} mt-1`}>
        <Icon className="h-4 w-4 mr-1" />
        <span>{Math.abs(change).toFixed(1)}% vs last month</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payment Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={compareWithLastMonth}
                onChange={(e) => setCompareWithLastMonth(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Compare with Last Month</span>
            </label>
          </div>
        </div>
      </div>

      {/* Month and Year Selectors */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-gray-600">Loading payment statistics...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Income */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(currentStats.totalIncome)}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                {currentStats.incomeTransactionCount} transactions
              </div>
              <div className="text-xs text-gray-400">
                Avg: {formatCurrency(currentStats.averageIncomePerTransaction)}
              </div>
              {renderPercentageBadge(percentageChange?.income)}
            </div>

            {/* Total Expense */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Expense</h3>
                <DollarSign className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(currentStats.totalExpense)}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                {currentStats.expenseTransactionCount} transactions
              </div>
              <div className="text-xs text-gray-400">
                Avg: {formatCurrency(currentStats.averageExpensePerTransaction)}
              </div>
              {renderPercentageBadge(percentageChange?.expense)}
            </div>

            {/* Net Balance */}
            <div className={`bg-white p-6 rounded-lg shadow border-l-4 ${
              currentStats.netBalance >= 0 ? 'border-blue-500' : 'border-orange-500'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Net Balance</h3>
                <DollarSign className={`h-5 w-5 ${
                  currentStats.netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'
                }`} />
              </div>
              <p className={`text-3xl font-bold ${
                currentStats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {formatCurrency(currentStats.netBalance)}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Profit Margin: {currentStats.profitMargin.toFixed(1)}%
              </div>
              {renderPercentageBadge(percentageChange?.net)}
            </div>

            {/* Pending Payments */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">
                {formatCurrency(currentStats.pendingAmount)}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                {currentStats.pendingCount} pending transactions
              </div>
              <div className="text-xs text-gray-400">
                {currentStats.totalIncome > 0 
                  ? `${((currentStats.pendingAmount / (currentStats.totalIncome + currentStats.pendingAmount)) * 100).toFixed(1)}% of total`
                  : 'N/A'
                }
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Income vs Expense Trend */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-base font-medium mb-4">Daily Income vs Expense</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                        return value;
                      }}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Type Distribution */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-base font-medium mb-4">Payment Type Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={typeColors[index % typeColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Payment Mode Distribution */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-base font-medium mb-4">Payment Mode Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {modeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={modeColors[index % modeColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Status Distribution */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-base font-medium mb-4">Payment Status Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      innerRadius={60}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={statusColors[entry.name as keyof typeof statusColors] || '#6b7280'}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Daily Summary Table */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-base font-medium mb-4">Daily Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Income
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expense
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailySummary.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No transactions for this period
                      </td>
                    </tr>
                  ) : (
                    dailySummary.map((day) => (
                      <tr key={day.date}>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-green-600">
                          {formatCurrency(day.income)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-red-600">
                          {formatCurrency(day.expense)}
                        </td>
                        <td className={`px-6 py-3 whitespace-nowrap text-sm font-medium ${
                          day.net >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {formatCurrency(day.net)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {day.transactionCount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {dailySummary.length > 0 && (
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        Total
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                        {formatCurrency(currentStats.totalIncome)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-red-600">
                        {formatCurrency(currentStats.totalExpense)}
                      </td>
                      <td className={`px-6 py-3 whitespace-nowrap text-sm font-bold ${
                        currentStats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {formatCurrency(currentStats.netBalance)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        {currentStats.incomeTransactionCount + currentStats.expenseTransactionCount}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

