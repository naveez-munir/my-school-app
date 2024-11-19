import { X, Printer } from 'lucide-react';
import { formatCurrency } from '~/utils/currencyUtils';
import { SalaryStatus, SalaryStatusLabels, type SalaryResponse } from '~/types/salary.types';
import { SalarySlipPrint } from './SalarySlipPrint';
import { months } from '~/utils/studentFeeData';

interface ViewSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  salary: SalaryResponse;
}

export const ViewSalaryModal = ({ isOpen, onClose, salary }: ViewSalaryModalProps) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getMonthName = (month: number) => {
    return months[month - 1];
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  let statusBgColor, statusTextColor;
  switch (salary.status) {
    case SalaryStatus.PAID:
      statusBgColor = 'bg-green-100';
      statusTextColor = 'text-green-800';
      break;
    case SalaryStatus.APPROVED:
      statusBgColor = 'bg-blue-100';
      statusTextColor = 'text-blue-800';
      break;
    case SalaryStatus.PROCESSED:
      statusBgColor = 'bg-yellow-100';
      statusTextColor = 'text-yellow-800';
      break;
    case SalaryStatus.CANCELLED:
      statusBgColor = 'bg-red-100';
      statusTextColor = 'text-red-800';
      break;
    default:
      statusBgColor = 'bg-gray-100';
      statusTextColor = 'text-gray-800';
  }

  return (
    <>
      <SalarySlipPrint salary={salary} />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 screen-only">
        <div className="bg-white rounded-lg shadow-xl max-w-[95%] sm:max-w-2xl lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 flex justify-between items-center">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Salary Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
            </button>
          </div>

        <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-2">{salary.employeeName || 'Employee'}</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-500">{salary.employeeType}</p>
            </div>
            <div>
              <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1 inline-flex text-xs sm:text-sm lg:text-base leading-5 font-semibold rounded-full ${statusBgColor} ${statusTextColor}`}>
                {SalaryStatusLabels[salary.status]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 mb-1">Period</h4>
              <p className="text-sm sm:text-base lg:text-lg font-medium">{getMonthName(salary.month)} {salary.year}</p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 mb-1">Basic Salary</h4>
              <p className="text-sm sm:text-base lg:text-lg font-medium">{formatCurrency(salary.basicSalary)}</p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 mb-1">Net Salary</h4>
              <p className="text-sm sm:text-base lg:text-lg font-medium">{formatCurrency(salary.netSalary)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 mb-1">Working Days</h4>
              <p className="text-sm sm:text-base lg:text-lg font-medium">{salary.workingDays}</p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 mb-1">Present Days</h4>
              <p className="text-sm sm:text-base lg:text-lg font-medium">{salary.presentDays}</p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 mb-1">Leave Days</h4>
              <p className="text-sm sm:text-base lg:text-lg font-medium">{salary.leaveDays}</p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 mb-1">Overtime Hours</h4>
              <p className="text-sm sm:text-base lg:text-lg font-medium">{salary.overtimeHours || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div>
              <h4 className="text-sm sm:text-base lg:text-lg font-medium mb-3">Allowances</h4>
              {salary.allowances && salary.allowances.length > 0 ? (
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salary.allowances.map((allowance, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-xs sm:text-sm lg:text-base text-gray-900">{allowance.allowanceType}</td>
                          <td className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-xs sm:text-sm lg:text-base text-gray-900 text-right">{formatCurrency(allowance.calculatedAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs sm:text-sm lg:text-base text-gray-500">No allowances</p>
              )}
            </div>

            <div>
              <h4 className="text-sm sm:text-base lg:text-lg font-medium mb-3">Deductions</h4>
              {salary.deductions && salary.deductions.length > 0 ? (
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salary.deductions.map((deduction, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-xs sm:text-sm lg:text-base text-gray-900">{deduction.deductionType}</td>
                          <td className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-xs sm:text-sm lg:text-base text-gray-900 text-right">{formatCurrency(deduction.calculatedAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs sm:text-sm lg:text-base text-gray-500">No deductions</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div>
              <h4 className="text-sm sm:text-base lg:text-lg font-medium mb-3">Attendance Breakdown</h4>
              {salary.attendanceBreakdown && salary.attendanceBreakdown.length > 0 ? (
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase">Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salary.attendanceBreakdown.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-xs sm:text-sm lg:text-base text-gray-900">{item.type}</td>
                          <td className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-xs sm:text-sm lg:text-base text-gray-900 text-right">{item.days}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs sm:text-sm lg:text-base text-gray-500">No attendance breakdown</p>
              )}
            </div>

            <div>
              <h4 className="text-sm sm:text-base lg:text-lg font-medium mb-3">Summary</h4>
              <div className="bg-gray-50 rounded-md p-3 sm:p-4 lg:p-5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600">Gross Salary:</span>
                  <span className="text-xs sm:text-sm lg:text-base font-medium">{formatCurrency(salary.grossSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600">Total Deductions:</span>
                  <span className="text-xs sm:text-sm lg:text-base font-medium text-red-600">{formatCurrency(salary.totalDeductions)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-900">Net Salary:</span>
                  <span className="text-xs sm:text-sm lg:text-base font-bold text-green-600">{formatCurrency(salary.netSalary)}</span>
                </div>
              </div>
            </div>
          </div>

          {salary.paymentDate && (
            <div className="bg-blue-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-sm sm:text-base lg:text-lg font-medium mb-2">Payment Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600">Payment Date:</span>
                  <p className="text-xs sm:text-sm lg:text-base font-medium">{formatDate(salary.paymentDate)}</p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600">Payment Method:</span>
                  <p className="text-xs sm:text-sm lg:text-base font-medium">{salary.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600">Payment Reference:</span>
                  <p className="text-xs sm:text-sm lg:text-base font-medium">{salary.paymentReference || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {salary.remarks && (
            <div className="bg-gray-50 p-3 sm:p-4 lg:p-5 rounded-md">
              <h4 className="text-sm sm:text-base lg:text-lg font-medium mb-2">Remarks</h4>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700">{salary.remarks}</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 flex justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm lg:text-base"
          >
            <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            Print Salary Slip
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs sm:text-sm lg:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

