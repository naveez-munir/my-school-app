import { type Payment, PaymentType, PaymentStatus, PaymentMode } from '~/types/payment.types';

export interface PaymentStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
  pendingAmount: number;
  pendingCount: number;
  averageIncomePerTransaction: number;
  averageExpensePerTransaction: number;
  profitMargin: number;
}

export interface PaymentComparison {
  current: PaymentStats;
  previous?: PaymentStats;
  percentageChange?: {
    income: number;
    expense: number;
    net: number;
  };
}

export interface DailySummary {
  date: string;
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
}

export interface TypeDistribution {
  name: string;
  value: number;
  count: number;
}

export interface ModeDistribution {
  name: string;
  value: number;
  count: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
  count: number;
}

/**
 * Calculate payment statistics from payment data
 */
export function calculatePaymentStats(payments: Payment[]): PaymentStats {
  const completedPayments = payments.filter(p => p.status === PaymentStatus.COMPLETED);
  
  const incomePayments = completedPayments.filter(
    p => p.paymentType === PaymentType.STUDENT_FEE || p.paymentType === PaymentType.OTHER_INCOME
  );
  
  const expensePayments = completedPayments.filter(
    p => p.paymentType === PaymentType.SALARY || p.paymentType === PaymentType.EXPENSE
  );
  
  const pendingPayments = payments.filter(p => p.status === PaymentStatus.PENDING);
  
  const totalIncome = incomePayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = expensePayments.reduce((sum, p) => sum + p.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const incomeTransactionCount = incomePayments.length;
  const expenseTransactionCount = expensePayments.length;
  const pendingCount = pendingPayments.length;
  
  const averageIncomePerTransaction = incomeTransactionCount > 0 
    ? totalIncome / incomeTransactionCount 
    : 0;
  
  const averageExpensePerTransaction = expenseTransactionCount > 0 
    ? totalExpense / expenseTransactionCount 
    : 0;
  
  const profitMargin = totalIncome > 0 
    ? (netBalance / totalIncome) * 100 
    : 0;
  
  return {
    totalIncome,
    totalExpense,
    netBalance,
    incomeTransactionCount,
    expenseTransactionCount,
    pendingAmount,
    pendingCount,
    averageIncomePerTransaction,
    averageExpensePerTransaction,
    profitMargin
  };
}

/**
 * Calculate percentage change between two stats
 */
export function calculatePercentageChange(
  current: PaymentStats,
  previous: PaymentStats
): { income: number; expense: number; net: number } {
  const incomeChange = previous.totalIncome > 0
    ? ((current.totalIncome - previous.totalIncome) / previous.totalIncome) * 100
    : 0;
  
  const expenseChange = previous.totalExpense > 0
    ? ((current.totalExpense - previous.totalExpense) / previous.totalExpense) * 100
    : 0;
  
  const netChange = previous.netBalance !== 0
    ? ((current.netBalance - previous.netBalance) / Math.abs(previous.netBalance)) * 100
    : 0;
  
  return {
    income: incomeChange,
    expense: expenseChange,
    net: netChange
  };
}

/**
 * Group payments by date for daily summary
 */
export function getDailySummary(payments: Payment[]): DailySummary[] {
  const completedPayments = payments.filter(p => p.status === PaymentStatus.COMPLETED);
  
  const groupedByDate = completedPayments.reduce((acc, payment) => {
    const date = new Date(payment.paymentDate).toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = {
        date,
        income: 0,
        expense: 0,
        net: 0,
        transactionCount: 0
      };
    }
    
    const isIncome = payment.paymentType === PaymentType.STUDENT_FEE || 
                     payment.paymentType === PaymentType.OTHER_INCOME;
    
    if (isIncome) {
      acc[date].income += payment.amount;
    } else {
      acc[date].expense += payment.amount;
    }
    
    acc[date].net = acc[date].income - acc[date].expense;
    acc[date].transactionCount += 1;
    
    return acc;
  }, {} as Record<string, DailySummary>);
  
  return Object.values(groupedByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Get payment type distribution
 */
export function getTypeDistribution(payments: Payment[]): TypeDistribution[] {
  const completedPayments = payments.filter(p => p.status === PaymentStatus.COMPLETED);
  
  const distribution = completedPayments.reduce((acc, payment) => {
    const type = payment.paymentType;
    
    if (!acc[type]) {
      acc[type] = { name: type, value: 0, count: 0 };
    }
    
    acc[type].value += payment.amount;
    acc[type].count += 1;
    
    return acc;
  }, {} as Record<string, TypeDistribution>);
  
  return Object.values(distribution);
}

/**
 * Get payment mode distribution
 */
export function getModeDistribution(payments: Payment[]): ModeDistribution[] {
  const completedPayments = payments.filter(p => p.status === PaymentStatus.COMPLETED);
  
  const distribution = completedPayments.reduce((acc, payment) => {
    const mode = payment.paymentMode;
    
    if (!acc[mode]) {
      acc[mode] = { name: mode, value: 0, count: 0 };
    }
    
    acc[mode].value += payment.amount;
    acc[mode].count += 1;
    
    return acc;
  }, {} as Record<string, ModeDistribution>);
  
  return Object.values(distribution);
}

/**
 * Get payment status distribution
 */
export function getStatusDistribution(payments: Payment[]): StatusDistribution[] {
  const distribution = payments.reduce((acc, payment) => {
    const status = payment.status;
    
    if (!acc[status]) {
      acc[status] = { name: status, value: 0, count: 0 };
    }
    
    acc[status].value += payment.amount;
    acc[status].count += 1;
    
    return acc;
  }, {} as Record<string, StatusDistribution>);
  
  return Object.values(distribution);
}

/**
 * Get date range for a specific month and year
 */
export function getMonthDateRange(month: number, year: number): { fromDate: string; toDate: string } {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of month
  
  return {
    fromDate: startDate.toISOString().split('T')[0],
    toDate: endDate.toISOString().split('T')[0]
  };
}

/**
 * Get previous month and year
 */
export function getPreviousMonth(month: number, year: number): { month: number; year: number } {
  if (month === 1) {
    return { month: 12, year: year - 1 };
  }
  return { month: month - 1, year };
}

/**
 * Format month name
 */
export function getMonthName(month: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month - 1] || '';
}

