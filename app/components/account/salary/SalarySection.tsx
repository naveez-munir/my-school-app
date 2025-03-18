import { useState } from "react";
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
  useCreateSalary, 
  useUpdateSalary, 
  useCancelSalary,
  useApproveSalary,
  useProcessPayment,
  useGenerateSalary,
  useGenerateAllSalaries,
  useGenerateSalarySlip
} from "~/hooks/useSalaryQueries";
import { SalariesTable } from "./SalariesTable";
import { SalaryModal } from "./SalaryModal";
import { EmployeeTypeSelector } from "~/components/common/EmployeeTypeSelector";
import { MonthSelector } from "~/components/common/MonthSelector";
import { YearSelector } from "~/components/common/YearSelector";
import { SalaryStatusSelector } from "~/components/common/SalaryStatusSelector";

export const SalarySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryResponse | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'approve' | 'payment'>('create');
  const [targetId, setTargetId] = useState<string | null>(null);
  
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
  
  const createSalaryMutation = useCreateSalary();
  const updateSalaryMutation = useUpdateSalary();
  const generateSalaryMutation = useGenerateSalary();
  const generateAllSalariesMutation = useGenerateAllSalaries();
  const approveSalaryMutation = useApproveSalary();
  const processPaymentMutation = useProcessPayment();
  const cancelSalaryMutation = useCancelSalary();
  const generateSlipMutation = useGenerateSalarySlip();

  const handleCreateClick = () => {
    setEditingSalary(null);
    setTargetId(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleGenerateClick = () => {
    if (window.confirm('Generate salaries for the selected month and year?')) {
      generateAllSalariesMutation.mutate({ 
        month, 
        year, 
        employeeType: employeeType !== 'all' ? employeeType : undefined 
      }, {
        onSuccess: (result) => {
          alert(`${result.message}`);
        },
        onError: (error) => {
          alert(`Failed to generate salaries: ${error.message}`);
        }
      });
    }
  };

  const handleCreate = async (data: CreateSalaryDto) => {
    try {
      await createSalaryMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating salary:", err);
      alert(`Failed to create salary: ${(err as Error).message}`);
    }
  };

  const handleUpdate = async (data: CreateSalaryDto) => {
    if (editingSalary?.id) {
      try {
        await updateSalaryMutation.mutateAsync({ 
          id: editingSalary.id, 
          data 
        });
        setIsModalOpen(false);
        setEditingSalary(null);
      } catch (err) {
        console.error("Error updating salary:", err);
        alert(`Failed to update salary: ${(err as Error).message}`);
      }
    }
  };

  const handleView = (salary: SalaryResponse) => {
    window.location.href = `/salaries/${salary.id}`;
  };

  const handleEdit = (salary: SalaryResponse) => {
    setEditingSalary(salary);
    setTargetId(salary.id as string);
    setModalMode('edit');
    setIsModalOpen(true);
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

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this salary?')) {
      try {
        await cancelSalaryMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error cancelling salary:", err);
        alert(`Failed to cancel salary: ${(err as Error).message}`);
      }
    }
  };

  const handleGenerateSlip = async (id: string) => {
    try {
      await generateSlipMutation.mutateAsync(id);
    } catch (err) {
      console.error("Error generating salary slip:", err);
      alert(`Failed to generate salary slip: ${(err as Error).message}`);
    }
  };

  const handleSubmitApprove = async (data: CreateSalaryDto & Partial<UpdateSalaryDto>) => {
    if (!targetId) return;
    
    const approvalData: ApproveSalaryDto = {
      approvedBy: data.approvedBy || '',
      comments: data.remarks
    };
    
    try {
      await approveSalaryMutation.mutateAsync({ 
        id: targetId, 
        data: approvalData 
      });
      setIsModalOpen(false);
      setTargetId(null);
    } catch (err) {
      console.error("Error approving salary:", err);
      alert(`Failed to approve salary: ${(err as Error).message}`);
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
    } catch (err) {
      console.error("Error processing payment:", err);
      alert(`Failed to process payment: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Salary Management
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={handleGenerateClick}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            disabled={generateAllSalariesMutation.isPending}
          >
            {generateAllSalariesMutation.isPending ? 'Generating...' : 'Generate Salaries'}
          </button>
          <button
            onClick={handleCreateClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Salary Manually
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <span className="ml-2">Loading...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
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
          setEditingSalary(null);
          setTargetId(null);
        }}
        onSubmit={
          modalMode === 'edit' ? handleUpdate : 
          modalMode === 'approve' ? handleSubmitApprove :
          modalMode === 'payment' ? handleSubmitPayment :
          handleCreate
        }
        initialData={editingSalary || undefined}
        isSubmitting={
          createSalaryMutation.isPending || 
          updateSalaryMutation.isPending ||
          approveSalaryMutation.isPending ||
          processPaymentMutation.isPending
        }
        mode={modalMode}
      />
    </div>
  );
};
