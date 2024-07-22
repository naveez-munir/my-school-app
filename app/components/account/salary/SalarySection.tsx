import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  type SalaryResponse,
  type CreateSalaryDto,
  EmployeeType,
  SalaryStatus,
  type ApproveSalaryDto,
  type ProcessPaymentDto,
  type UpdateSalaryDto,
  PaymentMethod
} from "~/types/salary.types";
import {
  useSalaries,
  useCancelSalary,
  useApproveSalary,
  useProcessPayment,
  useGenerateAllSalaries
} from "~/hooks/useSalaryQueries";
import { SalariesTable } from "./SalariesTable";
import { SalaryModal } from "./SalaryModal";
import { GenerateSalariesModal } from "./GenerateSalariesModal";
import { SalarySlipPrint } from "./SalarySlipPrint";
import { ConfirmationModal } from "~/components/common/ConfirmationModal";
import { EmployeeTypeSelector } from "~/components/common/EmployeeTypeSelector";
import { MonthSelector } from "~/components/common/MonthSelector";
import { YearSelector } from "~/components/common/YearSelector";
import { SalaryStatusSelector } from "~/components/common/SalaryStatusSelector";

export const SalarySection = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'approve' | 'payment'>('approve');
  const [targetId, setTargetId] = useState<string | null>(null);

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const [salaryToPrint, setSalaryToPrint] = useState<SalaryResponse | null>(null);

  // Filters
  const [employeeType, setEmployeeType] = useState<EmployeeType | 'all'>('all');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [status, setStatus] = useState<SalaryStatus | 'all'>('all');

  // React Query hooks
  const {
    data: salaries = [],
    isLoading,
    error
  } = useSalaries({
    employeeType: employeeType !== 'all' ? employeeType : undefined,
    month: month,
    year: year,
    status: status !== 'all' ? status : undefined
  });

  const generateAllSalariesMutation = useGenerateAllSalaries();
  const approveSalaryMutation = useApproveSalary();
  const processPaymentMutation = useProcessPayment();
  const cancelSalaryMutation = useCancelSalary();

  const handleCreateClick = () => {
    navigate('/dashboard/accounts/salary/new');
  };

  const handleGenerateClick = () => {
    setIsGenerateModalOpen(true);
  };

  const handleConfirmGenerate = () => {
    generateAllSalariesMutation.mutate({
      month,
      year,
      employeeType: employeeType !== 'all' ? employeeType : undefined
    }, {
      onSuccess: (result) => {
        setIsGenerateModalOpen(false);
        toast.success(result.message || 'Salaries generated successfully');
      },
      onError: (error) => {
        setIsGenerateModalOpen(false);
        toast.error(`Failed to generate salaries: ${error.message}`);
      }
    });
  };

  const handleView = (salary: SalaryResponse) => {
    navigate(`/dashboard/accounts/salary/${salary.id}`);
  };

  const handleEdit = (salary: SalaryResponse) => {
    navigate(`/dashboard/accounts/salary/${salary.id}/edit`);
  };

  const handleApprove = (id: string) => {
    setTargetId(id);
    setModalMode('approve');
    setIsModalOpen(true);
  };

  const handlePayment = (id: string) => {
    setTargetId(id);
    setModalMode('payment');
    setIsModalOpen(true);
  };

  const handleCancel = (id: string) => {
    setCancelTargetId(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;

    try {
      await cancelSalaryMutation.mutateAsync(cancelTargetId);
      setIsCancelModalOpen(false);
      setCancelTargetId(null);
      toast.success('Salary cancelled successfully');
    } catch (err) {
      console.error("Error cancelling salary:", err);
      setIsCancelModalOpen(false);
      setCancelTargetId(null);
      toast.error(`Failed to cancel salary: ${(err as Error).message}`);
    }
  };

  const handleGenerateSlip = (id: string) => {
    const salary = salaries.find(s => s.id === id);
    if (salary) {
      setSalaryToPrint(salary);
      setTimeout(() => {
        window.print();
        setSalaryToPrint(null);
      }, 100);
    } else {
      toast.error('Salary not found');
    }
  };

  const handleSubmitApprove = async (data: CreateSalaryDto & Partial<UpdateSalaryDto>) => {
    if (!targetId) return;

    const approvalData: ApproveSalaryDto = {
      comments: data.remarks
    };

    try {
      await approveSalaryMutation.mutateAsync({
        id: targetId,
        data: approvalData
      });
      setIsModalOpen(false);
      setTargetId(null);
      toast.success('Salary approved successfully');
    } catch (err) {
      console.error("Error approving salary:", err);
      toast.error(`Failed to approve salary: ${(err as Error).message}`);
    }
  };

  const handleSubmitPayment = async (data: CreateSalaryDto & Partial<UpdateSalaryDto>) => {
    if (!targetId) return;

    const paymentData: ProcessPaymentDto = {
      paymentMethod: data.paymentMethod as PaymentMethod,
      paymentDate: data.paymentDate as string,
      paymentReference: data.paymentReference,
      remarks: data.remarks
    };

    try {
      await processPaymentMutation.mutateAsync({
        id: targetId,
        data: paymentData
      });
      setIsModalOpen(false);
      setTargetId(null);
      toast.success('Payment processed successfully');
    } catch (err) {
      console.error("Error processing payment:", err);
      toast.error(`Failed to process payment: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-700">
          Salary Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateClick}
            className="bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 text-xs sm:text-sm"
            disabled={generateAllSalariesMutation.isPending}
          >
            {generateAllSalariesMutation.isPending ? 'Generating...' : 'Generate Salaries'}
          </button>
          <button
            onClick={handleCreateClick}
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
          >
            Add Salary Manually
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <EmployeeTypeSelector
            value={employeeType}
            onChange={setEmployeeType}
            includeAll
          />

          <MonthSelector
            value={month}
            onChange={setMonth}
          />

          <YearSelector
            value={year}
            onChange={setYear}
            range={{
              start: new Date().getFullYear() - 2,
              end: new Date().getFullYear() + 2
            }}
          />

          <SalaryStatusSelector
            value={status}
            onChange={setStatus}
            includeAll
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-sm">Loading...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">{(error as Error).message}</div>
      ) : (
        <SalariesTable
          data={salaries}
          onView={handleView}
          onEdit={handleEdit}
          onApprove={handleApprove}
          onPayment={handlePayment}
          onCancel={handleCancel}
          onGenerateSlip={handleGenerateSlip}
        />
      )}

      <SalaryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTargetId(null);
        }}
        onSubmit={
          modalMode === 'approve' ? handleSubmitApprove : handleSubmitPayment
        }
        isSubmitting={
          approveSalaryMutation.isPending ||
          processPaymentMutation.isPending
        }
        mode={modalMode}
      />

      <GenerateSalariesModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onConfirm={handleConfirmGenerate}
        month={month}
        year={year}
        employeeType={employeeType}
        isGenerating={generateAllSalariesMutation.isPending}
      />

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setCancelTargetId(null);
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Salary"
        message="Are you sure you want to cancel this salary record?"
        warningMessage="This action cannot be undone."
        confirmButtonText="Cancel Salary"
        confirmButtonVariant="danger"
        isLoading={cancelSalaryMutation.isPending}
      />

      {salaryToPrint && <SalarySlipPrint salary={salaryToPrint} />}
    </div>
  );
};
