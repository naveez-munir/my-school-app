import { useState } from "react";
import toast from "react-hot-toast";
import type {
  GenerateStudentFeeInput,
  ApplyDiscountInput,
  BulkGenerateStudentFeeInput,
  PopulatedStudentFee,
  CreateAdhocFeeInput,
  StudentFeeSettlementInput,
  StudentClassTransferInput,
} from "~/types/studentFee";
import {
  useStudentFeeAnalytics,
  useGenerateStudentFee,
  useBulkGenerateStudentFees,
  useApplyDiscount,
  useCancelFee,
  useCalculateLateFees,
  useUpdateFeeStatuses,
  useGenerateRecurringFees,
  useCreateAdhocFee,
  useSettleStudentFees,
  useHandleClassTransfer
} from "~/hooks/useStudentFeeQueries";
import { useClasses } from "~/hooks/useClassQueries";
import { useStudents } from "~/hooks/useStudentQueries";
import { useStudentFeeModals } from "~/hooks/useStudentFeeModals";
import { AcademicYearSelector } from "~/components/common/AcademicYearSelector";
import { ClassSelector } from "~/components/common/ClassSelector";
import { MonthSelector } from "~/components/common/MonthSelector";
import { FeeStatusSelector } from "~/components/common/FeeStatusSelector";
import { FeeActionButtons } from "./FeeActionButtons";
import { StudentFeeSkeleton } from "./StudentFeeSkeleton";
import { FeeStatusSummary } from "./FeeStatusSummary";
import { StudentFeesTable } from "./StudentFeesTable";
import { StudentFeeModals } from "./StudentFeeModals";
import type { RecurringFeeData } from "./GenerateRecurringFeesModal";

