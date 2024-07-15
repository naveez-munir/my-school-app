import { useState } from "react";
import toast from "react-hot-toast";
import type {
  GenerateStudentFeeInput,
  ApplyDiscountInput,
  BulkGenerateStudentFeeInput,
  StudentFee,
  PopulatedStudentFee
} from "~/types/studentFee";
import {
  useStudentFeeAnalytics,
  useGenerateStudentFee,
  useBulkGenerateStudentFees,
  useApplyDiscount,
  useCancelFee,
  useCalculateLateFees,
  useUpdateFeeStatuses,
  useGenerateRecurringFees
} from "~/hooks/useStudentFeeQueries";
import { useClasses } from "~/hooks/useClassQueries";
import { useStudents } from "~/hooks/useStudentQueries";
import { AcademicYearSelector } from "~/components/common/AcademicYearSelector";
import { ClassSelector } from "~/components/common/ClassSelector";
import { MonthSelector } from "~/components/common/MonthSelector";
import { FeeStatusSelector } from "~/components/common/FeeStatusSelector";
import { FeeActionButtons } from "./FeeActionButtons";
import { StudentFeeSkeleton } from "./StudentFeeSkeleton";
import { FeeStatusSummary } from "./FeeStatusSummary";
import { StudentFeesTable } from "./StudentFeesTable";
import { GenerateStudentFeeModal } from "./GenerateStudentFeeModal";
import { BulkGenerateFeesModal } from "./BulkGenerateFeesModal";
import { ApplyDiscountModal } from "./ApplyDiscountModal";
import { CancelFeeModal } from "./CancelFeeModal";
import { ViewFeeDetailsModal } from "./ViewFeeDetailsModal";
import { ConfirmActionModal } from "./ConfirmActionModal";
import { GenerateRecurringFeesModal, type RecurringFeeData, type ClassSelection } from "./GenerateRecurringFeesModal";
import { PaymentModal } from "../feePayment/PaymentModal";
import { BulkPaymentModal } from "../feePayment/BulkPaymentModal";

type AnyStudentFee = StudentFee | PopulatedStudentFee;

