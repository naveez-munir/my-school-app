import { useState } from "react";
import { useDailyPayments } from "~/hooks/useFeePaymentQueries";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { formatCurrency } from "~/types/studentFee";
import { Calendar, ChevronLeft, ChevronRight, Printer } from "lucide-react";

interface DailyPaymentsReportProps {
  onViewReceipt: (paymentId: string) => void;
}

export function DailyPaymentsReport({ onViewReceipt }: DailyPaymentsReportProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data, isLoading, error } = useDailyPayments(selectedDate);
  
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    
    // Don't allow going beyond today
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };
  
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Daily Payments Report</h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousDay}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={handleDateChange}
              className="pl-8 pr-2 py-1 border rounded-md"
              max={new Date().toISOString().split('T')[0]}
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          
          <button
            onClick={goToNextDay}
            disabled={selectedDate.toDateString() === new Date().toDateString()}
            className={`p-1 rounded-md ${
              selectedDate.toDateString() === new Date().toDateString()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-medium">{formattedDate}</h3>
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
            <p>No payments recorded for this day.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm text-blue-700 mb-1">Total Collected</h4>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(data.summary.totalCollected)}
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
                    {(amount as number / data.summary.totalCollected * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.studentName || `${payment.student?.firstName || ''} ${payment.student?.lastName || ''}`.trim() || 'N/A'}
                        </div>
                        {(payment.studentRollNumber || payment.student?.rollNumber) && (
                          <div className="text-xs text-gray-500">
                            Roll #: {payment.studentRollNumber || payment.student?.rollNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.studentClass ||
                           (typeof payment.student?.class === 'object'
                            ? payment.student.class.className
                            : payment.student?.class || 'N/A')}
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
