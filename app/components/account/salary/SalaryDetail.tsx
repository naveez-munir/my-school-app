import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { 
  useSalary, 
  useApproveSalary, 
  useProcessPayment, 
  useCancelSalary,
  useGenerateSalarySlip
} from '~/hooks/useSalaryQueries';
import { SalaryModal } from './SalaryModal';
import { 
  SalaryStatus, 
  SalaryStatusLabels, 
  type ApproveSalaryDto, 
  type ProcessPaymentDto 
} from '~/types/salary.types';
import { FileText, CheckCircle, CreditCard, XCircle, ChevronLeft } from 'lucide-react';

export const SalaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'approve' | 'payment'>('approve');
  
  const { data: salary, isLoading, error } = useSalary(id as string);
  const approveSalaryMutation = useApproveSalary();
  const processPaymentMutation = useProcessPayment();
  const cancelSalaryMutation = useCancelSalary();
  const generateSlipMutation = useGenerateSalarySlip();

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error || !salary) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
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

  const handleGenerateSlip = async () => {
    try {
      await generateSlipMutation.mutateAsync(id!);
    } catch (err) {
      console.error("Error generating salary slip:", err);
      alert(`Failed to generate salary slip: ${(err as Error).message}`);
    }
  };

  const handleSubmitApprove = async (data: any) => {
    const approvalData: ApproveSalaryDto = {
      approvedBy: data.approvedBy || '',
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/salaries')}
            className="mr-3 p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-700">
            Salary Details
          </h2>
        </div>
        
        <div className="flex space-x-3">
          {canApprove && (
            <button
              onClick={handleApprove}
              className="flex items-center bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              disabled={approveSalaryMutation.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {approveSalaryMutation.isPending ? 'Processing...' : 'Approve'}
            </button>
          )}
          
          {canProcessPayment && (
            <button
              onClick={handlePayment}
              className="flex items-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              disabled={processPaymentMutation.isPending}
            >
              <CreditCard className="h-4 w-4 mr-1" />
              {processPaymentMutation.isPending ? 'Processing...' : 'Process Payment'}
            </button>
          )}
          
          {canCancel && (
            <button
              onClick={handleCancel}
              className="flex items-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
              disabled={cancelSalaryMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-1" />
              {cancelSalaryMutation.isPending ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
          
          <button
            onClick={handleGenerateSlip}
            className="flex items-center bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700"
            disabled={generateSlipMutation.isPending}
          >
            <FileText className="h-4 w-4 mr-1" />
            {generateSlipMutation.isPending ? 'Generating...' : 'Generate Slip'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{salary.employeeName || 'Employee'}</h3>
            <p className="text-sm text-gray-500">{salary.employeeType}</p>
          </div>
          <div>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusBgColor} ${statusTextColor}`}>
              {SalaryStatusLabels[salary.status]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Period</h4>
            <p className="text-lg font-medium">{getMonthName(salary.month)} {salary.year}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Basic Salary</h4>
            <p className="text-lg font-medium">{formatCurrency(salary.basicSalary)}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Net Salary</h4>
            <p className="text-lg font-medium">{formatCurrency(salary.netSalary)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Working Days</h4>
            <p className="text-lg font-medium">{salary.workingDays}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Present Days</h4>
            <p className="text-lg font-medium">{salary.presentDays}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Leave Days</h4>
            <p className="text-lg font-medium">{salary.leaveDays}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Overtime Hours</h4>
            <p className="text-lg font-medium">{salary.overtimeHours || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-md font-medium mb-3">Allowances</h4>
            {salary.allowances && salary.allowances.length > 0 ? (
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salary.allowances.map((allowance, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-sm text-gray-900">{allowance.allowanceType}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(allowance.calculatedAmount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td className="px-4 py-2 text-sm font-medium">Total Allowances</td>
                      <td className="px-4 py-2 text-sm font-medium text-right">
                        {formatCurrency(salary.allowances.reduce((sum, item) => sum + item.calculatedAmount, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                No allowances
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3">Deductions</h4>
            {salary.deductions && salary.deductions.length > 0 ? (
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salary.deductions.map((deduction, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-sm text-gray-900">{deduction.deductionType}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(deduction.calculatedAmount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td className="px-4 py-2 text-sm font-medium">Total Deductions</td>
                      <td className="px-4 py-2 text-sm font-medium text-right">
                        {formatCurrency(salary.deductions.reduce((sum, item) => sum + item.calculatedAmount, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                No deductions
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">Attendance Breakdown</h4>
          {salary.attendanceBreakdown && salary.attendanceBreakdown.length > 0 ? (
            <div className="bg-gray-50 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {salary.attendanceBreakdown.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-sm text-gray-900">{formatDate(item.date)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.type}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.hours || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.remarks || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
              No attendance breakdown
            </div>
          )}
        </div>

        {salary.status === SalaryStatus.APPROVED && (
          <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200">
            <h4 className="text-md font-medium mb-2">Approval Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Approved By</p>
                <p className="text-sm font-medium">{salary.approverName || salary.approvedBy || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Approval Date</p>
                <p className="text-sm font-medium">{formatDate(salary.approvalDate!)}</p>
              </div>
            </div>
          </div>
        )}

        {salary.status === SalaryStatus.PAID && (
          <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-200">
            <h4 className="text-md font-medium mb-2">Payment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-sm font-medium">{salary.paymentMethod || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="text-sm font-medium">{formatDate(salary.paymentDate!)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference</p>
                <p className="text-sm font-medium">{salary.paymentReference || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {salary.remarks && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-md font-medium mb-2">Remarks</h4>
            <p className="text-sm">{salary.remarks}</p>
          </div>
        )}

        <div className="border-t mt-8 pt-6 flex justify-between text-sm text-gray-500">
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
    </div>
  );
};