export const StudentFeeSection = () => {
  const [academicYear, setAcademicYear] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isBulkGenerateModalOpen, setIsBulkGenerateModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [classesRequiringSelection, setClassesRequiringSelection] = useState<ClassSelection[]>([]);
  const [selectedFee, setSelectedFee] = useState<AnyStudentFee | null>(null);
  const [feeToCancel, setFeeToCancel] = useState<string | null>(null);
  const [feeToView, setFeeToView] = useState<AnyStudentFee | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; action: 'lateFees' | 'updateStatuses' | null }>({ isOpen: false, action: null });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [feeToPay, setFeeToPay] = useState<AnyStudentFee | null>(null);
  const [selectedFeeIds, setSelectedFeeIds] = useState<Set<string>>(new Set());
  const [isBulkPaymentModalOpen, setIsBulkPaymentModalOpen] = useState(false);

  const { data: students = [] } = useStudents();
  const { data: classes = [] } = useClasses();

  const {
    summary,
    fees,
    isLoading: feesLoading,
    error
  } = useStudentFeeAnalytics({academicYear,classId: selectedClassId, month: selectedMonth, status: selectedStatus});

  const isLoading = feesLoading;
  const hasAllData = !isLoading && fees && fees.length > 0;

  const generateFeeMutation = useGenerateStudentFee();
  const bulkGenerateFeeMutation = useBulkGenerateStudentFees();
  const applyDiscountMutation = useApplyDiscount();
  const cancelFeeMutation = useCancelFee();
  const calculateLateFeesMutation = useCalculateLateFees();
  const updateFeeStatusesMutation = useUpdateFeeStatuses();
  const generateRecurringMutation = useGenerateRecurringFees();

  const handleGenerateFee = async (data: GenerateStudentFeeInput) => {
    try {
      await generateFeeMutation.mutateAsync(data);
      setIsGenerateModalOpen(false);
      toast.success("Student fee generated successfully");
    } catch (err: any) {
      console.error("Error generating student fee:", err);
      const errorMessage = err?.response?.data?.message?.message || err?.response?.data?.message || "Failed to generate student fee";
      toast.error(errorMessage);
    }
  };

  const handleBulkGenerate = async (data: BulkGenerateStudentFeeInput) => {
    try {
      const result: any = await bulkGenerateFeeMutation.mutateAsync(data);
      setIsBulkGenerateModalOpen(false);

      if (result.summary?.failed > 0) {
        toast.success(result.summary.message, { duration: 5000 });
      } else {
        toast.success("Student fees generated successfully");
      }
    } catch (err: any) {
      console.error("Error bulk generating fees:", err);
      const errorMessage = err?.response?.data?.message?.message || err?.response?.data?.message || "Failed to generate student fees";
      toast.error(errorMessage);
    }
  };

  const handleApplyDiscount = async (data: ApplyDiscountInput) => {
    if (selectedFee) {
      try {
        await applyDiscountMutation.mutateAsync({
          id: selectedFee._id,
          data
        });
        toast.success("Discount applied successfully");
        setIsDiscountModalOpen(false);
        setSelectedFee(null);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to apply discount";
        toast.error(errorMessage);
        console.error("Error applying discount:", err);
      }
    }
  };

  const handleCancelFeeClick = (id: string) => {
    setFeeToCancel(id);
    setIsCancelModalOpen(true);
  };

  const handleCancelFee = async (reason: string) => {
    if (feeToCancel) {
      try {
        await cancelFeeMutation.mutateAsync({ id: feeToCancel, reason });
        setIsCancelModalOpen(false);
        setFeeToCancel(null);
        toast.success("Fee cancelled successfully");
      } catch (err: any) {
        console.error("Error canceling fee:", err);
        const errorMessage = err?.response?.data?.message?.message || err?.response?.data?.message || "Failed to cancel fee";
        toast.error(errorMessage);
      }
    }
  };

  const handleCalculateLateFees = () => {
    setConfirmModal({ isOpen: true, action: 'lateFees' });
  };

  const handleUpdateFeeStatuses = () => {
    setConfirmModal({ isOpen: true, action: 'updateStatuses' });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.action === 'lateFees') {
      try {
        await calculateLateFeesMutation.mutateAsync();
        toast.success('Late fees calculated successfully');
        setConfirmModal({ isOpen: false, action: null });
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to calculate late fees";
        toast.error(errorMessage);
        console.error("Error calculating late fees:", err);
      }
    } else if (confirmModal.action === 'updateStatuses') {
      try {
        await updateFeeStatusesMutation.mutateAsync();
        toast.success('Fee statuses updated successfully');
        setConfirmModal({ isOpen: false, action: null });
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to update fee statuses";
        toast.error(errorMessage);
        console.error("Error updating fee statuses:", err);
      }
    }
  };

  const handleViewDetails = (fee: AnyStudentFee) => {
    setFeeToView(fee);
    setIsViewDetailsModalOpen(true);
  };

  const handlePay = (fee: AnyStudentFee) => {
    setFeeToPay(fee);
    setIsPaymentModalOpen(true);
  };

  const handleBulkPay = () => {
    setIsBulkPaymentModalOpen(true);
  };

  const handleGenerateRecurring = () => {
    setIsRecurringModalOpen(true);
  };

  const handleGenerateRecurringConfirm = async (data: RecurringFeeData) => {
    try {
      const result = await generateRecurringMutation.mutateAsync(data);

      if (result.classesRequiringSelection && result.classesRequiringSelection.length > 0) {
        setClassesRequiringSelection(result.classesRequiringSelection);
        toast.error(`Please select fee structures for ${result.classesRequiringSelection.length} classes`);
        return;
      }

      setIsRecurringModalOpen(false);
      setClassesRequiringSelection([]);
      toast.success(`Successfully generated ${result.generated} fees${result.skipped > 0 ? `, skipped ${result.skipped} existing` : ''}`);
    } catch (err: any) {
      console.error("Error generating recurring fees:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to generate recurring fees";
      toast.error(errorMessage);
    }
  };

  const clearFilters = () => {
    setAcademicYear('');
    setSelectedClassId('');
    setSelectedMonth(undefined);
    setSelectedStatus('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Student Fee Management
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Generate Fee
          </button>
          <button
            onClick={() => setIsBulkGenerateModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            Bulk Generate
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <AcademicYearSelector
            value={academicYear}
            onChange={setAcademicYear}
            className="md:col-span-1"
          />

          <ClassSelector
            value={selectedClassId}
            onChange={setSelectedClassId}
            className="md:col-span-1"
          />

          <MonthSelector
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="md:col-span-1"
          />

          <FeeStatusSelector
            value={selectedStatus as any}
            onChange={(value) => setSelectedStatus(value === 'all' ? '' : value)}
            label="Status"
            placeholder="All Fees"
            includeAll={true}
            className="md:col-span-1"
          />

          <div className="md:col-span-1 flex items-end gap-2">
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 text-sm font-medium"
            >
              Clear Filters
            </button>
            {selectedFeeIds.size > 0 && (
              <button
                onClick={handleBulkPay}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Bulk Pay ({selectedFeeIds.size})
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <FeeActionButtons
            onCalculateLateFees={handleCalculateLateFees}
            onUpdateFeeStatuses={handleUpdateFeeStatuses}
            onGenerateRecurring={handleGenerateRecurring}
            isCalculating={calculateLateFeesMutation.isPending}
            isUpdating={updateFeeStatusesMutation.isPending}
            isGeneratingRecurring={generateRecurringMutation.isPending}
          />
        </div>
      </div>

      {isLoading ? (
        <StudentFeeSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : !hasAllData ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          No fees found. Try adjusting your filters or generate fees first.
        </div>
      ) : (
        <>
          <FeeStatusSummary summary={summary || { totalPending: 0, totalOverdue: 0, count: 0 }} />
          
          <StudentFeesTable
            data={fees}
            onViewDetails={handleViewDetails}
            onDiscount={(fee: AnyStudentFee) => {
              setSelectedFee(fee);
              setIsDiscountModalOpen(true);
            }}
            onCancel={handleCancelFeeClick}
            onPay={handlePay}
            selectedFees={selectedFeeIds}
            onSelectionChange={setSelectedFeeIds}
          />
        </>
      )}

      <GenerateStudentFeeModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSubmit={handleGenerateFee}
        isSubmitting={generateFeeMutation.isPending}
        academicYear={academicYear}
      />

      <BulkGenerateFeesModal
        isOpen={isBulkGenerateModalOpen}
        onClose={() => setIsBulkGenerateModalOpen(false)}
        onSubmit={handleBulkGenerate}
        isSubmitting={bulkGenerateFeeMutation.isPending}
        academicYear={academicYear}
        students={students}
        classes={classes}
      />

      <ApplyDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => {
          setIsDiscountModalOpen(false);
          setSelectedFee(null);
        }}
        onSubmit={handleApplyDiscount}
        fee={selectedFee}
        isSubmitting={applyDiscountMutation.isPending}
      />

      <CancelFeeModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setFeeToCancel(null);
        }}
        onConfirm={handleCancelFee}
        isSubmitting={cancelFeeMutation.isPending}
      />

      <ViewFeeDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false);
          setFeeToView(null);
        }}
        fee={feeToView}
      />

      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null })}
        onConfirm={handleConfirmAction}
        title={confirmModal.action === 'lateFees' ? 'Calculate Late Fees' : 'Update Fee Statuses'}
        message={confirmModal.action === 'lateFees'
          ? 'This will calculate late fees for all overdue payments. Continue?'
          : 'This will update the status of all fees based on their due dates and payment status. Continue?'}
        confirmText="Continue"
        isLoading={calculateLateFeesMutation.isPending || updateFeeStatusesMutation.isPending}
      />

      <GenerateRecurringFeesModal
        isOpen={isRecurringModalOpen}
        onClose={() => {
          setIsRecurringModalOpen(false);
          setClassesRequiringSelection([]);
        }}
        onConfirm={handleGenerateRecurringConfirm}
        currentFilters={{ academicYear, month: selectedMonth }}
        isLoading={generateRecurringMutation.isPending}
        classesRequiringSelection={classesRequiringSelection}
      />

      {feeToPay && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setFeeToPay(null);
          }}
          studentFeeId={feeToPay._id}
          studentId={typeof feeToPay.studentId === 'object' ? feeToPay.studentId._id : feeToPay.studentId}
          dueAmount={feeToPay.dueAmount}
        />
      )}

      <BulkPaymentModal
        isOpen={isBulkPaymentModalOpen}
        onClose={() => {
          setIsBulkPaymentModalOpen(false);
          setSelectedFeeIds(new Set());
        }}
        studentFeePayments={(fees || [])
          .filter(fee => selectedFeeIds.has(fee._id))
          .map(fee => {
            const studentId = typeof fee.studentId === 'object' ? fee.studentId._id : fee.studentId;
            const studentName = typeof fee.studentId === 'object'
              ? `${fee.studentId.firstName} ${fee.studentId.lastName}`
              : `Student ${fee.studentId}`;

            return {
              studentFeeId: fee._id,
              studentId,
              studentName,
              dueAmount: fee.dueAmount,
              amount: fee.dueAmount,
            };
          })}
      />
    </div>
  );
};
