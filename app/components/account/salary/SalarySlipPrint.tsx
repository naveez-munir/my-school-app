import { formatCurrency } from '~/utils/currencyUtils';
import { SalaryStatusLabels, type SalaryResponse } from '~/types/salary.types';
import { months } from '~/utils/studentFeeData';

interface SalarySlipPrintProps {
  salary: SalaryResponse;
}

export function SalarySlipPrint({ salary }: SalarySlipPrintProps) {
  const getMonthName = (month: number) => {
    return months[month - 1];
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="hidden print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #salary-slip-print, #salary-slip-print * {
            visibility: visible !important;
          }
          #salary-slip-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      <div id="salary-slip-print" className="p-6 bg-white">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Lincoln High School</h1>
          <p className="text-xs text-gray-600">Salary Slip</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {getMonthName(salary.month)} {salary.year}
          </p>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          <div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Employee Name: </span>
              <span className="text-gray-900">{salary.employeeName || 'N/A'}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Designation: </span>
              <span className="text-gray-900">{salary.employeeType}</span>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Period: </span>
              <span className="text-gray-900">{getMonthName(salary.month)} {salary.year}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Status: </span>
              <span className="text-gray-900">{SalaryStatusLabels[salary.status]}</span>
            </div>
          </div>
        </div>

        {/* Attendance Details */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-800 mb-2 text-xs border-b border-gray-300 pb-1">
            Attendance Details
          </h3>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600 block mb-1">Working Days</span>
              <p className="font-semibold text-gray-900">{salary.workingDays}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600 block mb-1">Present Days</span>
              <p className="font-semibold text-gray-900">{salary.presentDays}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600 block mb-1">Leave Days</span>
              <p className="font-semibold text-gray-900">{salary.leaveDays}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-600 block mb-1">Overtime Hours</span>
              <p className="font-semibold text-gray-900">{salary.overtimeHours}</p>
            </div>
          </div>
        </div>

        {/* Earnings and Deductions */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 text-xs border-b border-gray-300 pb-1">
              Earnings
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 text-gray-700 font-semibold">Type</th>
                  <th className="text-right py-1 text-gray-700 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1 text-gray-600">Basic Salary</td>
                  <td className="text-right py-1 text-gray-900">{formatCurrency(salary.basicSalary)}</td>
                </tr>
                {salary.allowances && salary.allowances.length > 0 ? (
                  salary.allowances.map((allowance, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-1 text-gray-600">{allowance.allowanceType}</td>
                      <td className="text-right py-1 text-gray-900">
                        {formatCurrency(allowance.calculatedAmount)}
                      </td>
                    </tr>
                  ))
                ) : null}
                <tr className="border-t-2 border-gray-300 font-semibold">
                  <td className="py-1 text-gray-800">Gross Salary</td>
                  <td className="text-right py-1 text-gray-900">{formatCurrency(salary.grossSalary)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2 text-xs border-b border-gray-300 pb-1">
              Deductions
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 text-gray-700 font-semibold">Type</th>
                  <th className="text-right py-1 text-gray-700 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {salary.deductions && salary.deductions.length > 0 ? (
                  salary.deductions.map((deduction, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-1 text-gray-600">{deduction.deductionType}</td>
                      <td className="text-right py-1 text-gray-900">
                        {formatCurrency(deduction.calculatedAmount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-1 text-gray-500 text-center">No deductions</td>
                  </tr>
                )}
                <tr className="border-t-2 border-gray-300 font-semibold">
                  <td className="py-1 text-gray-800">Total Deductions</td>
                  <td className="text-right py-1 text-gray-900">
                    {formatCurrency(salary.totalDeductions)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Salary */}
        <div className="bg-gray-100 p-3 rounded mb-3 border-2 border-gray-300">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-800">Net Salary:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(salary.netSalary)}
            </span>
          </div>
        </div>

        {/* Payment Information */}
        {salary.paymentDate && (
          <div className="mb-2 bg-gray-50 p-2 rounded">
            <h3 className="font-semibold text-gray-800 mb-2 text-xs border-b border-gray-300 pb-1">
              Payment Information
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Payment Date: </span>
                <span className="text-gray-900 font-medium">{formatDate(salary.paymentDate)}</span>
              </div>
              <div>
                <span className="text-gray-600">Payment Method: </span>
                <span className="text-gray-900 font-medium">{salary.paymentMethod || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Payment Reference: </span>
                <span className="text-gray-900 font-medium">{salary.paymentReference || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Remarks */}
        {salary.remarks && (
          <div className="mb-2">
            <h3 className="font-semibold text-gray-800 mb-1 text-xs block">Remarks:</h3>
            <p className="text-xs text-gray-700 block border-b border-gray-400 pb-1">{salary.remarks}</p>
          </div>
        )}

      </div>

      {/* Signature Section - Fixed at bottom */}
      <div className="print:fixed print:bottom-20 print:left-6 print:right-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white">
            <div className="grid grid-cols-2 gap-8 text-xs">
              <div className="text-center">
                <div className="border-t border-gray-400 pt-1 mt-8">
                  <p className="font-semibold text-gray-800">Employee Signature</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-400 pt-1 mt-8">
                  <p className="font-semibold text-gray-800">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="print:fixed print:bottom-6 print:left-6 print:right-6">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-500 border-t border-gray-200 pt-2 bg-white">
          <p>This is a computer-generated salary slip and does not require a signature.</p>
          <p className="mt-1">Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      </div>
    </div>
  );
}

