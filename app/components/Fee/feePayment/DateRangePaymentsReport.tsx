import { useState } from "react";
import { usePaymentsByDateRange } from "~/hooks/useFeePaymentQueries";
import { formatCurrency, type FeePaymentFilterParams } from "~/types/studentFee";
import { ClassSelector } from "~/components/common/ClassSelector";
import { Calendar, Download, Printer } from "lucide-react";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { DateInput } from "~/components/common/form/inputs/DateInput";

interface DateRangePaymentsReportProps {
  onViewReceipt: (paymentId: string) => void;
}

export function DateRangePaymentsReport({ onViewReceipt }: DateRangePaymentsReportProps) {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });
  
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  
  const { data, isLoading, error } = usePaymentsByDateRange(
    startDate,
    endDate,
    selectedClass ? { classId: selectedClass } : undefined
  );
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(new Date(e.target.value));
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(e.target.value));
  };
  
  const exportToCsv = () => {
    if (!data || !data.payments.length) return;
    
    const headers = [
      'Date',
      'Student Name',
      'Class',
      'Roll Number',
      'Amount',
      'Late Charges',
      'Total',
      'Payment Mode',
      'Status',
    ];
    
    const rows = data.payments.map(payment => [
      new Date(payment.paymentDate).toLocaleDateString(),
      `${payment.student?.firstName} ${payment.student?.lastName}`,
      typeof payment.student?.class === 'object' ? payment.student.class.className : '',
      payment.student?.rollNumber || '',
      payment.amount.toString(),
      payment.lateChargesPaid.toString(),
      (payment.amount + payment.lateChargesPaid).toString(),
      payment.paymentMode,
      payment.status,
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Payments Date Range Report</h2>
        
        {data && data.payments.length > 0 && (
          <button
            onClick={exportToCsv}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateInput 
         type="date"
         value={endDate.toISOString()}
         onChange={(value) => {setStartDate(new Date(value))}}
         label="Start Date"
        />

        <DateInput 
         type="date"
         value={endDate.toISOString()}
         onChange={(value) => {setEndDate(new Date(value))}}
         label="End Date"
        />
        
        <ClassSelector
          label="Class (Optional)"
          value={selectedClass}
          onChange={setSelectedClass}
          placeholder="All Classes"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-medium">
            Payments from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </h3>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading payment data...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <p>Error loading payment data.</p>
          </div>
        ) : !data || data.payments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No payments found for the selected period and filters.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm text-blue-700 mb-1">Total Collected</h4>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(data.summary.totalAmount)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {data.summary.count} payments
                </p>
              </div>
              
              {Object.entries(data.summary.byPaymentMode).map(([mode, amount]) => (
                <div key={mode} className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm text-gray-600 mb-1">{mode}</h4>
                  <p className="text-xl font-bold text-gray-800">
                    {formatCurrency(amount as number)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((amount as number) / data.summary.totalAmount * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
            
            {data.summary.byClass && Object.keys(data.summary.byClass).length > 0 && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-medium mb-2">Collections by Class</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {Object.entries(data.summary.byClass).map(([className, amount]) => (
                    <div key={className} className="bg-gray-50 p-2 rounded-md text-center">
                      <p className="text-xs text-gray-600 truncate">{className}</p>
                      <p className="text-sm font-medium">{formatCurrency(amount as number)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.student?.firstName} {payment.student?.lastName}
                        </div>
                        {payment.student?.rollNumber && (
                          <div className="text-xs text-gray-500">
                            Roll #: {payment.student.rollNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {typeof payment.student?.class === 'object'
                            ? payment.student.class.className
                            : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {formatCurrency(payment.amount)}
                        </div>
                        {payment.lateChargesPaid > 0 && (
                          <div className="text-xs text-gray-500">
                            + {formatCurrency(payment.lateChargesPaid)} (late charges)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.paymentMode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.status === 'SUCCESS' && (
                          <button
                            onClick={() => onViewReceipt(payment._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Print Receipt"
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
