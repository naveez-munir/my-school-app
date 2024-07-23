import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  useSalary,
  useApproveSalary,
  useProcessPayment,
  useCancelSalary
} from '~/hooks/useSalaryQueries';
import { SalaryModal } from './SalaryModal';
import { SalarySlipPrint } from './SalarySlipPrint';
import {
  SalaryStatus,
  SalaryStatusLabels,
  type ApproveSalaryDto,
  type ProcessPaymentDto
} from '~/types/salary.types';
import { FileText, CheckCircle, CreditCard, XCircle, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '~/utils/currencyUtils';
import { months } from '~/utils/studentFeeData';

interface SalaryDetailProps {
  readOnly?: boolean;
}

export const SalaryDetail = ({ readOnly = false }: SalaryDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'approve' | 'payment'>('approve');
  const [salaryToPrint, setSalaryToPrint] = useState<typeof salary | null>(null);

  const { data: salary, isLoading, error } = useSalary(id as string);
  const approveSalaryMutation = useApproveSalary();
  const processPaymentMutation = useProcessPayment();
  const cancelSalaryMutation = useCancelSalary();

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-xs sm:text-sm">Loading...</span>
      </div>
    );
  }

  if (error || !salary) {
    return (
      <div className="bg-red-50 text-red-700 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
        {error ? (error as Error).message : 'Salary not found'}
      </div>
    );
  }

  const handleApprove = () => {
    setModalMode('approve');
    setIsModalOpen(true);
  };

  const handlePayment = () => {
    setModalMode('payment');
    setIsModalOpen(true);
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this salary?')) {
      try {
        await cancelSalaryMutation.mutateAsync(id!);
        // Refresh the page or redirect
        window.location.reload();
      } catch (err) {
        console.error("Error cancelling salary:", err);
        alert(`Failed to cancel salary: ${(err as Error).message}`);
      }
    }
  };

  const handleGenerateSlip = () => {
    if (salary) {
      setSalaryToPrint(salary);
      setTimeout(() => {
        window.print();
        setSalaryToPrint(null);
      }, 100);
    }
  };

  const handleSubmitApprove = async (data: any) => {
    const approvalData: ApproveSalaryDto = {
      comments: data.remarks
    };
    
    try {
      await approveSalaryMutation.mutateAsync({ 
        id: id!, 
        data: approvalData 
      });
      setIsModalOpen(false);
      // Refresh the page
      window.location.reload();
    } catch (err) {
      console.error("Error approving salary:", err);
      alert(`Failed to approve salary: ${(err as Error).message}`);
    }
  };

  const handleSubmitPayment = async (data: any) => {
    const paymentData: ProcessPaymentDto = {
      paymentMethod: data.paymentMethod!,
      paymentDate: data.paymentDate as string,
      paymentReference: data.paymentReference,
      remarks: data.remarks
    };
    
    try {
      await processPaymentMutation.mutateAsync({ 
        id: id!, 
        data: paymentData 
      });
      setIsModalOpen(false);
      // Refresh the page
      window.location.reload();
    } catch (err) {
      console.error("Error processing payment:", err);
      alert(`Failed to process payment: ${(err as Error).message}`);
    }
  };



  const getMonthName = (month: number) => {
    return months[month - 1];
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Determine if actions are available based on status
  const canApprove = salary.status === SalaryStatus.PENDING || salary.status === SalaryStatus.PROCESSED;
  const canProcessPayment = salary.status === SalaryStatus.APPROVED;
  const canCancel = salary.status === SalaryStatus.PENDING || salary.status === SalaryStatus.PROCESSED;

  // Status badge color
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
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {!salaryToPrint && (
        <>
      <div className="flex justify-between items-center mb-4 sm:mb-5">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/salaries')}
              className="mr-3 p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Salary Details
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
            {!readOnly && canApprove && (
              <button
                onClick={handleApprove}
                className="flex items-center bg-green-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded hover:bg-green-700 text-xs sm:text-sm"
                disabled={approveSalaryMutation.isPending}
              >
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                {approveSalaryMutation.isPending ? 'Processing...' : 'Approve'}
              </button>
            )}

            {!readOnly && canProcessPayment && (
              <button
                onClick={handlePayment}
                className="flex items-center bg-blue-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded hover:bg-blue-700 text-xs sm:text-sm"
                disabled={processPaymentMutation.isPending}
              >
                <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                {processPaymentMutation.isPending ? 'Processing...' : 'Process Payment'}
              </button>
            )}

            {!readOnly && canCancel && (
              <button
                onClick={handleCancel}
                className="flex items-center bg-red-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded hover:bg-red-700 text-xs sm:text-sm"
                disabled={cancelSalaryMutation.isPending}
              >
                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                {cancelSalaryMutation.isPending ? 'Cancelling...' : 'Cancel'}
              </button>
            )}

            <button
              onClick={handleGenerateSlip}
              className="flex items-center bg-gray-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded hover:bg-gray-700 text-xs sm:text-sm"
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
              Print Salary Slip
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-5">
        <div className="flex justify-between items-start mb-4 sm:mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{salary.employeeName || 'Employee'}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{salary.employeeType}</p>
          </div>
          <div>
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${statusBgColor} ${statusTextColor}`}>
              {SalaryStatusLabels[salary.status]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Period</h4>
            <p className="text-sm sm:text-base font-medium">{getMonthName(salary.month)} {salary.year}</p>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Basic Salary</h4>
            <p className="text-sm sm:text-base font-medium">{formatCurrency(salary.basicSalary)}</p>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Net Salary</h4>
            <p className="text-sm sm:text-base font-medium">{formatCurrency(salary.netSalary)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Working Days</h4>
            <p className="text-sm sm:text-base font-medium">{salary.workingDays}</p>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Present Days</h4>
            <p className="text-sm sm:text-base font-medium">{salary.presentDays}</p>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Leave Days</h4>
            <p className="text-sm sm:text-base font-medium">{salary.leaveDays}</p>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Overtime Hours</h4>
            <p className="text-sm sm:text-base font-medium">{salary.overtimeHours || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
          <div>
            <h4 className="text-sm sm:text-base font-medium mb-3">Allowances</h4>
            {salary.allowances && salary.allowances.length > 0 ? (
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salary.allowances.map((allowance, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900">{allowance.allowanceType}</td>
                        <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900 text-right">{formatCurrency(allowance.calculatedAmount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium">Total Allowances</td>
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-right">
                        {formatCurrency(salary.allowances.reduce((sum, item) => sum + item.calculatedAmount, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 sm:p-4 text-center text-gray-500 rounded-md text-xs sm:text-sm">
                No allowances
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-medium mb-3">Deductions</h4>
            {salary.deductions && salary.deductions.length > 0 ? (
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salary.deductions.map((deduction, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900">{deduction.deductionType}</td>
                        <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900 text-right">{formatCurrency(deduction.calculatedAmount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium">Total Deductions</td>
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-right">
                        {formatCurrency(salary.deductions.reduce((sum, item) => sum + item.calculatedAmount, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 sm:p-4 text-center text-gray-500 rounded-md text-xs sm:text-sm">
                No deductions
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 sm:mb-5">
          <h4 className="text-sm sm:text-base font-medium mb-3">Attendance Breakdown</h4>
          {salary.attendanceBreakdown && salary.attendanceBreakdown.length > 0 ? (
            <div className="bg-gray-50 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Hours</th>
                    <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-3 py-1.5 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {salary.attendanceBreakdown.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900">{formatDate(item.date)}</td>
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900">{item.type}</td>
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900">{item.hours || 'N/A'}</td>
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                      <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-900">{item.remarks || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 sm:p-4 text-center text-gray-500 rounded-md text-xs sm:text-sm">
              No attendance breakdown
            </div>
          )}
        </div>

        {salary.status === SalaryStatus.APPROVED && (
          <div className="bg-blue-50 p-3 sm:p-4 rounded-md mb-4 sm:mb-5 border border-blue-200">
            <h4 className="text-sm sm:text-base font-medium mb-2">Approval Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Approved By</p>
                <p className="text-xs sm:text-sm font-medium">{salary.approverName || salary.approvedBy || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Approval Date</p>
                <p className="text-xs sm:text-sm font-medium">{formatDate(salary.approvalDate!)}</p>
              </div>
            </div>
          </div>
        )}

        {salary.status === SalaryStatus.PAID && (
          <div className="bg-green-50 p-3 sm:p-4 rounded-md mb-4 sm:mb-5 border border-green-200">
            <h4 className="text-sm sm:text-base font-medium mb-2">Payment Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Payment Method</p>
                <p className="text-xs sm:text-sm font-medium">{salary.paymentMethod || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Payment Date</p>
                <p className="text-xs sm:text-sm font-medium">{formatDate(salary.paymentDate!)}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Reference</p>
                <p className="text-xs sm:text-sm font-medium">{salary.paymentReference || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {salary.remarks && (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <h4 className="text-sm sm:text-base font-medium mb-2">Remarks</h4>
            <p className="text-xs sm:text-sm">{salary.remarks}</p>
          </div>
        )}

        <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-5 flex justify-between text-xs sm:text-sm text-gray-500">
          <div>
            <p>Created: {formatDate(salary.createdAt!)}</p>
            <p>Last Updated: {formatDate(salary.updatedAt!)}</p>
          </div>
          <div>
            <p>Salary ID: {salary.id}</p>
            <p>Structure ID: {salary.salaryStructureId}</p>
          </div>
        </div>
      </div>

      <SalaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === 'approve' ? handleSubmitApprove : handleSubmitPayment}
        initialData={salary}
        isSubmitting={approveSalaryMutation.isPending || processPaymentMutation.isPending}
        mode={modalMode}
      />
        </>
      )}

      {salaryToPrint && <SalarySlipPrint salary={salaryToPrint} />}
    </div>
  );
};