export const StudentFeeSection = () => {
  const [academicYear, setAcademicYear] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedFeeIds, setSelectedFeeIds] = useState<Set<string>>(new Set());

  const modals = useStudentFeeModals();
  const { data: students = [] } = useStudents();
  const { data: classes = [] } = useClasses();

  const {
    summary,
    fees,
    isLoading: feesLoading,
    error
  } = useStudentFeeAnalytics({ academicYear, classId: selectedClassId, month: selectedMonth, status: selectedStatus });

  const isLoading = feesLoading;
  const hasAllData = !isLoading && fees && fees.length > 0;

  const generateFeeMutation = useGenerateStudentFee();
  const bulkGenerateFeeMutation = useBulkGenerateStudentFees();
  const applyDiscountMutation = useApplyDiscount();
  const cancelFeeMutation = useCancelFee();
  const calculateLateFeesMutation = useCalculateLateFees();
  const updateFeeStatusesMutation = useUpdateFeeStatuses();
  const generateRecurringMutation = useGenerateRecurringFees();
  const createAdhocFeeMutation = useCreateAdhocFee();
  const settleStudentFeesMutation = useSettleStudentFees();
  const handleClassTransferMutation = useHandleClassTransfer();

  const handleGenerateFee = async (data: GenerateStudentFeeInput) => {
    try {
      await generateFeeMutation.mutateAsync(data);
      modals.close();
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
      modals.close();
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
    if (modals.state.modal !== 'discount') return;
    try {
      await applyDiscountMutation.mutateAsync({ id: modals.state.fee._id, data });
      toast.success("Discount applied successfully");
      modals.close();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to apply discount";
      toast.error(errorMessage);
      console.error("Error applying discount:", err);
    }
  };

  const handleCancelFee = async (reason: string) => {
    if (modals.state.modal !== 'cancel') return;
    try {
      await cancelFeeMutation.mutateAsync({ id: modals.state.feeId, reason });
      modals.close();
      toast.success("Fee cancelled successfully");
    } catch (err: any) {
      console.error("Error canceling fee:", err);
      const errorMessage = err?.response?.data?.message?.message || err?.response?.data?.message || "Failed to cancel fee";
      toast.error(errorMessage);
    }
  };

  const handleConfirmAction = async () => {
    if (modals.state.modal === 'confirmLateFees') {
      try {
        await calculateLateFeesMutation.mutateAsync();
        toast.success('Late fees calculated successfully');
        modals.close();
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to calculate late fees";
        toast.error(errorMessage);
        console.error("Error calculating late fees:", err);
      }
    } else if (modals.state.modal === 'confirmUpdateStatuses') {
      try {
        await updateFeeStatusesMutation.mutateAsync();
        toast.success('Fee statuses updated successfully');
        modals.close();
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to update fee statuses";
        toast.error(errorMessage);
        console.error("Error updating fee statuses:", err);
      }
    }
  };

  const handleGenerateRecurringConfirm = async (data: RecurringFeeData) => {
    try {
      const result = await generateRecurringMutation.mutateAsync(data);
      if (result.classesRequiringSelection && result.classesRequiringSelection.length > 0) {
        modals.updateClassesRequiringSelection(result.classesRequiringSelection);
        toast.error(`Please select fee structures for ${result.classesRequiringSelection.length} classes`);
        return;
      }
      modals.close();
      toast.success(`Successfully generated ${result.generated} fees${result.skipped > 0 ? `, skipped ${result.skipped} existing` : ''}`);
    } catch (err: any) {
      console.error("Error generating recurring fees:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to generate recurring fees";
      toast.error(errorMessage);
    }
  };

  const handleCreateAdhocFee = async (data: CreateAdhocFeeInput) => {
    try {
      await createAdhocFeeMutation.mutateAsync(data);
      modals.close();
      toast.success("Ad-hoc fee created successfully");
    } catch (err: any) {
      console.error("Error creating ad-hoc fee:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create ad-hoc fee";
      toast.error(errorMessage);
    }
  };

  const handleSettleStudentFees = async (data: StudentFeeSettlementInput) => {
    if (modals.state.modal !== 'settlement') return { cancelledFees: 0, totalCancelledAmount: 0, refundableFees: [], totalRefundableAmount: 0, nonRefundableFees: 0, totalNonRefundableAmount: 0 };
    try {
      const result = await settleStudentFeesMutation.mutateAsync({
        studentId: modals.state.student.id,
        data
      });
      toast.success("Student fees settled successfully");
      return result;
    } catch (err: any) {
      console.error("Error settling fees:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to settle fees";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleClassTransfer = async (data: StudentClassTransferInput) => {
    if (modals.state.modal !== 'transfer') return { cancelledFees: 0, totalCancelledAmount: 0, carriedForwardFees: 0, totalCarriedForwardAmount: 0, adjustedFees: 0, totalAdjustmentAmount: 0, newFeesGenerated: 0, totalNewFeesAmount: 0 };
    try {
      const result = await handleClassTransferMutation.mutateAsync({
        studentId: modals.state.student.id,
        data
      });
      toast.success("Class transfer completed successfully");
      return result;
    } catch (err: any) {
      console.error("Error transferring class:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to transfer class";
      toast.error(errorMessage);
      throw err;
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
            onClick={modals.openGenerate}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Generate Fee
          </button>
          <button
            onClick={modals.openBulkGenerate}
            className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            Bulk Generate
          </button>
          <button
            onClick={modals.openAdhoc}
            className="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 text-sm font-medium"
          >
            Ad-hoc Fee
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
                onClick={modals.openBulkPayment}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Bulk Pay ({selectedFeeIds.size})
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <FeeActionButtons
            onCalculateLateFees={modals.openConfirmLateFees}
            onUpdateFeeStatuses={modals.openConfirmUpdateStatuses}
            onGenerateRecurring={modals.openRecurring}
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
            onViewDetails={(fee) => modals.openViewDetails(fee as PopulatedStudentFee)}
            onDiscount={(fee) => modals.openDiscount(fee as PopulatedStudentFee)}
            onCancel={modals.openCancel}
            onPay={(fee) => modals.openPayment(fee as PopulatedStudentFee)}
            onSettleStudent={modals.openSettlement}
            onClassTransfer={modals.openTransfer}
            selectedFees={selectedFeeIds}
            onSelectionChange={setSelectedFeeIds}
          />
        </>
      )}

      <StudentFeeModals
        modalState={modals.state}
        onClose={modals.close}
        academicYear={academicYear}
        selectedMonth={selectedMonth}
        fees={fees || []}
        selectedFeeIds={selectedFeeIds}
        students={students}
        classes={classes}
        onGenerateFee={handleGenerateFee}
        onBulkGenerate={handleBulkGenerate}
        onApplyDiscount={handleApplyDiscount}
        onCancelFee={handleCancelFee}
        onConfirmAction={handleConfirmAction}
        onGenerateRecurring={handleGenerateRecurringConfirm}
        onCreateAdhocFee={handleCreateAdhocFee}
        onSettleStudentFees={handleSettleStudentFees}
        onClassTransfer={handleClassTransfer}
        onClearSelectedFees={() => setSelectedFeeIds(new Set())}
        isGenerating={generateFeeMutation.isPending}
        isBulkGenerating={bulkGenerateFeeMutation.isPending}
        isApplyingDiscount={applyDiscountMutation.isPending}
        isCancelling={cancelFeeMutation.isPending}
        isConfirmActionLoading={calculateLateFeesMutation.isPending || updateFeeStatusesMutation.isPending}
        isGeneratingRecurring={generateRecurringMutation.isPending}
        isCreatingAdhoc={createAdhocFeeMutation.isPending}
        isSettling={settleStudentFeesMutation.isPending}
        isTransferring={handleClassTransferMutation.isPending}
      />
    </div>
  );
};
